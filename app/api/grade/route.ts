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
        const { problem, solution, contest, year, number, topic, track, image_url, submission_image } = await req.json();

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

        const isPhysics = track === 'physics';
        const isChemistry = track === 'chemistry';
        const work = isPhysics || isChemistry ? 'solution' : 'proof';
        const systemPrompt = isPhysics
            ? buildPhysicsPrompt()
            : isChemistry
                ? buildChemistryPrompt()
                : buildMathPrompt();

        const defaultContest = isPhysics ? 'USAPhO' : isChemistry ? 'USNCO' : 'USAMO';

        // Some problems (e.g. USNCO Part II) store the statement as a screenshot
        // rather than text. Load it so the multimodal grader can actually read it.
        const imageBlock = await loadImageBlock(image_url, req);
        // A photo of the student's own work (e.g. a hand-drawn chemical
        // structure) arrives as a base64 data URL from the trainer.
        const submissionImageBlock = parseDataUrlImage(submission_image);
        const problemText = (problem && problem.trim())
            ? problem
            : (imageBlock
                ? '(The full problem statement is provided in the attached image below.)'
                : '(No problem statement provided.)');

        const userPrompt = `Problem (${contest || defaultContest} ${year || ''} #${number ?? ''}${topic ? `, ${topic}` : ''}):

${problemText}

----- STUDENT'S SUBMITTED ${work.toUpperCase()} -----
${solution}
----- END OF SUBMISSION -----
${submissionImageBlock ? "\nThe student also attached a photo of their handwritten work / drawn structure (shown below). Read it carefully and grade it as part of the submission.\n" : ''}
Grade this ${work} on the 0-7 scale. Be ruthlessly strict and follow every grading principle. Use the ===SCORE===, ===VERDICT===, ===STRENGTHS===, ===GAPS===, ===TO_REACH_7=== delimiters exactly.`;

        // Order: problem-statement image first (if any), then the student's
        // photo, then the text prompt.
        const contentBlocks = [
            ...(imageBlock ? [imageBlock] : []),
            ...(submissionImageBlock ? [submissionImageBlock] : []),
            { type: 'text' as const, text: userPrompt },
        ];
        const userContent = (imageBlock || submissionImageBlock)
            ? contentBlocks
            : userPrompt;

        const message = await anthropic.messages.create({
            model: 'claude-opus-4-8',
            max_tokens: 4000,
            system: systemPrompt,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            messages: [{ role: 'user', content: userContent as any }],
        });

        const raw = message.content[0]?.type === 'text' ? message.content[0].text : '';

        return NextResponse.json(parseGrade(raw));
    } catch (error) {
        console.error('Grade API error:', error);
        const detail =
            error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: `Grading failed: ${detail}` },
            { status: 500 }
        );
    }
}

type ImageBlock = {
    type: 'image';
    source:
        | { type: 'base64'; media_type: string; data: string }
        | { type: 'url'; url: string };
};

/**
 * Turn an image_url into an Anthropic image content block so the (multimodal)
 * grader can read screenshot-only problem statements (e.g. USNCO Part II).
 * - External http(s) URLs are passed through as a url source.
 * - Local public paths (e.g. "/images/usnco_national/part2/2024_q1.png") are
 *   read off disk and base64-encoded.
 * Returns null if there is no usable image.
 */
/**
 * Parse a base64 data URL (e.g. "data:image/png;base64,iVBOR...") uploaded by
 * the student into an Anthropic image block. Returns null for anything that
 * isn't a supported image data URL.
 */
function parseDataUrlImage(value: unknown): ImageBlock | null {
    if (!value || typeof value !== 'string') return null;
    const m = value.match(/^data:(image\/(?:png|jpeg|jpg|webp|gif));base64,([A-Za-z0-9+/=]+)$/);
    if (!m) return null;
    const mediaType = m[1] === 'image/jpg' ? 'image/jpeg' : m[1];
    return {
        type: 'image',
        source: { type: 'base64', media_type: mediaType, data: m[2] },
    };
}

async function loadImageBlock(
    imageUrl: unknown,
    req: NextRequest
): Promise<ImageBlock | null> {
    if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.trim()) return null;
    const url = imageUrl.trim();

    if (/^https?:\/\//i.test(url)) {
        return { type: 'image', source: { type: 'url', url } };
    }

    // Local path under /public — read the file and base64-encode it.
    try {
        const { promises: fs } = await import('fs');
        const path = await import('path');
        const rel = url.startsWith('/') ? url.slice(1) : url;
        const filePath = path.join(process.cwd(), 'public', rel);
        const buf = await fs.readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        const mediaType =
            ext === '.png' ? 'image/png'
            : ext === '.webp' ? 'image/webp'
            : ext === '.gif' ? 'image/gif'
            : 'image/jpeg';
        return {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: buf.toString('base64') },
        };
    } catch {
        // Fall back to an absolute URL derived from the request origin.
        try {
            const origin = new URL(req.url).origin;
            return { type: 'image', source: { type: 'url', url: origin + url } };
        } catch {
            return null;
        }
    }
}

function buildMathPrompt(): string {
    return `You are a senior USAMO/IMO grader. You grade written proofs on the official 0-7 scale used at the USA Mathematical Olympiad and the International Mathematical Olympiad. You are RUTHLESSLY STRICT and your reputation depends on never inflating a score.

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
}

function buildPhysicsPrompt(): string {
    return `You are a senior USAPhO / IPhO grader. You grade written free-response physics solutions on a strict 0-7 quality scale (a normalized version of the points-based marking used at the USA Physics Olympiad and the International Physics Olympiad). You are RUTHLESSLY STRICT and your reputation depends on never inflating a score.

THE 0-7 SCALE (calibrate to it exactly):
- 7: A complete, correct solution. Correct physical principles, fully justified derivation, correct algebra, correct final answer WITH correct units and reasonable significant figures. Dimensionally consistent throughout.
- 6: Essentially correct, with a minor slip — a dropped constant factor, a small arithmetic error, or missing/incorrect units on the final answer — that does not reflect a conceptual misunderstanding.
- 5: Correct physical approach carried almost all the way, but with one real error (e.g. a sign error that propagates, a wrong boundary condition) that affects the final answer.
- 4: Correct identification of the governing physics and the key equations set up correctly, but the derivation is incomplete or has a significant gap. (Already a HIGH score.)
- 3: The right physical principle is identified and partially applied, but major steps are missing or wrong.
- 2: A relevant correct equation or physical insight is present, but the solution is far from complete.
- 1: Only a relevant concept is named, or trivial setup with no real progress.
- 0: Nothing of value. Wrong physics, irrelevant equations, restating the problem, or a bare final answer with no derivation.

CRITICAL GRADING PRINCIPLES — ENFORCE THESE HARSHLY:
1. A correct final ANSWER with no derivation earns AT MOST 1 point. Physics olympiads grade method and reasoning, not just the number. "The answer is X" with no work = 0 or 1.
2. Quoting a formula without justifying that it applies to THIS situation is a gap — especially if the conditions for that formula are not met. Penalize unjustified formula-dropping.
3. Dimensional inconsistency, missing units, or an answer that is off by orders of magnitude is a serious error — never award 6 or 7 to a dimensionally wrong result.
4. A wrong physical assumption (ignoring a relevant force, wrong conservation law, wrong reference frame) that the rest of the solution depends on caps the score at 2-3.
5. Sign errors, dropped factors of 2, and incorrect limits of integration are real errors — dock points; they are not "close enough."
6. Length and effort are IRRELEVANT. A long wrong derivation can earn 0. A short correct one earns 7.
7. When in doubt, grade DOWN. Do not award points for "vibes" or for an approach that merely looks physics-y.
8. Do NOT reward restating the problem or describing what the student "would" do without doing it.

Respond using the EXACT delimiter format below. Do NOT use JSON. Use LaTeX wrapped in $ for inline math and $$ for display math throughout. Always check units and dimensions explicitly.

===SCORE===
A single integer from 0 to 7. Nothing else on this line.
===VERDICT===
One blunt sentence stating what the score means (e.g. "Right setup but a sign error wrecks the final answer.").
===STRENGTHS===
A short bulleted list of what the student genuinely did correctly (correct principle, correct setup, correct intermediate result). If there is nothing of value, write "- Nothing of physical value was established." Be honest, not generous.
===GAPS===
A bulleted list of every error, unjustified step, dimensional problem, missing case, and units issue — citing the specific step where it occurs. This is the most important section. Be exhaustive and specific.
===TO_REACH_7===
A short paragraph describing concretely what a full-credit solution would need to add or fix, including the correct final answer with units where appropriate.`;
}

function buildChemistryPrompt(): string {
    return `You are a senior USNCO / IChO grader. You grade written free-response chemistry solutions (USNCO National Exam Part II style) on a strict 0-7 quality scale (a normalized version of the points-based marking used at the USA National Chemistry Olympiad and the International Chemistry Olympiad). You are RUTHLESSLY STRICT and your reputation depends on never inflating a score.

THE 0-7 SCALE (calibrate to it exactly):
- 7: A complete, correct solution. Correct chemical principles, balanced equations where required, fully justified reasoning, correct stoichiometry/algebra, correct final answer WITH correct units and reasonable significant figures. Dimensionally consistent throughout.
- 6: Essentially correct, with a minor slip — a dropped unit, a small arithmetic error, wrong significant figures, or a missing state symbol — that does not reflect a conceptual misunderstanding.
- 5: Correct chemical approach carried almost all the way, but with one real error (e.g. an unbalanced equation, a sign error in thermodynamics, a wrong mole ratio) that affects the final answer.
- 4: Correct identification of the governing chemistry and the key relationships set up correctly, but the solution is incomplete or has a significant gap. (Already a HIGH score.)
- 3: The right chemical principle is identified and partially applied, but major steps are missing or wrong.
- 2: A relevant correct equation, structure, or chemical insight is present, but the solution is far from complete.
- 1: Only a relevant concept is named, or trivial setup with no real progress.
- 0: Nothing of value. Wrong chemistry, irrelevant equations, restating the problem, or a bare final answer with no work.

CRITICAL GRADING PRINCIPLES — ENFORCE THESE HARSHLY:
1. A correct final ANSWER with no work earns AT MOST 1 point. Chemistry olympiads grade method and reasoning, not just the number. "The answer is X" with no derivation = 0 or 1.
2. Unbalanced chemical equations, wrong oxidation states, or incorrect mole ratios are real errors — dock points; they are not "close enough."
3. Dimensional inconsistency, missing/wrong units, or an answer off by orders of magnitude is a serious error — never award 6 or 7 to a dimensionally wrong or unit-less numerical result.
4. A wrong chemical assumption (wrong limiting reagent, wrong reaction, wrong conservation principle, ignoring a relevant equilibrium) that the rest of the solution depends on caps the score at 2-3.
5. Quoting a formula (e.g. Nernst, Henderson-Hasselbalch, ideal gas) without justifying that its conditions are met is a gap. Penalize unjustified formula-dropping.
6. Significant figures and units matter at olympiad level, but a correct method with a minor sig-fig slip is a 6, not a 0 — judge proportionally.
7. Length and effort are IRRELEVANT. A long wrong derivation can earn 0. A short correct one earns 7.
8. When in doubt, grade DOWN. Do not award points for "vibes" or for an approach that merely looks chemistry-y. Do NOT reward restating the problem.

Respond using the EXACT delimiter format below. Do NOT use JSON. Use LaTeX wrapped in $ for inline math and $$ for display math throughout. Check balanced equations, units, and dimensions explicitly.

===SCORE===
A single integer from 0 to 7. Nothing else on this line.
===VERDICT===
One blunt sentence stating what the score means (e.g. "Right approach but the equation is unbalanced and the final units are wrong.").
===STRENGTHS===
A short bulleted list of what the student genuinely did correctly (correct principle, balanced equation, correct intermediate result). If there is nothing of value, write "- Nothing of chemical value was established." Be honest, not generous.
===GAPS===
A bulleted list of every error, unjustified step, unbalanced equation, dimensional problem, missing case, and units issue — citing the specific step where it occurs. This is the most important section. Be exhaustive and specific.
===TO_REACH_7===
A short paragraph describing concretely what a full-credit solution would need to add or fix, including the correct final answer with units where appropriate.`;
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
