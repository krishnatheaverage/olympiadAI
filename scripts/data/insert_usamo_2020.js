// insert_usamo_2020.js - Inserts the 2020 USAMO problems (proof-based, AI-graded)

const SUPABASE_URL = 'https://rrjhdokniecigtekmpjz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qk42EmpxYFxXsAGkjLAzJA_kGznRof4';

const SOURCE = 'https://artofproblemsolving.com/wiki/index.php/2020_USAMO_Problems';

const problems = [
  {
    number: 1,
    topic: 'Geometry',
    difficulty: 'medium',
    problem:
      'Let $ABC$ be a fixed acute triangle inscribed in a circle $\\omega$ with center $O$. A ' +
      'variable point $X$ is chosen on minor arc $AB$ of $\\omega$, and segments $CX$ and $AB$ ' +
      'meet at $D$. Denote by $O_1$ and $O_2$ the circumcenters of triangles $ADX$ and $BDX$, ' +
      'respectively. Determine all points $X$ for which the area of triangle $OO_1O_2$ is ' +
      'minimized.',
  },
  {
    number: 2,
    topic: 'Combinatorics',
    difficulty: 'hard',
    problem:
      'An empty $2020 \\times 2020 \\times 2020$ cube is given, and a $2020 \\times 2020$ grid of ' +
      'square unit cells is drawn on each of its six faces. A beam is a $1 \\times 1 \\times 2020$ ' +
      'rectangular prism. Several beams are placed inside the cube subject to the following ' +
      'conditions:\n\n' +
      '- The two $1 \\times 1$ faces of each beam coincide with unit cells lying on opposite faces ' +
      'of the cube. (Hence, there are $3 \\cdot 2020^2$ possible positions for a beam.)\n' +
      '- No two beams have intersecting interiors.\n' +
      '- The interiors of each of the four $1 \\times 2020$ faces of each beam touch either a face ' +
      'of the cube or the interior of the face of another beam.\n\n' +
      'What is the smallest positive number of beams that can be placed to satisfy these ' +
      'conditions?',
  },
  {
    number: 3,
    topic: 'Number Theory',
    difficulty: 'hard',
    problem:
      'Let $p$ be an odd prime. An integer $x$ is called a quadratic non-residue if $p$ does not ' +
      'divide $x - t^2$ for any integer $t$.\n\n' +
      'Denote by $A$ the set of all integers $a$ such that $1 \\leq a < p$, and both $a$ and ' +
      '$4 - a$ are quadratic non-residues. Calculate the remainder when the product of the ' +
      'elements of $A$ is divided by $p$.',
  },
  {
    number: 4,
    topic: 'Combinatorics',
    difficulty: 'medium',
    problem:
      'Suppose that $(a_1, b_1), (a_2, b_2), \\ldots, (a_{100}, b_{100})$ are distinct ordered ' +
      'pairs of nonnegative integers. Let $N$ denote the number of pairs of integers $(i, j)$ ' +
      'satisfying $1 \\leq i < j \\leq 100$ and $|a_i b_j - a_j b_i| = 1$. Determine the largest ' +
      'possible value of $N$ over all possible choices of the $100$ ordered pairs.',
  },
  {
    number: 5,
    topic: 'Algebra',
    difficulty: 'hard',
    problem:
      'A finite set $S$ of points in the coordinate plane is called overdetermined if $|S| \\geq ' +
      '2$ and there exists a nonzero polynomial $P(t)$, with real coefficients and of degree at ' +
      'most $|S| - 2$, satisfying $P(x) = y$ for every point $(x, y) \\in S$.\n\n' +
      'For each integer $n \\geq 2$, find the largest integer $k$ (in terms of $n$) such that ' +
      'there exists a set of $n$ distinct points that is not overdetermined, but has $k$ ' +
      'overdetermined subsets.',
  },
  {
    number: 6,
    topic: 'Algebra',
    difficulty: 'hard',
    problem:
      'Let $n \\geq 2$ be an integer. Let $x_1 \\geq x_2 \\geq \\cdots \\geq x_n$ and ' +
      '$y_1 \\geq y_2 \\geq \\cdots \\geq y_n$ be $2n$ real numbers such that\n' +
      '$$0 = x_1 + x_2 + \\cdots + x_n = y_1 + y_2 + \\cdots + y_n$$\n' +
      'and\n' +
      '$$1 = x_1^2 + x_2^2 + \\cdots + x_n^2 = y_1^2 + y_2^2 + \\cdots + y_n^2.$$\n' +
      'Prove that\n' +
      '$$\\sum_{i=1}^{n} (x_i y_i - x_i y_{n+1-i}) \\geq \\frac{2}{\\sqrt{n-1}}.$$',
  },
];

async function main() {
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
  };

  // Delete only existing 2020 USAMO problems so re-running is idempotent
  console.log('Deleting existing 2020 USAMO problems...');
  const delRes = await fetch(
    SUPABASE_URL + '/rest/v1/olympiad_problems?contest=eq.' + encodeURIComponent('USAMO') + '&year=eq.2020',
    { method: 'DELETE', headers }
  );
  console.log(`Delete USAMO 2020: ${delRes.status}`);

  const rows = problems.map(p => ({
    contest: 'USAMO',
    year: 2020,
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
    console.log(`Done! ${rows.length} USAMO 2020 problems inserted.`);
  }
}

main().catch(console.error);
