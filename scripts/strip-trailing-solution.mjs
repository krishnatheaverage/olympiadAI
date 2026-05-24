#!/usr/bin/env node

/**
 * Strip the trailing word "Solution" (or "Solutions") from problem text.
 * The AoPS scraper sometimes captured the header of the next section
 * after the problem, leaving "Solution" dangling at the end.
 *
 * Usage:
 *   node scripts/strip-trailing-solution.mjs            # dry-run
 *   node scripts/strip-trailing-solution.mjs --apply    # commit
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

// Match a trailing "Solution" / "Solutions" / "Solution 1" / "Solution:"
// possibly preceded by whitespace and newlines. Only at the very end.
const TRAILING_SOLUTION_RE = /[\s\n]*(?:Solution[s]?(?:\s*\d+)?(?:\s*\([^)]*\))?[\s:.]*)$/i;

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
    const m = r.problem.match(TRAILING_SOLUTION_RE);
    if (!m || m[0].trim() === '') continue;
    // Only trim if the match is a STANDALONE "Solution" word, not the end of
    // a sentence like "...the solution." We require the matched chunk to begin
    // with whitespace OR newline (i.e. it's its own word/line, not part of a sentence).
    const matchStart = r.problem.length - m[0].length;
    const charBefore = matchStart > 0 ? r.problem[matchStart - 1] : ' ';
    // Skip if the char before our match is a letter — that would mean "Solution" is part of a word
    if (/[a-zA-Z]/.test(charBefore)) continue;
    const trimmed = r.problem.replace(TRAILING_SOLUTION_RE, '').trimEnd();
    if (trimmed === r.problem || trimmed.length === 0) continue;
    updates.push({
        id: r.id,
        label: `${r.contest} ${r.year} #${r.number}`,
        matched: m[0].replace(/\n/g, '\\n'),
        before_tail: r.problem.slice(-80),
        after_tail: trimmed.slice(-80),
        trimmed,
    });
}

console.log(`Found ${updates.length} rows with a trailing "Solution"\n`);
updates.slice(0, 8).forEach(u => {
    console.log(`--- ${u.label} (id=${u.id}) ---`);
    console.log(`  matched: ${JSON.stringify(u.matched)}`);
    console.log(`  was end: ...${JSON.stringify(u.before_tail)}`);
    console.log(`  now end: ...${JSON.stringify(u.after_tail)}`);
    console.log();
});
if (updates.length > 8) console.log(`... and ${updates.length - 8} more\n`);

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
}
console.log(`Applied ${applied}/${updates.length}.`);
