import { NextRequest, NextResponse } from 'next/server';

/**
 * Strict olympiad proof grader.
 *
 * Grades a student's written proof for an olympiad problem (USAMO-style) on the
 * standard 0-7 scale used by graders at the IMO/USAMO. The model is instructed
 * to be ruthlessly strict: partial credit is the exception, not the default,
 * and hand-waving / unjustified leaps are penalized hard.
 */
export async function POST(req: NextRequest) {
    try {
        const { problem, solution, contest, year, number, topic } = await req.json();

        if (!solution || !solution.trim()) {
            return NextResponse.json(
                { error: 'No solution provided to grade.' },
                { status: 400 }
            );
        }

        const apiKey = process.env.ANTHROPIC_API_KEY;

        if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
            return NextResponse.json(getDemoGrade());
        }

        const { default: Anthropic } = await import('@anthropic-ai/sdk');
        const anthropic = new Anthropic({ apiKey });

        const systemPrompt = `You are a senior USAMO/IMO grader. You grade written proofs on the official 0-7 scale used at the USA Mathematical Olympiad and the International Mathematical Olympiad. You are RUTHLESSLY STRICT and your reputation depends on never inflating a score.

THE 0-7 SCALE (this is how real olympiads grade — calibrate to it exactly):
- 7: A complete, fully rigorous, correct proof. Every step justified. No gaps.
- 6: Essentially complete and correct, but with a minor gap or a small error that does not affect the overall argument.
- 5: A complete solution path with one non-trivial but recoverable gap, OR a correct main idea pushed almost all the way through with a real but localized flaw.
- 4: Substantial progress — the key idea is present and partially executed, but the proof is incomplete or has a significant gap. (This is already a HIGH score.)
- 3: A promising approach with meaningful partial results, but major pieces missing.
- 2: A useful nontrivial observation or a correct reduction, but far from a solution.
- 1: A small relevant observation, special cases, or correct setup with no real progress.
- 0: Nothing of value. Restating the problem, wrong approach with no salvageable content, unjustified claims, or "answer only" with no proof.

CRITICAL GRADING PRINCIPLES — ENFORCE THESE HARSHLY:
1. A correct ANSWER with no rigorous PROOF earns AT MOST 1 point. Olympiads grade proofs, not answers. "The answer is X" with weak/no justification = 0 or 1.
2. "It is easy to see", "clearly", "obviously", "by symmetry" used to skip a NON-trivial step is a GAP. Penalize it. Do not give the student the benefit of the doubt.
3. Verifying small cases or examples is NOT a proof of a general claim. Cap such work at 1-2 points unless a real general argument exists.
4. Big unjustified leaps ("and therefore the result follows") cut the score hard, even if the conclusion is correct.
5. A wrong claim that the rest of the proof depends on caps the score at 2-3 regardless of how much was written.
6. Length and effort are IRRELEVANT. A long hand-wavy essay can earn 0. A short airtight proof earns 7.
7. When in doubt, grade DOWN. Real olympiad graders do not award points for "vibes" or partial intuition. Most submitted proofs that "feel right" to a student score 0-2.
8. Do NOT reward the student for restating the problem or for stating what they "would" do without doing it.

Respond using the EXACT delimiter format below. Do NOT use JSON. Use LaTeX wrapped in $ for inline math and $$ for display math throughout.

===SCORE===
A single integer from 0 to 7. Nothing else on this line.
===VERDICT===
One blunt sentence stating what the score means (e.g. "Substantial progress but the key lemma is unproven.").
===STRENGTHS===
A short bulleted list of what the student genuinely did correctly. If there is nothing of value, write "- Nothing of mathematical value was established." Be honest, not generous.
===GAPS===
A bulleted list of every gap, unjustified step, error, and missing case — citing the specific step where it occurs. This is the most important section. Be exhaustive and specific. Quote or paraphrase the offending step.
===TO_REACH_7===
A short paragraph describing concretely what a full-credit proof would need to add or fix.`;

        const userPrompt = `Problem (${contest || 'USAMO'} ${year || ''} #${number ?? ''}${topic ? `, ${topic}` : ''}):

${problem}

----- STUDENT'S SUBMITTED PROOF -----
${solution}
----- END OF SUBMISSION -----

Grade this proof on the 0-7 scale. Be ruthlessly strict and follow every grading principle. Use the ===SCORE===, ===VERDICT===, ===STRENGTHS===, ===GAPS===, ===TO_REACH_7=== delimiters exactly.`;

        const message = await anthropic.messages.create({
            model: 'claude-opus-4-1-20250805',
            max_tokens: 4000,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }],
        });

        const raw = message.content[0]?.type === 'text' ? message.content[0].text : '';

        return NextResponse.json(parseGrade(raw));
    } catch (error) {
        console.error('Grade API error:', error);
        return NextResponse.json(
            { error: 'Something went wrong grading your proof. Please try again.' },
            { status: 500 }
        );
    }
}

function parseGrade(raw: string): {
    score: number;
    verdict: string;
    strengths: string;
    gaps: string;
    toReach7: string;
} {
    const scoreMatch = raw.match(/===SCORE===([\s\S]*?)===VERDICT===/);
    const verdictMatch = raw.match(/===VERDICT===([\s\S]*?)===STRENGTHS===/);
    const strengthsMatch = raw.match(/===STRENGTHS===([\s\S]*?)===GAPS===/);
    const gapsMatch = raw.match(/===GAPS===([\s\S]*?)===TO_REACH_7===/);
    const reachMatch = raw.match(/===TO_REACH_7===([\s\S]*?)$/);

    const scoreRaw = scoreMatch?.[1]?.trim() ?? '';
    const scoreNum = parseInt(scoreRaw.match(/-?\d+/)?.[0] ?? '', 10);
    const score = Number.isFinite(scoreNum) ? Math.max(0, Math.min(7, scoreNum)) : 0;

    return {
        score,
        verdict: verdictMatch?.[1]?.trim() || 'Unable to parse a verdict.',
        strengths: strengthsMatch?.[1]?.trim() || '- None identified.',
        gaps: gapsMatch?.[1]?.trim() || raw.trim() || 'Unable to parse gaps.',
        toReach7: reachMatch?.[1]?.trim() || '',
    };
}

function getDemoGrade() {
    return {
        score: 1,
        verdict: 'Demo grader: add an Anthropic API key for real strict grading.',
        strengths: '- The submission was received.',
        gaps: '- No Anthropic API key is configured, so the proof was not actually evaluated. Add ANTHROPIC_API_KEY to .env.local to enable strict Claude Opus grading on the 0-7 scale.',
        toReach7: 'Configure the API key, then resubmit to receive a real rigorous critique.',
    };
}
