// insert_amc10a_all.js
// Deletes all existing AMC 10A and "AMC 10A Fall" problems, then inserts all 150

const SUPABASE_URL = 'https://rrjhdokniecigtekmpjz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qk42EmpxYFxXsAGkjLAzJA_kGznRof4';

function diff(num) {
  if (num <= 8) return 'easy';
  if (num <= 18) return 'medium';
  return 'hard';
}

function sourceLink(year, num, contestName) {
  if (contestName === 'AMC 10A Fall') {
    return `https://artofproblemsolving.com/wiki/index.php/2021_Fall_AMC_10A_Problems/Problem_${num}`;
  }
  return `https://artofproblemsolving.com/wiki/index.php/${year}_AMC_10A_Problems/Problem_${num}`;
}

const problems = [

// ===================== 2020 AMC 10A =====================
{
  contest: 'AMC 10A', year: 2020, number: 1,
  topic: 'algebra',
  problem: 'What value of x satisfies x - 3/4 = 5/12 - 1/3?',
  choices: ['-2/3', '7/36', '7/12', '2/3', '5/6'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2020, number: 2,
  topic: 'statistics',
  problem: 'The numbers 3, 5, 7, a, and b have an average (arithmetic mean) of 15. What is the average of a and b?',
  choices: ['0', '15', '30', '45', '60'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2020, number: 3,
  topic: 'algebra',
  problem: 'Assuming a ≠ 3, b ≠ 4, and c ≠ 5, what is the value in simplest form of the following expression? ((a-3)/(5-c)) * ((b-4)/(3-a)) * ((c-5)/(4-b))',
  choices: ['-1', '1', 'abc/60', '1/abc - 1/60', '1/60 - 1/abc'],
  correct_answer: 'A',
},
{
  contest: 'AMC 10A', year: 2020, number: 4,
  topic: 'algebra',
  problem: 'A driver travels for 2 hours at 60 miles per hour, during which her car gets 30 miles per gallon of gasoline. She is paid $0.50 per mile, and her only expense is gasoline at $2.00 per gallon. What is her net rate of pay, in dollars per hour, after this expense?',
  choices: ['20', '22', '24', '25', '26'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2020, number: 5,
  topic: 'algebra',
  problem: 'What is the sum of all real numbers x for which |x^2 - 12x + 34| = 2?',
  choices: ['12', '15', '18', '21', '25'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2020, number: 6,
  topic: 'number theory',
  problem: 'How many 4-digit positive integers (that is, integers between 1000 and 9999, inclusive) having only even digits are divisible by 5?',
  choices: ['80', '100', '125', '200', '500'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A', year: 2020, number: 7,
  topic: 'algebra',
  problem: 'The 25 integers from -10 to 14 inclusive, can be arranged to form a 5-by-5 square in which the sum of the numbers in each row, the sum of the numbers in each column, and the sum of the numbers along each of the main diagonals are all the same. What is the value of this common sum?',
  choices: ['2', '5', '10', '25', '50'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2020, number: 8,
  topic: 'algebra',
  problem: 'What is the value of 1 + 2 + 3 - 4 + 5 + 6 + 7 - 8 + ... + 197 + 198 + 199 - 200?',
  choices: ['9800', '9900', '10000', '10100', '10200'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A', year: 2020, number: 9,
  topic: 'number theory',
  problem: 'A single bench section at a school event can hold either 7 adults or 11 children. When N bench sections are connected end to end, an equal number of adults and children seated together will occupy all the bench space. What is the least possible positive integer value of N?',
  choices: ['9', '18', '27', '36', '77'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A', year: 2020, number: 10,
  topic: 'geometry',
  problem: 'Seven cubes, whose volumes are 1, 8, 27, 64, 125, 216, and 343 cubic units, are stacked vertically to form a tower in which the volumes of the cubes decrease from bottom to top. Except for the bottom cube, the bottom face of each cube lies completely on top of the cube below it. What is the total surface area of the tower (including the bottom) in square units?',
  choices: ['644', '658', '664', '720', '749'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A', year: 2020, number: 11,
  topic: 'statistics',
  problem: 'What is the median of the following list of 4040 numbers? 1, 2, 3, ..., 2020, 1^2, 2^2, 3^2, ..., 2020^2',
  choices: ['1974.5', '1975.5', '1976.5', '1977.5', '1978.5'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2020, number: 12,
  topic: 'geometry',
  problem: 'Triangle AMC is isosceles with AM = AC. Medians MV and CU are perpendicular to each other, and MV = CU = 12. What is the area of triangle AMC?',
  choices: ['48', '72', '96', '144', '192'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2020, number: 13,
  topic: 'probability',
  problem: 'A frog sitting at the point (1, 2) begins a sequence of jumps, where each jump is parallel to one of the coordinate axes and has length 1, and the direction of each jump (up, down, right, or left) is chosen independently at random. The sequence ends when the frog reaches a side of the square with vertices (0, 0), (0, 4), (4, 4), and (4, 0). What is the probability that the sequence of jumps ends on a vertical side of the square?',
  choices: ['1/2', '5/8', '2/3', '3/4', '7/8'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A', year: 2020, number: 14,
  topic: 'algebra',
  problem: 'Real numbers x and y satisfy x + y = 4 and x * y = -2. What is the value of x + x^3/y^2 + y^3/x^2 + y?',
  choices: ['360', '400', '420', '440', '480'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2020, number: 15,
  topic: 'number theory',
  problem: 'A positive integer divisor of 12! is chosen at random. The probability that the divisor chosen is a perfect square can be expressed as m/n, where m and n are relatively prime positive integers. What is m + n?',
  choices: ['3', '5', '12', '18', '23'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2020, number: 16,
  topic: 'geometry',
  problem: 'A point is chosen at random within the square in the coordinate plane whose vertices are (0, 0), (2020, 0), (2020, 2020), and (0, 2020). The probability that the point is within d units of a lattice point is 1/2. (A point (x, y) is a lattice point if x and y are both integers.) What is d to the nearest tenth?',
  choices: ['0.3', '0.4', '0.5', '0.6', '0.7'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A', year: 2020, number: 17,
  topic: 'algebra',
  problem: 'Define P(x) = (x - 1^2)(x - 2^2) * ... * (x - 100^2). How many integers n are there such that P(n) <= 0?',
  choices: ['4900', '4950', '5000', '5050', '5100'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2020, number: 18,
  topic: 'combinatorics',
  problem: 'Let (a, b, c, d) be an ordered quadruple of not necessarily distinct integers, each one of them in the set {0, 1, 2, 3}. For how many such quadruples is it true that a*d - b*c is odd? (For example, (0, 3, 1, 1) is one such quadruple, because 0*1 - 3*1 = -3 is odd.)',
  choices: ['48', '64', '96', '128', '192'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2020, number: 19,
  topic: 'combinatorics',
  problem: 'As shown in the figure below a regular dodecahedron (the polyhedron consisting of 12 congruent regular pentagonal faces) floats in space with two horizontal faces. Note that there is a ring of five slanted faces adjacent to the top face, and a ring of five slanted faces adjacent to the bottom face. How many ways are there to move from the top face to the bottom face via a sequence of adjacent faces so that each face is visited at most once and moves are not permitted from the bottom ring to the top ring?',
  choices: ['125', '250', '405', '640', '810'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2020, number: 20,
  topic: 'geometry',
  problem: 'Quadrilateral ABCD satisfies angle ABC = angle ACD = 90°, AC = 20, and CD = 30. Diagonals AC and BD intersect at point E, and AE = 5. What is the area of quadrilateral ABCD?',
  choices: ['330', '340', '350', '360', '370'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2020, number: 21,
  topic: 'number theory',
  problem: 'There exists a unique strictly increasing sequence of nonnegative integers a_1 < a_2 < ... < a_k such that (2^289 + 1)/(2^17 + 1) = 2^a_1 + 2^a_2 + ... + 2^a_k. What is k?',
  choices: ['117', '136', '137', '273', '306'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2020, number: 22,
  topic: 'number theory',
  problem: 'For how many positive integers n <= 1000 is floor(998/n) + floor(999/n) + floor(1000/n) not divisible by 3? (Recall that floor(x) is the greatest integer less than or equal to x.)',
  choices: ['22', '23', '24', '25', '26'],
  correct_answer: 'A',
},
{
  contest: 'AMC 10A', year: 2020, number: 23,
  topic: 'geometry',
  problem: 'Let T be the triangle in the coordinate plane with vertices (0, 0), (4, 0), and (0, 3). Consider the following five isometries (rigid transformations) of the plane: rotations of 90°, 180°, and 270° counterclockwise around the origin, reflection across the x-axis, and reflection across the y-axis. How many of the 125 sequences of three of these transformations (not necessarily distinct) will return T to its original position? (For example, a 180° rotation, followed by a reflection across the x-axis, followed by a reflection across the y-axis will return T to its original position, but a 90° rotation, followed by a reflection across the x-axis, followed by another reflection across the x-axis will not return T to its original position.)',
  choices: ['12', '15', '17', '20', '25'],
  correct_answer: 'A',
},
{
  contest: 'AMC 10A', year: 2020, number: 24,
  topic: 'number theory',
  problem: 'Let n be the least positive integer greater than 1000 for which gcd(63, n + 120) = 21 and gcd(n + 63, 120) = 60. What is the sum of the digits of n?',
  choices: ['12', '15', '18', '21', '24'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2020, number: 25,
  topic: 'probability',
  problem: 'Jason rolls three fair standard six-sided dice. Then he looks at the rolls and chooses a subset of the dice (possibly empty, possibly all three dice) to reroll. After rerolling, he wins if and only if the sum of the numbers face up on the three dice is exactly 7. Jason always plays to optimize his chances of winning. What is the probability that he chooses to reroll exactly two of the dice?',
  choices: ['7/36', '5/24', '2/9', '17/72', '1/4'],
  correct_answer: 'A',
},

// ===================== 2021 AMC 10A =====================
{
  contest: 'AMC 10A', year: 2021, number: 1,
  topic: 'algebra',
  problem: 'What is the value of (2^2 - 2) - (3^2 - 3) + (4^2 - 4)?',
  choices: ['1', '2', '5', '8', '12'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2021, number: 2,
  topic: 'algebra',
  problem: "Portia's high school has 3 times as many students as Lara's high school. The two high schools have a total of 2600 students. How many students does Portia's high school have?",
  choices: ['600', '650', '1950', '2000', '2050'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2021, number: 3,
  topic: 'number theory',
  problem: 'The sum of two natural numbers is 17,402. One of the two numbers is divisible by 10. If the units digit of that number is erased, the other number is obtained. What is the difference of these two numbers?',
  choices: ['10272', '11700', '13362', '14238', '15426'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2021, number: 4,
  topic: 'algebra',
  problem: 'A cart rolls down a hill, traveling 5 inches the first second and accelerating so that during each successive 1-second time interval, it travels 7 inches more than during the previous 1-second interval. The cart takes 30 seconds to reach the bottom of the hill. How far, in inches, does it travel?',
  choices: ['215', '360', '2992', '3195', '3242'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2021, number: 5,
  topic: 'statistics',
  problem: 'The quiz scores of a class with k > 12 students have a mean of 8. The mean of a collection of 12 of these quiz scores is 14. What is the mean of the remaining quiz scores in terms of k?',
  choices: ['(14 - 8)/(k - 12)', '(8k - 168)/(k - 12)', '14/12 - 8/k', '14(k - 12)/k^2', '14(k - 12)/(8k)'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A', year: 2021, number: 6,
  topic: 'algebra',
  problem: 'Chantal and Jean start hiking from a trailhead toward a fire tower. Jean is wearing a heavy backpack and walks slower. Chantal starts walking at 4 miles per hour. Halfway to the tower, the trail becomes really steep, and Chantal slows down to 2 miles per hour. After reaching the tower, she immediately turns around and descends the steep part of the trail at 3 miles per hour. She meets Jean at the halfway point. What was Jean\'s average speed, in miles per hour, until they meet?',
  choices: ['12/13', '1', '13/12', '24/13', '2'],
  correct_answer: 'A',
},
{
  contest: 'AMC 10A', year: 2021, number: 7,
  topic: 'logic',
  problem: "Tom has a collection of 13 snakes, 4 of which are purple and 5 of which are happy. He observes that all of his happy snakes can add, none of his purple snakes can subtract, and all of his snakes that can't subtract also can't add. Which of these conclusions can be drawn about Tom's snakes?",
  choices: ['Purple snakes can add.', 'Purple snakes are happy.', 'Snakes that can add are purple.', 'Happy snakes are not purple.', "Happy snakes can't subtract."],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2021, number: 8,
  topic: 'number theory',
  problem: 'When a student multiplied the number 66 by the repeating decimal, 1.abab... = 1.overline{ab}, where a and b are digits, he did not notice the notation and just multiplied 66 times 1.ab. Later he found that his answer is 0.5 less than the correct answer. What is the 2-digit integer ab?',
  choices: ['15', '30', '45', '60', '75'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2021, number: 9,
  topic: 'algebra',
  problem: 'What is the least possible value of (xy - 1)^2 + (x + y)^2 for real numbers x and y?',
  choices: ['0', '1/4', '1/2', '1', '2'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2021, number: 10,
  topic: 'algebra',
  problem: 'Which of the following is equivalent to (2 + 3)(2^2 + 3^2)(2^4 + 3^4)(2^8 + 3^8)(2^16 + 3^16)(2^32 + 3^32)(2^64 + 3^64)?',
  choices: ['3^127 + 2^127', '3^127 + 2^127 + 2*3^63 + 3*2^63', '3^128 - 2^128', '3^128 + 2^128', '5^127'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2021, number: 11,
  topic: 'number theory',
  problem: 'For which of the following integers b is the base-b number 2021_b - 221_b not divisible by 3?',
  choices: ['3', '4', '6', '7', '8'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2021, number: 12,
  topic: 'geometry',
  problem: 'Two right circular cones with vertices facing down as shown in the figure below contain the same amount of liquid. The radii of the tops of the liquid surfaces are 3 cm and 6 cm. Into each cone is dropped a spherical marble of radius 1 cm, which sinks to the bottom and is completely submerged without spilling any liquid. What is the ratio of the rise of the liquid level in the narrow cone to the rise of the liquid level in the wide cone?',
  choices: ['1:1', '47:43', '2:1', '40:13', '4:1'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2021, number: 13,
  topic: 'geometry',
  problem: 'What is the volume of tetrahedron ABCD with edge lengths AB = 2, AC = 3, AD = 4, BC = sqrt(13), BD = 2*sqrt(5), and CD = 5?',
  choices: ['3', '2*sqrt(3)', '4', '3*sqrt(3)', '6'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2021, number: 14,
  topic: 'algebra',
  problem: 'All the roots of polynomial z^6 - 10z^5 + Az^4 + Bz^3 + Cz^2 + Dz + 16 are positive integers, possibly repeated. What is the value of B?',
  choices: ['-88', '-80', '-64', '-41', '-40'],
  correct_answer: 'A',
},
{
  contest: 'AMC 10A', year: 2021, number: 15,
  topic: 'combinatorics',
  problem: 'Values for A, B, C, and D are to be selected from {1, 2, 3, 4, 5, 6} without replacement (i.e., no two letters have the same value). How many ways are there to make such choices so that the two curves y = Ax^2 + B and y = Cx^2 + D intersect? (The order in which the curves are listed does not matter; for example, the choices A = 3, B = 2, C = 4, D = 1 is considered the same as the choices A = 4, B = 1, C = 3, D = 2.)',
  choices: ['30', '60', '90', '180', '360'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2021, number: 16,
  topic: 'statistics',
  problem: 'In the following list of numbers, the integer n appears n times in the list for 1 <= n <= 200. 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, ..., 200, 200, ..., 200. What is the median of the numbers in this list?',
  choices: ['100.5', '134', '142', '150.5', '167'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2021, number: 17,
  topic: 'geometry',
  problem: 'Trapezoid ABCD has AB || CD, BC = CD = 43, and AD perpendicular to BD. Let O be the intersection of the diagonals AC and BD, and let P be the midpoint of BD. Given that OP = 11, the length AD can be written in the form m*sqrt(n), where m and n are positive integers and n is not divisible by the square of any prime. What is m + n?',
  choices: ['65', '132', '157', '194', '215'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2021, number: 18,
  topic: 'algebra',
  problem: 'Let f be a function defined on the set of positive rational numbers with the property that f(a * b) = f(a) + f(b) for all positive rational numbers a and b. Suppose that f also has the property that f(p) = p for every prime number p. For which of the following numbers x is f(x) < 0?',
  choices: ['17/32', '11/16', '7/9', '7/6', '25/11'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2021, number: 19,
  topic: 'geometry',
  problem: 'The area of the region bounded by the graph of x^2 + y^2 = 3|x - y| + 3|x + y| is m + n*pi, where m and n are integers. What is m + n?',
  choices: ['18', '27', '36', '45', '54'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2021, number: 20,
  topic: 'combinatorics',
  problem: 'In how many ways can the sequence 1, 2, 3, 4, 5 be rearranged so that no three consecutive terms are increasing and no three consecutive terms are decreasing?',
  choices: ['10', '18', '24', '32', '44'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2021, number: 21,
  topic: 'geometry',
  problem: 'Let ABCDEF be an equiangular hexagon. The lines AB, CD, and EF determine a triangle with area 192*sqrt(3), and the lines BC, DE, and FA determine a triangle with area 324*sqrt(3). The perimeter of hexagon ABCDEF can be expressed as m + n*sqrt(p), where m, n, and p are positive integers and p is not divisible by the square of any prime. What is m + n + p?',
  choices: ['47', '52', '55', '58', '63'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2021, number: 22,
  topic: 'algebra',
  problem: "Hiram's algebra notes are 50 pages long and are printed on 25 sheets of paper; the first sheet contains pages 1 and 2, the second sheet contains pages 3 and 4, and so on. One day he leaves his notes on the table before leaving for lunch, and his roommate decides to borrow some pages from the middle of the notes. When Hiram comes back, he discovers that his roommate has taken a consecutive set of sheets from the notes and that the average (mean) of the page numbers on all remaining sheets is exactly 19. How many sheets were borrowed?",
  choices: ['10', '13', '15', '17', '20'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A', year: 2021, number: 23,
  topic: 'probability',
  problem: 'Frieda the frog begins a sequence of hops on a 3 x 3 grid of squares, moving one square on each hop and choosing at random the direction of each hop -- up, down, left, or right. She does not hop diagonally. When the direction of a hop would take Frieda off the grid, she "wraps around" and jumps to the opposite edge. For example if Frieda begins in the center square and makes two hops "up", the first hop would place her in the top row middle square, and the second hop would cause Frieda to jump to the opposite edge, landing in the bottom row middle square. Suppose Frieda starts from the center square, makes at most four hops at random, and stops hopping if she lands on a corner square. What is the probability that she reaches a corner square on one of the four hops?',
  choices: ['9/16', '5/8', '3/4', '25/32', '13/16'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2021, number: 24,
  topic: 'geometry',
  problem: 'The interior of a quadrilateral is bounded by the graphs of (x + ay)^2 = 4a^2 and (ax - y)^2 = a^2, where a is a positive real number. What is the area of this region in terms of a, valid for all a > 0?',
  choices: ['8a^2/(a+1)^2', '4a/(a+1)', '8a/(a+1)', '8a^2/(a^2+1)', '8a/(a^2+1)'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2021, number: 25,
  topic: 'combinatorics',
  problem: 'How many ways are there to place 3 indistinguishable red chips, 3 indistinguishable blue chips, and 3 indistinguishable green chips in the squares of a 3 x 3 grid so that no two chips of the same color are directly adjacent to each other, either vertically or horizontally?',
  choices: ['12', '18', '24', '30', '36'],
  correct_answer: 'E',
},

// ===================== 2021 AMC 10A (Fall Contest) =====================
{
  contest: 'AMC 10A Fall', year: 2021, number: 1,
  topic: 'algebra',
  problem: 'What is the value of (2112 - 2021)^2 / 169?',
  choices: ['7', '21', '49', '64', '91'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 2,
  topic: 'geometry',
  problem: 'Menkara has a 4 x 6 index card. If she shortens the length of one side of this card by 1 inch, the card would have area 18 square inches. What would the area of the card be in square inches if instead she shortens the length of the other side by 1 inch?',
  choices: ['16', '17', '18', '19', '20'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 3,
  topic: 'geometry',
  problem: 'What is the maximum number of balls of clay with radius 2 that can completely fit inside a cube of side length 6 assuming that the balls can be reshaped but not compressed before they are packed in the cube?',
  choices: ['3', '4', '5', '6', '7'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 4,
  topic: 'algebra',
  problem: 'Mr. Lopez has a choice of two routes to get to work. Route A is 6 miles long, and his average speed along this route is 30 miles per hour. Route B is 5 miles long, and his average speed along this route is 40 miles per hour, except for a 1/2-mile stretch in a school zone where his average speed is 20 miles per hour. By how many minutes is Route B quicker than Route A?',
  choices: ['2 3/4', '3 3/4', '4 1/2', '5 1/2', '6 3/4'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 5,
  topic: 'number theory',
  problem: 'The six-digit number 2 0 2 1 0 A is prime for only one digit A. What is A?',
  choices: ['1', '3', '5', '7', '9'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 6,
  topic: 'algebra',
  problem: 'Elmer the emu takes 44 equal strides to walk between consecutive telephone poles on a rural road. Oscar the ostrich can cover the same distance in 12 equal leaps. The telephone poles are evenly spaced, and the 41st pole along this road is exactly one mile (5280 feet) from the first pole. How much longer, in feet, is Oscar\'s leap than Elmer\'s stride?',
  choices: ['6', '8', '10', '11', '15'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 7,
  topic: 'geometry',
  problem: 'As shown in the figure below, point E lies in the opposite half-plane determined by line CD from point A so that angle CDE = 110°. Point F lies on AD so that DE = DF, and ABCD is a square. What is the degree measure of angle AFE?',
  choices: ['160', '164', '166', '170', '174'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 8,
  topic: 'number theory',
  problem: 'A two-digit positive integer is said to be cuddly if it is equal to the sum of its nonzero tens digit and the square of its units digit. How many two-digit positive integers are cuddly?',
  choices: ['0', '1', '2', '3', '4'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 9,
  topic: 'probability',
  problem: 'When a certain unfair die is rolled, an even number is 3 times as likely to appear as an odd number. The die is rolled twice. What is the probability that the sum of the numbers rolled is even?',
  choices: ['3/8', '4/9', '5/9', '9/16', '5/8'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 10,
  topic: 'statistics',
  problem: 'A school has 100 students and 5 teachers. In the first period, each student is taking one class, and each teacher is teaching one class. The enrollments in the classes are 50, 20, 20, 5, and 5. Let t be the average value obtained if a teacher is picked at random and the number of students in their class is noted. Let s be the average value obtained if a student is picked at random and the number of students in their class, including that student, is noted. What is t - s?',
  choices: ['-18.5', '-13.5', '0', '13.5', '18.5'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 11,
  topic: 'algebra',
  problem: 'Emily sees a ship traveling at a constant speed along a straight section of a river. She walks parallel to the riverbank at a uniform rate faster than the ship. She counts 210 equal steps walking from the back of the ship to the front. Walking in the opposite direction, she counts 42 steps of the same size from the front of the ship to the back. In terms of Emily\'s equal steps, what is the length of the ship?',
  choices: ['70', '84', '98', '105', '126'],
  correct_answer: 'A',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 12,
  topic: 'number theory',
  problem: 'The base-nine representation of the number N is 27,006,000,052_nine. What is the remainder when N is divided by 5?',
  choices: ['0', '1', '2', '3', '4'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 13,
  topic: 'probability',
  problem: 'Each of 6 balls is randomly and independently painted either black or white with equal probability. What is the probability that every ball is different in color from more than half of the other 5 balls?',
  choices: ['1/64', '1/6', '1/4', '5/16', '1/2'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 14,
  topic: 'algebra',
  problem: 'How many ordered pairs (x, y) of real numbers satisfy the following system of equations? x^2 + 3y = 9, (|x| + |y| - 4)^2 = 1',
  choices: ['1', '2', '3', '5', '7'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 15,
  topic: 'geometry',
  problem: 'Isosceles triangle ABC has AB = AC = 3*sqrt(6), and a circle with radius 5*sqrt(2) is tangent to line AB at B and to line AC at C. What is the area of the circle that passes through vertices A, B, and C?',
  choices: ['24*pi', '25*pi', '26*pi', '27*pi', '28*pi'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 16,
  topic: 'algebra',
  problem: 'The graph of f(x) = |floor(x)| - |floor(1 - x)| is symmetric about which of the following? (Here floor(x) is the greatest integer not exceeding x.)',
  choices: ['the y-axis', 'the line x = 1', 'the origin', 'the point (1/2, 0)', 'the point (1, 0)'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 17,
  topic: 'geometry',
  problem: 'An architect is building a structure that will place vertical pillars at the vertices of regular hexagon ABCDEF, which is lying horizontally on the ground. The six pillars will hold up a flat solar panel that will not be parallel to the ground. The heights of the pillars at A, B, and C are 12, 9, and 10 meters, respectively. What is the height, in meters, of the pillar at E?',
  choices: ['9', '6*sqrt(3)', '8*sqrt(3)', '17', '12*sqrt(3)'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 18,
  topic: 'combinatorics',
  problem: "A farmer's rectangular field is partitioned into a 2 by 2 grid of 4 rectangular sections as shown in the figure. In each section the farmer will plant one crop: corn, wheat, soybeans, or potatoes. The farmer does not want to grow corn and wheat in any two sections that share a border, and the farmer does not want to grow soybeans and potatoes in any two sections that share a border. Given these restrictions, in how many ways can the farmer choose crops to plant in each of the four sections of the field?",
  choices: ['12', '64', '84', '90', '144'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 19,
  topic: 'geometry',
  problem: 'A disk of radius 1 rolls all the way around the inside of a square of side length s > 4 and sweeps out a region of area A. A second disk of radius 1 rolls all the way around the outside of the same square and sweeps out a region of area 2A. The value of s can be written as a + b*pi/c, where a, b, and c are positive integers and b and c are relatively prime. What is a + b + c?',
  choices: ['10', '11', '12', '13', '14'],
  correct_answer: 'A',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 20,
  topic: 'algebra',
  problem: 'For how many ordered pairs (b, c) of positive integers does neither x^2 + bx + c = 0 nor x^2 + cx + b = 0 have two distinct real solutions?',
  choices: ['4', '6', '8', '12', '16'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 21,
  topic: 'probability',
  problem: 'Each of 20 balls is tossed independently and at random into one of 5 bins. Let P be the probability that some bin ends up with 3 balls, another with 5 balls, and the other three with 4 balls each. Let Q be the probability that every bin ends up with 4 balls. What is P/Q?',
  choices: ['1', '4', '8', '12', '16'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 22,
  topic: 'geometry',
  problem: 'Inside a right circular cone with base radius 5 and height 12 are three congruent spheres each with radius r. Each sphere is tangent to the other two spheres and also tangent to the base and side of the cone. What is r?',
  choices: ['3/2', '(90 - 40*sqrt(3))/11', '2', '(144 - 25*sqrt(3))/44', '5/2'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 23,
  topic: 'number theory',
  problem: 'For each positive integer n, let f_1(n) be twice the number of positive integer divisors of n, and for j >= 2, let f_j(n) = f_1(f_{j-1}(n)). For how many values of n <= 50 is f_50(n) = 12?',
  choices: ['7', '8', '9', '10', '11'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 24,
  topic: 'combinatorics',
  problem: 'Each of the 12 edges of a cube is labeled 0 or 1. Two labelings are considered different even if one can be obtained from the other by a sequence of one or more rotations and/or reflections. For how many such labelings is the sum of the labels on the edges of each of the 6 faces of the cube equal to 2?',
  choices: ['8', '10', '12', '16', '20'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A Fall', year: 2021, number: 25,
  topic: 'algebra',
  problem: 'A quadratic polynomial p(x) with real coefficients and leading coefficient 1 is called disrespectful if the equation p(p(x)) = 0 is satisfied by exactly three real numbers. Among all the disrespectful quadratic polynomials, there is a unique such polynomial p_tilde(x) for which the sum of the roots is maximized. What is p_tilde(1)?',
  choices: ['5/16', '1/2', '5/8', '1', '9/8'],
  correct_answer: 'A',
},

// ===================== 2022 AMC 10A =====================
{
  contest: 'AMC 10A', year: 2022, number: 1,
  topic: 'algebra',
  problem: 'What is the value of 3 + 1/(3 + 1/(3 + 1/3))?',
  choices: ['31/10', '49/15', '33/10', '109/33', '15/4'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2022, number: 2,
  topic: 'algebra',
  problem: 'Mike cycled 15 laps in 57 minutes. Assume he cycled at a constant speed throughout. Approximately how many laps did he complete in the first 27 minutes?',
  choices: ['5', '7', '9', '11', '13'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A', year: 2022, number: 3,
  topic: 'algebra',
  problem: 'The sum of three numbers is 96. The first number is 6 times the third number, and the third number is 40 less than the second number. What is the absolute value of the difference between the first and second numbers?',
  choices: ['1', '2', '3', '4', '5'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2022, number: 4,
  topic: 'algebra',
  problem: 'In some countries, automobile fuel efficiency is measured in liters per 100 kilometers while other countries use miles per gallon. Suppose that 1 kilometer equals m miles, and 1 gallon equals l liters. Which of the following gives the fuel efficiency in liters per 100 kilometers for a car that gets x miles per gallon?',
  choices: ['x/(100lm)', 'xlm/100', 'lm/(100x)', '100/(xlm)', '100lm/x'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2022, number: 5,
  topic: 'geometry',
  problem: 'Square ABCD has side length 1. Point P, Q, R, and S each lie on a side of ABCD such that APQCRS is an equilateral convex hexagon with side length s. What is s?',
  choices: ['sqrt(2)/3', '1/2', '2 - sqrt(2)', '1 - sqrt(2)/4', '2/3'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2022, number: 6,
  topic: 'algebra',
  problem: 'Which expression is equal to |a - 2 - sqrt((a-1)^2)| for a < 0?',
  choices: ['3 - 2a', '1 - a', '1', 'a + 1', '3'],
  correct_answer: 'A',
},
{
  contest: 'AMC 10A', year: 2022, number: 7,
  topic: 'number theory',
  problem: 'The least common multiple of a positive integer n and 18 is 180, and the greatest common divisor of n and 45 is 15. What is the sum of the digits of n?',
  choices: ['3', '6', '8', '9', '12'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A', year: 2022, number: 8,
  topic: 'statistics',
  problem: 'A data set consists of 6 (not distinct) positive integers: 1, 7, 5, 2, 5, and X. The average (arithmetic mean) of the 6 numbers equals a value in the data set. What is the sum of all positive values of X?',
  choices: ['10', '26', '32', '36', '40'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2022, number: 9,
  topic: 'combinatorics',
  problem: 'A rectangle is partitioned into 5 regions as shown. Each region is to be painted a solid color - red, orange, yellow, blue, or green - so that regions that touch are painted different colors, and colors can be used more than once. How many different colorings are possible?',
  choices: ['120', '270', '360', '540', '720'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2022, number: 10,
  topic: 'geometry',
  problem: 'Daniel finds a rectangular index card and measures its diagonal to be 8 centimeters. Daniel then cuts out equal squares of side 1 cm at two opposite corners of the index card and measures the distance between the two closest vertices of these squares to be 4*sqrt(2) centimeters, as shown below. What is the area of the original index card?',
  choices: ['14', '10*sqrt(2)', '16', '12*sqrt(2)', '18'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2022, number: 11,
  topic: 'algebra',
  problem: 'Ted mistakenly wrote 2^m * sqrt(1/4096) as 2 * m-th-root(1/4096). What is the sum of all real numbers m for which these two expressions have the same value?',
  choices: ['5', '6', '7', '8', '9'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2022, number: 12,
  topic: 'logic',
  problem: 'On Halloween 31 children walked into the principal\'s office asking for candy. They can be classified into three types: Some always lie; some always tell the truth; and some alternately lie and tell the truth. The alternaters arbitrarily choose their first response, either a lie or the truth, but each subsequent statement has the opposite truth value from its predecessor. The principal asked everyone the same three questions in this order. "Are you a truth-teller?" The principal gave a piece of candy to each of the 22 children who answered yes. "Are you an alternater?" The principal gave a piece of candy to each of the 15 children who answered yes. "Are you a liar?" The principal gave a piece of candy to each of the 9 children who answered yes. How many pieces of candy in all did the principal give to the children who always tell the truth?',
  choices: ['7', '12', '21', '27', '31'],
  correct_answer: 'A',
},
{
  contest: 'AMC 10A', year: 2022, number: 13,
  topic: 'geometry',
  problem: 'Let triangle ABC be a scalene triangle. Point P lies on BC so that AP bisects angle BAC. The line through B perpendicular to AP intersects the line through A parallel to BC at point D. Suppose BP = 2 and PC = 3. What is AD?',
  choices: ['8', '9', '10', '11', '12'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2022, number: 14,
  topic: 'combinatorics',
  problem: 'How many ways are there to split the integers 1 through 14 into 7 pairs such that in each pair, the greater number is at least 2 times the lesser number?',
  choices: ['108', '120', '126', '132', '144'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2022, number: 15,
  topic: 'geometry',
  problem: 'Quadrilateral ABCD with side lengths AB = 7, BC = 24, CD = 20, DA = 15 is inscribed in a circle. The area interior to the circle but exterior to the quadrilateral can be written in the form (a*pi - b)/c, where a, b, and c are positive integers such that a and c have no common prime factor. What is a + b + c?',
  choices: ['260', '855', '1235', '1565', '1997'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2022, number: 16,
  topic: 'algebra',
  problem: 'The roots of the polynomial 10x^3 - 39x^2 + 29x - 6 are the height, length, and width of a rectangular box (right rectangular prism). A new rectangular box is formed by lengthening each edge of the original box by 2 units. What is the volume of the new box?',
  choices: ['24/5', '42/5', '81/5', '30', '48'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2022, number: 17,
  topic: 'number theory',
  problem: 'How many three-digit positive integers a b c are there whose nonzero digits a, b, and c satisfy 0.overline{abc} = (1/3)(0.overline{a} + 0.overline{b} + 0.overline{c})? (The bar indicates repetition, thus 0.overline{abc} in the infinite repeating decimal 0.abcabcabc...)',
  choices: ['9', '10', '11', '13', '14'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2022, number: 18,
  topic: 'geometry',
  problem: 'Let T_k be the transformation of the coordinate plane that first rotates the plane k degrees counterclockwise around the origin and then reflects the plane across the y-axis. What is the least positive integer n such that performing the sequence of transformations T_1, T_2, T_3, ..., T_n returns the point (1, 0) back to itself?',
  choices: ['359', '360', '719', '720', '721'],
  correct_answer: 'A',
},
{
  contest: 'AMC 10A', year: 2022, number: 19,
  topic: 'number theory',
  problem: 'Define L_n as the least common multiple of all the integers from 1 to n inclusive. There is a unique integer h such that 1/1 + 1/2 + 1/3 + ... + 1/17 = h/L_17. What is the remainder when h is divided by 17?',
  choices: ['1', '3', '5', '7', '9'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2022, number: 20,
  topic: 'algebra',
  problem: 'A four-term sequence is formed by adding each term of a four-term arithmetic sequence of positive integers to the corresponding term of a four-term geometric sequence of positive integers. The first three terms of the resulting four-term sequence are 57, 60, and 91. What is the fourth term of this sequence?',
  choices: ['190', '194', '198', '202', '206'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2022, number: 21,
  topic: 'geometry',
  problem: 'A bowl is formed by attaching four regular hexagons of side 1 to a square of side 1. The edges of adjacent hexagons coincide, as shown in the figure. What is the area of the octagon obtained by joining the top eight vertices of the four hexagons, situated on the rim of the bowl?',
  choices: ['6', '7', '5 + 2*sqrt(2)', '8', '9'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A', year: 2022, number: 22,
  topic: 'combinatorics',
  problem: 'Suppose that 13 cards numbered 1, 2, 3, ..., 13 are arranged in a row. The task is to pick them up in numerically increasing order, working repeatedly from left to right. In the example below, cards 1, 2, 3 are picked up on the first pass, 4 and 5 on the second pass, 6 on the third pass, 7, 8, 9, 10 on the fourth pass, and 11, 12, 13 on the fifth pass. For how many of the 13! possible orderings of the cards will the 13 cards be picked up in exactly two passes?',
  choices: ['4082', '4095', '4096', '8178', '8191'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2022, number: 23,
  topic: 'geometry',
  problem: 'Isosceles trapezoid ABCD has parallel sides AD and BC, with BC < AD and AB = CD. There is a point P in the plane such that PA = 1, PB = 2, PC = 3, and PD = 4. What is BC/AD?',
  choices: ['1/4', '1/3', '1/2', '2/3', '3/4'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A', year: 2022, number: 24,
  topic: 'combinatorics',
  problem: 'How many strings of length 5 formed from the digits 0, 1, 2, 3, 4 are there such that for each j in {1, 2, 3, 4}, at least j of the digits are less than j? (For example, 02214 satisfies this condition because it contains at least 1 digit less than 1, at least 2 digits less than 2, at least 3 digits less than 3, and at least 4 digits less than 4. The string 23404 does not satisfy the condition because it does not contain at least 2 digits less than 2.)',
  choices: ['500', '625', '1089', '1199', '1296'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2022, number: 25,
  topic: 'geometry',
  problem: 'Let R, S, and T be squares that have vertices at lattice points (i.e., points whose coordinates are both integers) in the coordinate plane, together with their interiors. The bottom edge of each square is on the x-axis. The left edge of R and the right edge of S are on the y-axis, and R contains 9/4 as many lattice points as does S. The top two vertices of T are in R union S, and T contains 1/4 of the lattice points contained in R union S. See the figure (not drawn to scale). The fraction of lattice points in S that are in S ∩ T is 27 times the fraction of lattice points in R that are in R ∩ T. What is the minimum possible value of the edge length of R plus the edge length of S plus the edge length of T?',
  choices: ['336', '337', '338', '339', '340'],
  correct_answer: 'E',
},

// ===================== 2023 AMC 10A =====================
{
  contest: 'AMC 10A', year: 2023, number: 1,
  topic: 'algebra',
  problem: 'Cities A and B are 45 miles apart. Alice and Barbara start biking from A and B at speeds of 18 mph and 12 mph, respectively. How far away from city A will they be when they meet?',
  choices: ['20', '24', '25', '26', '27'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2023, number: 2,
  topic: 'algebra',
  problem: 'The weight of 1/3 of a large pizza together with 3 1/2 cups of orange slices is the same as the weight of 3/4 of a large pizza together with 1/2 cup of orange slices. A cup of orange slices weighs 1/4 of a pound. What is the weight, in pounds, of a large pizza?',
  choices: ['1 4/5', '2', '2 2/5', '3', '3 3/5'],
  correct_answer: 'A',
},
{
  contest: 'AMC 10A', year: 2023, number: 3,
  topic: 'number theory',
  problem: 'How many positive perfect squares less than 2023 are divisible by 5?',
  choices: ['8', '9', '10', '11', '12'],
  correct_answer: 'A',
},
{
  contest: 'AMC 10A', year: 2023, number: 4,
  topic: 'geometry',
  problem: 'A quadrilateral has all integer sides lengths, a perimeter of 26, and one side of length 4. What is the greatest possible length of one side of this quadrilateral?',
  choices: ['9', '10', '11', '12', '13'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2023, number: 5,
  topic: 'number theory',
  problem: 'How many digits are in the base-ten representation of 8^5 * 5^10 * 15^5?',
  choices: ['14', '15', '16', '17', '18'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2023, number: 6,
  topic: 'algebra',
  problem: 'An integer is assigned to each vertex of a cube. The value of an edge is defined to be the sum of the values of the two vertices it touches, and the value of a face is defined to be the sum of the values of the four edges surrounding it. The value of the cube is defined as the sum of the values of its six faces. Suppose the sum of the integers assigned to the vertices is 21. What is the value of the cube?',
  choices: ['42', '63', '84', '126', '252'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2023, number: 7,
  topic: 'probability',
  problem: 'Janet rolls a standard 6-sided die 4 times and keeps a running total of the numbers she rolls. What is the probability that at some point, her running total will equal 3?',
  choices: ['2/9', '49/216', '25/108', '17/72', '13/54'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A', year: 2023, number: 8,
  topic: 'algebra',
  problem: 'Barb the baker has developed a new temperature scale for her bakery called the Breadus scale, which is a linear function of the Fahrenheit scale. Bread rises at 110 degrees Fahrenheit, which is 0 degrees on the Breadus scale. Bread is baked at 350 degrees Fahrenheit, which is 100 degrees on the Breadus scale. Bread is done when its internal temperature is 200 degrees Fahrenheit. What is this in degrees on the Breadus scale?',
  choices: ['33', '34.5', '36', '37.5', '39'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2023, number: 9,
  topic: 'combinatorics',
  problem: 'A digital display shows the current date as an 8-digit integer, consisting of a 4-digit year, followed by a 2-digit month, followed by a 2-digit date within the month. For how many dates in 2023 will each digit appear an even number of times in the digital display for that date?',
  choices: ['5', '6', '7', '8', '9'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2023, number: 10,
  topic: 'algebra',
  problem: "If Mareen scores an 11 on her next test, her mean score will go up by 1. If she gets three 11's in a row, her mean score will increase by 2. What is her current mean test score?",
  choices: ['4', '5', '6', '7', '8'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2023, number: 11,
  topic: 'geometry',
  problem: 'A square with area 3 has a square with area 2 inscribed in it. This creates 4 smaller congruent right triangles. What is the ratio of the smaller leg to the larger leg in the shaded right triangle?',
  choices: ['1/5', '1/4', '2 - sqrt(3)', 'sqrt(3) - sqrt(2)', 'sqrt(2) - 1'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2023, number: 12,
  topic: 'number theory',
  problem: 'How many three-digit positive integers N satisfy the following properties? The number N is divisible by 7. The number formed by reversing the digits of N is divisible by 5.',
  choices: ['13', '14', '15', '16', '17'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A', year: 2023, number: 13,
  topic: 'geometry',
  problem: 'Abdul and Chiang are standing 48 feet apart in a field. Bharat is standing in the same field as far from Abdul as possible so that the angle formed by his lines of sight to Abdul and Chiang measures 60°. What is the square of the distance (in feet) between Abdul and Bharat?',
  choices: ['1728', '2601', '3072', '4608', '6912'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2023, number: 14,
  topic: 'probability',
  problem: 'A number is chosen at random from among the first 100 positive integers, and a positive integer divisor of that number is then chosen at random. What is the probability that the chosen divisor is divisible by 11?',
  choices: ['4/100', '9/200', '1/20', '11/200', '3/50'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A', year: 2023, number: 15,
  topic: 'geometry',
  problem: 'An even number of circles are nested, starting with a radius of 1 and increasing by 1 each time, all sharing a common point. The region between every other circle is shaded, starting with the region inside the circle of radius 2 but outside the circle of radius 1. An example showing 8 circles is displayed below. What is the least number of circles needed to make the total shaded area at least 2023*pi?',
  choices: ['46', '48', '56', '60', '64'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2023, number: 16,
  topic: 'combinatorics',
  problem: 'In a tennis tournament, each person plays every other person once. In this tournament, there are twice as many right-handed players than left-handed players, but left-handed players won 40% more games than right-handed players. How many total games were played?',
  choices: ['15', '36', '45', '48', '66'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A', year: 2023, number: 17,
  topic: 'geometry',
  problem: 'Let ABCD be a rectangle with AB = 30 and BC = 28. Points P and Q lie on BC and CD respectively so that all sides of triangles ABP, PCQ, and QDA have integer lengths. What is the perimeter of triangle APQ?',
  choices: ['84', '86', '88', '90', '92'],
  correct_answer: 'A',
},
{
  contest: 'AMC 10A', year: 2023, number: 18,
  topic: 'geometry',
  problem: 'A rhombic dodecahedron is a solid with 12 congruent rhombus faces. At every vertex, 3 or 4 edges meet, depending on the vertex. How many vertices have exactly 3 edges meet?',
  choices: ['5', '6', '7', '8', '9'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2023, number: 19,
  topic: 'geometry',
  problem: "The line segment formed by A(1, 2) and B(3, 3) is rotated to the line segment formed by A'(3, 1) and B'(4, 3) about the point P(r, s). What is |r - s|?",
  choices: ['1/4', '1/2', '3/4', '2/3', '1'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2023, number: 20,
  topic: 'combinatorics',
  problem: 'Each square in a 3 x 3 grid of squares is colored red, white, blue, or green so that every 2 x 2 square contains one square of each color. One such coloring is shown on the right below. How many different colorings are possible?',
  choices: ['24', '48', '60', '72', '96'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2023, number: 21,
  topic: 'algebra',
  problem: 'Consider the polynomial P(x) such that: 1 is a root of P(x) - 1, 2 is a root of P(x - 2), 3 is a root of P(3x), and 4 is a root of 4P(x). All the roots of P(x) except one are integers. If the one non-integer root can be written in the form m/n, where m and n are relatively prime, what is m + n?',
  choices: ['41', '43', '45', '47', '49'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2023, number: 22,
  topic: 'geometry',
  problem: 'Circle C_1 and C_2 have radius 1, and the distance between their centers is 1/2. Circle C_3 is the largest circle internally tangent to both C_1 and C_2. Circle C_4 is internally tangent to both C_1 and C_2 and is externally tangent to C_3. What is the radius of C_4?',
  choices: ['1/14', '1/12', '1/10', '3/28', '1/9'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2023, number: 23,
  topic: 'number theory',
  problem: 'Positive integer divisors a and b of n are called complementary if ab = n. Given that N has a pair of complementary divisors that differ by 20 and a pair of complementary divisors that differ by 23, find the sum of the digits of N.',
  choices: ['11', '13', '15', '17', '19'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2023, number: 24,
  topic: 'geometry',
  problem: 'Six regular hexagonal blocks of side length 1 unit are arranged inside a regular hexagonal frame. Each block lies along an inside edge of the frame and is aligned with two other blocks, as shown in the figure below. The distance from any corner of the frame to the nearest vertex of a block is 3/7 unit. What is the area of the region inside the frame not occupied by the blocks?',
  choices: ['13*sqrt(3)/3', '216*sqrt(3)/49', '9*sqrt(3)/2', '14*sqrt(3)/3', '243*sqrt(3)/49'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2023, number: 25,
  topic: 'probability',
  problem: 'If A and B are vertices of a polyhedron, define the distance d(A, B) to be the minimum number of edges of the polyhedron one must traverse in order to connect A and B. For example, if AB is an edge of the polyhedron, then d(A, B) = 1, but if AC and CB are edges and AB is not an edge, then d(A, B) = 2. Let Q, R, and S be randomly chosen distinct vertices of a regular icosahedron (regular polyhedron made up of 20 equilateral triangles). What is the probability that d(Q, R) > d(R, S)?',
  choices: ['7/22', '1/3', '3/8', '5/12', '1/2'],
  correct_answer: 'A',
},

// ===================== 2025 AMC 10A =====================
{
  contest: 'AMC 10A', year: 2025, number: 1,
  topic: 'algebra',
  problem: 'Andy and Betsy both live in Mathville. Andy leaves Mathville on his bicycle at 1:30, traveling due north at a steady 8 miles per hour. Betsy leaves on her bicycle from the same point at 2:30, traveling due east at a steady 12 miles per hour. At what time will they be exactly the same distance from their common starting point?',
  choices: ['3:30', '3:45', '4:00', '4:15', '4:30'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2025, number: 2,
  topic: 'algebra',
  problem: 'A box contains 10 pounds of a nut mix that is 50 percent peanuts, 20 percent cashews, and 30 percent almonds. A second nut mix containing 20 percent peanuts, 40 percent cashews, and 40 percent almonds is added to the box resulting in a new nut mix that is 40 percent peanuts. How many pounds of cashews are now in the box?',
  choices: ['3.5', '4', '4.5', '5', '6'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A', year: 2025, number: 3,
  topic: 'number theory',
  problem: 'How many isosceles triangles are there with positive area whose side lengths are all positive integers and whose longest side has length 2025?',
  choices: ['2025', '2026', '3012', '3037', '4050'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2025, number: 4,
  topic: 'algebra',
  problem: 'A team of students is going to compete against a team of teachers in a trivia contest. The total number of students and teachers is 15. Ash, a cousin of one of the students, wants to join the contest. If Ash plays with the students, the average age on that team will increase from 12 to 14. If Ash plays with the teachers, the average age on that team will decrease from 55 to 52. How old is Ash?',
  choices: ['28', '29', '30', '32', '33'],
  correct_answer: 'A',
},
{
  contest: 'AMC 10A', year: 2025, number: 5,
  topic: 'algebra',
  problem: 'Consider the sequence of positive integers 1, 2, 1, 2, 3, 2, 1, 2, 3, 4, 3, 2, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 2, ... What is the 2025th term in the sequence?',
  choices: ['5', '15', '16', '44', '45'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2025, number: 6,
  topic: 'geometry',
  problem: 'In an equilateral triangle each interior angle is trisected by a pair of rays. The intersection of the interiors of the middle 20°-angle at each vertex is the interior of a convex hexagon. What is the degree measure of the smallest angle of this hexagon?',
  choices: ['80', '90', '100', '110', '120'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2025, number: 7,
  topic: 'algebra',
  problem: 'Suppose a and b are real numbers. When the polynomial x^3 + x^2 + ax + b is divided by x - 1, the remainder is 4. When the polynomial is divided by x - 2, the remainder is 6. What is b - a?',
  choices: ['14', '15', '16', '17', '18'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2025, number: 8,
  topic: 'logic',
  problem: 'Agnes writes the following four statements on a blank piece of paper.\n• At least one of these statements is true.\n• At least two of these statements are true.\n• At least two of these statements are false.\n• At least one of these statements is false.\nEach statement is either true or false. How many false statements did Agnes write on the paper?',
  choices: ['0', '1', '2', '3', '4'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A', year: 2025, number: 9,
  topic: 'algebra',
  problem: 'Let f(x) = 100x^3 - 300x^2 + 200x. For how many real numbers a does the graph of y = f(x - a) pass through the point (1, 25)?',
  choices: ['1', '2', '3', '4', 'more than 4'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2025, number: 10,
  topic: 'geometry',
  problem: 'A semicircle has diameter AB and chord CD of length 16 parallel to AB. A smaller circle with diameter on AB and tangent to CD is cut from the larger semicircle, as shown below. What is the area of the resulting figure, shown shaded?',
  choices: ['16*pi', '24*pi', '32*pi', '48*pi', '64*pi'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2025, number: 11,
  topic: 'algebra',
  problem: 'The sequence 1, x, y, z is arithmetic. The sequence 1, p, q, z is geometric. Both sequences are strictly increasing and contain only integers, and z is as small as possible. What is the value of x + y + z + p + q?',
  choices: ['66', '91', '103', '132', '149'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2025, number: 12,
  topic: 'combinatorics',
  problem: 'Carlos uses a 4-digit passcode to unlock his computer. In his passcode, exactly one digit is even, exactly one (possibly different) digit is prime, and no digit is 0. How many 4-digit passcodes satisfy these conditions?',
  choices: ['176', '192', '432', '464', '608'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2025, number: 13,
  topic: 'geometry',
  problem: 'In the figure below, the outside square contains infinitely many squares, each of them with the same center and sides parallel to the outside square. The ratio of the side length of a square to the side length of the next inner square is k, where 0 < k < 1. The spaces between squares are alternately shaded, as shown in the figure (which is not necessarily drawn to scale). The area of the shaded portion of the figure is 64% of the area of the original square. What is k?',
  choices: ['3/5', '16/25', '2/3', '3/4', '4/5'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2025, number: 14,
  topic: 'probability',
  problem: 'Six chairs are arranged around a round table. Two students and two teachers randomly select four of the chairs to sit in. What is the probability that the two students will sit in two adjacent chairs and the two teachers will also sit in two adjacent chairs?',
  choices: ['1/6', '1/5', '2/9', '3/13', '1/4'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A', year: 2025, number: 15,
  topic: 'geometry',
  problem: 'In the figure below, ABEF is a rectangle, AD perpendicular to DE, AF = 7, AB = 1, and AD = 5. What is the area of triangle ABC?',
  choices: ['3/8', '4/9', '(1/8)*sqrt(13)', '7/15', '(1/8)*sqrt(15)'],
  correct_answer: 'A',
},
{
  contest: 'AMC 10A', year: 2025, number: 16,
  topic: 'probability',
  problem: 'There are three jars. Each of three coins is placed in one of the three jars, chosen at random and independently of the placements of the other coins. What is the expected number of coins in a jar with the most coins?',
  choices: ['4/3', '13/9', '5/3', '17/9', '2'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2025, number: 17,
  topic: 'number theory',
  problem: 'Let N be the unique positive integer such that dividing 273436 by N leaves a remainder of 16 and dividing 272760 by N leaves a remainder of 15. What is the tens digit of N?',
  choices: ['0', '1', '2', '3', '4'],
  correct_answer: 'E',
},
{
  contest: 'AMC 10A', year: 2025, number: 18,
  topic: 'algebra',
  problem: 'The harmonic mean of a collection of numbers is the reciprocal of the arithmetic mean of the reciprocals of the numbers in the collection. For example, the harmonic mean of 4, 4, 5 is 1 / ((1/3)(1/4 + 1/4 + 1/5)) = 30/7. What is the harmonic mean of all the real roots of the 4050th degree polynomial prod_{k=1}^{2025} (kx^2 - 4x - 3) = (x^2 - 4x - 3)(2x^2 - 4x - 3)(3x^2 - 4x - 3) * ... * (2025x^2 - 4x - 3)?',
  choices: ['-5/3', '-3/2', '-6/5', '-5/6', '-2/3'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A', year: 2025, number: 19,
  topic: 'algebra',
  problem: 'An array of numbers is constructed beginning with the numbers -1, 3, 1 in the top row. Each adjacent pair of numbers is summed to produce a number in the next row. Each row begins and ends with -1 and 1, respectively. If the process continues, one of the rows will sum to 12,288. In that row, what is the third number from the left?',
  choices: ['-29', '-21', '-14', '-8', '-3'],
  correct_answer: 'A',
},
{
  contest: 'AMC 10A', year: 2025, number: 20,
  topic: 'geometry',
  problem: 'A silo (right circular cylinder) with diameter 20 meters stands in a field. MacDonald is located 20 meters west and 15 meters south of the center of the silo. McGregor is located 20 meters east and g > 0 meters south of the center of the silo. The line of sight between MacDonald and McGregor is tangent to the silo. The value of g can be written as a*sqrt(b) - c / d, where a, b, c, and d are positive integers, b is not divisible by the square of any prime, and d is relatively prime to the greatest common divisor of a and c. What is a + b + c + d?',
  choices: ['119', '120', '121', '122', '123'],
  correct_answer: 'A',
},
{
  contest: 'AMC 10A', year: 2025, number: 21,
  topic: 'combinatorics',
  problem: 'A set of numbers is called sum-free if whenever x and y are (not necessarily distinct) elements of the set, x + y is not an element of the set. For example, {1, 4, 6} and the empty set are sum-free, but {2, 4, 5} is not. What is the greatest possible number of elements in a sum-free subset of {1, 2, 3, ..., 20}.',
  choices: ['8', '9', '10', '11', '12'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2025, number: 22,
  topic: 'geometry',
  problem: 'A circle of radius r is surrounded by three circles, whose radii are 1, 2, and 3, all externally tangent to the inner circle and to each other, as shown. What is r?',
  choices: ['1/4', '6/23', '3/11', '5/17', '3/10'],
  correct_answer: 'B',
},
{
  contest: 'AMC 10A', year: 2025, number: 23,
  topic: 'geometry',
  problem: 'Triangle ABC has side lengths AB = 80, BC = 45, and AC = 75. The bisector of angle B and the altitude to side AB intersect at point P. What is BP?',
  choices: ['18', '19', '20', '21', '22'],
  correct_answer: 'D',
},
{
  contest: 'AMC 10A', year: 2025, number: 24,
  topic: 'combinatorics',
  problem: 'Call a positive integer fair if no digit is used more than once, it has no 0s, and no digit is adjacent to two greater digits. For example, 196, 23 and 12463 are fair, but 1546, 320, and 34321 are not. How many fair positive integers are there?',
  choices: ['511', '2584', '9841', '17711', '19682'],
  correct_answer: 'C',
},
{
  contest: 'AMC 10A', year: 2025, number: 25,
  topic: 'geometry',
  problem: 'A point P is chosen at random inside square ABCD. The probability that AP is neither the shortest nor the longest side of triangle APB can be written as (a + b*pi - c*sqrt(d)) / e, where a, b, c, d, and e are positive integers, gcd(a, b, c, e) = 1, and d is not divisible by the square of a prime. What is a + b + c + d + e?',
  choices: ['25', '26', '27', '28', '29'],
  correct_answer: 'A',
},

];

function getDifficulty(number) {
  if (number <= 8) return 'easy';
  if (number <= 18) return 'medium';
  return 'hard';
}

async function deleteProblems() {
  console.log('Deleting existing AMC 10A problems...');

  const res1 = await fetch(
    SUPABASE_URL + '/rest/v1/olympiad_problems?contest=eq.AMC%2010A&track=eq.amc10',
    {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    }
  );
  console.log('Delete AMC 10A status:', res1.status);

  const res2 = await fetch(
    SUPABASE_URL + '/rest/v1/olympiad_problems?contest=eq.AMC%2010A%20Fall&track=eq.amc10',
    {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    }
  );
  console.log('Delete AMC 10A Fall status:', res2.status);
}

async function insertProblems() {
  let successCount = 0;
  let failCount = 0;

  for (const p of problems) {
    const record = {
      contest: p.contest,
      year: p.year,
      number: p.number,
      topic: p.topic,
      difficulty: getDifficulty(p.number),
      problem: p.problem,
      choices: p.choices,
      correct_answer: p.correct_answer,
      correct_value: null,
      solution: '',
      track: 'amc10',
      source_link: sourceLink(p.year, p.number, p.contest)
    };

    const res = await fetch(SUPABASE_URL + '/rest/v1/olympiad_problems', {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(record)
    });

    if (res.status === 201) {
      successCount++;
      if (successCount % 10 === 0) {
        console.log(`Inserted ${successCount} problems so far...`);
      }
    } else {
      const text = await res.text();
      console.error(`FAILED: ${p.contest} ${p.year} #${p.number} - status ${res.status}: ${text}`);
      failCount++;
    }
  }

  console.log(`\nDone! Inserted: ${successCount}, Failed: ${failCount}`);
}

async function main() {
  await deleteProblems();
  console.log('\nStarting insertions...');
  await insertProblems();
}

main().catch(console.error);
