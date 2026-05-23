#!/usr/bin/env node

/**
 * Repair USNCO problem-field AI-solution dumps using Claude vision on the
 * already-stored page scans in public/images/usnco_(local|national)/pages/.
 *
 * Approach:
 *   1. Find all rows where the problem field looks like an AI solution
 *      dump (anchored phrases like "I need to", "To determine", etc).
 *   2. Group by (contest, year) bucket.
 *   3. For each bucket, walk every page scan we have and ask Claude
 *      Sonnet vision to extract a JSON list of {number, problem, choices}
 *      for problems visible on that page.
 *   4. Match extracted problems back to the broken rows by number and
 *      update problem (and choices if they differ).
 *
 * Sonnet is used (not Haiku) because vision OCR of complex chemistry
 * notation benefits from the better model.
 *
 * Usage:
 *   node scripts/fix-usnco-dumps.mjs                 # dry-run
 *   node scripts/fix-usnco-dumps.mjs --limit 1       # 1 page only (test)
 *   node scripts/fix-usnco-dumps.mjs --apply         # commit changes
 *   node scripts/fix-usnco-dumps.mjs --bucket "USNCO National:2024" --apply
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { promises as fs } from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const limitArg = args.find(a => a.startsWith('--limit'));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1] || args[args.indexOf(limitArg) + 1], 10) : null;
const bucketArg = args.find(a => a.startsWith('--bucket'));
const BUCKET_FILTER = bucketArg ? (bucketArg.split('=')[1] || args[args.indexOf(bucketArg) + 1]) : null;

const envPath = resolve(new URL('.', import.meta.url).pathname, '..', '.env.local');
const env = {};
readFileSync(envPath, 'utf-8').split('\n').forEach(l => {
    const m = l.match(/^([^#][^=]*)=(.*)/);
    if (m) env[m[1].trim()] = m[2].trim();
});
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const { default: Anthropic } = await import('@anthropic-ai/sdk');
const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 6 });

// Detection patterns — same idea as the AoPS scraper.
const DUMP_RES = [
    /^\s*I need to /i, /^\s*I'll use /i, /^\s*Let me /i,
    /^\s*First, let me /i, /^\s*To determine /i, /^\s*To find /i, /^\s*To solve /i,
];
function looksLikeDump(text) {
    return DUMP_RES.some(re => re.test(text || ''));
}

// --- find broken rows ---
const { data: allRows, error } = await supabase
    .from('olympiad_problems')
    .select('id, contest, year, number, problem, choices')
    .or('contest.eq.USNCO Local,contest.eq.USNCO National')
    .order('contest').order('year').order('number');
if (error) { console.error(error); process.exit(1); }

const broken = allRows.filter(r => looksLikeDump(r.problem));
console.log(`Total USNCO rows: ${allRows.length}`);
console.log(`Solution-dump rows to fix: ${broken.length}`);

// Group broken rows by (contest, year)
const buckets = new Map();
for (const r of broken) {
    const key = `${r.contest}:${r.year}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(r);
}

const bucketKeys = BUCKET_FILTER ? [BUCKET_FILTER] : [...buckets.keys()];
console.log(`Buckets to process: ${bucketKeys.length}\n`);

// --- helper: load all pages for a contest/year ---
async function pagesForBucket(contest, year) {
    const dir = contest === 'USNCO Local'
        ? 'public/images/usnco_local/pages'
        : 'public/images/usnco_national/pages';
    const all = await fs.readdir(resolve(new URL('.', import.meta.url).pathname, '..', dir));
    return all
        .filter(f => f.startsWith(`${year}-`) && /\.jpe?g$/i.test(f))
        .sort()
        .map(f => path.join(dir, f));
}

async function loadJpegBase64(relPath) {
    const buf = await fs.readFile(resolve(new URL('.', import.meta.url).pathname, '..', relPath));
    return buf.toString('base64');
}

const SYSTEM_PROMPT = `You extract olympiad chemistry problem text from a scanned PDF page.

You will be shown ONE page from a USNCO exam. The page contains multiple numbered problems (typically 5-7 per page). Each problem has a number, a problem statement, and (usually) 5 multiple-choice options labeled (A) through (E).

Return STRICT JSON — an array of objects, one per problem visible on the page:
[
  {
    "number": <int>,
    "problem": "<problem statement including any context/setup text — NOT the choices>",
    "choices": ["<choice A text without the (A) label>", "<B>", "<C>", "<D>", "<E>"]
  },
  ...
]

Rules:
- Use LaTeX delimiters \$...\$ around math/chemistry. Use \\\\ce{...} for chemical formulas like H2O → \\\\ce{H2O}.
- If a problem appears only partially on this page (cut off at top or bottom), OMIT it.
- If you see no clear problems, return [].
- Return ONLY the JSON array. No prose, no markdown fences.`;

async function extractProblemsFromPage(pagePath) {
    const data = await loadJpegBase64(pagePath);
    const msg = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [{
            role: 'user',
            content: [
                { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data } },
                { type: 'text', text: 'Extract all problems on this page.' },
            ],
        }],
    });
    let text = msg.content[0]?.type === 'text' ? msg.content[0].text : '';
    // Strip code fences if present
    text = text.replace(/^\s*```(?:json)?\s*/, '').replace(/\s*```\s*$/, '').trim();
    try {
        const arr = JSON.parse(text);
        return Array.isArray(arr) ? arr : [];
    } catch (e) {
        console.error(`  [!] parse failed for ${pagePath}: ${e.message}`);
        return [];
    }
}

// --- run ---
const allUpdates = [];

let pagesProcessed = 0;
for (const key of bucketKeys) {
    const rows = buckets.get(key) || [];
    if (rows.length === 0) continue;
    const [contest, yearStr] = key.split(':');
    const year = parseInt(yearStr, 10);
    const brokenNumbers = new Set(rows.map(r => r.number));
    console.log(`\n[${key}] ${rows.length} broken rows: ${[...brokenNumbers].sort((a,b)=>a-b).join(', ')}`);

    let pages;
    try {
        pages = await pagesForBucket(contest, year);
    } catch (e) {
        console.error(`  [!] cannot list pages: ${e.message}`);
        continue;
    }
    if (pages.length === 0) {
        console.log('  no page scans available, skipping');
        continue;
    }
    console.log(`  ${pages.length} page scans`);

    // Per bucket: extract from each page until all broken numbers found
    const found = new Map();
    for (const page of pages) {
        if (LIMIT && pagesProcessed >= LIMIT) break;
        pagesProcessed++;
        console.log(`  extracting ${path.basename(page)}...`);
        const extracted = await extractProblemsFromPage(page);
        for (const p of extracted) {
            if (brokenNumbers.has(p.number) && !found.has(p.number)) {
                found.set(p.number, { ...p, page });
            }
        }
        // Early-exit when all found
        if (found.size === brokenNumbers.size) break;
    }

    console.log(`  recovered ${found.size}/${rows.length}`);
    for (const row of rows) {
        const ex = found.get(row.number);
        if (!ex) { console.log(`    #${row.number}: NOT FOUND on any page`); continue; }
        allUpdates.push({
            id: row.id,
            label: `${row.contest} ${row.year} #${row.number}`,
            patch: {
                problem: ex.problem,
                ...(Array.isArray(ex.choices) && ex.choices.length === 5 ? { choices: ex.choices } : {}),
            },
        });
    }
}

console.log(`\n${allUpdates.length} rows ready to update.`);
if (allUpdates.length > 0) {
    console.log('\nSample (first):');
    console.log(JSON.stringify(allUpdates[0], null, 2).slice(0, 600));
}

if (!APPLY) {
    console.log('\nDRY RUN — re-run with --apply.');
    process.exit(0);
}

console.log('\nApplying...');
let applied = 0;
for (const u of allUpdates) {
    const { error: e } = await supabase.from('olympiad_problems').update(u.patch).eq('id', u.id);
    if (e) console.error(`  [!] ${u.label}: ${e.message}`);
    else applied++;
}
console.log(`Applied ${applied}/${allUpdates.length}.`);
