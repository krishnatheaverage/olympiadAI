// insert_usamo_2021.js - Inserts the 2021 USAMO problems (proof-based, AI-graded)

const SUPABASE_URL = 'https://rrjhdokniecigtekmpjz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qk42EmpxYFxXsAGkjLAzJA_kGznRof4';

const SOURCE = 'https://artofproblemsolving.com/wiki/index.php/2021_USAMO_Problems';

const problems = [
  {
    number: 1,
    topic: 'Geometry',
    difficulty: 'medium',
    problem:
      'Rectangles $BCC_1B_2$, $CAA_1C_2$, and $ABB_1A_2$ are erected outside an acute triangle ' +
      '$ABC$. Suppose that $$\\angle BC_1C + \\angle CA_1A + \\angle AB_1B = 180^\\circ.$$ Prove ' +
      'that lines $B_1C_2$, $C_1A_2$, and $A_1B_2$ are concurrent.',
  },
  {
    number: 2,
    topic: 'Combinatorics',
    difficulty: 'hard',
    problem:
      'The Planar National Park is a subset of the Euclidean plane consisting of several trails ' +
      'which meet at junctions. Every trail has its two endpoints at two different junctions ' +
      'whereas each junction is the endpoint of exactly three trails. Trails only intersect at ' +
      'junctions (in particular, trails only meet at endpoints). Finally, no trails begin and end ' +
      'at the same two junctions. A visitor walks through the park as follows: she begins at a ' +
      'junction and starts walking along a trail. At the end of that first trail, she enters a ' +
      'junction and turns left. On the next junction she turns right, and so on, alternating left ' +
      'and right turns at each junction. She does this until she gets back to the junction where ' +
      'she started. What is the largest possible number of times she could have entered any ' +
      'junction during her walk, over all possible layouts of the park?',
  },
  {
    number: 3,
    topic: 'Combinatorics',
    difficulty: 'hard',
    problem:
      'Let $n \\geq 2$ be an integer. An $n \\times n$ board is initially empty. Each minute, you ' +
      'may perform one of three moves: If there is an L-shaped tromino region of three cells ' +
      'without stones on the board (see the source link; rotations not allowed), you may place a ' +
      'stone in each of those cells. If all cells in a column have a stone, you may remove all ' +
      'stones from that column. If all cells in a row have a stone, you may remove all stones from ' +
      'that row. For which $n$ is it possible that, after some non-zero number of moves, the board ' +
      'has no stones?',
  },
  {
    number: 4,
    topic: 'Number Theory',
    difficulty: 'medium',
    problem:
      'A finite set $S$ of positive integers has the property that, for each $s \\in S$, and each ' +
      'positive integer divisor $d$ of $s$, there exists a unique element $t \\in S$ satisfying ' +
      '$\\gcd(s, t) = d$. (The elements $s$ and $t$ could be equal.) Given this information, find ' +
      'all possible values for the number of elements of $S$.',
  },
  {
    number: 5,
    topic: 'Algebra',
    difficulty: 'hard',
    problem:
      'Let $n \\geq 4$ be an integer. Find all positive real solutions to the following system of ' +
      '$2n$ equations: ' +
      '$$a_1 = \\frac{1}{a_{2n}} + \\frac{1}{a_2}, \\quad a_2 = a_1 + a_3,$$ ' +
      '$$a_3 = \\frac{1}{a_2} + \\frac{1}{a_4}, \\quad a_4 = a_3 + a_5,$$ ' +
      '$$a_5 = \\frac{1}{a_4} + \\frac{1}{a_6}, \\quad a_6 = a_5 + a_7,$$ ' +
      '$$\\vdots$$ ' +
      '$$a_{2n-1} = \\frac{1}{a_{2n-2}} + \\frac{1}{a_{2n}}, \\quad a_{2n} = a_{2n-1} + a_1.$$',
  },
  {
    number: 6,
    topic: 'Geometry',
    difficulty: 'hard',
    problem:
      'Let $ABCDEF$ be a convex hexagon satisfying $\\overline{AB} \\parallel \\overline{DE}$, ' +
      '$\\overline{BC} \\parallel \\overline{EF}$, $\\overline{CD} \\parallel \\overline{FA}$, and ' +
      '$$AB \\cdot DE = BC \\cdot EF = CD \\cdot FA.$$ Let $X$, $Y$, and $Z$ be the midpoints of ' +
      '$\\overline{AD}$, $\\overline{BE}$, and $\\overline{CF}$. Prove that the circumcenter of ' +
      '$\\triangle ACE$, the circumcenter of $\\triangle BDF$, and the orthocenter of ' +
      '$\\triangle XYZ$ are collinear.',
  },
];

async function main() {
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
  };

  // Delete only existing 2021 USAMO problems so re-running is idempotent
  console.log('Deleting existing 2021 USAMO problems...');
  const delRes = await fetch(
    SUPABASE_URL + '/rest/v1/olympiad_problems?contest=eq.' + encodeURIComponent('USAMO') + '&year=eq.2021',
    { method: 'DELETE', headers }
  );
  console.log(`Delete USAMO 2021: ${delRes.status}`);

  const rows = problems.map(p => ({
    contest: 'USAMO',
    year: 2021,
    number: p.number,
    topic: p.topic,
    difficulty: p.difficulty,
    problem: p.problem,
    choices: null,
    correct_answer: null, // proof problems -> AI graded
    correct_value: null,
    solution: null,
    track: 'math',
    source_link: SOURCE,
    image_url: null,
  }));

  console.log(`Total problems to insert: ${rows.length}`);

  const res = await fetch(
    SUPABASE_URL + '/rest/v1/olympiad_problems',
    { method: 'POST', headers, body: JSON.stringify(rows) }
  );
  if (res.status >= 400) {
    const text = await res.text();
    console.error(`Insert error (${res.status}):`, text);
  } else {
    console.log(`Done! ${rows.length} USAMO 2021 problems inserted.`);
  }
}

main().catch(console.error);
