import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

type AnthropicMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
type ImageBlock =
    | { type: 'image'; source: { type: 'url'; url: string } }
    | { type: 'image'; source: { type: 'base64'; media_type: AnthropicMediaType; data: string } };

async function loadImageBlock(imageUrl: string): Promise<ImageBlock | null> {
    try {
        if (/^https?:\/\//i.test(imageUrl)) {
            return { type: 'image', source: { type: 'url', url: imageUrl } };
        }
        // Treat as a file under /public
        const relative = imageUrl.replace(/^\//, '');
        const filePath = path.join(process.cwd(), 'public', relative);
        const buf = await fs.readFile(filePath);
        // Cap at ~4 MB to stay well under Anthropic's per-image limit
        if (buf.byteLength > 4 * 1024 * 1024) return null;
        const ext = path.extname(imageUrl).toLowerCase().slice(1);
        const mediaType: AnthropicMediaType | null =
            ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
            ext === 'png' ? 'image/png' :
            ext === 'gif' ? 'image/gif' :
            ext === 'webp' ? 'image/webp' : null;
        if (!mediaType) return null;
        return {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: buf.toString('base64') },
        };
    } catch (e) {
        console.error('Could not load tutor image:', imageUrl, e);
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages, problem, correct_answer, topic, image_url, choices, contest, year, number } = body;

        if (!Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { message: 'Invalid request: messages must be a non-empty array.' },
                { status: 400 }
            );
        }

        const trimmedMessages = messages.slice(-20).filter(
            (m: { role: string; content: string }) => m && typeof m.role === 'string' && typeof m.content === 'string'
        );

        const apiKey = process.env.ANTHROPIC_API_KEY;

        if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
            return NextResponse.json({
                message: 'AI Tutor requires an API key. Add your Anthropic API key to .env.local to enable the tutor.',
            });
        }

        const { default: Anthropic } = await import('@anthropic-ai/sdk');
        const anthropic = new Anthropic({ apiKey });

        const problemHeader = contest || year || number
            ? `${contest || ''} ${year || ''}${number ? ` #${number}` : ''}`.trim()
            : '';
        const choicesText = Array.isArray(choices) && choices.length
            ? '\nMultiple choice options:\n' + choices.map((c: string, i: number) =>
                `(${String.fromCharCode(65 + i)}) ${c}`).join('\n')
            : '';
        const problemTextBlock = problem ? `\nProblem text:\n${problem}` : '';
        const imageNote = image_url && !problem
            ? '\n(The full problem statement is provided in the attached image. Read the image carefully before responding.)'
            : image_url
                ? '\n(An image with the problem diagram/statement is attached.)'
                : '';
        const problemContext = (problem || image_url || choicesText)
            ? `\n\nThe student is working on${problemHeader ? ' ' + problemHeader : ' this problem'} (Topic: ${topic || 'unknown'}).${problemTextBlock}${choicesText}${imageNote}\nCorrect answer: ${correct_answer || 'unknown'}`
            : '';

        const imageBlock = image_url ? await loadImageBlock(image_url) : null;

        const systemPrompt = `You are an expert Olympiad tutor specializing in Math (AMC, AIME, USAMO), Chemistry (IChO, USNCO), Physics (IPhO, F=ma), and USACO competitive programming.${problemContext}

CRITICAL RULES:
1. NEVER give the answer directly. Guide the student step-by-step using the Socratic method.
2. Ask leading questions that help the student discover the solution themselves.
3. When they're stuck, give a small, targeted hint — not the full approach.
4. Use questions like "What do you notice about...?" or "What if you tried...?" or "Have you considered...?"
5. Praise correct reasoning. Gently redirect incorrect reasoning without being discouraging.
6. If they ask for the answer explicitly, say something like: "Let me give you another hint instead..." and provide a more specific nudge.
7. Break complex problems into smaller, manageable steps.
8. When they solve it, congratulate them and mention related concepts they could explore.
9. Keep responses concise — 2-3 short paragraphs max. Be conversational, not formulaic.
10. ALWAYS wrap ALL math expressions in LaTeX delimiters. Use $ for inline math (e.g. $x^2$) and $$ for display math on its own line.
11. NEVER write math in plain text. Always use LaTeX: $\\omega$, $\\pi$, $\\lambda$, $\\Delta$, $\\frac{a}{b}$, $\\sqrt{x}$, etc.
12. Even simple variables like x, n, m must be wrapped: $x$, $n$, $m$. Greek letters MUST use LaTeX commands.
13. Equations MUST be in display math: $$E = mc^2$$ NOT E = mc^2. Subscripts: $\\omega_m$ NOT omega_m.
14. VARY your responses. Do NOT use the same structure or opening every time. Be natural and responsive to what the student actually said.
15. Do NOT use markdown bold (**text**). Use plain text for emphasis.`;

        // Find the first user message; attach the image there so the model sees
        // it alongside the question. Anthropic recommends image-before-text order.
        const firstUserIdx = trimmedMessages.findIndex(
            (m: { role: string }) => m.role !== 'ai' && m.role !== 'assistant'
        );
        const anthropicMessages = trimmedMessages.map((m: { role: string; content: string }, idx: number) => {
            const role = m.role === 'ai' ? 'assistant' as const : 'user' as const;
            if (role === 'user' && imageBlock && idx === firstUserIdx) {
                return {
                    role,
                    content: [
                        imageBlock,
                        { type: 'text' as const, text: m.content },
                    ],
                };
            }
            return { role, content: m.content };
        });

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 800,
            system: systemPrompt,
            messages: anthropicMessages,
        });

        const response = message.content[0]?.type === 'text'
            ? message.content[0].text
            : 'I\'m having trouble thinking right now. Could you rephrase that?';

        return NextResponse.json({ message: response });
    } catch (error) {
        console.error('Tutor API error:', error);
        return NextResponse.json(
            { message: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
