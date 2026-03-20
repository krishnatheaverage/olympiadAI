import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { problem, correct_answer, choices, contest, year, number, topic } = await req.json();

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey || apiKey === 'your_openai_api_key_here') {
            return NextResponse.json({
                hint1: getDemoHint1(topic),
                hint2: getDemoHint2(topic, correct_answer),
                solution: getDemoSolution(problem, correct_answer, topic),
            });
        }

        const { default: OpenAI } = await import('openai');
        const openai = new OpenAI({ apiKey });

        const choicesText = choices
            ? `\nAnswer choices:\n${choices.map((c: string, i: number) => `${String.fromCharCode(65 + i)}) ${c}`).join('\n')}`
            : '';

        const systemPrompt = `You are an expert competition problem solver and tutor for math, physics, and chemistry olympiads.

Given a problem, provide THREE levels of help using the EXACT format below with delimiters. Do NOT use JSON.

===HINT1===
A subtle, conceptual nudge (1-2 sentences). Identify the key topic or technique without giving away the method. Ask a guiding question or point the student toward what to notice. Do NOT reveal the answer or specific formulas.
===HINT2===
A more directive hint (2-4 sentences). Name the specific technique, formula, or theorem to use. Set up the first step or key equation. You can mention what the answer relates to but guide the student to derive it.
===SOLUTION===
A complete, clear step-by-step solution. Use LaTeX notation wrapped in $ for inline math and $$ for display math. Use clear step labels like Step 1:, Step 2:, etc. End with the final answer clearly stated.

IMPORTANT RULES:
- Use $ for inline math (e.g. $x^2 + y^2$) and $$ for display math
- Use proper LaTeX: \\frac{a}{b}, \\sqrt{x}, \\cdot, \\geq, \\leq, etc.
- Do NOT use markdown bold (**text**). Use plain text for emphasis.
- Keep hints pedagogically useful — help the student THINK.
- The solution should be thorough but concise (3-6 steps).`;

        const userPrompt = `Problem from ${contest} ${year} #${number} (Topic: ${topic}):

${problem}${choicesText}

The correct answer is: ${correct_answer}

Provide Hint 1, Hint 2, and Full Solution using the ===HINT1===, ===HINT2===, ===SOLUTION=== delimiters.`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            max_tokens: 2500,
            temperature: 0.3,
        });

        const raw = completion.choices[0]?.message?.content || '';

        const parsed = parseDelimitedResponse(raw, correct_answer, topic);

        return NextResponse.json(parsed);
    } catch (error) {
        console.error('Solve API error:', error);
        return NextResponse.json(
            {
                hint1: 'Unable to generate hint. Please try again.',
                hint2: 'Unable to generate hint. Please try again.',
                solution: 'Something went wrong generating the solution. Please try again.',
            },
            { status: 500 }
        );
    }
}

/**
 * Parse delimiter-based response into hint1/hint2/solution.
 * Much more robust than JSON parsing since LaTeX won't break it.
 */
function parseDelimitedResponse(
    raw: string,
    correctAnswer: string,
    topic: string
): { hint1: string; hint2: string; solution: string } {
    const hint1Match = raw.match(/===HINT1===([\s\S]*?)===HINT2===/);
    const hint2Match = raw.match(/===HINT2===([\s\S]*?)===SOLUTION===/);
    const solutionMatch = raw.match(/===SOLUTION===([\s\S]*?)$/);

    const hint1 = hint1Match?.[1]?.trim();
    const hint2 = hint2Match?.[1]?.trim();
    const solution = solutionMatch?.[1]?.trim();

    if (hint1 && hint2 && solution) {
        return { hint1, hint2, solution };
    }

    // Fallback: try to split on less strict patterns
    const h1 = raw.match(/hint\s*1[:\s]*([\s\S]*?)(?:hint\s*2|$)/i);
    const h2 = raw.match(/hint\s*2[:\s]*([\s\S]*?)(?:solution|full solution|$)/i);
    const sol = raw.match(/(?:solution|full solution)[:\s]*([\s\S]*?)$/i);

    if (h1?.[1]?.trim() && sol?.[1]?.trim()) {
        return {
            hint1: h1[1].trim(),
            hint2: h2?.[1]?.trim() || `Think about how to apply concepts from ${topic} to get to the answer: ${correctAnswer}.`,
            solution: sol[1].trim(),
        };
    }

    // Last resort: use entire response as solution
    return {
        hint1: `Consider what key concept from ${topic} applies here. What are the important quantities or relationships in the problem?`,
        hint2: `Try to identify the specific theorem or formula needed. The answer is ${correctAnswer} — think about what approach leads there.`,
        solution: raw || 'Unable to generate solution. Please try again.',
    };
}

function getDemoHint1(topic: string): string {
    return `Think about the key concepts from ${topic} that apply here. What is the problem really asking you to find?`;
}

function getDemoHint2(topic: string, correctAnswer: string): string {
    return `Apply the core techniques from ${topic}. Try setting up the key equation or relationship first. The answer involves ${correctAnswer}.

To see AI-generated detailed hints, add your OpenAI API key to .env.local.`;
}

function getDemoSolution(problem: string, correctAnswer: string, topic: string): string {
    return `Solution (${topic})

Step 1: Identify what the problem is asking and extract the key information from the problem statement.

Step 2: Apply the relevant concepts from ${topic} to set up the approach.

Step 3: Work through the calculations/reasoning step by step.

Step 4: Verify the result matches the expected answer.

The correct answer is: ${correctAnswer}

To see AI-generated detailed solutions, add your OpenAI API key to .env.local.`;
}
