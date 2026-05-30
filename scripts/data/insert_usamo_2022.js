// insert_usamo_2022.js - Inserts the 2022 USAMO problems (proof-based, AI-graded)

const SUPABASE_URL = 'https://rrjhdokniecigtekmpjz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qk42EmpxYFxXsAGkjLAzJA_kGznRof4';

const SOURCE = 'https://artofproblemsolving.com/wiki/index.php/2022_USAMO_Problems';

const problems = [
  {
    number: 1,
    topic: 'Combinatorics',
    difficulty: 'medium',
    problem:
      'Let $a$ and $b$ be positive integers. The cells of an $(a+b+1) \\times (a+b+1)$ grid are ' +
      'colored amber and bronze such that there are at least $a^2 + ab - b$ amber cells and at least ' +
      '$b^2 + ab - a$ bronze cells. Prove that it is possible to choose $a$ amber cells and $b$ ' +
      'bronze cells such that no two of the $a + b$ chosen cells lie in the same row or column.',
  },
  {
    number: 2,
    topic: 'Geometry',
    difficulty: 'hard',
    problem:
      'Let $b \\geq 2$ and $w \\geq 2$ be fixed integers, and $n = b + w$. Given are $2b$ identical ' +
      'black rods and $2w$ identical white rods, each of side length $1$. We assemble a regular ' +
      '$2n$-gon using these rods so that parallel sides are the same color. Then, a convex $2b$-gon ' +
      '$B$ is formed by translating the black rods, and a convex $2w$-gon $W$ is formed by ' +
      'translating the white rods. An example of one way of doing the assembly when $b = 3$ and ' +
      '$w = 2$ is shown in the source link, as well as the resulting polygons $B$ and $W$. Prove ' +
      'that the difference of the areas of $B$ and $W$ depends only on the numbers $b$ and $w$, and ' +
      'not on how the $2n$-gon was assembled.',
  },
  {
    number: 3,
    topic: 'Algebra',
    difficulty: 'hard',
    problem:
      'Let $\\mathbb{R}_{>0}$ be the set of all positive real numbers. Find all functions ' +
      '$f : \\mathbb{R}_{>0} \\to \\mathbb{R}_{>0}$ such that for all $x, y \\in \\mathbb{R}_{>0}$ we ' +
      'have $$f(x) = f(f(f(x)) + y) + f(xf(y))f(x + y).$$',
  },
  {
    number: 4,
    topic: 'Number Theory',
    difficulty: 'medium',
    problem:
      'Find all pairs of primes $(p, q)$ for which $p - q$ and $pq - q$ are both perfect squares.',
  },
  {
    number: 5,
    topic: 'Algebra',
    difficulty: 'hard',
    problem:
      'A function $f : \\mathbb{R} \\to \\mathbb{R}$ is essentially increasing if $f(s) \\leq f(t)$ ' +
      'holds whenever $s \\leq t$ are real numbers such that $f(s) \\neq 0$ and $f(t) \\neq 0$. Find ' +
      'the smallest integer $k$ such that for any $2022$ real numbers ' +
      '$x_1, x_2, \\ldots, x_{2022}$, there exist $k$ essentially increasing functions ' +
      '$f_1, \\ldots, f_k$ such that ' +
      '$$f_1(n) + f_2(n) + \\cdots + f_k(n) = x_n \\quad \\text{for every } n = 1, 2, \\ldots, 2022.$$',
  },
  {
    number: 6,
    topic: 'Combinatorics',
    difficulty: 'hard',
    problem:
      'There are $2022$ users on a social network called Mathbook, and some of them are ' +
      'Mathbook-friends. (On Mathbook, friendship is always mutual and permanent.) Starting now, ' +
      'Mathbook will only allow a new friendship to be formed between two users if they have at ' +
      'least two friends in common. What is the minimum number of friendships that must already ' +
      'exist so that every user could eventually become friends with every other user?',
  },
];

async function main() {
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
  };

  // Delete only existing 2022 USAMO problems so re-running is idempotent
  console.log('Deleting existing 2022 USAMO problems...');
  const delRes = await fetch(
    SUPABASE_URL + '/rest/v1/olympiad_problems?contest=eq.' + encodeURIComponent('USAMO') + '&year=eq.2022',
    { method: 'DELETE', headers }
  );
  console.log(`Delete USAMO 2022: ${delRes.status}`);

  const rows = problems.map(p => ({
    contest: 'USAMO',
    year: 2022,
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
    console.log(`Done! ${rows.length} USAMO 2022 problems inserted.`);
  }
}

main().catch(console.error);
