// insert_usnco_national_part2.js
// Inserts USNCO National Exam Part II problems (free-response, screenshot-based,
// AI-graded on the 0-7 chemistry scale).
//
// Part II problems are stored as screenshots: each row points at an image in
// public/images/usnco_national/part2/ via image_url, and the trainer's grader
// (Opus, multimodal) reads the statement straight from the picture. No answer
// choices / answer key -> the row routes to the strict chemistry grader.
//
// To add a problem: drop its screenshot in public/images/usnco_national/part2/
// (e.g. 2024_q1.png) and add an entry to the `problems` array below.

const SUPABASE_URL = 'https://rrjhdokniecigtekmpjz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qk42EmpxYFxXsAGkjLAzJA_kGznRof4';

// Each entry: { year, number, topic, difficulty?, image, problem? }
//  - image: filename inside public/images/usnco_national/part2/
//  - problem: optional text caption (the screenshot carries the real statement)
const problems = [
  // Example shape (commented out — fill in as screenshots are added):
  // { year: 2024, number: 1, topic: 'thermodynamics', image: '2024_q1.png' },
];

async function main() {
  if (problems.length === 0) {
    console.log('No Part II problems defined yet. Add entries to `problems` and rerun.');
    return;
  }

  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
  };

  // Idempotent: wipe existing Part II rows before reinserting.
  console.log('Deleting existing USNCO National Part II problems...');
  const delRes = await fetch(
    SUPABASE_URL + '/rest/v1/olympiad_problems?contest=eq.' +
      encodeURIComponent('USNCO National Part II'),
    { method: 'DELETE', headers }
  );
  console.log('Delete USNCO National Part II:', delRes.status);

  const rows = problems.map(p => ({
    contest: 'USNCO National Part II',
    year: p.year,
    number: p.number,
    topic: p.topic,
    difficulty: p.difficulty || 'hard',
    problem: p.problem || '',
    choices: null,
    correct_answer: null, // free-response -> AI graded (chemistry rubric)
    correct_value: null,
    solution: null,
    track: 'chemistry',
    source_link: null,
    image_url: '/images/usnco_national/part2/' + p.image,
  }));

  console.log(`Inserting ${rows.length} USNCO National Part II problems...`);
  const res = await fetch(
    SUPABASE_URL + '/rest/v1/olympiad_problems',
    { method: 'POST', headers, body: JSON.stringify(rows) }
  );
  if (res.status >= 400) {
    const text = await res.text();
    console.error(`Insert error (${res.status}):`, text);
  } else {
    console.log(`Done! ${rows.length} USNCO National Part II problems inserted.`);
  }
}

main().catch(console.error);
