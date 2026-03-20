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

        const systemPrompt = `You are an expert competition problem solver and tutor. Given a problem from a math/science competition, provide THREE levels of help in a specific JSON format.

RULES:
1. Return ONLY valid JSON with exactly three fields: "hint1", "hint2", "solution"
2. hint1: A subtle, conceptual nudge (1-2 sentences). Identify the key topic or technique without giving away the method. Ask a guiding question or point out what to notice.
3. hint2: A more directive hint (2-4 sentences). Name the specific technique/formula/theorem to use. Set up the first step or key equation without solving it.
4. solution: A complete step-by-step solution (3-6 steps). Use **bold** for key concepts. End with the final answer clearly stated.
5. Use proper mathematical notation where appropriate.
6. Make hints pedagogically useful — help the student THINK, not just copy.
7. Do NOT include any text outside the JSON object.

Example output format:
{
  "hint1": "Think about what conservation law applies here. What quantity stays constant?",
  "hint2": "Use conservation of energy. Set up the equation: KE_initial + PE_initial = KE_final + PE_final. The key is recognizing that...",
  "solution": "**Step 1:** Identify that this is a conservation of energy problem...\\n\\n**Step 2:** Set up the energy equation...\\n\\n**The correct answer is: B**"
}`;

        const userPrompt = `Problem from ${contest} ${year} #${number} (Topic: ${topic}):

${problem}${choicesText}

The correct answer is: ${correct_answer}

Return your response as JSON with hint1, hint2, and solution fields.`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            max_tokens: 2500,
            temperature: 0.3,
        });

        const raw = completion.choices[0]?.message?.content || '';

        // Parse the structured response
        const parsed = parseHintResponse(raw, correct_answer, topic);

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
 * Parse the model's response into structured hint1/hint2/solution.
 * Handles various malformed outputs gracefully.
 */
function parseHintResponse(
    raw: string,
    correctAnswer: string,
    topic: string
): { hint1: string; hint2: string; solution: string } {
    // Try direct JSON parse
    try {
        const parsed = JSON.parse(raw);
        if (parsed.hint1 && parsed.hint2 && parsed.solution) {
            return {
                hint1: String(parsed.hint1),
                hint2: String(parsed.hint2),
                solution: String(parsed.solution),
            };
        }
    } catch { /* try other strategies */ }

    // Try extracting JSON from markdown code block
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
        try {
            const parsed = JSON.parse(jsonMatch[1]);
            if (parsed.hint1 && parsed.hint2 && parsed.solution) {
                return {
                    hint1: String(parsed.hint1),
                    hint2: String(parsed.hint2),
                    solution: String(parsed.solution),
                };
            }
        } catch { /* continue */ }
    }

    // Try extracting JSON object from anywhere in the string
    const braceMatch = raw.match(/\{[\s\S]*\}/);
    if (braceMatch) {
        try {
            const parsed = JSON.parse(braceMatch[0]);
            if (parsed.hint1 && parsed.hint2 && parsed.solution) {
                return {
                    hint1: String(parsed.hint1),
                    hint2: String(parsed.hint2),
                    solution: String(parsed.solution),
                };
            }
        } catch { /* continue */ }
    }

    // Fallback: treat entire response as solution, generate generic hints
    return {
        hint1: `Think about what core concept from **${topic}** applies here. What are the key quantities or relationships in the problem?`,
        hint2: `Focus on setting up the problem step by step. The answer is **${correctAnswer}** — try working backwards from there to understand the approach.`,
        solution: raw || 'Unable to generate solution. Please try again.',
    };
}

function getDemoHint1(topic: string): string {
    return `Think about the key concepts from **${topic}** that apply here. What is the problem really asking you to find?`;
}

function getDemoHint2(topic: string, correctAnswer: string): string {
    return `Apply the core techniques from **${topic}**. Try setting up the key equation or relationship first. The answer involves **${correctAnswer}**.

_To see AI-generated detailed hints, add your OpenAI API key to \`.env.local\`._`;
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
