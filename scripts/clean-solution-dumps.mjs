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

// Phrases that almost-certainly mark the start of an AI-generated
// solution dump appended after the real problem. We keep only the text
// BEFORE the first hit. New entries should be specific enough that
// they wouldn't appear inside a legitimate problem statement.
const TELLS = [
    // "Let me / Let's solve..." family
    'Let me solve this step-by-step.',
    'Let me solve this step by step.',
    'Let\'s solve this step-by-step.',
    'Let\'s solve this step by step.',
    'Let me solve this.',
    'Let\'s solve this.',
    'Let me break this down',
    'Let me denote',
    'Let me set up',
    'Let me set up coordinates',
    'Let me first',
    'Let me start by',
    'Let me work through',
    'Let me analyze',
    'Let me think about',
    'Let me approach this',
    'Let me consider',
    'Let me think step',

    // "To solve / To find / To determine" family
    'To solve this',
    'To find the remainder',
    'To find the remainder when',
    'To determine ',
    'To answer this',
    'To approach this',

    // "I need to / I\'ll" openers
    'I need to find',
    'I need to determine',
    'I\'ll use the fact that',
    'I will use the fact that',
    'I\'ll start by',
    'I\'ll first',

    // Section headers commonly used by LLM solutions
    '**Setting up',
    '**Setting Up',
    '**Boundary conditions',
    '**Boundary Conditions',
    '**Recurrence relation',
    '**Recurrence Relation',
    '**Computing values',
    '**Step 1',
    '**Step-by-step',
    '**Solution',
    '**Approach',
    '**Analysis',
    '**Answer:**',

    // Generic step-by-step intros
    'Here is the step-by-step',
    'Here\'s the step-by-step',
    'Here is the solution',
    'Here\'s the solution',
    'Here is my approach',

    // First / opener variants (first-person only — third-person "First, note that"
    // would have too many false positives in legit problem text)
    'First, let me',
    'First, let\'s',
    'First, I\'ll',
    'First, I need',

    // "We" openers — only with first-person solver intent
    'We want to find the remainder',
    'We\'ll solve',
];

async function fetchAllProblems() {
    // PostgREST caps responses at 1000 rows by default; the DB has ~1900.
    // Page through with .range() until we've seen them all.
    const pageSize = 1000;
    const all = [];
    let from = 0;
    while (true) {
        const { data, error } = await supabase
            .from('olympiad_problems')
            .select('*')
            .order('id', { ascending: true })
            .range(from, from + pageSize - 1);
        if (error) {
            console.error('Error fetching problems:', error.message);
            process.exit(1);
        }
        if (!data || data.length === 0) break;
        all.push(...data);
        if (data.length < pageSize) break;
        from += pageSize;
    }
    return all;
}

async function run() {
    console.log('Fetching all problems from Supabase (paginated)...');
    const problems = await fetchAllProblems();

    console.log(`Fetched ${problems.length} problems. Analyzing for solution dumps...`);
    const updates = [];

    // Minimum length for the surviving "before" text. If trimming a row
    // would leave less than this many characters, the entire problem
    // field WAS a solution dump (no real problem prefix) — those rows
    // need a separate re-scrape and we should NOT empty them out here.
    const MIN_RETAINED = 40;
    const skippedEmpty = [];

    for (const p of problems) {
        if (!p.problem) continue;
        let cleanText = p.problem;
        let matchedTell = null;
        let matchedIdx = -1;

        for (const tell of TELLS) {
            const idx = p.problem.indexOf(tell);
            if (idx !== -1 && (matchedIdx === -1 || idx < matchedIdx)) {
                matchedTell = tell;
                matchedIdx = idx;
            }
        }

        if (matchedTell) {
            cleanText = p.problem.substring(0, matchedIdx).trim();
            if (cleanText.length < MIN_RETAINED) {
                // Entire problem was a dump — leave it alone, log it
                skippedEmpty.push({
                    id: p.id,
                    label: `${p.contest} ${p.year} #${p.number}`,
                    matchedTell,
                });
                continue;
            }
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

    if (skippedEmpty.length > 0) {
        console.log(`\nSkipping ${skippedEmpty.length} rows where trimming would empty the field (whole problem was a dump — needs re-scrape):`);
        for (const s of skippedEmpty.slice(0, 10)) {
            console.log(`  ${s.label} (id=${s.id}, matched "${s.matchedTell}")`);
        }
        if (skippedEmpty.length > 10) console.log(`  ... and ${skippedEmpty.length - 10} more`);
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
