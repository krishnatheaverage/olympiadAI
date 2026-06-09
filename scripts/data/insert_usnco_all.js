// insert_usnco_all.js
// Deletes all existing USNCO Local problems, then inserts from separate year files

const SUPABASE_URL = 'https://rrjhdokniecigtekmpjz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qk42EmpxYFxXsAGkjLAzJA_kGznRof4';

const usnco2020 = require('./usnco_2020.json');
const usnco2021 = require('./usnco_2021.json');
const usnco2022 = require('./usnco_2022.json');
const usnco2023 = require('./usnco_2023.json');
const usnco2023b = require('./usnco_2023b.json');
const usnco2024 = require('./usnco_2024.json');
const usnco2025 = require('./usnco_2025.json');
const usnco2026 = require('./usnco_2026.json');

const allProblems = [
  ...usnco2020,
  ...usnco2021,
  ...usnco2022,
  ...usnco2023,
  ...usnco2023b,
  ...usnco2024,
  ...usnco2025,
  ...usnco2026,
];

// Convert choices to a proper array if needed
function parseChoices(choices) {
  if (Array.isArray(choices)) return choices;
  if (typeof choices === 'string') {
    try {
      const obj = JSON.parse(choices);
      if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        return ['A', 'B', 'C', 'D', 'E']
          .filter(k => obj[k] !== undefined)
          .map(k => obj[k]);
      }
      if (Array.isArray(obj)) return obj;
    } catch (e) {
      // Not JSON, return as-is in array
    }
  }
  return choices;
}

async function main() {
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
  };

  // 1) Delete existing USNCO Local problems (both "USNCO Local" and "USNCO Local B")
  console.log('Deleting existing USNCO Local problems...');
  const delRes1 = await fetch(
    SUPABASE_URL + '/rest/v1/olympiad_problems?contest=eq.USNCO%20Local',
    { method: 'DELETE', headers }
  );
  console.log('Delete USNCO Local status:', delRes1.status);

  const delRes2 = await fetch(
    SUPABASE_URL + '/rest/v1/olympiad_problems?contest=eq.USNCO%20Local%20B',
    { method: 'DELETE', headers }
  );
  console.log('Delete USNCO Local B status:', delRes2.status);

  // 2) Build rows
  const rows = allProblems.map(p => ({
    contest: p.contest || 'USNCO Local',
    year: p.year,
    number: p.number,
    topic: p.topic,
    difficulty: p.difficulty,
    problem: p.problem,
    choices: parseChoices(p.choices),
    correct_answer: p.correct_answer,
    correct_value: null,
    solution: p.solution || null,
    track: 'chemistry',
    source_link: null,
    image_url: null,
  }));

  console.log(`Total problems to insert: ${rows.length}`);

  // 3) Insert in batches of 25
  let successCount = 0;
  for (let i = 0; i < rows.length; i += 25) {
    const batch = rows.slice(i, i + 25);
    const res = await fetch(
      SUPABASE_URL + '/rest/v1/olympiad_problems',
      { method: 'POST', headers, body: JSON.stringify(batch) }
    );
    console.log(`Inserted batch ${Math.floor(i / 25) + 1} (${batch.length} rows): status ${res.status}`);
    if (res.status >= 400) {
      const text = await res.text();
      console.error('Error:', text);
    } else {
      successCount += batch.length;
    }
  }

  console.log(`Done! Successfully inserted ${successCount}/${rows.length} USNCO problems.`);
}

main().catch(console.error);
