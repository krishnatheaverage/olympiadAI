// insert_usamo_2026.js - Inserts the 2026 USAMO problems (proof-based, AI-graded)

const SUPABASE_URL = 'https://rrjhdokniecigtekmpjz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qk42EmpxYFxXsAGkjLAzJA_kGznRof4';

const SOURCE = 'https://artofproblemsolving.com/wiki/index.php/2026_USAMO_Problems';

const problems = [
  {
    number: 1,
    topic: 'Number Theory',
    difficulty: 'medium',
    problem:
      'Let $n$ be an integer greater than $1$. For which real numbers $x$ is ' +
      '$\\left\\lfloor nx \\right\\rfloor - \\sum_{k=1}^{n} \\dfrac{\\lfloor kx \\rfloor}{k}$ ' +
      'maximal, and what is the maximal value that this expression can take? ' +
      'Note: $\\lfloor z \\rfloor$ denotes the greatest integer less than or equal to $z$.',
  },
  {
    number: 2,
    topic: 'Combinatorics',
    difficulty: 'hard',
    problem:
      'Annie is playing a game where she starts with a row of positive integers, written on a ' +
      'blackboard, each of which is a power of $2$. On each turn, she can erase two adjacent ' +
      'numbers and replace them with a power of $2$ that is greater than either of the erased ' +
      'numbers. This shortens the row of numbers, and she continues to take turns until only one ' +
      'number remains. Annie wins the game if the final remaining number is less than $4$ times ' +
      'the sum of the original numbers. Is it always possible for Annie to win, regardless of the ' +
      'starting row of numbers?',
  },
  {
    number: 3,
    topic: 'Geometry',
    difficulty: 'hard',
    problem:
      'Let $ABC$ be an acute scalene triangle with no angle equal to $60^\\circ$. Let $\\omega$ be ' +
      'the circumcircle of $ABC$. Let $\\triangle_B$ be the equilateral triangle with three ' +
      'vertices on $\\omega$, one of which is $B$. Let $\\ell_B$ be the line through the two ' +
      'vertices of $\\triangle_B$ other than $B$. Let $\\triangle_C$ and $\\ell_C$ be defined ' +
      'analogously. Let $Y$ be the intersection of $AC$ and $\\ell_B$, and let $Z$ be the ' +
      'intersection of $AB$ and $\\ell_C$. Let $N$ be the midpoint of minor arc $BC$ on $\\omega$. ' +
      'Let $\\mathcal{R}$ be the triangle formed by $\\ell_B$, $\\ell_C$, and the tangent to ' +
      '$\\omega$ through $N$. Prove that the circumcircle of $AYZ$ and the incircle of ' +
      '$\\mathcal{R}$ are tangent.',
  },
  {
    number: 4,
    topic: 'Number Theory',
    difficulty: 'medium',
    problem:
      'A positive integer $n$ is called solitary if, for any nonnegative integers $a$ and $b$ ' +
      'such that $a + b = n$, either $a$ or $b$ contains the digit $1$ when written in base $10$. ' +
      'Determine, with proof, the number of solitary integers less than $10^{2026}$.',
  },
  {
    number: 5,
    topic: 'Geometry',
    difficulty: 'hard',
    problem:
      'Let $ABC$ be a triangle. Points $D$, $E$, and $F$ lie on sides $BC$, $CA$, and $AB$, ' +
      'respectively, such that $\\angle AFE = \\angle BDF = \\angle CED$. Let $O_A$, $O_B$, and ' +
      '$O_C$ be the circumcenters of triangles $AFE$, $BDF$, and $CED$, respectively. Let $M$, ' +
      '$N$, and $O$ be the circumcenters of triangles $ABC$, $DEF$, and $O_A O_B O_C$, ' +
      'respectively. Prove that $OM = ON$.',
  },
  {
    number: 6,
    topic: 'Number Theory',
    difficulty: 'hard',
    problem:
      'Let $a$ and $b$ be positive integers such that $\\varphi(ab + 1)$ divides $a^2 + b^2 + 1$. ' +
      'Prove that $a$ and $b$ are Fibonacci numbers. Note: Euler\'s totient function ' +
      '$\\varphi(n)$ is the number of positive integers less than or equal to $n$ that are ' +
      'relatively prime to $n$.',
  },
];

async function main() {
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
  };

  // Delete existing USAMO problems so re-running is idempotent
  console.log('Deleting existing USAMO problems...');
  const delRes = await fetch(
    SUPABASE_URL + '/rest/v1/olympiad_problems?contest=eq.' + encodeURIComponent('USAMO'),
    { method: 'DELETE', headers }
  );
  console.log(`Delete USAMO: ${delRes.status}`);

  const rows = problems.map(p => ({
    contest: 'USAMO',
    year: 2026,
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
    console.log(`Done! ${rows.length} USAMO 2026 problems inserted.`);
  }
}

main().catch(console.error);
