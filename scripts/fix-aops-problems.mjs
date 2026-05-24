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

// --mode controls how rows are selected:
//   'dumps'        (default) — rows whose problem field starts with an
//                              AI-solution-dump opener (original use case)
//   'paraphrased'             — rows shorter than --min-length (default 300)
//                              that have an AoPS source_link. Catches AMC/AIME
//                              problems that were AI-summarized at ingest time.
//   'ids'                     — re-scrape specific rows by id (comma list via --ids)
const modeArg = args.find(a => a.startsWith('--mode'));
const MODE = modeArg ? (modeArg.split('=')[1] || args[args.indexOf(modeArg) + 1]) : 'dumps';
const minLenArg = args.find(a => a.startsWith('--min-length'));
const MIN_LENGTH = minLenArg ? parseInt(minLenArg.split('=')[1] || args[args.indexOf(minLenArg) + 1], 10) : 300;
const idsArg = args.find(a => a.startsWith('--ids'));
const TARGET_IDS = idsArg ? (idsArg.split('=')[1] || args[args.indexOf(idsArg) + 1]).split(',').map(s => parseInt(s.trim(), 10)) : [];

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

    // AoPS uses <img> tags two different ways:
    //   1. Inline LaTeX:    <img src="//.../foo.png" alt="$\sqrt x$" class="latex" ...>
    //   2. Asymptote diagrams: <img src="//.../big.png" alt="[asy] ... [/asy]" ...>
    // For LaTeX images we want the alt text (the LaTeX itself). For diagrams
    // we want to PRESERVE the rendered PNG URL so the trainer can show the
    // actual figure inline. Encode it as markdown ![alt](url) which the
    // renderer will turn into a real <img>.
    chunk = chunk.replace(/<img\b([^>]*)\/?>/g, (full, attrs) => {
        const altMatch = attrs.match(/\balt="([^"]*)"/);
        const srcMatch = attrs.match(/\bsrc="([^"]+)"/);
        const alt = altMatch ? altMatch[1] : '';
        const src = srcMatch ? srcMatch[1] : '';
        const isDiagram = /\[asy\]/i.test(alt);
        if (isDiagram && src) {
            // Normalize protocol-relative URLs
            const url = src.startsWith('//') ? `https:${src}` : src;
            return `\n\n![diagram](${url})\n\n`;
        }
        return alt;
    });
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
    chunk = stripChoices(chunk);
    return chunk || null;
}

// Strip the trailing AMC/AIME multiple-choice block. AoPS embeds it
// inline at the end of the problem statement in several formats; our
// trainer renders choices from the separate `choices` DB column so the
// problem text must not include them.
function stripChoices(text) {
    if (!text) return '';
    let out = text;
    // \$\textbf{(A)}~ ... — most common AMC format
    out = out.replace(/\$\s*\\textbf\b[\s\S]*$/, '');
    // (A) ... (B) ... (C) ... (D) ... — plain-text variant (some older problems)
    out = out.replace(/\s*\(A\)\s+[\s\S]*\(B\)\s+[\s\S]*$/, '');
    // ${\textbf{(A) — alternate AoPS formatting
    out = out.replace(/\$?\s*\{?\\textbf\b[\s\S]*$/, '');
    return out.trim();
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

let candidates;
if (MODE === 'paraphrased') {
    candidates = allRows.filter(r => {
        if (!r.problem || r.problem.length >= MIN_LENGTH) return false;
        const c = (r.contest || '').toUpperCase();
        return c.startsWith('AMC') || c.startsWith('AIME') || c.startsWith('USAMO');
    });
} else if (MODE === 'ids') {
    const idset = new Set(TARGET_IDS);
    candidates = allRows.filter(r => idset.has(r.id));
} else {
    candidates = allRows.filter(r => looksLikeSolutionDump(r.problem));
}
const targets = LIMIT ? candidates.slice(0, LIMIT) : candidates;

console.log(`  ${allRows.length} rows with AoPS source_link`);
if (MODE === 'paraphrased') {
    console.log(`  ${candidates.length} AMC/AIME/USAMO rows shorter than ${MIN_LENGTH} chars (likely paraphrased)`);
} else {
    console.log(`  ${candidates.length} look like solution dumps (matched detector)`);
}
console.log(`  ${targets.length} will be processed`);
console.log(`  Detection mode: ${MODE}`);
console.log(`  Write mode: ${APPLY ? 'APPLY (will write to DB)' : 'DRY RUN (no changes)'}`);
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
        // Paraphrased mode: only overwrite if the AoPS version is
        // meaningfully longer than what we already have. Catches the case
        // where AoPS strips the problem to just a title or the page lookup
        // grabbed the wrong section. (Skipped in 'ids' mode — the caller
        // explicitly listed rows they want overwritten.)
        if (MODE === 'paraphrased' && extracted.length < row.problem.length * 1.5) {
            failures++;
            results.push({
                id: row.id,
                label: `${row.contest} ${row.year} #${row.number}`,
                error: `extracted (${extracted.length}) not meaningfully longer than current (${row.problem.length})`,
            });
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
