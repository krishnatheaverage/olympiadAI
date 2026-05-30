// insert_usamo_2025.js - Inserts the 2025 USAMO problems (proof-based, AI-graded)

const SUPABASE_URL = 'https://rrjhdokniecigtekmpjz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qk42EmpxYFxXsAGkjLAzJA_kGznRof4';

const SOURCE = 'https://artofproblemsolving.com/wiki/index.php/2025_USAMO_Problems';

const problems = [
  {
    number: 1,
    topic: 'Number Theory',
    difficulty: 'medium',
    problem:
      'Let $k$ and $d$ be positive integers. Prove that there exists a positive integer $N$ such ' +
      'that for every odd integer $n > N$, the digits in the base-$2n$ representation of $n^k$ are ' +
      'all greater than $d$.',
  },
  {
    number: 2,
    topic: 'Algebra',
    difficulty: 'hard',
    problem:
      'Let $n$ and $k$ be positive integers with $k < n$. Let $P(x)$ be a polynomial of degree $n$ ' +
      'with real coefficients, nonzero constant term, and no repeated roots. Suppose that for any ' +
      'real numbers $a_0, a_1, \\ldots, a_k$ such that the polynomial ' +
      '$a_k x^k + \\cdots + a_1 x + a_0$ divides $P(x)$, the product $a_0 a_1 \\cdots a_k$ is zero. ' +
      'Prove that $P(x)$ has a nonreal root.',
  },
  {
    number: 3,
    topic: 'Combinatorics',
    difficulty: 'hard',
    problem:
      'Alice the architect and Bob the builder play a game. First, Alice chooses two points $P$ and ' +
      '$Q$ in the plane and a subset $\\mathcal{S}$ of the plane, which are announced to Bob. Next, ' +
      'Bob marks infinitely many points in the plane, designating each a city. He may not place two ' +
      'cities within distance at most one unit of each other, and no three cities he places may be ' +
      'collinear. Finally, roads are constructed between the cities as follows: for each pair $A$, ' +
      '$B$ of cities, they are connected with a road along the line segment $AB$ if and only if the ' +
      'following condition holds: For every city $C$ distinct from $A$ and $B$, there exists ' +
      '$R \\in \\mathcal{S}$ such that $\\triangle PQR$ is directly similar to either $\\triangle ABC$ ' +
      'or $\\triangle BAC$. Alice wins the game if (i) the resulting roads allow for travel between ' +
      'any pair of cities via a finite sequence of roads and (ii) no two roads cross. Otherwise, ' +
      'Bob wins. Determine, with proof, which player has a winning strategy. Note: $\\triangle UVW$ ' +
      'is directly similar to $\\triangle XYZ$ if there exists a sequence of rotations, translations, ' +
      'and dilations sending $U$ to $X$, $V$ to $Y$, and $W$ to $Z$.',
  },
  {
    number: 4,
    topic: 'Geometry',
    difficulty: 'medium',
    problem:
      'Let $H$ be the orthocenter of acute triangle $ABC$, let $F$ be the foot of the altitude from ' +
      '$C$ to $AB$, and let $P$ be the reflection of $H$ across $BC$. Suppose that the circumcircle ' +
      'of triangle $AFP$ intersects line $BC$ at two distinct points $X$ and $Y$. Prove that $C$ is ' +
      'the midpoint of $XY$.',
  },
  {
    number: 5,
    topic: 'Number Theory',
    difficulty: 'hard',
    problem:
      'Determine, with proof, all positive integers $k$ such that ' +
      '$$\\frac{1}{n+1} \\sum_{i=0}^{n} \\binom{n}{i}^k$$ is an integer for every positive integer $n$.',
  },
  {
    number: 6,
    topic: 'Combinatorics',
    difficulty: 'hard',
    problem:
      'Let $m$ and $n$ be positive integers with $m \\geq n$. There are $m$ cupcakes of different ' +
      'flavors arranged around a circle and $n$ people who like cupcakes. Each person assigns a ' +
      'nonnegative real number score to each cupcake, depending on how much they like the cupcake. ' +
      'Suppose that for each person $P$, it is possible to partition the circle of $m$ cupcakes into ' +
      '$n$ groups of consecutive cupcakes so that the sum of $P$\'s scores of the cupcakes in each ' +
      'group is at least $1$. Prove that it is possible to distribute the $m$ cupcakes to the $n$ ' +
      'people so that each person $P$ receives cupcakes of total score at least $1$ with respect to $P$.',
  },
];

async function main() {
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
  };

  // Delete only existing 2025 USAMO problems so re-running is idempotent
  console.log('Deleting existing 2025 USAMO problems...');
  const delRes = await fetch(
    SUPABASE_URL + '/rest/v1/olympiad_problems?contest=eq.' + encodeURIComponent('USAMO') + '&year=eq.2025',
    { method: 'DELETE', headers }
  );
  console.log(`Delete USAMO 2025: ${delRes.status}`);

  const rows = problems.map(p => ({
    contest: 'USAMO',
    year: 2025,
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
    console.log(`Done! ${rows.length} USAMO 2025 problems inserted.`);
  }
}

main().catch(console.error);
