import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// --- env ----------------------------------------------------------------
const envPath = resolve(new URL('.', import.meta.url).pathname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
    const m = line.match(/^([^#][^=]*)=(.*)/);
    if (m) env[m[1].trim()] = m[2].trim().replace(/^"|"$/g, ''); // strip quotes
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing env vars in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TELLS = [
    'To find the remainder',
    'To find the remainder when',
    'Let me solve this step-by-step.',
    'Let me solve this step by step.',
    'Let\'s solve this step-by-step.',
    'Let\'s solve this step by step.',
    'Let me solve this.',
    'Let\'s solve this.',
    'Let me break this down',
    'First, let\'s find',
    'First, I\'ll find',
    'First, let me',
    'Here is the step-by-step',
    'Here\'s the step-by-step',
    'I\'ll use the fact that',
    'I will use the fact that',
    'We want to find the remainder',
];

async function run() {
    console.log('Fetching all problems from Supabase...');
    const { data: problems, error } = await supabase
        .from('olympiad_problems')
        .select('*');

    if (error) {
        console.error('Error fetching problems:', error.message);
        process.exit(1);
    }

    console.log(`Fetched ${problems.length} problems. Analyzing for solution dumps...`);
    const updates = [];

    for (const p of problems) {
        let cleanText = p.problem;
        let matchedTell = null;

        for (const tell of TELLS) {
            const idx = p.problem.indexOf(tell);
            if (idx !== -1) {
                matchedTell = tell;
                // Keep only the text before the tell, and trim trailing whitespace/newlines
                cleanText = p.problem.substring(0, idx).trim();
                break;
            }
        }

        if (matchedTell) {
            updates.push({
                id: p.id,
                contest: p.contest,
                year: p.year,
                number: p.number,
                matchedTell,
                before: p.problem,
                after: cleanText,
            });
        }
    }

    console.log(`\nFound ${updates.length} problems with solution dumps inside the problem statement.`);

    if (updates.length === 0) {
        console.log('No updates needed. Database is clean!');
        return;
    }

    // Print the diffs
    for (const u of updates) {
        console.log(`\n--------------------------------------------`);
        console.log(`Row ID: ${u.id} | ${u.contest} ${u.year} #${u.number}`);
        console.log(`Matched Tell: "${u.matchedTell}"`);
        console.log(`BEFORE (preview):\n${u.before.slice(0, 100)}...\n`);
        console.log(`AFTER:\n${u.after}`);
    }

    const APPLY = process.argv.includes('--apply');
    if (!APPLY) {
        console.log(`\nDRY RUN completed. Run with "node scripts/clean-solution-dumps.mjs --apply" to commit changes.`);
        return;
    }

    console.log(`\nApplying ${updates.length} updates to Supabase...`);
    let count = 0;
    for (const u of updates) {
        const { error: updErr } = await supabase
            .from('olympiad_problems')
            .update({ problem: u.after })
            .eq('id', u.id);

        if (updErr) {
            console.error(`❌ Failed to update row ID ${u.id}:`, updErr.message);
        } else {
            console.log(`✅ Updated row ID ${u.id} (${u.contest} ${u.year} #${u.number})`);
            count++;
        }
    }

    console.log(`\nSuccessfully cleaned ${count} problems in the database!`);
}

run().catch(console.error);
