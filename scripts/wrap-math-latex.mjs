#!/usr/bin/env node

/**
 * Wrap math expressions in olympiad_problems.problem with LaTeX delimiters.
 *
 * Why: ~76% of math problems were ingested as plain text (no $...$), so the
 * KaTeX renderer never formatted them. This is a one-shot backfill: it asks
 * Claude to insert $...$ around math while leaving prose untouched, then
 * writes the result back to Supabase.
 *
 * Usage:
 *   node scripts/wrap-math-latex.mjs                # dry-run, all math
 *   node scripts/wrap-math-latex.mjs --limit 5      # dry-run, first 5 problems
 *   node scripts/wrap-math-latex.mjs --apply        # actually write to DB
 *   node scripts/wrap-math-latex.mjs --track all    # math + chem + physics
 *   node scripts/wrap-math-latex.mjs --model sonnet # use claude-sonnet-4 (slower, ~10x cost)
 *
 * Defaults to claude-haiku-4-5 (cheap, plenty good for this task).
 * Skips problems that already contain a $ delimiter (assumed already wrapped).
 *
 * Approximate cost on Haiku for 695 math problems: < $1.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// --- args ---------------------------------------------------------------
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const limitArg = args.find(a => a.startsWith('--limit'));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1] || args[args.indexOf(limitArg) + 1], 10) : null;
const trackArg = args.find(a => a.startsWith('--track'));
const TRACK = trackArg ? (trackArg.split('=')[1] || args[args.indexOf(trackArg) + 1]) : 'math';
const modelArg = args.find(a => a.startsWith('--model'));
const MODEL_CHOICE = modelArg ? (modelArg.split('=')[1] || args[args.indexOf(modelArg) + 1]) : 'haiku';
const MODEL = MODEL_CHOICE === 'sonnet' ? 'claude-sonnet-4-20250514' : 'claude-haiku-4-5';
const CONCURRENCY = 5;

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
const ANTHROPIC_KEY = env.ANTHROPIC_API_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY || !ANTHROPIC_KEY) {
    console.error('Missing env vars. Need NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, ANTHROPIC_API_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const { default: Anthropic } = await import('@anthropic-ai/sdk');
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY });

// --- prompt -------------------------------------------------------------
const SYSTEM_PROMPT = `You wrap math expressions in math problem text with LaTeX delimiters so a KaTeX renderer can format them.

RULES (follow strictly):
1. Wrap math in $...$ (inline) or $$...$$ (display, only for standalone equations on their own line).
2. Wrap ENTIRE expressions, not individual tokens. "y = x^2 + 1" must become "$y = x^2 + 1$", NOT "$y$ = $x^2$ + $1$".
3. Wrap standalone variables when they're being referred to mathematically: "let x be" → "let $x$ be"; "the integer n" → "the integer $n$".
4. Coordinates and ordered tuples are math: "(4, 39)" → "$(4, 39)$"; "f(x)" → "$f(x)$".
5. Numbers in everyday prose are NOT math: "She has 5 apples" → unchanged. But "let r = 5" IS math: "let $r = 5$".
6. Inequalities, ratios, fractions, exponents, subscripts, summations, integrals, Greek letters are all math.
7. If a region is already wrapped in $...$ or $$...$$, leave it exactly as-is.
8. Do NOT change any words, punctuation, capitalization, or whitespace outside math regions.
9. Do NOT add any commentary, markdown code fences, quotes, or labels. Return ONLY the rewritten problem text.

If the input has no math at all, return it unchanged.`;

async function wrapOne(problemText) {
    const msg = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: problemText }],
    });
    const out = msg.content[0]?.type === 'text' ? msg.content[0].text : '';
    // Strip accidental code fences or surrounding quotes if Claude added them.
    return out
        .replace(/^\s*```(?:\w+)?\n?/, '')
        .replace(/\n?```\s*$/, '')
        .replace(/^["']|["']$/g, '')
        .trim();
}

// --- fetch problems -----------------------------------------------------
console.log(`\nFetching ${TRACK === 'all' ? 'all' : TRACK} problems from Supabase...`);
let query = supabase.from('olympiad_problems').select('id, contest, year, number, track, problem').neq('problem', '');
if (TRACK !== 'all') query = query.eq('track', TRACK);
const { data: allRows, error } = await query.order('id', { ascending: true });
if (error) { console.error(error); process.exit(1); }

// Filter out ones that already have $ — assume already wrapped.
const candidates = allRows.filter(r => !r.problem.includes('$'));
const targets = LIMIT ? candidates.slice(0, LIMIT) : candidates;

console.log(`  ${allRows.length} total rows`);
console.log(`  ${allRows.length - candidates.length} already have $ delimiters (skipped)`);
console.log(`  ${targets.length} candidates to rewrite`);
console.log(`  Model: ${MODEL}`);
console.log(`  Mode: ${APPLY ? 'APPLY (will write to DB)' : 'DRY RUN (no changes)'}`);
console.log('');

if (targets.length === 0) { console.log('Nothing to do.'); process.exit(0); }

// --- run with bounded concurrency --------------------------------------
const results = [];
let done = 0;
let failures = 0;

async function processOne(row) {
    try {
        const before = row.problem;
        const after = await wrapOne(before);
        const changed = after && after !== before;
        results.push({ id: row.id, label: `${row.contest} ${row.year} #${row.number}`, before, after, changed });
        done++;
        if (done % 25 === 0 || done === targets.length) {
            console.log(`  [${done}/${targets.length}] processed`);
        }
        return { row, before, after, changed };
    } catch (e) {
        failures++;
        console.error(`  [!] ${row.contest} ${row.year} #${row.number}: ${e.message}`);
        return null;
    }
}

// Simple batched runner
for (let i = 0; i < targets.length; i += CONCURRENCY) {
    const batch = targets.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(processOne));
}

const changes = results.filter(r => r.changed);
console.log(`\nDone. ${changes.length} rewrites, ${results.length - changes.length} unchanged, ${failures} failures.`);

// --- dump dry-run report ------------------------------------------------
const reportPath = resolve(new URL('.', import.meta.url).pathname, '..', `latex-wrap-report-${Date.now()}.json`);
writeFileSync(reportPath, JSON.stringify(changes.slice(0, 200), null, 2));
console.log(`Diff preview saved to ${reportPath} (first 200 changed entries).`);

if (changes.length > 0) {
    console.log('\nSample diff (first 3):');
    changes.slice(0, 3).forEach(c => {
        console.log(`\n--- ${c.label} (id=${c.id}) ---`);
        console.log(`BEFORE: ${c.before.slice(0, 200)}${c.before.length > 200 ? '...' : ''}`);
        console.log(`AFTER:  ${c.after.slice(0, 200)}${c.after.length > 200 ? '...' : ''}`);
    });
}

// --- apply --------------------------------------------------------------
if (!APPLY) {
    console.log(`\nDRY RUN — no DB writes. Re-run with --apply to commit ${changes.length} updates.`);
    process.exit(0);
}

console.log(`\nApplying ${changes.length} updates...`);
let applied = 0;
for (const c of changes) {
    const { error: updErr } = await supabase
        .from('olympiad_problems')
        .update({ problem: c.after })
        .eq('id', c.id);
    if (updErr) {
        console.error(`  [!] failed id=${c.id}: ${updErr.message}`);
    } else {
        applied++;
        if (applied % 25 === 0) console.log(`  ${applied}/${changes.length} applied`);
    }
}
console.log(`\nApplied ${applied}/${changes.length}. Done.`);
