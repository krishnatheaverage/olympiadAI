#!/usr/bin/env node

// Standalone script to re-rate all problem difficulties using Claude AI
// Usage: node scripts/rate-difficulties-standalone.mjs
// Reads .env.local directly, no dev server needed

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read .env.local
const envPath = resolve(new URL('.', import.meta.url).pathname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#][^=]*)=(.*)/);
    if (match) env[match[1].trim()] = match[2].trim();
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ANTHROPIC_KEY = env.ANTHROPIC_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !ANTHROPIC_KEY) {
    console.error('Missing env vars. Check .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function rateBatch(problems) {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

    const descriptions = problems.map((p, i) => {
        const choicesStr = p.choices
            ? (typeof p.choices === 'string' ? JSON.parse(p.choices) : p.choices).join(' | ')
            : 'Free response';
        return `[${i}] ${p.contest} ${p.year} #${p.number} (${p.track}, ${p.topic})\n${p.problem}\nChoices: ${choicesStr}`;
    }).join('\n\n---\n\n');

    const systemPrompt = `You are an expert at rating competitive math, physics, and chemistry olympiad problems by difficulty.

Rate each problem as exactly one of: easy, medium, or hard.

Guidelines:
- EASY: Straightforward single-concept application. Most prepared students get it. Basic computation. AMC 10 #1-10 level, USNCO Local easy, basic F=ma.
- MEDIUM: Multi-step reasoning, combining concepts, deeper understanding needed. AMC 10 #11-20, AIME #1-8, USNCO Local hard / National easy, F=ma requiring insight.
- HARD: Creative problem-solving, advanced techniques, deep conceptual understanding. AMC 10/12 #21-25, AIME #9-15, USAMO, USNCO National hard, USAPhO-level.

IMPORTANT: Rate based on ACTUAL problem content and difficulty, NOT question number. A #5 can be hard if content is challenging.

Respond with ONLY a JSON array like: ["easy","medium","hard","medium",...]
Exactly ${problems.length} entries. No explanations.`;

    const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: descriptions }],
    });

    const raw = message.content[0]?.type === 'text' ? message.content[0].text : '[]';
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('Failed to parse: ' + raw.slice(0, 200));
    return JSON.parse(match[0]);
}

async function main() {
    const BATCH_SIZE = 40;
    let offset = 0;
    let totalUpdated = 0;
    let totalProblems = 0;

    console.log('Re-rating all problem difficulties with Claude AI...\n');

    while (true) {
        const { data: problems, error } = await supabase
            .from('olympiad_problems')
            .select('id, contest, year, number, topic, problem, choices, track')
            .range(offset, offset + BATCH_SIZE - 1)
            .order('id', { ascending: true });

        if (error) { console.error('DB error:', error); break; }
        if (!problems || problems.length === 0) break;

        totalProblems += problems.length;
        console.log(`Batch ${Math.floor(offset / BATCH_SIZE) + 1}: ${problems.length} problems (offset ${offset})`);

        try {
            const ratings = await rateBatch(problems);

            let batchUpdated = 0;
            for (let i = 0; i < problems.length && i < ratings.length; i++) {
                const diff = ratings[i]?.toLowerCase().trim();
                if (diff === 'easy' || diff === 'medium' || diff === 'hard') {
                    const { error: ue } = await supabase
                        .from('olympiad_problems')
                        .update({ difficulty: diff })
                        .eq('id', problems[i].id);
                    if (!ue) batchUpdated++;
                }
            }

            totalUpdated += batchUpdated;
            console.log(`  -> Updated ${batchUpdated}/${problems.length}`);
        } catch (err) {
            console.error(`  -> Error: ${err.message}`);
        }

        if (problems.length < BATCH_SIZE) break;
        offset += BATCH_SIZE;

        // Rate limit delay
        await new Promise(r => setTimeout(r, 2000));
    }

    console.log(`\nDone! Re-rated ${totalUpdated}/${totalProblems} problems.`);
}

main().catch(console.error);
