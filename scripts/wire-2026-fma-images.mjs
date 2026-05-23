#!/usr/bin/env node

/**
 * Wire up the per-problem JPGs for 2026 F=ma rows.
 *
 * - Sets image_url to /images/fma/questions/2026_q{N}.jpg
 * - Strips "[Diagram Required]" prefix since the diagram now renders
 * - Cleans up problem 3 / 25's image-only-choice placeholders so they
 *   show clean (A)/(B)/(C)/(D)/(E) buttons that reference the figure
 * - Clears the broken source_link (the AAPT URL we used returns 404)
 *
 * Usage:
 *   node scripts/wire-2026-fma-images.mjs            # dry-run
 *   node scripts/wire-2026-fma-images.mjs --apply
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

// Problems whose CHOICES are also images, not text — replace the
// "see PDF" placeholder choices with bare letter labels that reference
// the figure the user is now seeing inline.
const IMAGE_ONLY_CHOICES = new Map([
    [3, ['(A)', '(B)', '(C)', '(D)', '(E)']],
]);

const { data: rows, error } = await supabase
    .from('olympiad_problems')
    .select('id, number, problem, choices, image_url, source_link')
    .eq('contest', 'F=ma')
    .eq('year', 2026)
    .order('number');
if (error) { console.error(error); process.exit(1); }
console.log(`Found ${rows.length} F=ma 2026 rows\n`);

const updates = [];
for (const row of rows) {
    const newProblem = row.problem
        .replace(/^\[Diagram Required\]\s*/, '')
        // Some rows say "(See original PDF for the trajectory and the five answer graphs.)"
        // — drop that since the image now shows everything.
        .replace(/\s*\(See original PDF[^)]*\)\s*\.?\s*/g, '')
        .replace(/\s*\(See PDF for[^)]*\)\s*\.?\s*/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    const newChoices = IMAGE_ONLY_CHOICES.has(row.number)
        ? IMAGE_ONLY_CHOICES.get(row.number)
        : row.choices;
    const newImageUrl = `/images/fma/questions/2026_q${row.number}.jpg`;
    // Source: clear the broken aapt 2026.cfm URL; point to the public exams index.
    const newSourceLink = 'https://www.aapt.org/programs/physicsteam/exams.cfm';

    const patch = {};
    if (newProblem !== row.problem) patch.problem = newProblem;
    if (JSON.stringify(newChoices) !== JSON.stringify(row.choices)) patch.choices = newChoices;
    if (newImageUrl !== row.image_url) patch.image_url = newImageUrl;
    if (newSourceLink !== row.source_link) patch.source_link = newSourceLink;

    if (Object.keys(patch).length > 0) {
        updates.push({ id: row.id, number: row.number, patch });
    }
}

console.log(`${updates.length} rows need updating`);
if (updates.length === 0) process.exit(0);

console.log('\nSample (problem 1):');
const sample = updates.find(u => u.number === 1) || updates[0];
console.log(JSON.stringify(sample, null, 2).slice(0, 500));

if (!APPLY) {
    console.log('\nDRY RUN — re-run with --apply.');
    process.exit(0);
}

console.log('\nApplying...');
let applied = 0;
for (const u of updates) {
    const { error: e } = await supabase.from('olympiad_problems').update(u.patch).eq('id', u.id);
    if (e) { console.error(`  [!] #${u.number}: ${e.message}`); }
    else { applied++; }
}
console.log(`Applied ${applied}/${updates.length}.`);
