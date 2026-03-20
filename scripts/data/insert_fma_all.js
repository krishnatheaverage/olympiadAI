// insert_fma_all.js
// Deletes all existing F=ma problems, then inserts from separate year files

const SUPABASE_URL = 'https://rrjhdokniecigtekmpjz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qk42EmpxYFxXsAGkjLAzJA_kGznRof4';

const fma2020a = require('./fma_2020a.js');
const fma2021 = require('./fma_2021.js');
const fma2022a = require('./fma_2022a.js');
const fma2023 = require('./fma_2023.js');
const fma2024 = require('./fma_2024.js');
const fma2025 = require('./fma_2025.js');
const pageMap = require('./fma_page_map.js');

const allProblems = [
  ...fma2020a,
  ...fma2021,
  ...fma2022a,
  ...fma2023,
  ...fma2024,
  ...fma2025,
];

function diff(num) {
  if (num <= 8) return 'easy';
  if (num <= 18) return 'medium';
  return 'hard';
}

// Convert choices from JSON string {"A":"...","B":"..."} to array ["answer1","answer2",...]
function parseChoices(choices) {
  if (Array.isArray(choices)) return choices;
  if (typeof choices === 'string') {
    try {
      const obj = JSON.parse(choices);
      // If it's an object with A,B,C,D,E keys, convert to array
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

  // 1) Delete existing F=ma problems
  console.log('Deleting existing F=ma problems...');
  const delRes = await fetch(
    SUPABASE_URL + '/rest/v1/olympiad_problems?contest=eq.F%3Dma',
    { method: 'DELETE', headers }
  );
  console.log('Delete status:', delRes.status);

  // 2) Build rows
  const rows = allProblems.map(p => ({
    contest: p.contest || 'F=ma',
    year: p.year,
    number: p.number,
    topic: p.topic,
    difficulty: diff(p.number),
    problem: p.problem,
    choices: parseChoices(p.choices),
    correct_answer: p.correct_answer,
    correct_value: null,
    solution: p.solution || '',
    track: 'physics',
    source_link: null,
    image_url: (pageMap[p.year] && pageMap[p.year][p.number]) || null,
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
    console.log(`Inserted batch ${Math.floor(i/25) + 1} (${batch.length} rows): status ${res.status}`);
    if (res.status >= 400) {
      const text = await res.text();
      console.error('Error:', text);
    } else {
      successCount += batch.length;
    }
  }

  console.log(`Done! Successfully inserted ${successCount}/${rows.length} F=ma problems.`);
}

main().catch(console.error);
