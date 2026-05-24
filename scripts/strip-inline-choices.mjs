#!/usr/bin/env node

/**
 * Strip the inline AMC/AIME multiple-choice block from problem text.
 * AoPS pages embed choices like:
 *   $\textbf{(A)}~70 \qquad \textbf{(B)}~85 \qquad ...$
 * after the problem statement. Our trainer renders choices from the
 * separate `choices` JSON column, so the inline copy is duplicate noise.
 *
 * Usage:
 *   node scripts/strip-inline-choices.mjs            # dry-run
 *   node scripts/strip-inline-choices.mjs --apply
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const APPLY = process.argv.includes('--apply');

const envPath = resolve(new URL('.', import.meta.url).pathname, '..', '.env.local');
const env = {};
readFileSync(envPath, 'utf-8').split('\n').forEach(l => {
    const m = l.match(/^([^#][^=]*)=(.*)/);
    if (m) env[m[1].trim()] = m[2].trim();
});
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function stripInlineChoices(text) {
    if (!text) return text;
    let out = text;
    // $\textbf{(A)} ... — most common AMC format. Strip from $\textbf{(A)
    // onward to end of string.
    out = out.replace(/\$?\s*\\textbf\s*\{?\s*\(\s*A\s*\)\s*\}?[\s\S]*$/, '');
    // Same but with leading $ already consumed and ${ wrapper:
    out = out.replace(/\$?\{?\\textbf\b[\s\S]*\\textbf\b[\s\S]*$/, '');
    // Plain-text variant: " (A) ... (B) ..." appearing late
    out = out.replace(/\s*\(\s*A\s*\)\s+[^()]{1,40}\s+\(\s*B\s*\)\s+[\s\S]*$/, '');
    return out.trimEnd();
}

async function fetchAll() {
    const all = [];
    let from = 0;
    while (true) {
        const { data, error } = await supabase
            .from('olympiad_problems')
            .select('id, contest, year, number, problem')
            .order('id', { ascending: true })
            .range(from, from + 999);
        if (error) { console.error(error); process.exit(1); }
        if (!data || data.length === 0) break;
        all.push(...data);
        if (data.length < 1000) break;
        from += 1000;
    }
    return all;
}

const rows = await fetchAll();
console.log(`Scanning ${rows.length} rows...\n`);

const updates = [];
for (const r of rows) {
    if (!r.problem) continue;
    const trimmed = stripInlineChoices(r.problem);
    if (trimmed === r.problem || trimmed.length < 30) continue;
    // Also skip if the trim only chopped less than ~20 chars (might be
    // a false positive on a normal sentence)
    if (r.problem.length - trimmed.length < 20) continue;
    updates.push({
        id: r.id,
        label: `${r.contest} ${r.year} #${r.number}`,
        before_tail: r.problem.slice(-100),
        after_tail: trimmed.slice(-100),
        trimmed,
    });
}

console.log(`Found ${updates.length} rows with inline choice block to strip\n`);
updates.slice(0, 5).forEach(u => {
    console.log(`--- ${u.label} (id=${u.id}) ---`);
    console.log(`  was end: ...${JSON.stringify(u.before_tail)}`);
    console.log(`  now end: ...${JSON.stringify(u.after_tail)}`);
    console.log();
});
if (updates.length > 5) console.log(`... and ${updates.length - 5} more\n`);

if (!APPLY) {
    console.log('DRY RUN — re-run with --apply to commit.');
    process.exit(0);
}

console.log('Applying...');
let applied = 0;
for (const u of updates) {
    const { error: e } = await supabase
        .from('olympiad_problems')
        .update({ problem: u.trimmed })
        .eq('id', u.id);
    if (e) console.error(`  [!] id=${u.id}: ${e.message}`);
    else applied++;
    if (applied % 50 === 0) console.log(`  ${applied}/${updates.length} applied`);
}
console.log(`\nApplied ${applied}/${updates.length}.`);
