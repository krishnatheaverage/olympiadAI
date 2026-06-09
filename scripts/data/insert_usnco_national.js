const SUPABASE_URL = 'https://rrjhdokniecigtekmpjz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qk42EmpxYFxXsAGkjLAzJA_kGznRof4';
const fs = require('fs');
const path = require('path');

const files = [
  'usnco_national_2020_2021.json',
  'usnco_national_2022_2023.json',
  'usnco_national_2024_2025.json',
  'usnco_national_2026.json',
];

let all = [];
for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
  all.push(...data);
}

async function main() {
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
  };

  const delRes = await fetch(
    SUPABASE_URL + '/rest/v1/olympiad_problems?contest=eq.' + encodeURIComponent('USNCO National'),
    { method: 'DELETE', headers }
  );
  console.log('Delete USNCO National:', delRes.status);

  const rows = all.map(p => ({
    contest: 'USNCO National',
    year: p.year,
    number: p.number,
    topic: p.topic,
    difficulty: p.difficulty || (p.number <= 20 ? 'medium' : 'hard'),
    problem: p.problem,
    choices: p.choices,
    correct_answer: p.correct_answer,
    correct_value: null,
    solution: null,
    track: 'chemistry',
    source_link: null,
    image_url: null,
  }));

  console.log(`Inserting ${rows.length} USNCO National problems...`);

  let ok = 0;
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
      ok += batch.length;
      console.log(`Batch ${Math.floor(i/25)+1}: ${batch.length} rows`);
    }
  }
  console.log(`Done! ${ok}/${rows.length} inserted.`);
}
main().catch(console.error);
