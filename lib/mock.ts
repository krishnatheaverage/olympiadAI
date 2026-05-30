export type MockTrack = 'math' | 'chemistry' | 'physics';

export interface MockConfig {
    label: string;
    track: MockTrack;
    /** Number of questions to draw for this mock. */
    numQ: number;
    /** Time limit, in minutes. */
    timeMin: number;
    /** Case-insensitive contest-name substring used to filter the problem pool. */
    contestPrefix: string;
    /**
     * Scoring rule given (correct, wrong, blank).
     * AMC is the only contest with a blank-credit rule today; everything else
     * is just +1 per correct.
     */
    scoring: (correct: number, wrong: number, blank: number) => number;
    /** Display name for the score (helps when 100+ means very different things). */
    scoreSuffix?: string;
}

export const MOCK_CONFIGS: Record<string, MockConfig> = {
    'AMC 10': {
        label: 'AMC 10',
        track: 'math',
        numQ: 25,
        timeMin: 75,
        contestPrefix: 'AMC 10',
        scoring: (c, _w, b) => c * 6 + b * 1.5,
        scoreSuffix: '/ 150',
    },
    'AMC 12': {
        label: 'AMC 12',
        track: 'math',
        numQ: 25,
        timeMin: 75,
        contestPrefix: 'AMC 12',
        scoring: (c, _w, b) => c * 6 + b * 1.5,
        scoreSuffix: '/ 150',
    },
    'AIME': {
        label: 'AIME',
        track: 'math',
        numQ: 15,
        timeMin: 180,
        contestPrefix: 'AIME',
        scoring: (c) => c,
        scoreSuffix: '/ 15',
    },
    'F=ma': {
        label: 'F = ma',
        track: 'physics',
        numQ: 25,
        timeMin: 75,
        contestPrefix: 'F=ma',
        scoring: (c) => c,
        scoreSuffix: '/ 25',
    },
    'USNCO Local': {
        label: 'USNCO Local',
        track: 'chemistry',
        numQ: 60,
        timeMin: 110,
        contestPrefix: 'USNCO',
        scoring: (c) => c,
        scoreSuffix: '/ 60',
    },
};

export type MockConfigKey = keyof typeof MOCK_CONFIGS;
