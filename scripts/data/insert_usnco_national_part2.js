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
    image: '2025_q3.png',
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
  {
    year: 2025,
    number: 4,
    topic: 'electrochemistry',
    difficulty: 'hard',
    image: '2025_q4.png',
    problem:
      'A galvanic cell is set up as follows and the cell potential measured as a function of ' +
      'temperature to give the graph shown. (The cell consists of a Pb electrode in a beaker of ' +
      '1.00 M $\\mathrm{Pb^{2+}}$ and a Zn electrode in a beaker of 1.00 M $\\mathrm{Zn^{2+}}$, ' +
      'connected by a salt bridge and a voltmeter. The measured cell potential $E$ (in V) is a ' +
      'linear function of temperature $T$ (in K) over 280–340 K, with best-fit line ' +
      '$E = 0.7887 - 0.000515\\,T$.)\n\n' +
      'a. Which electrode is the anode and which is the cathode?\n\n' +
      'b. The standard reduction potential for $\\mathrm{Zn^{2+}}(aq)$ at 298 K is $-0.762$ V. ' +
      'What is the standard reduction potential for $\\mathrm{Pb^{2+}}(aq)$ at 298 K?\n\n' +
      'c. What are $\\Delta G^\\circ$ (at 298 K), $\\Delta H^\\circ$, and $\\Delta S^\\circ$ for ' +
      'the reaction shown below?\n' +
      '$$\\mathrm{Zn}(s) + \\mathrm{Pb^{2+}}(aq) \\rightarrow \\mathrm{Zn^{2+}}(aq) + ' +
      '\\mathrm{Pb}(s)$$\n\n' +
      'd. Explain the sign of $\\Delta S^\\circ$ for the reaction given in part c.\n\n' +
      'e. The temperature-dependence of the cell is remeasured with the same cell, except that ' +
      'the concentration of $\\mathrm{Pb^{2+}}(aq)$ in the left-hand compartment is changed to ' +
      '0.100 M. Describe how the $E$-vs-$T$ plot for this new cell compares to the standard cell ' +
      '(both slope and intercept), and briefly justify your answer.',
  },
  {
    year: 2025,
    number: 5,
    topic: 'reactions',
    difficulty: 'hard',
    problem:
      'Write net equations for each of the reactions below. Use appropriate ionic and molecular ' +
      'formulas and omit formulas for all ions or molecules that do not take part in a reaction. ' +
      'Write structural formulas for all organic substances, and clearly show stereochemistry ' +
      'where relevant. You need not balance the equations or show the phases of the species.\n\n' +
      'a. Carbon dioxide is bubbled through a saturated solution of barium hydroxide.\n\n' +
      'b. Potassium permanganate is mixed with iron(II) sulfate in dilute sulfuric acid.\n\n' +
      'c. Solid silver chloride is added to concentrated aqueous ammonia.\n\n' +
      'd. Phosphorus trichloride reacts with potassium chlorate.\n\n' +
      'e. Para-xylene (1,4-dimethylbenzene) is heated with a mixture of concentrated nitric and ' +
      'sulfuric acids.\n\n' +
      'f. Fluorine-18 emits a positron.',
  },
  {
    year: 2025,
    number: 6,
    topic: 'bonding',
    difficulty: 'hard',
    problem:
      'Oxygen has two stable allotropes, $\\mathrm{O_2}$ (dioxygen) and $\\mathrm{O_3}$ ' +
      '(ozone).\n\n' +
      'a. Explain why $\\mathrm{O_2}$ has a higher normal boiling point than either ' +
      '$\\mathrm{N_2}$ or $\\mathrm{F_2}$.\n\n' +
      'b. Explain why both atomic oxygen (O) and $\\mathrm{O_2}$ have two unpaired electrons in ' +
      'their ground states.\n\n' +
      'c. Molecular oxygen has an excited state with no unpaired electrons, which emits light with ' +
      'a wavelength of 1270 nm to return to the ground state. What is the energy (in ' +
      '$\\mathrm{kJ\\,mol^{-1}}$) by which the excited state is higher than the ground state?\n\n' +
      'd. Explain why $\\mathrm{O_2}$ does not absorb light in the infrared region of the ' +
      'electromagnetic spectrum but $\\mathrm{O_3}$ does.\n\n' +
      'e. Dioxygen can be oxidized to form dioxygenyl cation ($\\mathrm{O_2^+}$) or reduced to ' +
      'form superoxide ion ($\\mathrm{O_2^-}$) or peroxide ion ($\\mathrm{O_2^{2-}}$), while ozone ' +
      'can be reduced to form ozonide ion ($\\mathrm{O_3^-}$). Among these six species ' +
      '($\\mathrm{O_2}$, $\\mathrm{O_2^+}$, $\\mathrm{O_2^-}$, $\\mathrm{O_2^{2-}}$, ' +
      '$\\mathrm{O_3}$, $\\mathrm{O_3^-}$), the O–O bond distances are 112 pm, 121 pm, 127 pm, ' +
      '128 pm, 135 pm, and 154 pm. Assign the correct distance to each of the six species and ' +
      'briefly justify your assignments. (You may consider 127 and 128 pm as essentially the same ' +
      'in this problem.)',
  },
  {
    year: 2025,
    number: 7,
    topic: 'solid state',
    difficulty: 'hard',
    image: '2025_q7.png',
    problem:
      'Cesium lead iodide, $\\mathrm{CsPbI_3}$, is of interest in solar photovoltaic cells. It ' +
      'adopts a structure called a perovskite whose cubic unit cell is shown below (small gray ' +
      'spheres on the cube corners, medium-sized white spheres on the cube edges/faces, and one ' +
      'large black sphere at the body center).\n\n' +
      'a. Which element corresponds to the small gray spheres, which to the medium sized white ' +
      'spheres, and which to the large black spheres?\n\n' +
      'b. Describe the coordination number and the identity of the nearest neighbor atoms for each ' +
      'of the types of atoms in $\\mathrm{CsPbI_3}$.\n\n' +
      'c. The length of the unit cell edge in $\\mathrm{CsPbI_3}$ is 628 pm. What is the density ' +
      'of $\\mathrm{CsPbI_3}$, in $\\mathrm{g\\,cm^{-3}}$?\n\n' +
      'd. A mixed-metal oxide that is of interest in high-temperature superconductivity research, ' +
      '$\\mathrm{YBa_2Cu_3O_7}$, adopts a structure related to the perovskite structure. One unit ' +
      'cell of this structure is shown below (it contains four types of spheres: dotted, white, ' +
      'black, and gray). Identify which elements correspond to the four types of spheres in the ' +
      'diagram.\n\n' +
      'e. Give the oxidation numbers of each element in $\\mathrm{YBa_2Cu_3O_7}$.\n\n' +
      'f. The atoms represented by the black spheres have two different coordination geometries in ' +
      'the structure shown. What are the geometries? How is this observation related to the ' +
      'oxidation numbers you determined in part e?',
  },
  {
    year: 2025,
    number: 8,
    topic: 'organic',
    difficulty: 'hard',
    problem:
      'Many organic compounds react with elemental halogens such as $\\mathrm{Br_2}$ or ' +
      '$\\mathrm{I_2}$.\n\n' +
      'a. Under appropriate conditions, 3-methylpentane will react with $\\mathrm{Br_2}$ to form a ' +
      'single monobromide with the formula $\\mathrm{C_6H_{13}Br}$. Give appropriate reaction ' +
      'conditions and the structural formula of the product.\n\n' +
      'b. Cyclohexene forms different products when reacted with $\\mathrm{Br_2}$ in water than ' +
      'when reacted in carbon tetrachloride. Give structural formulas for the products formed in ' +
      'the two solvents, including stereochemistry if relevant.\n\n' +
      'c. Benzene reacts with bromine in the presence of a Lewis acid catalyst. Give an example of ' +
      'a suitable catalyst and the structural formula of the major organic product of the ' +
      'reaction.\n\n' +
      'd. Cyclopentanone reacts with excess bromine in the presence of base to give a ' +
      'tetrabromide. Give a structural formula for the product and explain why the reaction does ' +
      'not give good yields of a monobromide product even when only one equivalent of ' +
      '$\\mathrm{Br_2}$ is used.\n\n' +
      'e. Acetophenone, $\\mathrm{C_6H_5COCH_3}$, reacts with excess iodine in the presence of ' +
      'aqueous sodium hydroxide to give a yellow precipitate and a water-soluble organic species. ' +
      'Give structural formulas for these two products.',
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
