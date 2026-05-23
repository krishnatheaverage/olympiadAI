#!/usr/bin/env node

/**
 * Re-scrape problem text from AoPS for rows where an earlier ingestion
 * stuffed an AI-generated solution into the `problem` field instead of
 * the actual problem statement.
 *
 * Detection: rows whose problem field starts with one of the known
 * solution-dump tells ("I need to find", "Let me", "I'll use", ...) or
 * contains structural giveaways ("Setting up", "Boundary conditions",
 * "Recurrence relation"). Only rows with an AoPS source_link are
 * candidates — others have no clean re-source path.
 *
 * AoPS is Cloudflare-protected so direct fetch returns 403. We go
 * through ScrapingBee (SCRAPINGBEE_API_KEY in .env.local). LaTeX is
 * embedded as <img alt="$...$"> on AoPS pages, so the extractor pulls
 * alt text to preserve math.
 *
 * Usage:
 *   node scripts/fix-aops-problems.mjs                 # dry-run
 *   node scripts/fix-aops-problems.mjs --limit 5       # try 5 first
 *   node scripts/fix-aops-problems.mjs --apply         # commit changes
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// --- args ---------------------------------------------------------------
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const limitArg = args.find(a => a.startsWith('--limit'));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1] || args[args.indexOf(limitArg) + 1], 10) : null;
const CONCURRENCY = 3; // be gentle with ScrapingBee + AoPS

// --- env ----------------------------------------------------------------
const envPath = resolve(new URL('.', import.meta.url).pathname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
    const m = line.match(/^([^#][^=]*)=(.*)/);
    if (m) env[m[1].trim()] = m[2].trim();
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SB_KEY = env.SCRAPINGBEE_API_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY || !SB_KEY) {
    console.error('Missing env vars. Need NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SCRAPINGBEE_API_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- detection ----------------------------------------------------------
// Anchored to start-of-string to avoid false positives (the phrase "I need
// to find" can appear inside an actual problem prompt, but never as the
// opening words of a contest problem).
const STARTING_TELLS = [
    /^\s*I need to /i,
    /^\s*I'll use /i,
    /^\s*Let me /i,
    /^\s*First, let me /i,
    /^\s*To find /i,
    /^\s*To solve /i,
    /^\s*To determine /i,
];
// Structural markers — bold headers from chain-of-thought style dumps.
const STRUCTURAL_TELLS = [
    /\*\*Setting up the problem/i,
    /\*\*Boundary conditions/i,
    /\*\*Recurrence relation/i,
    /\*\*Computing values/i,
    /\*\*Answer:\*\*/i,
    /\*\*Setting up coordinates/i,
    /\\boxed\{/,
];

function looksLikeSolutionDump(text) {
    if (!text) return false;
    if (STARTING_TELLS.some(re => re.test(text))) return true;
    if (STRUCTURAL_TELLS.some(re => re.test(text))) return true;
    return false;
}

// --- ScrapingBee + extraction ------------------------------------------
async function fetchAopsPage(url) {
    const sbUrl = `https://app.scrapingbee.com/api/v1/?api_key=${SB_KEY}&url=${encodeURIComponent(url)}&render_js=false`;
    const res = await fetch(sbUrl);
    if (!res.ok) throw new Error(`ScrapingBee ${res.status}: ${await res.text().then(t => t.slice(0, 100))}`);
    return await res.text();
}

function extractProblemFromHtml(html, problemNumber) {
    // AoPS has two page shapes:
    //   - individual problem pages (id="Problem")
    //   - index pages listing all problems (id="Problem_N")
    // Try the numbered form first when we know the number.
    let m = null;
    if (problemNumber != null) {
        const re = new RegExp(`id="Problem_${problemNumber}"[^<]*</span>[\\s\\S]*?</h2>([\\s\\S]*?)<h2`);
        m = html.match(re);
    }
    if (!m) {
        m = html.match(/id="Problem"[^<]*<\/span>[\s\S]*?<\/h2>([\s\S]*?)<h2/);
    }
    if (!m) return null;
    let chunk = m[1];
    // Strip MediaWiki edit links
    chunk = chunk.replace(/<span class="mw-editsection"[\s\S]*?<\/span>/g, '');
    // Replace AoPS LaTeX images with their alt text (which IS the LaTeX)
    chunk = chunk.replace(/<img[^>]*\balt="([^"]+)"[^>]*\/?>/g, (_, alt) => alt);
    // Strip remaining tags
    chunk = chunk.replace(/<[^>]+>/g, '');
    // Decode common HTML entities
    chunk = chunk
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ');
    // Collapse whitespace
    chunk = chunk.replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n\n').trim();
    return chunk || null;
}

// --- fetch candidates ---------------------------------------------------
console.log('\nFetching candidate rows from Supabase...');
const { data: allRows, error } = await supabase
    .from('olympiad_problems')
    .select('id, contest, year, number, problem, source_link')
    .neq('problem', '')
    .ilike('source_link', '%artofproblemsolving.com%')
    .order('id', { ascending: true });
if (error) { console.error(error); process.exit(1); }

const candidates = allRows.filter(r => looksLikeSolutionDump(r.problem));
const targets = LIMIT ? candidates.slice(0, LIMIT) : candidates;

console.log(`  ${allRows.length} rows with AoPS source_link`);
console.log(`  ${candidates.length} look like solution dumps (matched detector)`);
console.log(`  ${targets.length} will be processed`);
console.log(`  Mode: ${APPLY ? 'APPLY (will write to DB)' : 'DRY RUN (no changes)'}`);
console.log('');

if (targets.length === 0) { console.log('Nothing to do.'); process.exit(0); }

// --- run with bounded concurrency --------------------------------------
const results = [];
let done = 0;
let failures = 0;

async function processOne(row) {
    try {
        const html = await fetchAopsPage(row.source_link);
        const extracted = extractProblemFromHtml(html, row.number);
        if (!extracted) {
            failures++;
            results.push({ id: row.id, label: `${row.contest} ${row.year} #${row.number}`, error: 'no Problem section in HTML' });
            return;
        }
        if (looksLikeSolutionDump(extracted)) {
            // Extra safety: if the extracted text ALSO looks like a dump,
            // something is off — skip rather than swap garbage for garbage.
            failures++;
            results.push({ id: row.id, label: `${row.contest} ${row.year} #${row.number}`, error: 'extracted text also looks like a solution dump' });
            return;
        }
        results.push({
            id: row.id,
            label: `${row.contest} ${row.year} #${row.number}`,
            before: row.problem,
            after: extracted,
            source: row.source_link,
        });
    } catch (e) {
        failures++;
        results.push({ id: row.id, label: `${row.contest} ${row.year} #${row.number}`, error: e.message });
    } finally {
        done++;
        if (done % 10 === 0 || done === targets.length) {
            console.log(`  [${done}/${targets.length}] processed`);
        }
    }
}

for (let i = 0; i < targets.length; i += CONCURRENCY) {
    const batch = targets.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(processOne));
}

const updates = results.filter(r => r.after);
const errors = results.filter(r => r.error);
console.log(`\nDone. ${updates.length} successful extractions, ${errors.length} failures.`);

// --- report -------------------------------------------------------------
const reportPath = resolve(new URL('.', import.meta.url).pathname, '..', `aops-fix-report-${Date.now()}.json`);
writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`Full diff + error report: ${reportPath}`);

if (updates.length > 0) {
    console.log('\nSample diff (first 3):');
    updates.slice(0, 3).forEach(c => {
        console.log(`\n--- ${c.label} (id=${c.id}) ---`);
        console.log(`BEFORE: ${c.before.slice(0, 150).replace(/\n/g, ' ')}...`);
        console.log(`AFTER:  ${c.after.slice(0, 250).replace(/\n/g, ' ')}...`);
    });
}

if (errors.length > 0) {
    console.log(`\nFirst 5 errors:`);
    errors.slice(0, 5).forEach(e => console.log(`  ${e.label} (id=${e.id}): ${e.error}`));
}

// --- apply --------------------------------------------------------------
if (!APPLY) {
    console.log(`\nDRY RUN — no DB writes. Re-run with --apply to commit ${updates.length} updates.`);
    process.exit(0);
}

console.log(`\nApplying ${updates.length} updates...`);
let applied = 0;
for (const u of updates) {
    const { error: updErr } = await supabase
        .from('olympiad_problems')
        .update({ problem: u.after })
        .eq('id', u.id);
    if (updErr) {
        console.error(`  [!] failed id=${u.id}: ${updErr.message}`);
    } else {
        applied++;
        if (applied % 25 === 0) console.log(`  ${applied}/${updates.length} applied`);
    }
}
console.log(`\nApplied ${applied}/${updates.length}. Done.`);
