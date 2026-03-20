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
