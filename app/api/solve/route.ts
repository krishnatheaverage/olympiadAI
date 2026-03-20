import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { problem, correct_answer, choices, contest, year, number, topic } = await req.json();

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey || apiKey === 'your_openai_api_key_here') {
            // Demo mode
            return NextResponse.json({
                solution: getDemoSolution(problem, correct_answer, topic),
            });
        }

        const { default: OpenAI } = await import('openai');
        const openai = new OpenAI({ apiKey });

        const choicesText = choices
            ? `\nAnswer choices:\n${choices.map((c: string, i: number) => `${String.fromCharCode(65 + i)}) ${c}`).join('\n')}`
            : '';

        const systemPrompt = `You are an expert competition problem solver. Given a problem from a math/science/programming competition, provide a clear, step-by-step solution.

RULES:
1. Show the complete solution with clear reasoning at each step.
2. Use **bold** for key concepts and results.
3. End with the final answer clearly stated.
4. Keep the solution concise but thorough — aim for 3-6 steps.
5. Use proper mathematical notation where appropriate.
6. If it's a multiple choice problem, explain why the correct answer is right.`;

        const userPrompt = `Problem from ${contest} ${year} #${number} (Topic: ${topic}):

${problem}${choicesText}

The correct answer is: ${correct_answer}

Please provide a clear, step-by-step solution.`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            max_tokens: 2000,
            temperature: 0.3,
        });

        const solution = completion.choices[0]?.message?.content || 'Unable to generate solution. Please try again.';

        return NextResponse.json({ solution });
    } catch (error) {
        console.error('Solve API error:', error);
        return NextResponse.json(
            { solution: 'Something went wrong generating the solution. Please try again.' },
            { status: 500 }
        );
    }
}

function getDemoSolution(problem: string, correctAnswer: string, topic: string): string {
    return `**Solution** (${topic})

**Step 1:** Identify what the problem is asking and extract the key information from the problem statement.

**Step 2:** Apply the relevant concepts from ${topic} to set up the approach.

**Step 3:** Work through the calculations/reasoning step by step.

**Step 4:** Verify the result matches the expected answer.

**The correct answer is: ${correctAnswer}**

_To see AI-generated detailed solutions, add your OpenAI API key to \`.env.local\`._`;
}
