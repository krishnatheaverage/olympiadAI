import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages } = body;

        // Validate messages input
        if (!Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { message: 'Invalid request: messages must be a non-empty array.' },
                { status: 400 }
            );
        }

        // Limit conversation length to prevent abuse
        const trimmedMessages = messages.slice(-20).filter(
            (m: any) => m && typeof m.role === 'string' && typeof m.content === 'string'
        );

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey || apiKey === 'your_openai_api_key_here') {
            // Demo mode: return a helpful hint-based response
            return NextResponse.json({
                message: getDemoResponse(messages),
            });
        }

        const { default: OpenAI } = await import('openai');
        const openai = new OpenAI({ apiKey });

        const systemPrompt = `You are an expert Olympiad tutor specializing in Math (AMC, AIME, USAMO), Chemistry (IChO, USNCO), Physics (IPhO, F=ma), and USACO competitive programming.

CRITICAL RULES:
1. NEVER give the answer directly. Guide the student step-by-step.
2. Ask leading questions that help the student discover the solution.
3. When they're stuck, give a small hint — not the full approach.
4. Use the Socratic method: ask "What do you notice about...?" or "What if you tried...?"
5. Praise correct reasoning. Gently redirect incorrect reasoning without being discouraging.
6. If they ask for the answer explicitly, say something like: "I want you to discover this yourself! Let me give you another hint..."
7. Break complex problems into smaller, manageable steps.
8. When they solve it, congratulate them and optionally mention related concepts they could explore.
9. Keep responses concise — no more than 3-4 paragraphs.
10. Use markdown bold (**text**) to emphasize key concepts.`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                ...trimmedMessages,
            ],
            max_tokens: 600,
            temperature: 0.7,
        });

        const message = completion.choices[0]?.message?.content || 'I\'m having trouble thinking right now. Could you rephrase that?';

        return NextResponse.json({ message });
    } catch (error) {
        console.error('Tutor API error:', error);
        return NextResponse.json(
            { message: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}

function getDemoResponse(messages: { role: string; content: string }[]): string {
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

    if (lastMessage.includes('hint') || lastMessage.includes('stuck')) {
        return `Let's think about this step by step! 🤔

**First**, what information does the problem give you? Try listing out the key facts.

**Then**, think about what mathematical tools or formulas might connect these facts.

What do you notice when you organize the given information?`;
    }

    if (lastMessage.includes('approach') || lastMessage.includes('correct')) {
        return `That's a great question! Let me help you think about your approach.

**Key question**: What's the core relationship in this problem? Sometimes problems that look complex have a simpler structure underneath.

Try to identify: what is the problem **really** asking? Can you rephrase the question in simpler terms?`;
    }

    if (lastMessage.includes('explain') || lastMessage.includes('concept')) {
        return `Great — understanding the underlying concept is the best approach! 💡

Rather than just applying a formula, let's build intuition. **Think of a simpler version** of this problem first.

What happens with smaller numbers or simpler cases? Often, patterns emerge that reveal the general solution.

Can you try a specific example?`;
    }

    if (lastMessage.includes('example') || lastMessage.includes('similar')) {
        return `Here's a similar, simpler problem to build intuition:

**Mini Problem**: Start with a smaller version of your current problem. Use numbers you can work with by hand.

Work through this simpler case, and notice:
1. What **pattern** emerges?
2. Can you **generalize** from this specific case?
3. Does this generalization apply to the original problem?

What do you find?`;
    }

    return `Interesting problem! Let me guide you through this. 🎯

**Step 1**: Let's make sure we understand what's being asked. Can you tell me in your own words what the problem is looking for?

**Step 2**: What constraints or conditions does the problem give us?

Start there, and we'll work through it together!`;
}
