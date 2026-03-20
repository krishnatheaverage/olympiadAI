import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { track, goal, currentLevel } = await req.json();

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey || apiKey === 'your_openai_api_key_here') {
            // Demo mode: return sample roadmap
            return NextResponse.json({
                phases: generateDemoRoadmap(track, goal),
            });
        }

        const { default: OpenAI } = await import('openai');
        const openai = new OpenAI({ apiKey });

        const systemPrompt = `You are an expert Olympiad training coach. Generate a structured training roadmap.

Given a competition track, the student's current level, and their goal, create a 4-phase training plan that bridges the gap between where they are and where they want to be. Skip topics the student already knows based on their current level.

Respond with ONLY valid JSON in this exact format:
{
  "phases": [
    {
      "phase": 1,
      "title": "Phase Title",
      "duration": "X weeks",
      "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4"],
      "description": "Brief description of what this phase covers and its goals."
    }
  ]
}

Make the roadmap specific to the track, current level, and goal. Include realistic topic names and durations. Create exactly 4 phases that progress from the student's current level to their goal.`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Track: ${track}\nCurrent Level: ${currentLevel || 'Just starting out'}\nGoal: ${goal}` },
            ],
            max_tokens: 800,
            temperature: 0.7,
        });

        const content = completion.choices[0]?.message?.content || '';

        // Parse JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const data = JSON.parse(jsonMatch[0]);
                if (data.phases && Array.isArray(data.phases)) {
                    return NextResponse.json(data);
                }
            } catch (e) {
                console.error('Roadmap JSON parse error:', e);
            }
        }

        // Fall back to demo roadmap
        return NextResponse.json({
            phases: generateDemoRoadmap(track, goal),
        });
    } catch (error) {
        console.error('Roadmap API error:', error);
        return NextResponse.json(
            { error: 'Failed to generate roadmap' },
            { status: 500 }
        );
    }
}

function generateDemoRoadmap(track: string, goal: string) {
    const trackTopics: Record<string, string[][]> = {
        math: [
            ['Algebra Fundamentals', 'Number Sense', 'Basic Counting', 'Geometry Basics'],
            ['Modular Arithmetic', 'Combinatorics', 'Coordinate Geometry', 'Sequences'],
            ['Number Theory', 'Complex Numbers', 'Trigonometry', 'Advanced Counting'],
            ['Full Mock Tests', 'Time Management', 'Error Analysis', 'Strategy'],
        ],
        chemistry: [
            ['Atomic Structure', 'Stoichiometry', 'Periodicity', 'Chemical Bonding'],
            ['Thermodynamics', 'Kinetics', 'Equilibrium', 'Acid-Base Chemistry'],
            ['Organic Chemistry', 'Coordination Chemistry', 'Electrochemistry', 'Lab Techniques'],
            ['Past USNCO Exams', 'Lab Practical Prep', 'Timed Problem Sets', 'Final Review'],
        ],
        physics: [
            ['Kinematics', 'Newton\'s Laws', 'Work & Energy', 'Momentum'],
            ['Rotational Dynamics', 'Fluid Mechanics', 'Oscillations', 'Waves'],
            ['Electrostatics', 'Circuits', 'Magnetism', 'Optics'],
            ['Thermodynamics', 'Modern Physics', 'Past F=ma Exams', 'Competition Strategy'],
        ],
        usaco: [
            ['I/O & File Handling', 'Arrays & Sorting', 'Complete Search', 'Basic Data Structures'],
            ['Greedy Algorithms', 'Binary Search', 'Graph Representation', 'DFS/BFS'],
            ['Dynamic Programming', 'Shortest Paths', 'Trees', 'Advanced Sorting'],
            ['Past Contest Practice', 'Time Strategy', 'Edge Case Analysis', 'Debugging'],
        ],
    };

    const topics = trackTopics[track] || trackTopics.math;

    return [
        {
            phase: 1,
            title: 'Foundation Building',
            duration: '4 weeks',
            topics: topics[0],
            description: `Build a strong foundation with core concepts for ${goal}. Focus on understanding fundamentals deeply.`,
        },
        {
            phase: 2,
            title: 'Intermediate Mastery',
            duration: '6 weeks',
            topics: topics[1],
            description: `Develop intermediate skills and problem-solving strategies. Practice with increasing difficulty.`,
        },
        {
            phase: 3,
            title: 'Advanced Techniques',
            duration: '4 weeks',
            topics: topics[2],
            description: `Master advanced topics and develop creativity in problem solving. Tackle competition-level challenges.`,
        },
        {
            phase: 4,
            title: 'Competition Readiness',
            duration: '3 weeks',
            topics: topics[3],
            description: `Final preparation with simulated competition conditions. Build confidence and refine strategy for ${goal}.`,
        },
    ];
}
