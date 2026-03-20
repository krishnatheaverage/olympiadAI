// insert_aime_all.js - Inserts all AIME I and AIME II problems (2020-2026)

const SUPABASE_URL = 'https://rrjhdokniecigtekmpjz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qk42EmpxYFxXsAGkjLAzJA_kGznRof4';

const fs = require('fs');
const path = require('path');

// Load all JSON files
const files = [
  'aime1_2020_2021_2022.json',
  'aime1_2023_2024.json',
  'aime1_2025_2026.json',
  'aime2_2020_2021_2022.json',
  'aime2_2023_2024.json',
  'aime2_2025_2026.json',
];

let allProblems = [];
for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
  allProblems.push(...data);
}

function diff(num) {
  if (num <= 5) return 'easy';
  if (num <= 10) return 'medium';
  return 'hard';
}

async function main() {
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
  };

  // Delete existing AIME I and AIME II problems
  console.log('Deleting existing AIME problems...');
  for (const contest of ['AIME I', 'AIME II']) {
    const delRes = await fetch(
      SUPABASE_URL + '/rest/v1/olympiad_problems?contest=eq.' + encodeURIComponent(contest),
      { method: 'DELETE', headers }
    );
    console.log(`Delete ${contest}: ${delRes.status}`);
  }

  // Build rows
  const rows = allProblems.map(p => ({
    contest: p.contest,
    year: p.year,
    number: p.number,
    topic: p.topic,
    difficulty: diff(p.number),
    problem: p.problem,
    choices: null, // AIME has no multiple choice
    correct_answer: null, // AIME uses correct_value instead
    correct_value: String(p.correct_value),
    solution: p.solution || null,
    track: 'math',
    source_link: p.source_link || null,
    image_url: null,
  }));

  console.log(`Total problems to insert: ${rows.length}`);

  // Insert in batches of 25
  let successCount = 0;
  for (let i = 0; i < rows.length; i += 25) {
    const batch = rows.slice(i, i + 25);
    const res = await fetch(
      SUPABASE_URL + '/rest/v1/olympiad_problems',
      { method: 'POST', headers, body: JSON.stringify(batch) }
    );
    if (res.status >= 400) {
      const text = await res.text();
      console.error(`Batch ${Math.floor(i/25)+1} error (${res.status}):`, text);
    } else {
      successCount += batch.length;
      console.log(`Batch ${Math.floor(i/25)+1}: ${batch.length} rows inserted`);
    }
  }

  console.log(`Done! ${successCount}/${rows.length} AIME problems inserted.`);
}

main().catch(console.error);
