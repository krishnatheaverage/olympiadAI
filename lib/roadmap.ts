export interface RoadmapPhase {
    phase: number;
    title: string;
    duration: string;
    topics: string[];
    description: string;
}

export interface Roadmap {
    track: string;
    goal: string;
    phases: RoadmapPhase[];
}

// Sample roadmaps for demo mode
export const sampleRoadmaps: Record<string, Roadmap> = {
    'math-aime': {
        track: 'math',
        goal: 'Qualify for AIME',
        phases: [
            {
                phase: 1,
                title: 'Foundation Building',
                duration: '4 weeks',
                topics: ['Algebra Fundamentals', 'Basic Counting', 'Number Sense', 'Geometry Basics'],
                description: 'Master the core concepts tested on AMC 10/12. Focus on speed and accuracy with fundamental techniques.',
            },
            {
                phase: 2,
                title: 'Intermediate Techniques',
                duration: '6 weeks',
                topics: ['Modular Arithmetic', 'Combinatorics', 'Coordinate Geometry', 'Sequences & Series'],
                description: 'Build problem-solving strategies for AMC 12-level questions. Practice timed problem sets.',
            },
            {
                phase: 3,
                title: 'Advanced Problem Solving',
                duration: '4 weeks',
                topics: ['Number Theory', 'Complex Numbers', 'Trigonometry', 'Advanced Counting'],
                description: 'Tackle the hardest AMC problems (#20-25). Develop techniques for problems that require creative approaches.',
            },
            {
                phase: 4,
                title: 'Contest Simulation',
                duration: '3 weeks',
                topics: ['Full AMC Mock Tests', 'Time Management', 'Strategic Guessing', 'Error Analysis'],
                description: 'Take full-length timed practice tests. Analyze mistakes and refine your approach.',
            },
        ],
    },
    'usaco-silver': {
        track: 'usaco',
        goal: 'Promote to USACO Silver',
        phases: [
            {
                phase: 1,
                title: 'Programming Fundamentals',
                duration: '3 weeks',
                topics: ['C++/Python Basics', 'I/O Handling', 'Arrays & Strings', 'Basic Sorting'],
                description: 'Ensure solid programming skills and familiarity with competitive programming I/O patterns.',
            },
            {
                phase: 2,
                title: 'Core Algorithms',
                duration: '5 weeks',
                topics: ['Brute Force', 'Greedy Algorithms', 'Simulation', 'Basic Data Structures'],
                description: 'Learn the fundamental algorithmic paradigms tested at the Bronze level.',
            },
            {
                phase: 3,
                title: 'Problem Patterns',
                duration: '4 weeks',
                topics: ['Rectangle Geometry', 'Ad Hoc Problems', 'Simple Graph Traversal', 'Complete Search'],
                description: 'Practice recognizing and applying common Bronze-level problem patterns.',
            },
            {
                phase: 4,
                title: 'Contest Practice',
                duration: '3 weeks',
                topics: ['Past USACO Bronze Contests', 'Time Strategy', 'Debugging', 'Edge Cases'],
                description: 'Solve full past USACO Bronze contests under timed conditions.',
            },
        ],
    },
};
