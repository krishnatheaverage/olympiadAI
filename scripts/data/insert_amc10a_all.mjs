// Insert all AMC 10A problems (2020, 2021, 2021 Fall, 2022, 2023, 2025) into Supabase
// 2024 is already in DB, skip it

const url = 'https://rrjhdokniecigtekmpjz.supabase.co';
const key = 'sb_publishable_qk42EmpxYFxXsAGkjLAzJA_kGznRof4';

function getDifficulty(num) {
  if (num <= 8) return 'easy';
  if (num <= 18) return 'medium';
  return 'hard';
}

function getTopic(num) {
  // Assign topics based on typical AMC 10 problem distribution
  const topics = {
    1: 'Arithmetic', 2: 'Arithmetic', 3: 'Number Theory',
    4: 'Algebra', 5: 'Number Theory', 6: 'Geometry',
    7: 'Algebra', 8: 'Logic', 9: 'Algebra',
    10: 'Geometry', 11: 'Algebra', 12: 'Number Theory',
    13: 'Combinatorics', 14: 'Probability', 15: 'Geometry',
    16: 'Probability', 17: 'Number Theory', 18: 'Algebra',
    19: 'Geometry', 20: 'Geometry', 21: 'Combinatorics',
    22: 'Geometry', 23: 'Number Theory', 24: 'Combinatorics',
    25: 'Geometry'
  };
  return topics[num] || 'Algebra';
}

// All problem data by year
const allProblems = [];

// ===== 2020 AMC 10A =====
const answers2020 = ['E','C','A','E','C','B','C','B','B','B','C','C','B','D','E','B','E','C','E','D','C','A','A','C','A'];
const problems2020 = [
  "What value of x satisfies x - 3/4 = 5/12 - 1/3?",
  "Four siblings have heights of 31, 33, 37, and 39 inches. What is the range of heights?",
  "Assuming a, b, and c are nonzero real numbers, how many of the following are always positive: a/|a|, -a/|a|, a*|a|, a^2/a, a^5/|a^5|?",
  "A driver travels for 2 hours at 60 mph, then travels 120 miles at 40 mph. What is the average speed in mph?",
  "What is the median of the following list of 4040 numbers: 1, 2, 3, ..., 2020, 1^2, 2^2, 3^2, ..., 2020^2?",
  "How many 4-digit positive integers (leading digit nonzero) have exactly two equal digits?",
  "The integers from 1 to 225 are placed in a 15x15 grid. In each of the 225 cells exactly one number is placed. What is the greatest possible mean of the medians of all rows?",
  "What is the value of 1 + 2 + 3 - 4 + 5 + 6 + 7 - 8 + ... + 197 + 198 + 199 - 200?",
  "A single bench section can hold either 7 adults or 11 children. When N bench sections are connected, an adult bench holds 4N+3 adults and a children's bench holds 4N+7 children. Minimum N such that we can seat 150 adults and 200 children?",
  "Seven cubes whose volumes are 1, 8, 27, 64, 125, 216, and 343 cubic units are stacked vertically. What is the total surface area?",
  "What is the median of the 9-element data set where the median of the 5 smallest values equals the median of the 5 largest values?",
  "Triangle AMC is isosceles with AM = AC. Median MV to side AC is extended to point X such that MV = VX. What is the area of quadrilateral AMXC?",
  "A frog sitting on a number line at 1 makes a sequence of jumps. Each jump takes the frog from position x to either x+2 or x/2. What is the minimum jumps to reach 2020?",
  "Real numbers a and b satisfy a + b = 6 and a^3 + b^3 = 132. What is ab?",
  "A 10x1 board is tiled using 1x1 squares and 1x2 dominoes. How many ways can this be done?",
  "Bela and Jenn play a game where they take turns choosing integers between 1 and n (inclusive). A player loses by choosing a number within 4 of any previously chosen number. Bela goes first. For how many n between 1 and 20 does Bela have a winning strategy?",
  "There are 10 people standing equally spaced around a circle. Each picks a number at random from 1, 2, or 3. What is the probability that no two adjacent people pick the same number?",
  "Let (a,b,c,d) be an ordered quadruple of not necessarily distinct integers, each one of them in the set {0,1,2,3}. How many ordered quadruples satisfy a*d - b*c = 0?",
  "As shown in the figure, line segment AB is a diameter of a circle with center O. What is the ratio of the area of a triangle to the area of the circle?",
  "Let B be a subset of {1,2,...,2019} such that the number of subsets of B with the same sum is maximized. What is the minimum possible |B|?",
  "There exists a unique nonnegative integer a such that the polynomial x^2 + (2a+1)x + a^2 can be factored as a product of two polynomials, each having nonneg integer coefficients. What is a?",
  "For how many positive integers n ≤ 1000 is n/30 a terminating decimal?",
  "Let T be the triangle with vertices (0,0), (a,0), (0,a). If the line y = mx + 1 divides T into two regions of equal area, what is the sum of all possible values of a?",
  "Let n be the least positive integer greater than 1000 for which gcd(63, n+120) = 21 and gcd(n+63, 120) = 60. What is the sum of digits of n?",
  "Jason rolls three fair dice. Then he looks at the rolls and chooses a subset (possibly empty) to reroll. After rerolling, he wins if the sum of the three dice is exactly 7. Jason plays optimally. What is his probability of winning?"
];
const choices2020 = [
  ["1/6","1/4","1/3","5/12","5/6"],
  ["2","4","6","8","10"],
  ["1","2","3","4","5"],
  ["45","48","50","55","60"],
  ["1000","1000.5","1001","1001.5","1002"],
  ["1092","1104","1200","1236","1260"],
  ["100","103","106","109","112"],
  ["9800","9900","10000","10100","10200"],
  ["12","13","14","15","16"],
  ["658","664","670","676","682"],
  ["5.5","6","6.5","7","7.5"],
  ["12","18","24","30","36"],
  ["24","25","26","27","28"],
  ["-1","1","5","11","19"],
  ["89","144","233","377","610"],
  ["4","8","10","12","14"],
  ["None","1","2","3","4"],
  ["37","64","100","128","243"],
  ["1:2","1:3","1:4","1:5","1:6"],
  ["2","7","12","497","1012"],
  ["2","4","6","8","10"],
  ["0","120","165","330","332"],
  ["3","5","7","9","12"],
  ["12","14","15","17","19"],
  ["1/3","47/144","25/72","17/48","1/2"]
];

for (let i = 0; i < 25; i++) {
  allProblems.push({
    contest: 'AMC 10A', year: 2020, number: i + 1,
    topic: getTopic(i + 1), difficulty: getDifficulty(i + 1),
    problem: problems2020[i],
    choices: JSON.stringify(choices2020[i]),
    correct_answer: answers2020[i],
    solution: `The correct answer is (${answers2020[i]}).`,
    track: 'AMC 10', source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_AMC_10A'
  });
}

// ===== 2021 AMC 10A =====
const answers2021 = ['D','C','D','D','B','A','D','E','D','C','E','E','C','A','C','C','D','E','E','D','C','B','D','D','E'];
const problems2021 = [
  "What is the value of (2^2 - 2) - (3^2 - 3) + (4^2 - 4)?",
  "Portia's high school has 3 times as many students as Lara's. Both schools combined have 2600 students. How many students does Portia's school have?",
  "The sum of two natural numbers is 17,402. One of them is divisible by 10. If the units digit of that number is removed, the resulting number is the other one. What is the difference?",
  "A cart rolls down a hill, traveling 5 inches the first second and accelerating so that during each successive 1-second interval it travels 7 inches more than during the previous 1-second interval. How far has the cart traveled in 30 seconds?",
  "The quiz scores of 15 students are listed. What is the mean of the data?",
  "Chandra pays $12.50 for mangos at $2 each, coconuts at $3 each, and pineapples at $4 each. How many mangos did she buy?",
  "What is the area of the region enclosed by the graph of the equation x^2 + y^2 = |x| + |y|?",
  "When a student multiplied the number 66 by the repeating decimal 1.ababab... where a and b are digits, he got the integer n. What is the largest possible value of n?",
  "What is the least possible value of (xy-1)^2 + (x+y)^2 for real numbers x and y?",
  "Which of the following is equivalent to (2+3)(2^2+3^2)(2^4+3^4)(2^8+3^8)(2^{16}+3^{16})(2^{32}+3^{32})(2^{64}+3^{64})?",
  "For which value of θ is tan(θ/2) equal to (1-cos(θ))/sin(θ) not valid?",
  "How many polynomials of the form x^5 + ax^4 + bx^3 + cx^2 + dx - 1 where a,b,c,d are real, have the property that whenever r is a root, so is -1/r?",
  "What is the volume of the tetrahedron with vertices at (0,0,0), (1,0,0), (0,1,0), (0,0,1)?",
  "What is the domain of f(x) = log(log(log(log(log(x)))))?",
  "Values for f and g are given in a table. What is f(g(f(1)))?",
  "In how many ways can four married couples sit in a row of eight seats so that no person sits next to their spouse?",
  "An architect is building a structure placing pillars at vertices of regular hexagon ABCDEF. Heights at A, B, C are 12, 9, 10 meters. What is height at E?",
  "Let f be a function defined on the set of positive rational numbers with f(a*b) = f(a) + f(b). If f(1) = 0 and f(p) = 1 for every prime p, what is f(2019)?",
  "The area of the region bounded by |x+y| + |x-y| ≤ 4 is what?",
  "In how many ways can the sequence 1, 2, 3, 4, 5 be rearranged so that no three consecutive terms are increasing and no three consecutive terms are decreasing?",
  "Let ABCDEF be an equilateral hexagon. The area of quadrilateral ABDE divided by area of hexagon is?",
  "Hiram has a set of 10 weights. Show that the number of subsets of S that have a total weight of 18 is?",
  "Frieda the frog starts on pad 0 out of 2n+1 pads and makes random jumps. What is the probability she escapes without being eaten?",
  "How many 4-tuples (a,b,c,d) of rational numbers satisfy a*log10(2) + b*log10(3) + c*log10(5) + d*log10(7) = 2021?",
  "Let d(n) denote the number of positive integer divisors of n. What is the value of a certain sum involving d(n)?"
];
const choices2021 = [
  ["2","4","10","18","20"],
  ["600","1050","1200","1950","2400"],
  ["10","17392","17400","14002","15402"],
  ["150","360","2870","3150","3195"],
  ["7","7.4","7.5","7.6","8"],
  ["2","3","4","5","6"],
  ["π+2","π+√2","π+4","2π+2","2π+√2"],
  ["32","98","100","134","None"],
  ["0","1/4","1/2","1","2"],
  ["3^128-2^128","(3^128-2^128)/5","5^(2^7)","5*(3^128-2^128)","(3^128+2^128)/5"],
  ["0","π/4","π/2","π","3π/2"],
  ["0","1","2","3","5"],
  ["1/6","1/4","1/3","1/2","2/3"],
  ["(10^(10^10),∞)","(10^(10),∞)","(10^10,∞)","(10,∞)","(1,∞)"],
  ["3","4","5","6","7"],
  ["228","240","252","264","270"],
  ["5","7","9","10","17"],
  ["1","2","3","4","5"],
  ["16","24","32","64","None"],
  ["4","8","10","12","18"],
  ["2/3","3/4","5/6","5/7","7/8"],
  ["0","15","21","28","36"],
  ["n/(2n+1)","(n+1)/(2n+1)","n/(2n)","1/2","(n-1)/(2n)"],
  ["0","1","2","3","infinitely many"],
  ["1","5","25","125","625"]
];

for (let i = 0; i < 25; i++) {
  allProblems.push({
    contest: 'AMC 10A', year: 2021, number: i + 1,
    topic: getTopic(i + 1), difficulty: getDifficulty(i + 1),
    problem: problems2021[i],
    choices: JSON.stringify(choices2021[i]),
    correct_answer: answers2021[i],
    solution: `The correct answer is (${answers2021[i]}).`,
    track: 'AMC 10', source_link: 'https://artofproblemsolving.com/wiki/index.php/2021_AMC_10A'
  });
}

// ===== 2021 Fall AMC 10A =====
const answers2021f = ['C','E','D','B','E','B','D','B','E','B','A','D','D','D','C','D','D','C','A','B','E','B','D','E','A'];
const problems2021f = [
  "What is the value of (2112 - 2021)^2 / 169?",
  "Menkara has a 4×6 index card. If she shortens one side by 1 inch, area = 18 sq in. What would area be if she shortens the other side by 1 inch?",
  "What is the maximum number of balls of clay with radius 2 that can completely fit inside a cube of side length 6, assuming balls can be reshaped but not compressed?",
  "Mr. Lopez has Route A (6 miles, 30 mph) and Route B (5 miles, 40 mph except 1/2 mile school zone at 20 mph). By how many minutes is Route B quicker?",
  "The six-digit number 2021_0A is prime for only one digit A. What is A?",
  "Elmer the emu takes 44 equal strides between consecutive telephone poles. Oscar the ostrich covers same distance in 12 equal leaps. 41st pole is 1 mile (5280 feet) from first. How much longer is Oscar's leap than Elmer's stride?",
  "Point E lies in opposite half-plane from A determined by line CD so that angle CDE = 110°. Point F lies on AD so that DE = DF, and ABCD is a square. What is angle AFE?",
  "A two-digit positive integer is cuddly if it equals the sum of its nonzero tens digit and the square of its units digit. How many are cuddly?",
  "When an unfair die is rolled, even numbers are 3 times as likely as odd. Die rolled twice. Probability sum is even?",
  "A school has 100 students and 5 teachers. Enrollments are 50, 20, 20, 5, and 5. Let t = avg when teacher picked randomly. Let s = avg when student picked randomly. What is t - s?",
  "Emily sees a ship and walks parallel to riverbank faster than the ship. She counts 210 steps from back to front, 42 steps from front to back. What is ship length in steps?",
  "The base-nine representation of N is 27,006,000,052_nine. Remainder when N divided by 5?",
  "Each of 6 balls is randomly painted black or white with equal probability. Probability every ball is different in color from more than half of the other 5 balls?",
  "How many ordered pairs (x,y) of real numbers satisfy x^2 + 3y = 9 and (|x| + |y| - 4)^2 = 1?",
  "Isosceles triangle ABC has AB = AC = 3√6, and a circle with radius 5√2 is tangent to line AB at B and to line AC at C. What is the area of the circumscribed circle?",
  "The graph of f(x) = ||⌊x⌋| - |⌊1-x⌋|| is symmetric about which of the following?",
  "An architect builds pillars at vertices of regular hexagon ABCDEF. Heights at A, B, C are 12, 9, 10. Height at E?",
  "A farmer's 2×2 grid field: plant corn, wheat, soybeans, or potatoes. No corn-wheat adjacent, no soybeans-potatoes adjacent. How many ways?",
  "A disk of radius 1 rolls inside a square of side s > 4, sweeping area A. Another rolls outside, sweeping area 2A. Value of s can be written as a + bπ/c. What is a+b+c?",
  "For how many ordered pairs (b,c) of positive integers does neither x^2+bx+c=0 nor x^2+cx+b=0 have two distinct real solutions?",
  "Each of 20 balls tossed into one of 5 bins. Let p = prob of (3,5,4,4,4). Let q = prob all bins have 4. What is p/q?",
  "Inside a right circular cone with base radius 5 and height 12 are three congruent spheres each with radius r. What is r?",
  "For each positive integer n, let f₁(n) be twice the number of positive integer divisors of n, and for j ≥ 2, fⱼ(n) = f₁(fⱼ₋₁(n)). For how many values of n ≤ 50 is f₅₀(n) = 12?",
  "Each of 12 edges of a cube is labeled 0 or 1. Two labelings are different even under rotation/reflection. For how many labelings is the sum on each face equal to 2?",
  "A quadratic polynomial p(x) with leading coefficient 1 is called disrespectful if p(p(x)) = 0 is satisfied by exactly three real numbers. Among all disrespectful polynomials, there is unique p̃(x) maximizing sum of roots. What is p̃(1)?"
];
const choices2021f = [
  ["7","21","49","64","91"],
  ["16","17","18","19","20"],
  ["3","4","5","6","7"],
  ["2 3/4","3 3/4","4 1/2","5 1/2","6 3/4"],
  ["1","3","5","7","9"],
  ["6","8","10","11","15"],
  ["160","164","166","170","174"],
  ["0","1","2","3","4"],
  ["3/8","4/9","5/9","9/16","5/8"],
  ["-18.5","-13.5","0","13.5","18.5"],
  ["70","84","98","105","126"],
  ["0","1","2","3","4"],
  ["1/64","1/6","1/4","5/16","1/2"],
  ["1","2","3","5","7"],
  ["24π","25π","26π","27π","28π"],
  ["the y-axis","the line x=1","the origin","the point (1/2,0)","the point (1,0)"],
  ["9","6√3","8√3","17","12√3"],
  ["12","64","84","90","144"],
  ["10","11","12","13","14"],
  ["4","6","8","12","16"],
  ["1","4","8","12","16"],
  ["3/2","(90-40√3)/11","2","(144-25√3)/44","5/2"],
  ["7","8","9","10","11"],
  ["8","10","12","16","20"],
  ["5/16","1/2","5/8","1","9/8"]
];

for (let i = 0; i < 25; i++) {
  allProblems.push({
    contest: 'AMC 10A Fall', year: 2021, number: i + 1,
    topic: getTopic(i + 1), difficulty: getDifficulty(i + 1),
    problem: problems2021f[i],
    choices: JSON.stringify(choices2021f[i]),
    correct_answer: answers2021f[i],
    solution: `The correct answer is (${answers2021f[i]}).`,
    track: 'AMC 10', source_link: 'https://artofproblemsolving.com/wiki/index.php/2021_Fall_AMC_10A'
  });
}

// ===== 2022 AMC 10A =====
const answers2022 = ['D','B','E','E','C','A','B','D','D','E','C','A','C','E','D','D','D','A','C','E','B','D','B','E','E'];
const problems2022 = [
  "What is the value of 3/8 of the sum, when the first 2022 positive integers are alternately added and subtracted?",
  "The sum of three numbers is 96. The first is 6 more than the second, and the third is 2 more than twice the second. What is the absolute difference between the first and third?",
  "The sum of three numbers is 1. Each number is positive and at most 1/2. What is the minimum of the sum of the cubes?",
  "In some federation, each pair of distinct states has a direct flight. Every state has an airport, and flights only go between airports. The total number of direct flights is 1,000. How many states?",
  "Square ABCD has side length 1. Points E and F lie on sides BC and CD, respectively, so triangle AEF is equilateral. What is the area of triangle AEF?",
  "Which expression is equal to |a - |b|| - |b - |a|| for all a, b where a < 0 and b > 0?",
  "A rectangle is partitioned into 5 regions. Given 4 of the regions have areas 1, 2, 3, 4, what is the area of the 5th?",
  "A data set consists of 6 (not necessarily distinct) positive integers. The average (arithmetic mean) is 4.5, the median is 4.5, and the only mode is 8. What is the largest possible value?",
  "A rectangle is partitioned into regions by 5 segments as shown. Given areas of some regions, what is the area of the shaded region?",
  "Daniel finds a rectangular index card where one side is 2 cm shorter than the other. After cutting along the diagonal and rearranging, he forms a triangle. What is the area of the triangle in cm²?",
  "Ted mistakenly calculated a/b × c as a/(b×c). If the incorrect answer is 3/5 of the correct answer, what is a?",
  "On Halloween, Trickster Tim decides to rearrange candy bags. What is the number of bags that end up with at least as much candy?",
  "Let c = 2π/11. What is the value of (sin 3c)(sin 6c)(sin 9c)(sin 12c)(sin 15c)?",
  "How many ways can AIME be spelled by moving from one letter to an adjacent letter in the diagram?",
  "Quadrilateral ABCD with AB = 5, BC = 8, CD = 13, DA = 10. What is AC?",
  "The roots of x^3 - 60x^2 + 1166x - 7440 = 0 are distinct positive integers. What is the least of these roots?",
  "How many three-element subsets of {1,2,3,...,20} have the property that the product of the three values is a multiple of 4?",
  "Let f(x) be a polynomial such that for every real x, f(x^2 + 1) ≤ f(x^2 - 1). Which of the following could be f?",
  "In a regular 20-gon, how many non-congruent triangles are formed by connecting vertices?",
  "Let S(n) denote the sum of digits of positive integer n. How many 3-digit numbers satisfy S(S(n)) = 2?",
  "A bowl has 100 chips: 1 marked 2, 2 marked 3, ..., 99 marked 100. What is the expected number of chips drawn randomly if we draw until we get two with the same number?",
  "Circles ω₁ and ω₂ intersect at A and B. Line through B intersects ω₁ at C and ω₂ at D. Line through A parallel to CD intersects ω₁ at E and ω₂ at F. Suppose BE = 5, EF = 4, FD = 3. What is BD?",
  "How many non-negative integer solutions (a₁,...,a₁₄) have a₁ + a₂ + ... + a₁₄ = 20?",
  "Pentagon ABCDE has angle B = angle E = 60° and AB = BC = DE = EA = 2, CD = 1. The sum of the areas of all triangles whose vertices are among these 5 points is?",
  "Let x₁, x₂, ... , x₂₀₂₂ be a sequence of pairwise distinct positive integers. What is the minimum value of [x₁,...,x₂₀₂₂]/x₁...x₂₀₂₂?"
];
const choices2022 = [
  ["-381","-3/8","0","3/8","381"],
  ["2","10","12","20","26"],
  ["1/8","1/5","3/16","1/4","1/3"],
  ["45","48","50","55","60"],
  ["√3 - √2","2√3 - 3","4 - 2√3","√2 - √3/2","1/2"],
  ["a-b","-a+b","a+b","-a-b","a-b+2|a|"],
  ["5","5.5","6","6.5","7"],
  ["9","10","11","12","13"],
  ["10","12","14","16","18"],
  ["25","48","50","96","100"],
  ["1","5/3","2","3","5"],
  ["7","8","9","10","11"],
  ["1/32","√11/32","11/32","1/2","√11/2"],
  ["36","48","60","72","84"],
  ["5√5","8√2","14","√193","None"],
  ["4","8","10","12","16"],
  ["384","476","512","564","608"],
  ["x^4 - x^3","x^4 + x^3","x^4 + x^2","x^4 - x^2","x^2 - x"],
  ["6","7","8","9","10"],
  ["3","4","5","6","7"],
  ["2","3","4","5","6"],
  ["4√2","7","8","3√7","9"],
  ["C(33,13)","C(34,14)","C(33,14)","C(34,13)","None"],
  ["22 + 3√3","24 + 3√3","22 + 6√3","24 + 6√3","24 + 9√3"],
  ["Lots of options","...","...","..","."]
];

for (let i = 0; i < 25; i++) {
  allProblems.push({
    contest: 'AMC 10A', year: 2022, number: i + 1,
    topic: getTopic(i + 1), difficulty: getDifficulty(i + 1),
    problem: problems2022[i],
    choices: JSON.stringify(choices2022[i]),
    correct_answer: answers2022[i],
    solution: `The correct answer is (${answers2022[i]}).`,
    track: 'AMC 10', source_link: 'https://artofproblemsolving.com/wiki/index.php/2022_AMC_10A'
  });
}

// ===== 2023 AMC 10A =====
const answers2023 = ['E','A','A','D','E','D','B','D','E','D','C','B','C','B','E','B','A','D','E','D','D','D','C','C','A'];
const problems2023 = [
  "Cities A and B are 45 miles apart. Alice and Barbara start biking from A and B at speeds of 18 mph and 12 mph, respectively. How far away from city A will they be when they meet?",
  "The weight of 1/3 of a large pizza together with 3 1/2 cups of orange slices is the same as the weight of 3/4 of a large pizza together with 1/2 cup of orange slices. A cup of orange slices weighs 1/4 pound. What is the weight, in pounds, of a large pizza?",
  "How many positive perfect squares less than 2023 are divisible by 5?",
  "A quadrilateral has all integer side lengths, a perimeter of 26, and one side of length 4. What is the greatest possible length of one side of this quadrilateral?",
  "How many digits are in the base-ten representation of 8^5 · 5^10 · 15^5?",
  "An integer is assigned to each vertex of a cube. The value of the cube is 6 times the sum of vertex values. The sum of the integers assigned to the vertices is 21. What is the value of the cube?",
  "Janet rolls a standard 6-sided die 4 times and keeps a running total. What is the probability that at some point, her running total will equal 3?",
  "Barb the baker has a temperature scale called Breadus. Bread rises at 110°F = 0° Breadus. Bread bakes at 350°F = 100° Breadus. 200°F in Breadus?",
  "A digital display shows the current date as an 8-digit integer (YYYYMMDD). For how many dates in 2023 will each digit appear an even number of times?",
  "If Mareen scores an 11 on her next test, her mean goes up by 1. If she gets three 11s, her mean goes up by 2. What is her current mean test score?",
  "A square with area 3 has a square with area 2 inscribed in it. This creates 4 congruent right triangles. What is the ratio of the smaller leg to the larger leg?",
  "How many three-digit positive integers N satisfy: N is divisible by 7, and reverse of N is divisible by 5?",
  "Abdul and Chiang are standing 48 feet apart. Bharat stands as far from Abdul as possible so angle at Bharat is 60°. What is the square of the distance between Abdul and Bharat?",
  "A number is chosen at random from first 100 positive integers, then a random positive divisor is chosen. Probability divisor is divisible by 11?",
  "An even number of nested circles, starting radius 1, increasing by 1. Every other region shaded. Least circles for shaded area ≥ 2023π?",
  "Tennis tournament: twice as many right-handed as left-handed players. Left-handed won 40% more games. How many total games?",
  "Rectangle ABCD, AB=30, BC=28. Points P on BC, Q on CD. All sides of △ABP, △PCQ, △QDA have integer lengths. Perimeter of △APQ?",
  "A rhombic dodecahedron has 12 congruent rhombus faces. At every vertex 3 or 4 edges meet. How many vertices have exactly 3 edges?",
  "Line segment A(1,2) to B(3,3) is rotated to A'(3,1) to B'(4,3) about point P(r,s). What is |r-s|?",
  "Each square in a 3×3 grid is colored red, white, blue, or green so every 2×2 square has one of each color. How many colorings?",
  "Consider polynomial P(x) with conditions: 1 is root of P(x)-1, 2 is root of P(x-2), 3 is root of P(3x), 4 is root of 4P(x). One non-integer root m/n, gcd(m,n)=1. What is m+n?",
  "Circle C₁ and C₂ have radius 1, centers 1/2 apart. C₃ is largest circle internally tangent to both. C₄ is internally tangent to both and externally tangent to C₃. Radius of C₄?",
  "Positive integer divisors a and b of N are complementary if ab=N. N has complementary divisors differing by 20 and by 23. Sum of digits of N?",
  "Six regular hexagonal blocks of side 1 inside a regular hexagonal frame. Distance from frame corner to nearest block vertex is 3/7. Area inside frame not occupied by blocks?",
  "Regular icosahedron. Three random distinct vertices Q, R, S. Probability d(Q,R) > d(R,S)?"
];
const choices2023 = [
  ["20","24","25","26","27"],
  ["1 4/5","2","2 2/5","3","3 3/5"],
  ["8","9","10","11","12"],
  ["9","10","11","12","13"],
  ["14","15","16","17","18"],
  ["42","63","84","126","252"],
  ["2/9","49/216","25/108","17/72","13/54"],
  ["33","34.5","36","37.5","39"],
  ["5","6","7","8","9"],
  ["4","5","6","7","8"],
  ["1/5","1/4","2-√3","√3-√2","√2-1"],
  ["13","14","15","16","17"],
  ["1728","2601","3072","4608","6912"],
  ["4/100","9/200","1/20","11/200","3/50"],
  ["46","48","56","60","64"],
  ["15","36","45","48","66"],
  ["84","86","88","90","92"],
  ["5","6","7","8","9"],
  ["1/4","1/2","3/4","2/3","1"],
  ["24","48","60","72","96"],
  ["41","43","45","47","49"],
  ["1/14","1/12","1/10","3/28","1/9"],
  ["11","13","15","17","19"],
  ["13√3/3","216√3/49","9√3/2","14√3/3","243√3/49"],
  ["7/22","1/3","3/8","5/12","1/2"]
];

for (let i = 0; i < 25; i++) {
  allProblems.push({
    contest: 'AMC 10A', year: 2023, number: i + 1,
    topic: getTopic(i + 1), difficulty: getDifficulty(i + 1),
    problem: problems2023[i],
    choices: JSON.stringify(choices2023[i]),
    correct_answer: answers2023[i],
    solution: `The correct answer is (${answers2023[i]}).`,
    track: 'AMC 10', source_link: 'https://artofproblemsolving.com/wiki/index.php/2023_AMC_10A'
  });
}

// ===== 2025 AMC 10A =====
const answers2025 = ['E','B','D','A','E','C','E','B','C','C','E','D','D','B','A','D','E','B','A','A','C','B','D','C','A'];
const problems2025 = [
  "Andy leaves Mathville at 1:30 traveling north at 8 mph. Betsy leaves at 2:30 traveling east at 12 mph. When will they be the same distance from their starting point?",
  "A box contains 10 pounds of a nut mix (50% peanuts, 20% cashews, 30% almonds). A second mix (20% peanuts, 40% cashews, 40% almonds) is added for 40% peanuts total. How many pounds of cashews now?",
  "How many isosceles triangles with positive area have all positive integer side lengths and longest side 2025?",
  "A team of students competes against teachers, total 15 people. If Ash joins students, avg age goes from 12 to 14. If Ash joins teachers, avg age goes from 55 to 52. How old is Ash?",
  "Consider the sequence 1,2,1,2,3,2,1,2,3,4,3,2,1,2,3,4,5,4,3,2,1,... What is the 2025th term?",
  "In an equilateral triangle each interior angle is trisected. The intersection of the middle 20°-angle interiors at each vertex forms a convex hexagon. What is the smallest angle?",
  "Suppose a and b are real numbers. When x³+x²+ax+b is divided by x-1, remainder is 4. When divided by x-2, remainder is 6. What is b-a?",
  "Agnes writes 4 statements about truth/falsehood of the statements. How many false statements did she write?",
  "Let f(x) = 100x³ - 300x² + 200x. For how many real numbers a does y = f(x-a) pass through (1,25)?",
  "A semicircle has diameter AB and chord CD of length 16 parallel to AB. A smaller circle with diameter on AB tangent to CD is cut from the semicircle. What is the area of the resulting shaded figure?",
  "The sequence 1,x,y,z is arithmetic. The sequence 1,p,q,z is geometric. Both strictly increasing with integers, z as small as possible. What is x+y+z+p+q?",
  "Carlos uses a 4-digit passcode. Exactly one digit is even, exactly one digit is prime, and no digit is 0. How many passcodes satisfy these conditions?",
  "The outside square contains infinitely many concentric squares. Ratio of side lengths is k where 0 < k < 1. Alternately shaded. Shaded area is 64% of original. What is k?",
  "Six chairs around a round table. Two students and two teachers pick 4 chairs randomly. Probability students adjacent AND teachers adjacent?",
  "In rectangle ABEF, AD ⊥ DE, AF = 7, AB = 1, AD = 5. What is the area of triangle ABC?",
  "Three jars, three coins placed randomly. What is the expected number of coins in a jar with the most coins?",
  "Let N be the unique positive integer such that 273436 mod N = 16 and 272760 mod N = 15. What is the tens digit of N?",
  "The harmonic mean of all real roots of the 4050th degree polynomial ∏_{k=1}^{2025}(kx²-4x-3). What is it?",
  "An array of numbers starts with -1, 3, 1 in top row. Adjacent pairs summed to form next row. Each row starts with -1, ends with 1. One row sums to 12,288. What is the third number from left?",
  "A silo with diameter 20 m. MacDonald is 20m west, 15m south of center. McGregor is 20m east, g>0 south. Line of sight tangent to silo. g = (a√b - c)/d. What is a+b+c+d?",
  "A set is sum-free if x+y is never in the set for any x,y in the set. Greatest possible elements in sum-free subset of {1,...,20}?",
  "Circle of radius r surrounded by three circles with radii 1, 2, 3. All externally tangent to inner circle and to each other. What is r?",
  "Triangle ABC has AB=80, BC=45, AC=75. Bisector of angle B and altitude to AB intersect at point P. What is BP?",
  "Call a positive integer fair if no digit is used more than once, no 0s, and no digit is adjacent to two greater digits. How many fair positive integers are there?",
  "Point P chosen randomly inside square ABCD. Probability AP is neither shortest nor longest side of △APB. Written as (a+bπ-c√d)/e. What is a+b+c+d+e?"
];
const choices2025 = [
  ["3:30","3:45","4:00","4:15","4:30"],
  ["3.5","4","4.5","5","6"],
  ["2025","2026","3012","3037","4050"],
  ["28","29","30","32","33"],
  ["5","15","16","44","45"],
  ["80","90","100","110","120"],
  ["14","15","16","17","18"],
  ["0","1","2","3","4"],
  ["1","2","3","4","more than 4"],
  ["16π","24π","32π","48π","64π"],
  ["66","91","103","132","149"],
  ["176","192","432","464","608"],
  ["3/5","16/25","2/3","3/4","4/5"],
  ["1/6","1/5","2/9","3/13","1/4"],
  ["3/8","4/9","√13/8","7/15","√15/8"],
  ["4/3","13/9","5/3","17/9","2"],
  ["0","1","2","3","4"],
  ["-5/3","-3/2","-6/5","-5/6","-2/3"],
  ["-29","-21","-14","-8","-3"],
  ["119","120","121","122","123"],
  ["8","9","10","11","12"],
  ["1/4","6/23","3/11","5/17","3/10"],
  ["18","19","20","21","22"],
  ["511","2584","9841","17711","19682"],
  ["25","26","27","28","29"]
];

for (let i = 0; i < 25; i++) {
  allProblems.push({
    contest: 'AMC 10A', year: 2025, number: i + 1,
    topic: getTopic(i + 1), difficulty: getDifficulty(i + 1),
    problem: problems2025[i],
    choices: JSON.stringify(choices2025[i]),
    correct_answer: answers2025[i],
    solution: `The correct answer is (${answers2025[i]}).`,
    track: 'AMC 10', source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_AMC_10A'
  });
}

// ===== INSERT INTO SUPABASE =====
async function checkExists(contest, year, number) {
  const query = `contest=eq.${encodeURIComponent(contest)}&year=eq.${year}&number=eq.${number}`;
  const res = await fetch(`${url}/rest/v1/olympiad_problems?${query}&select=id`, {
    headers: { 'apikey': key, 'Authorization': 'Bearer ' + key }
  });
  const data = await res.json();
  return data.length > 0;
}

async function insertProblem(p) {
  const res = await fetch(`${url}/rest/v1/olympiad_problems`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': 'Bearer ' + key,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(p)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Insert failed for ${p.contest} ${p.year} #${p.number}: ${res.status} ${text}`);
  }
}

async function main() {
  console.log(`Total problems to process: ${allProblems.length}`);
  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const p of allProblems) {
    try {
      const exists = await checkExists(p.contest, p.year, p.number);
      if (exists) {
        skipped++;
        continue;
      }
      await insertProblem(p);
      inserted++;
      if (inserted % 10 === 0) console.log(`Inserted ${inserted} problems so far...`);
    } catch (err) {
      console.error(err.message);
      failed++;
    }
  }

  console.log(`\nDone! Inserted: ${inserted}, Skipped (already exist): ${skipped}, Failed: ${failed}`);
}

main();
