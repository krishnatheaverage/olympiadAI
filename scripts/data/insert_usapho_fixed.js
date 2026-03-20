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

  // Delete existing USAPhO problems (both old and any Part A/B)
  for (const c of ['USAPhO', 'USAPhO Part A', 'USAPhO Part B']) {
    await fetch(
      SUPABASE_URL + '/rest/v1/olympiad_problems?contest=eq.' + encodeURIComponent(c),
      { method: 'DELETE', headers }
    );
  }
  console.log('Deleted old USAPhO entries');

  const rows = all.map(p => {
    // Problems 1-3 are Part A, 4-6 are Part B
    const isPartB = p.number > 3;
    const partLabel = isPartB ? 'Part B' : 'Part A';
    const partNumber = isPartB ? p.number - 3 : p.number;
    
    return {
      contest: `USAPhO ${partLabel}`,
      year: p.year,
      number: partNumber,
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
    };
  });

  console.log(`Inserting ${rows.length} USAPhO problems (Part A + Part B)...`);

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
  
  // Verify
  const countRes = await fetch(
    SUPABASE_URL + '/rest/v1/olympiad_problems?contest=like.USAPhO*&select=contest',
    { headers }
  );
  const countData = await countRes.json();
  const partA = countData.filter(r => r.contest === 'USAPhO Part A').length;
  const partB = countData.filter(r => r.contest === 'USAPhO Part B').length;
  console.log(`Done! Part A: ${partA}, Part B: ${partB}`);
}
main().catch(console.error);
