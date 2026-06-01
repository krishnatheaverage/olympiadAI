// wire_amc10b_2022_q19_images.js
// 2022 AMC 10B Problem 19 (Conway's-Life-style grid transform) ships with two
// Asymptote diagrams embedded in its text: a sample transformation and the
// 3x3 "?" subgrid that collapses to a single center square. The LatexRenderer
// can't draw [asy] source, so it falls back to a "see source link" badge.
//
// This script swaps each [asy]...[/asy] block for an inline markdown image
// pointing at the rendered figures the user supplied. The renderer turns
// ![alt](url) into an <img>, so each diagram lands in its correct spot in the
// text. Idempotent: re-running just rewrites the same two image tags (and it
// no-ops once the [asy] blocks are already gone, leaving the row untouched).

const SUPABASE_URL = 'https://rrjhdokniecigtekmpjz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qk42EmpxYFxXsAGkjLAzJA_kGznRof4';

const IMAGES = [
  '/images/amc/2022_amc10b_q19_sample.png', // 1st [asy]: sample transformation
  '/images/amc/2022_amc10b_q19_config.png', // 2nd [asy]: 3x3 "?" grid -> center
];
const ALTS = [
  'Sample transformation: an initial 5x5 grid and its transformed result',
  'Initial 5x5 grid with a 3x3 subgrid of unknown cells transforming to a single filled center square',
];

async function main() {
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json',
  };

  const q = '/rest/v1/olympiad_problems?contest=eq.' + encodeURIComponent('AMC 10B') +
            '&year=eq.2022&number=eq.19&select=id,problem';
  const getRes = await fetch(SUPABASE_URL + q, { headers });
  const rows = await getRes.json();
  if (!rows.length) {
    console.error('Could not find AMC 10B 2022 #19.');
    return;
  }
  const row = rows[0];

  let i = 0;
  const newProblem = row.problem.replace(/\[asy\][\s\S]*?\[\/asy\]/g, () => {
    const img = `![${ALTS[i] || 'figure'}](${IMAGES[i] || IMAGES[IMAGES.length - 1]})`;
    i++;
    return img;
  });

  if (i === 0) {
    console.log('No [asy] blocks found — nothing to do (already wired?).');
    return;
  }
  console.log(`Replaced ${i} [asy] block(s) with inline images.`);

  const patchRes = await fetch(
    SUPABASE_URL + '/rest/v1/olympiad_problems?id=eq.' + row.id,
    {
      method: 'PATCH',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ problem: newProblem }),
    }
  );
  if (patchRes.status >= 400) {
    console.error(`Update error (${patchRes.status}):`, await patchRes.text());
  } else {
    console.log(`Done! Updated row id ${row.id} (${patchRes.status}).`);
  }
}

main().catch(console.error);
