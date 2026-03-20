const SUPABASE_URL = 'https://rrjhdokniecigtekmpjz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qk42EmpxYFxXsAGkjLAzJA_kGznRof4';
const fs = require('fs');
const path = require('path');

const files = [
  'usapho_2020_2021.json',
  'usapho_2022_2023.json',
  'usapho_2024_2025.json',
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

  // Delete existing USAPhO problems
  const delRes = await fetch(
    SUPABASE_URL + '/rest/v1/olympiad_problems?contest=eq.USAPhO',
    { method: 'DELETE', headers }
  );
  console.log('Delete USAPhO:', delRes.status);

  const rows = all.map(p => ({
    contest: 'USAPhO',
    year: p.year,
    number: p.number,
    topic: p.topic,
    difficulty: 'hard',
    problem: p.problem,
    choices: null,
    correct_answer: null,
    correct_value: null,
    solution: p.solution || null,
    track: 'physics',
    source_link: null,
    image_url: null,
  }));

  console.log(`Inserting ${rows.length} USAPhO problems...`);

  for (let i = 0; i < rows.length; i += 25) {
    const batch = rows.slice(i, i + 25);
    const res = await fetch(
      SUPABASE_URL + '/rest/v1/olympiad_problems',
      { method: 'POST', headers, body: JSON.stringify(batch) }
    );
    if (res.status >= 400) {
      const text = await res.text();
      console.error(`Batch error (${res.status}):`, text);
    } else {
      console.log(`Batch ${Math.floor(i/25)+1}: ${batch.length} rows inserted`);
    }
  }
  console.log('Done!');
}
main().catch(console.error);
