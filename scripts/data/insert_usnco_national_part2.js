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

// Each entry: { year, number, topic, difficulty?, problem?, image? }
//  - problem: full text statement (multi-part a./b./c. renders as tabs)
//  - image: OPTIONAL filename inside public/images/usnco_national/part2/.
//    If present, the multimodal grader reads the statement straight from it
//    and it renders under the problem. Use this for diagram-heavy problems.
const problems = [
  {
    year: 2025,
    number: 1,
    topic: 'stoichiometry',
    difficulty: 'hard',
    image: '2025_q1.png',
    problem:
      'Copper(II) sulfate pentahydrate, $\\mathrm{CuSO_4 \\cdot 5H_2O}$, is a blue crystalline ' +
      'solid. Upon gentle heating, it loses water to form anhydrous $\\mathrm{CuSO_4}$, which is a ' +
      'white solid.\n\n' +
      'a. When 5.000 g $\\mathrm{CuSO_4 \\cdot 5H_2O}$ is heated to remove all of its water, what ' +
      'mass of anhydrous $\\mathrm{CuSO_4}$ will be produced?\n\n' +
      'b. Explain the change in color on dehydration of $\\mathrm{CuSO_4 \\cdot 5H_2O}$.\n\n' +
      'c. A solution of 0.0506 g $\\mathrm{Cu(CH_3COO)_2 \\cdot H_2O}$ is made up with water to a ' +
      'volume of 5.00 mL water. This solution in a 1-cm cuvette produces the visible spectrum ' +
      'shown below. What wavelength would be the best choice to determine the concentration of ' +
      '$\\mathrm{Cu(II)}$?\n\n' +
      'd. A student determines the value of $n$ in an unknown crystalline hydrate of copper(II) ' +
      'nitrate, $\\mathrm{Cu(NO_3)_2 \\cdot nH_2O}$, by preparing 5.00 mL of an aqueous solution of ' +
      'a known mass of the compound and measuring its absorbance at the wavelength determined in ' +
      'part c. However, the student inserts the cuvette into the spectrophotometer without first ' +
      'wiping fingerprints from it. How will this affect the value of $n$ determined in the ' +
      'experiment?\n\n' +
      'e. An alternative method for determining the degree of hydration of the copper nitrate is ' +
      'to allow a known mass of compound to react with excess KI solution, which produces a ' +
      'yellow-brown suspension. Write a balanced net ionic equation for this reaction.\n\n' +
      'f. The experiment in part e is carried out with 0.1000 g of the hydrated copper(II) ' +
      'nitrate. To the resulting mixture is added a 0.0250 M solution of sodium thiosulfate, ' +
      '$\\mathrm{Na_2S_2O_3}$, until the color of the mixture has just dissipated, leaving a milky ' +
      'white suspension. This requires 17.20 mL of added sodium thiosulfate solution. What is the ' +
      'value of $n$ for the $\\mathrm{Cu(NO_3)_2 \\cdot nH_2O}$?',
  },
  {
    year: 2025,
    number: 2,
    topic: 'equilibrium',
    difficulty: 'hard',
    problem:
      'Calcium oxalate, $\\mathrm{CaC_2O_4}$, has a $K_{sp}$ of $2.7 \\times 10^{-9}$. Oxalic acid, ' +
      '$\\mathrm{H_2C_2O_4}$, has two ionizable hydrogens with $\\mathrm{p}K_{a1} = 1.27$ and ' +
      '$\\mathrm{p}K_{a2} = 4.28$.\n\n' +
      'a. Draw a Lewis structure for oxalate ion, $\\mathrm{C_2O_4^{2-}}$, including all bonds, ' +
      'lone pairs, and formal charges.\n\n' +
      'b. Calculate the molar solubility of calcium oxalate in pure water.\n\n' +
      'c. Calculate the molar solubility of calcium oxalate in a 0.100 M $\\mathrm{CaCl_2}$ ' +
      'solution.\n\n' +
      'd. A 0.100 mol sample of solid $\\mathrm{CaC_2O_4}$ is suspended in 1.00 L of water and ' +
      '$\\mathrm{HCl}(g)$ is bubbled through the solution until all of the solid just dissolves. ' +
      'What is the pH of the final homogeneous solution? You may assume the final volume of ' +
      'solution is 1.00 L.\n\n' +
      'e. How many moles of $\\mathrm{HCl}(g)$ are added in part d?\n\n' +
      'f. Will the molar solubility of $\\mathrm{CaC_2O_4}$ in 0.1 M $\\mathrm{NaHC_2O_4}$ be ' +
      'significantly greater than, significantly less than, or within 10% of the molar solubility ' +
      'of calcium oxalate in pure water? Justify your answer.',
  },
  {
    year: 2025,
    number: 3,
    topic: 'thermodynamics',
    difficulty: 'hard',
    problem:
      'N,N-Dimethylethanolamine ($\\mathrm{(CH_3)_2NCH_2CH_2OH}$, DMEA, $M = 89.14$) is a ' +
      'Brønsted base whose conjugate acid, $\\mathrm{DMEAH^+}$, has a $\\mathrm{p}K_a = 9.22$ ' +
      '($K_a = 6.0 \\times 10^{-10}$). Acetic acid ($\\mathrm{CH_3COOH}$, $M = 60.05$) has a ' +
      '$\\mathrm{p}K_a = 4.75$ ($K_a = 1.8 \\times 10^{-5}$).\n\n' +
      'a. Calculate $\\Delta G^\\circ_{rxn}$ at 298 K for the acid-base reaction of DMEA with ' +
      '$\\mathrm{CH_3COOH}$.\n\n' +
      'b. A solution consisting of 7.84 g $\\mathrm{CH_3COOH}$ and 107.17 g water is placed in a ' +
      'well-insulated (Dewar) flask. To this solution is added DMEA in small portions. After each ' +
      'portion of DMEA is added, the solution is stirred and the temperature measured with a ' +
      'digital thermometer. The data obtained are plotted (temperature $T$ in °C vs. grams of ' +
      'DMEA added). The solid line is the best linear fit to the data with $< 12$ g added DMEA, ' +
      'with equation $y = 1.141x + 19.03$; the dashed line is the average of the data with ' +
      '$\\geq 12$ g added DMEA, with equation $y = 31.84$. Calculate $\\Delta H^\\circ_{rxn}$ for ' +
      'the reaction of DMEA with $\\mathrm{CH_3COOH}$. You may assume that all solutions have the ' +
      'same specific heat capacity as pure water.\n\n' +
      'c. Calculate $\\Delta S^\\circ_{rxn}$ for the reaction of DMEA with $\\mathrm{CH_3COOH}$.\n\n' +
      'd. The $\\Delta S^\\circ$ calculated in part c. is negative. What features of the reaction ' +
      'of DMEA with $\\mathrm{CH_3COOH}$ cause it to have a negative entropy of reaction?',
  },
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
    image_url: p.image ? '/images/usnco_national/part2/' + p.image : null,
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
