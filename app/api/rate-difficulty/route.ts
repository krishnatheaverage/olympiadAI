import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!apiKey || !supabaseUrl || !supabaseAnonKey) {
        return NextResponse.json({ error: 'Missing API keys' }, { status: 500 });
    }

    const { batch_size = 50, offset = 0 } = await req.json().catch(() => ({}));

    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { default: Anthropic } = await import('@anthropic-ai/sdk');
        const anthropic = new Anthropic({ apiKey });

        // Fetch a batch of problems
        const { data: problems, error } = await supabase
            .from('olympiad_problems')
            .select('id, contest, year, number, topic, problem, choices, track')
            .range(offset, offset + batch_size - 1)
            .order('id', { ascending: true });

        if (error) throw error;
        if (!problems || problems.length === 0) {
            return NextResponse.json({ message: 'No more problems to rate', updated: 0 });
        }

        // Build a batch prompt with all problems
        const problemDescriptions = problems.map((p, i) => {
            const choicesStr = p.choices
                ? (typeof p.choices === 'string' ? JSON.parse(p.choices) : p.choices).join(', ')
                : 'Free response';
            return `[${i}] Contest: ${p.contest} | Year: ${p.year} | #${p.number} | Topic: ${p.topic} | Track: ${p.track}\nProblem: ${p.problem}\nChoices: ${choicesStr}`;
        }).join('\n\n---\n\n');

        const systemPrompt = `You are an expert at rating competitive math, physics, and chemistry olympiad problems by difficulty.

Rate each problem as exactly one of: easy, medium, or hard.

Guidelines for rating:
- EASY: Straightforward application of a single concept. Most prepared students would get it right. Requires basic knowledge and simple computation. AMC 10 #1-10, USNCO Local easy questions, F=ma straightforward mechanics.
- MEDIUM: Requires combining concepts, multi-step reasoning, or deeper understanding. A well-prepared student might need to think carefully. AMC 10 #11-20, AMC 12 mid-range, AIME #1-8, USNCO Local harder questions, USNCO National easier questions, F=ma problems requiring insight.
- HARD: Requires creative problem-solving, advanced techniques, or deep conceptual understanding. Only top students solve these consistently. AMC 10 #21-25, AMC 12 #21-25, AIME #9-15, USAMO, USNCO National hard questions, USAPhO-level problems.

IMPORTANT: Rate based on the ACTUAL content and difficulty of the problem, NOT just the question number. A low-numbered question can be hard if the content is genuinely challenging, and a high-numbered question can be easy if it's straightforward.

Respond with ONLY a JSON array of ratings in order, like:
["easy","medium","hard","medium","easy",...]

No explanations. Just the JSON array with exactly ${problems.length} entries.`;

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2000,
            system: systemPrompt,
            messages: [{ role: 'user', content: problemDescriptions }],
        });

        const raw = message.content[0]?.type === 'text' ? message.content[0].text : '[]';

        // Parse the JSON array
        const match = raw.match(/\[[\s\S]*\]/);
        if (!match) {
            return NextResponse.json({ error: 'Failed to parse AI response', raw }, { status: 500 });
        }

        const ratings: string[] = JSON.parse(match[0]);

        // Update each problem
        let updated = 0;
        for (let i = 0; i < problems.length && i < ratings.length; i++) {
            const difficulty = ratings[i]?.toLowerCase().trim();
            if (difficulty === 'easy' || difficulty === 'medium' || difficulty === 'hard') {
                const { error: updateError } = await supabase
                    .from('olympiad_problems')
                    .update({ difficulty })
                    .eq('id', problems[i].id);

                if (!updateError) updated++;
            }
        }

        return NextResponse.json({
            message: `Rated ${updated} problems`,
            updated,
            total_in_batch: problems.length,
            next_offset: offset + batch_size,
        });
    } catch (error) {
        console.error('Rate difficulty error:', error);
        return NextResponse.json({ error: 'Failed to rate problems' }, { status: 500 });
    }
}
