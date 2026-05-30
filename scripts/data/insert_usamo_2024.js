// insert_usamo_2024.js - Inserts the 2024 USAMO problems (proof-based, AI-graded)

const SUPABASE_URL = 'https://rrjhdokniecigtekmpjz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qk42EmpxYFxXsAGkjLAzJA_kGznRof4';

const SOURCE = 'https://artofproblemsolving.com/wiki/index.php/2024_USAMO_Problems';

const problems = [
  {
    number: 1,
    topic: 'Number Theory',
    difficulty: 'medium',
    problem:
      'Find all integers $n \\geq 3$ such that the following property holds: if we list the ' +
      'divisors of $n!$ in increasing order as $1 = d_1 < d_2 < \\cdots < d_k = n!$, then we have ' +
      '$$d_2 - d_1 \\leq d_3 - d_2 \\leq \\cdots \\leq d_k - d_{k-1}.$$',
  },
  {
    number: 2,
    topic: 'Combinatorics',
    difficulty: 'hard',
    problem:
      'Let $S_1, S_2, \\ldots, S_{100}$ be finite sets of integers whose intersection is not empty. ' +
      'For each non-empty $T \\subseteq \\{S_1, S_2, \\ldots, S_{100}\\}$, the size of the ' +
      'intersection of the sets in $T$ is a multiple of the number of sets in $T$. What is the ' +
      'least possible number of elements that are in at least $50$ sets?',
  },
  {
    number: 3,
    topic: 'Combinatorics',
    difficulty: 'hard',
    problem:
      'Let $m$ be a positive integer. A triangulation of a polygon is $m$-balanced if its triangles ' +
      'can be colored with $m$ colors in such a way that the sum of the areas of all triangles of ' +
      'the same color is the same for each of the $m$ colors. Find all positive integers $n$ for ' +
      'which there exists an $m$-balanced triangulation of a regular $n$-gon. Note: A triangulation ' +
      'of a convex polygon $\\mathcal{P}$ with $n \\geq 3$ sides is any partitioning of ' +
      '$\\mathcal{P}$ into $n-2$ triangles by $n-3$ diagonals of $\\mathcal{P}$ that do not ' +
      'intersect in the polygon\'s interior.',
  },
  {
    number: 4,
    topic: 'Combinatorics',
    difficulty: 'medium',
    problem:
      'Let $m$ and $n$ be positive integers. A circular necklace contains $mn$ beads, each either ' +
      'red or blue. It turned out that no matter how the necklace was cut into $m$ blocks of $n$ ' +
      'consecutive beads, each block had a distinct number of red beads. Determine, with proof, all ' +
      'possible values of the ordered pair $(m, n)$.',
  },
  {
    number: 5,
    topic: 'Geometry',
    difficulty: 'hard',
    problem:
      'Point $D$ is selected inside acute triangle $ABC$ so that $\\angle DAC = \\angle ACB$ and ' +
      '$\\angle BDC = 90^\\circ + \\angle BAC$. Point $E$ is chosen on ray $BD$ so that $AE = EC$. ' +
      'Let $M$ be the midpoint of $BC$. Show that line $AB$ is tangent to the circumcircle of ' +
      'triangle $BEM$.',
  },
  {
    number: 6,
    topic: 'Algebra',
    difficulty: 'hard',
    problem:
      'Let $n > 2$ be an integer and let $\\ell \\in \\{1, 2, \\ldots, n\\}$. A collection ' +
      '$A_1, \\ldots, A_k$ of (not necessarily distinct) subsets of $\\{1, 2, \\ldots, n\\}$ is ' +
      'called $\\ell$-large if $|A_i| \\geq \\ell$ for all $1 \\leq i \\leq k$. Find, in terms of ' +
      '$n$ and $\\ell$, the largest real number $c$ such that the inequality ' +
      '$$\\sum_{i=1}^{k} \\sum_{j=1}^{k} x_i x_j \\frac{|A_i \\cap A_j|^2}{|A_i| \\cdot |A_j|} ' +
      '\\geq c \\left( \\sum_{i=1}^{k} x_i \\right)^2$$ holds for all positive integers $k$, all ' +
      'nonnegative real numbers $x_1, \\ldots, x_k$, and all $\\ell$-large collections ' +
      '$A_1, \\ldots, A_k$ of subsets of $\\{1, 2, \\ldots, n\\}$. Note: For a finite set $S$, ' +
      '$|S|$ denotes the number of elements in $S$.',
  },
];

async function main() {
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
  };

  // Delete only existing 2024 USAMO problems so re-running is idempotent
  console.log('Deleting existing 2024 USAMO problems...');
  const delRes = await fetch(
    SUPABASE_URL + '/rest/v1/olympiad_problems?contest=eq.' + encodeURIComponent('USAMO') + '&year=eq.2024',
    { method: 'DELETE', headers }
  );
  console.log(`Delete USAMO 2024: ${delRes.status}`);

  const rows = problems.map(p => ({
    contest: 'USAMO',
    year: 2024,
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
    console.log(`Done! ${rows.length} USAMO 2024 problems inserted.`);
  }
}

main().catch(console.error);
