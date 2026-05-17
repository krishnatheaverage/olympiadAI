export interface Problem {
    id?: number | string;
    contest: string;
    year: number;
    number: number;
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard';
    problem: string;
    choices: string[] | null;
    correct_answer: string;
    correct_value: string;
    solution: string;
    track: 'math' | 'chemistry' | 'physics';
    source_link?: string;
    image_url?: string;
}

export interface ProblemsData {
    math: Problem[];
    chemistry: Problem[];
    physics: Problem[];
}

import { fetchAllProblems } from './supabase';

let cachedProblems: ProblemsData | null = null;

/** Clear the problem cache so the next loadProblems() fetches fresh data. */
export function clearProblemsCache() {
    cachedProblems = null;
}

export async function loadProblems(): Promise<ProblemsData> {
    if (cachedProblems) return cachedProblems;

    let dbProblems: Problem[] = [];
    try {
        dbProblems = await fetchAllProblems();
    } catch (e) {
        console.error('Failed to fetch problems from DB, falling back to JSON:', e);
    }

    // Start with empty data, DB is the source of truth
    const combined: ProblemsData = {
        math: [],
        chemistry: [],
        physics: [],
    };

    dbProblems.forEach(p => {
        if (combined[p.track]) {
            // Avoid duplicates if same contest/year/number/track
            const existingIndex = combined[p.track].findIndex(cp =>
                cp.contest === p.contest &&
                cp.year === p.year &&
                cp.number === p.number
            );
            if (existingIndex !== -1) {
                // DB problems override local ones
                combined[p.track][existingIndex] = p;
            } else {
                combined[p.track].push(p);
            }
        }
    });

    cachedProblems = combined;
    return cachedProblems;
}

export function getAllProblems(data: ProblemsData): Problem[] {
    return [
        ...data.math.map(p => ({ ...p, track: 'math' as const })),
        ...data.chemistry.map(p => ({ ...p, track: 'chemistry' as const })),
        ...data.physics.map(p => ({ ...p, track: 'physics' as const }))
    ];
}

export function getProblemsForTrack(
    data: ProblemsData,
    track: string
): Problem[] {
    if (track === 'all') return getAllProblems(data);
    const trackProblems = data[track as keyof ProblemsData] || [];
    return trackProblems.map(p => ({ ...p, track: track as Problem['track'] }));
}

export function filterProblems(
    problems: Problem[],
    filters: {
        track?: string;
        contest?: string;
        topic?: string;
        difficulty?: string;
    }
): Problem[] {
    return problems.filter((p) => {
        if (filters.contest && filters.contest !== 'all' && p.contest !== filters.contest)
            return false;
        if (filters.topic && filters.topic !== 'all' && p.topic !== filters.topic)
            return false;
        if (
            filters.difficulty &&
            filters.difficulty !== 'all' &&
            p.difficulty !== filters.difficulty
        )
            return false;
        return true;
    });
}

export function getUniqueContests(problems: Problem[]): string[] {
    return [...new Set(problems.map((p) => p.contest))].sort();
}

export function getUniqueTopics(problems: Problem[]): string[] {
    return [...new Set(problems.map((p) => p.topic))].sort();
}

export interface ProblemPart {
    label: string;
    body: string;
}

/**
 * Split a problem's text into an intro and ordered sub-parts (a, b, c, ...).
 * Returns intro="" and a single unlabeled part containing the full text if no
 * "\na." style sub-parts are detected.
 */
export function splitProblemParts(text: string): { intro: string; parts: ProblemPart[] } {
    if (!text) return { intro: '', parts: [] };

    const re = /(?:^|\n)\s*([a-h])\.\s+/g;
    const matches: { letter: string; start: number; bodyStart: number }[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
        matches.push({ letter: m[1], start: m.index, bodyStart: m.index + m[0].length });
    }

    // Require at least an "a." and "b." in sequence to treat as multi-part
    if (matches.length < 2 || matches[0].letter !== 'a' || matches[1].letter !== 'b') {
        return { intro: '', parts: [{ label: '', body: text.trim() }] };
    }

    const intro = text.slice(0, matches[0].start).trim();
    const parts: ProblemPart[] = matches.map((cur, i) => {
        const end = i + 1 < matches.length ? matches[i + 1].start : text.length;
        return { label: cur.letter, body: text.slice(cur.bodyStart, end).trim() };
    });
    return { intro, parts };
}

/** True if a problem has neither a stored letter answer nor a free-response value. */
export function hasAnswerKey(problem: Problem): boolean {
    return Boolean(
        (problem.correct_answer && problem.correct_answer.trim()) ||
        (problem.correct_value && problem.correct_value.trim())
    );
}

export function shuffleProblems(problems: Problem[]): Problem[] {
    const shuffled = [...problems];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/** Strip MC label prefix like "(A) " or "(A)" from a choice string. */
function stripChoiceLabel(choice: string): string {
    return choice.replace(/^\s*\([A-Ea-e]\)\s*/, '').trim();
}

/**
 * Deterministic answer checking.
 * Compares user answer against the stored correct_answer field.
 * Supports both letter answers (A-E for MC) and value answers (free response).
 */
export function checkAnswer(problem: Problem, userAnswer: string): boolean {
    const answer = userAnswer.trim().toLowerCase();
    const correct = problem.correct_answer?.trim().toLowerCase() || '';
    const correctVal = problem.correct_value?.trim().toLowerCase() || '';

    // Match against letter (for MC)
    if (answer === correct) return true;

    // Match against the actual value
    if (correctVal && answer === correctVal) return true;

    // For MC: check if user typed the value matching the letter
    if (problem.choices && correct.length === 1) {
        const letterIndex = correct.charCodeAt(0) - 'a'.charCodeAt(0);
        if (letterIndex >= 0 && letterIndex < problem.choices.length) {
            const choiceText = stripChoiceLabel(problem.choices[letterIndex]).toLowerCase();
            if (answer === choiceText || answer === problem.choices[letterIndex].toLowerCase()) {
                return true;
            }
        }
    }

    return false;
}
