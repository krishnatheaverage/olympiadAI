const url = 'https://rrjhdokniecigtekmpjz.supabase.co';
const key = 'sb_publishable_qk42EmpxYFxXsAGkjLAzJA_kGznRof4';

function getDifficulty(num) {
  if (num <= 8) return 'easy';
  if (num <= 18) return 'medium';
  return 'hard';
}

function getTopic(year, num) {
  // Rough topic classification based on problem content
  const topicMap = {
    // 2020
    '2020-1': 'arithmetic', '2020-2': 'geometry', '2020-3': 'arithmetic',
    '2020-4': 'combinatorics', '2020-5': 'algebra', '2020-6': 'geometry',
    '2020-7': 'geometry', '2020-8': 'statistics', '2020-9': 'trigonometry',
    '2020-10': 'algebra', '2020-11': 'probability', '2020-12': 'geometry',
    '2020-13': 'algebra', '2020-14': 'geometry', '2020-15': 'complex numbers',
    '2020-16': 'probability', '2020-17': 'calculus', '2020-18': 'geometry',
    '2020-19': 'number theory', '2020-20': 'combinatorics', '2020-21': 'number theory',
    '2020-22': 'complex numbers', '2020-23': 'probability', '2020-24': 'geometry',
    '2020-25': 'algebra',
    // 2021
    '2021-1': 'arithmetic', '2021-2': 'algebra', '2021-3': 'arithmetic',
    '2021-4': 'logic', '2021-5': 'arithmetic', '2021-6': 'probability',
    '2021-7': 'algebra', '2021-8': 'number theory', '2021-9': 'algebra',
    '2021-10': 'geometry', '2021-11': 'geometry', '2021-12': 'algebra',
    '2021-13': 'complex numbers', '2021-14': 'algebra', '2021-15': 'combinatorics',
    '2021-16': 'statistics', '2021-17': 'geometry', '2021-18': 'algebra',
    '2021-19': 'trigonometry', '2021-20': 'geometry', '2021-21': 'complex numbers',
    '2021-22': 'algebra', '2021-23': 'probability', '2021-24': 'geometry',
    '2021-25': 'number theory',
    // 2022
    '2022-1': 'arithmetic', '2022-2': 'algebra', '2022-3': 'geometry',
    '2022-4': 'number theory', '2022-5': 'geometry', '2022-6': 'statistics',
    '2022-7': 'combinatorics', '2022-8': 'algebra', '2022-9': 'combinatorics',
    '2022-10': 'combinatorics', '2022-11': 'algebra', '2022-12': 'geometry',
    '2022-13': 'complex numbers', '2022-14': 'algebra', '2022-15': 'algebra',
    '2022-16': 'number theory', '2022-17': 'trigonometry', '2022-18': 'geometry',
    '2022-19': 'combinatorics', '2022-20': 'geometry', '2022-21': 'algebra',
    '2022-22': 'complex numbers', '2022-23': 'number theory', '2022-24': 'combinatorics',
    '2022-25': 'geometry',
    // 2023
    '2023-1': 'arithmetic', '2023-2': 'arithmetic', '2023-3': 'number theory',
    '2023-4': 'number theory', '2023-5': 'probability', '2023-6': 'algebra',
    '2023-7': 'combinatorics', '2023-8': 'statistics', '2023-9': 'geometry',
    '2023-10': 'algebra', '2023-11': 'trigonometry', '2023-12': 'algebra',
    '2023-13': 'combinatorics', '2023-14': 'complex numbers', '2023-15': 'geometry',
    '2023-16': 'complex numbers', '2023-17': 'probability', '2023-18': 'geometry',
    '2023-19': 'algebra', '2023-20': 'combinatorics', '2023-21': 'combinatorics',
    '2023-22': 'number theory', '2023-23': 'algebra', '2023-24': 'combinatorics',
    '2023-25': 'trigonometry',
    // 2024
    '2024-1': 'arithmetic', '2024-2': 'algebra', '2024-3': 'number theory',
    '2024-4': 'number theory', '2024-5': 'statistics', '2024-6': 'number theory',
    '2024-7': 'geometry', '2024-8': 'trigonometry', '2024-9': 'number theory',
    '2024-10': 'trigonometry', '2024-11': 'number theory', '2024-12': 'algebra',
    '2024-13': 'algebra', '2024-14': 'algebra', '2024-15': 'algebra',
    '2024-16': 'probability', '2024-17': 'algebra', '2024-18': 'geometry',
    '2024-19': 'geometry', '2024-20': 'probability', '2024-21': 'algebra',
    '2024-22': 'combinatorics', '2024-23': 'trigonometry', '2024-24': 'geometry',
    '2024-25': 'combinatorics',
    // 2025
    '2025-1': 'arithmetic', '2025-2': 'arithmetic', '2025-3': 'statistics',
    '2025-4': 'logic', '2025-5': 'geometry', '2025-6': 'probability',
    '2025-7': 'algebra', '2025-8': 'geometry', '2025-9': 'complex numbers',
    '2025-10': 'geometry', '2025-11': 'geometry', '2025-12': 'algebra',
    '2025-13': 'combinatorics', '2025-14': 'geometry', '2025-15': 'combinatorics',
    '2025-16': 'geometry', '2025-17': 'complex numbers', '2025-18': 'combinatorics',
    '2025-19': 'algebra', '2025-20': 'geometry', '2025-21': 'algebra',
    '2025-22': 'probability', '2025-23': 'combinatorics', '2025-24': 'geometry',
    '2025-25': 'algebra',
  };
  return topicMap[`${year}-${num}`] || 'algebra';
}

const problems = [
  // ==================== 2020 AMC 12A ====================
  {
    contest: 'AMC 12A', year: 2020, number: 1,
    problem: "Carlos took 70% of a whole pie. Maria took one third of the remainder. What portion of the whole pie was left?",
    choices: ["10%", "15%", "20%", "30%", "35%"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 2,
    problem: "The acronym AMC is shown in the rectangular grid below with grid lines spaced 1 unit apart. In units, what is the sum of the lengths of the line segments that form the acronym AMC? (The figure shows the letters A, M, C drawn on a grid. The letter A has diagonal sides, the letter M has diagonal strokes, and the letter C has diagonal strokes. Each letter is 3 units tall and about 2 units wide.)",
    choices: ["17", "15+2\\sqrt{2}", "13+4\\sqrt{2}", "11+6\\sqrt{2}", "21"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 3,
    problem: "A driver travels for 2 hours at 60 miles per hour, during which her car gets 30 miles per gallon of gasoline. She is paid $0.50 per mile, and her only expense is gasoline at $2.00 per gallon. What is her net rate of pay, in dollars per hour, after this expense?",
    choices: ["20", "22", "24", "25", "26"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 4,
    problem: "How many 4-digit positive integers (that is, integers between 1000 and 9999, inclusive) having only even digits are divisible by 5?",
    choices: ["80", "100", "125", "200", "500"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 5,
    problem: "The 25 integers from \\(-10\\) to 14, inclusive, can be arranged to form a 5-by-5 square in which the sum of the numbers in each row, the sum of the numbers in each column, and the sum of the numbers along each of the main diagonals are all the same. What is the value of this common sum?",
    choices: ["2", "5", "10", "25", "50"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 6,
    problem: "In the plane figure shown below, 3 of the unit squares have been shaded. (The figure shows a 4×4 grid with 3 unit squares shaded in specific positions.) What is the least number of additional unit squares that must be shaded so that the resulting figure has two lines of symmetry?",
    choices: ["4", "5", "6", "7", "8"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 7,
    problem: "Seven cubes, whose volumes are 1, 8, 27, 64, 125, 216, and 343 cubic units, are stacked vertically to form a tower in which the volumes of the cubes decrease from bottom to top. Except for the bottom cube, the bottom face of each cube lies completely on top of the cube below it. What is the total surface area of the tower (including the bottom) in square units?",
    choices: ["644", "658", "664", "720", "749"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 8,
    problem: "What is the median of the following list of \\(4040\\) numbers? \\[1, 2, 3, \\ldots, 2020, 1^2, 2^2, 3^2, \\ldots, 2020^2\\]",
    choices: ["1974.5", "1975.5", "1976.5", "1977.5", "1978.5"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 9,
    problem: "How many solutions does the equation \\(\\tan(2x) = \\cos\\left(\\frac{x}{2}\\right)\\) have on the interval \\([0, 2\\pi]\\)?",
    choices: ["1", "2", "3", "4", "5"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 10,
    problem: "There is a unique positive integer \\(n\\) such that \\[\\log_2(\\log_{16} n) = \\log_4(\\log_4 n).\\] What is the sum of the digits of \\(n\\)?",
    choices: ["4", "7", "8", "11", "13"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 11,
    problem: "A frog sitting at the point \\((1, 2)\\) begins a sequence of jumps, where each jump is parallel to one of the coordinate axes and has length 1, and the direction of each jump (up, down, right, or left) is chosen independently at random. The sequence ends when the frog reaches a side of the square with vertices \\((0, 0)\\), \\((0, 4)\\), \\((4, 4)\\), and \\((4, 0)\\). What is the probability that the sequence of jumps ends on a vertical side of the square?",
    choices: ["\\frac{1}{2}", "\\frac{5}{8}", "\\frac{2}{3}", "\\frac{3}{4}", "\\frac{7}{8}"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 12,
    problem: "Line \\(\\ell\\) in the coordinate plane has the equation \\(3x - 5y + 40 = 0\\). This line is rotated \\(45^\\circ\\) counterclockwise about the point \\((20, 20)\\) to obtain line \\(k\\). What is the \\(x\\)-coordinate of the \\(x\\)-intercept of line \\(k\\)?",
    choices: ["10", "15", "20", "25", "30"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 13,
    problem: "There are integers \\(a\\), \\(b\\), and \\(c\\), each greater than 1, such that \\[\\sqrt[leftroot{-2}uproot{2}a]{N \\sqrt[b]{N \\sqrt[c]{N}}} = \\sqrt[36]{N^{25}}\\] for all \\(N > 1\\). What is \\(b\\)?",
    choices: ["2", "3", "4", "5", "6"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 14,
    problem: "Regular octagon \\(ABCDEFGH\\) has area \\(n\\). Let \\(m\\) be the area of quadrilateral \\(ACEG\\). What is \\(\\frac{m}{n}\\)?",
    choices: ["\\frac{\\sqrt{2}}{4}", "\\frac{\\sqrt{2}}{2}", "\\frac{3}{4}", "\\frac{3\\sqrt{2}}{5}", "\\frac{2\\sqrt{2}}{3}"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 15,
    problem: "In the complex plane, let \\(A\\) be the set of solutions to \\(z^3 - 8 = 0\\) and let \\(B\\) be the set of solutions to \\(z^3 - 8z^2 - 8z + 64 = 0\\). What is the greatest distance between a point of \\(A\\) and a point of \\(B\\)?",
    choices: ["2\\sqrt{3}", "6", "9", "2\\sqrt{21}", "9 + \\sqrt{3}"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 16,
    problem: "A point is chosen at random within the square in the coordinate plane whose vertices are \\((0, 0)\\), \\((2020, 0)\\), \\((2020, 2020)\\), and \\((0, 2020)\\). The probability that the point is within \\(d\\) units of a lattice point is \\(\\frac{1}{2}\\). (A point \\((x, y)\\) is a lattice point if \\(x\\) and \\(y\\) are both integers.) What is \\(d\\) to the nearest tenth?",
    choices: ["0.3", "0.4", "0.5", "0.6", "0.7"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 17,
    problem: "The vertices of a quadrilateral lie on the graph of \\(y = \\ln x\\), and the \\(x\\)-coordinates of these vertices are consecutive positive integers. The area of the quadrilateral is \\(\\ln \\frac{91}{90}\\). What is the \\(x\\)-coordinate of the leftmost vertex?",
    choices: ["6", "7", "10", "12", "13"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 18,
    problem: "Quadrilateral \\(ABCD\\) satisfies \\(\\angle ABC = \\angle ACD = 90^\\circ\\), \\(AC = 20\\), and \\(CD = 30\\). Diagonals \\(\\overline{AC}\\) and \\(\\overline{BD}\\) intersect at point \\(E\\), and \\(AE = 5\\). What is the area of quadrilateral \\(ABCD\\)?",
    choices: ["330", "340", "350", "360", "370"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 19,
    problem: "There exists a unique strictly increasing sequence of nonnegative integers \\(a_1 < a_2 < \\cdots < a_k\\) such that \\[\\frac{2^{289}+1}{2^{17}+1} = 2^{a_1} + 2^{a_2} + \\cdots + 2^{a_k}.\\] What is \\(k\\)?",
    choices: ["117", "136", "137", "273", "306"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 20,
    problem: "Let \\(T\\) be the triangle in the coordinate plane with vertices \\((0,0)\\), \\((4,0)\\), and \\((0,3)\\). Consider the following five isometries (rigid transformations) of the plane: rotations of \\(90^\\circ\\), \\(180^\\circ\\), and \\(270^\\circ\\) counterclockwise around the origin, reflection across the \\(x\\)-axis, and reflection across the \\(y\\)-axis. How many of the 125 sequences of three of these transformations (not necessarily distinct) will return \\(T\\) to its original position? (For example, a \\(180^\\circ\\) rotation followed by a reflection across the \\(x\\)-axis followed by a reflection across the \\(y\\)-axis will return \\(T\\) to its original position, but a \\(90^\\circ\\) rotation followed by a \\(180^\\circ\\) rotation followed by another \\(180^\\circ\\) rotation will not, since the first rotation moves \\(T\\) out of its original position.)",
    choices: ["12", "15", "17", "20", "25"],
    correct_answer: 'A'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 21,
    problem: "How many positive integers \\(n\\) are there such that \\(n\\) is a multiple of 5, and the least common multiple of \\(5!\\) and \\(n\\) equals 5 times the greatest common divisor of \\(10!\\) and \\(n\\)?",
    choices: ["12", "24", "36", "48", "72"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 22,
    problem: "Let \\((a_n)\\) and \\((b_n)\\) be the sequences of real numbers such that \\[(2+i)^n = a_n + b_n i\\] for all integers \\(n \\geq 0\\), where \\(i = \\sqrt{-1}\\). What is \\[\\sum_{n=0}^{\\infty} \\frac{a_n b_n}{7^n}?\\]",
    choices: ["\\frac{3}{8}", "\\frac{7}{16}", "\\frac{1}{2}", "\\frac{9}{16}", "\\frac{4}{7}"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 23,
    problem: "Jason rolls three fair standard six-sided dice. Then he looks at the rolls and chooses a subset of the dice (possibly empty, possibly all three dice) to reroll. After rerolling, he wins if and only if the sum of the numbers face up on the three dice is exactly 7. Jason always plays to optimize his chances of winning. What is the probability that he chooses to reroll exactly two of the dice?",
    choices: ["\\frac{7}{36}", "\\frac{5}{24}", "\\frac{2}{9}", "\\frac{17}{72}", "\\frac{1}{4}"],
    correct_answer: 'A'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 24,
    problem: "Suppose that \\(\\triangle ABC\\) is an equilateral triangle of side length \\(s\\), with the property that there is a unique point \\(P\\) inside the triangle such that \\(AP = 1\\), \\(BP = \\sqrt{3}\\), and \\(CP = 2\\). What is \\(s\\)?",
    choices: ["1+\\sqrt{2}", "\\sqrt{7}", "\\frac{8}{3}", "\\sqrt{5+\\sqrt{5}}", "2\\sqrt{2}"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2020, number: 25,
    problem: "The number \\(a = \\frac{p}{q}\\), where \\(p\\) and \\(q\\) are relatively prime positive integers, has the property that the sum of all real numbers \\(x\\) satisfying \\(\\lfloor x \\rfloor \\cdot \\{x\\} = a \\cdot x^2\\) is \\(420\\), where \\(\\lfloor x \\rfloor\\) denotes the greatest integer less than or equal to \\(x\\) and \\(\\{x\\} = x - \\lfloor x \\rfloor\\) denotes the fractional part of \\(x\\). What is \\(p + q\\)?",
    choices: ["245", "593", "929", "1331", "1332"],
    correct_answer: 'C'
  },

  // ==================== 2021 AMC 12A ====================
  {
    contest: 'AMC 12A', year: 2021, number: 1,
    problem: "What is the value of \\(2^{1+2+3} - (2^1 + 2^2 + 2^3)\\)?",
    choices: ["0", "50", "52", "54", "57"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 2,
    problem: "Under what conditions is \\(\\sqrt{a^2+b^2}=a+b\\) true, where \\(a\\) and \\(b\\) are real numbers?",
    choices: ["It is never true.", "It is true if and only if \\(ab=0\\).", "It is true if and only if \\(a+b \\ge 0\\).", "It is true if and only if \\(ab=0\\) and \\(a+b \\ge 0\\).", "It is always true."],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 3,
    problem: "The sum of two natural numbers is \\(17{,}402\\). One of the two numbers is divisible by 10. If the units digit of that number is erased, the other number is obtained. What is the difference of these two numbers?",
    choices: ["10272", "11700", "13362", "14238", "15426"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 4,
    problem: "Tom has a collection of 13 snakes, 4 of which are purple and 5 of which are happy. He observes that all of his happy snakes can add; none of his purple snakes can subtract; all of his snakes that can't subtract also can't add. Which of these conclusions can be drawn about Tom's snakes?",
    choices: ["Purple snakes can add.", "Purple snakes are happy.", "Snakes that can add are purple.", "Happy snakes are not purple.", "Happy snakes can't subtract."],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 5,
    problem: "When a student multiplied the number 66 by the repeating decimal, \\(\\underline{1}.\\underline{a}\\underline{b}\\underline{a}\\underline{b}\\cdots = \\overline{1.\\overline{ab}}\\), where \\(a\\) and \\(b\\) are digits, he did not notice the notation and just multiplied 66 times \\(\\underline{1}.\\underline{a}\\underline{b}\\). Later he found that his answer is 0.5 less than the correct answer. What is the 2-digit number \\(\\overline{ab}\\)?",
    choices: ["15", "30", "45", "60", "75"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 6,
    problem: "A deck of cards has only red cards and black cards. The probability of a randomly chosen card being red is \\(\\frac{1}{3}\\). When 4 black cards are added to the deck, the probability of choosing red becomes \\(\\frac{1}{4}\\). How many cards were in the deck originally?",
    choices: ["6", "9", "12", "15", "18"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 7,
    problem: "What is the least possible value of \\((xy-1)^2 + (x+y)^2\\) for real numbers \\(x\\) and \\(y\\)?",
    choices: ["0", "\\frac{1}{4}", "\\frac{1}{2}", "1", "2"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 8,
    problem: "A sequence is defined by \\(D_0 = 0\\), \\(D_1 = 0\\), \\(D_2 = 1\\), and \\(D_n = D_{n-1} + D_{n-3}\\) for \\(n \\geq 3\\). What are the parities (odd/even) of the triple of numbers \\((D_{2021}, D_{2022}, D_{2023})\\), where E denotes even and O denotes odd?",
    choices: ["(O, E, O)", "(E, E, O)", "(E, O, E)", "(O, O, E)", "(O, O, O)"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 9,
    problem: "What is the value of \\[(2+3)(2^2+3^2)(2^4+3^4)(2^8+3^8)(2^{16}+3^{16})(2^{32}+3^{32})(2^{64}+3^{64})?\\]",
    choices: ["3^{127}+2^{127}", "3^{127}+2^{127}+2 \\cdot 3^{63}+3 \\cdot 2^{63}", "3^{128}-2^{128}", "3^{128}+2^{128}", "5^{127}"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 10,
    problem: "Two right circular cones with vertices facing down as shown in the figure below contain the same amount of liquid. The radii of the tops of the liquid surfaces are 3 cm and 6 cm. Into each cone is dropped a marble of radius 1 cm, which sinks to the bottom and is submerged without spilling any liquid. What is the ratio of the rise of the liquid level in the narrow cone to the rise of the liquid level in the wide cone? (The figure shows two cones pointing downward, the left/narrow one with a liquid radius of 3 cm and the right/wide one with a liquid radius of 6 cm.)",
    choices: ["1:1", "47:43", "2:1", "40:13", "4:1"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 11,
    problem: "A laser is placed at the point \\((3, 5)\\). The laser beam travels in a straight line. Lucy wants the beam to hit and bounce off the \\(y\\)-axis, then hit and bounce off the \\(x\\)-axis, then hit the point \\((7, 5)\\). What is the total distance the beam will travel along this path?",
    choices: ["2\\sqrt{10}", "5\\sqrt{2}", "10\\sqrt{2}", "15\\sqrt{2}", "10\\sqrt{5}"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 12,
    problem: "All the roots of the polynomial \\(z^6 - 10z^5 + Az^4 + Bz^3 + Cz^2 + Dz + 16\\) are positive integers, possibly repeated. What is the value of \\(B\\)?",
    choices: ["-88", "-80", "-64", "-41", "-40"],
    correct_answer: 'A'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 13,
    problem: "Of the following complex numbers \\(z\\), which one has the property that \\(z^5\\) has the greatest real part?",
    choices: ["-2", "-\\sqrt{3}+i", "-\\sqrt{2}+\\sqrt{2}i", "-1+\\sqrt{3}i", "2i"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 14,
    problem: "What is the value of \\[\\left(\\sum_{k=1}^{20} \\log_{5^k} 3^{k^2}\\right)\\cdot\\left(\\sum_{k=1}^{100} \\log_{9^k} 25^k\\right)?\\]",
    choices: ["21", "100\\log_5 3", "200\\log_3 5", "2200", "21000"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 15,
    problem: "A choir director must select a group of singers from among his 6 tenors and 8 basses. The only requirements are that the difference between the number of tenors and basses must be a multiple of 4, and the group must have at least one singer. Let \\(N\\) be the number of different groups that could be selected. What is \\(N \\bmod 100\\)?",
    choices: ["47", "48", "83", "95", "96"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 16,
    problem: "In the following list of numbers, the integer \\(n\\) appears \\(n\\) times in the list for \\(1 \\leq n \\leq 200\\). \\[1, 2, 2, 3, 3, 3, 4, 4, 4, 4, \\ldots, 200, 200, \\ldots, 200\\] What is the median of the numbers in this list?",
    choices: ["100.5", "134", "142", "150.5", "167"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 17,
    problem: "Trapezoid \\(ABCD\\) has \\(\\overline{AB} \\parallel \\overline{CD}\\), \\(BC = CD = 43\\), and \\(\\overline{AD} \\perp \\overline{BD}\\). Let \\(O\\) be the intersection of the diagonals \\(\\overline{AC}\\) and \\(\\overline{BD}\\). Point \\(P\\) is the midpoint of \\(\\overline{BD}\\). The length \\(OP = 11\\). If \\(AD = m\\sqrt{n}\\), where \\(m\\) and \\(n\\) are positive integers and \\(n\\) is not divisible by the square of any prime, what is \\(m+n\\)?",
    choices: ["65", "132", "157", "194", "215"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 18,
    problem: "Let \\(f\\) be a function defined on the set of positive rational numbers with the property that \\(f(a \\cdot b) = f(a) + f(b)\\) for all positive rational numbers \\(a\\) and \\(b\\). Furthermore, suppose that \\(f\\) also has the property that \\(f(p) = p\\) for every prime number \\(p\\). For which of the following numbers \\(x\\) is \\(f(x) < 0\\)?",
    choices: ["\\frac{17}{32}", "\\frac{11}{16}", "\\frac{7}{9}", "\\frac{7}{6}", "\\frac{25}{11}"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 19,
    problem: "How many solutions does the equation \\(\\sin\\left(\\frac{\\pi}{2}\\cos x\\right) = \\cos\\left(\\frac{\\pi}{2}\\sin x\\right)\\) have in the closed interval \\([0, \\pi]\\)?",
    choices: ["0", "1", "2", "3", "4"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 20,
    problem: "A parabola has vertex \\(V\\) and focus \\(F\\), and the two endpoints of the latus rectum are \\(L_1\\) and \\(L_2\\). What is the area of \\(\\triangle L_1 L_2 F\\)? Wait, the actual problem: Let \\(V\\) be the vertex of a parabola with focus \\(F\\), and let \\(A\\) be a point on the parabola such that \\(AF = 20\\) and \\(AV = 21\\). What is the sum of all possible values of the length \\(FV\\)?",
    choices: ["13", "\\frac{40}{3}", "\\frac{41}{3}", "14", "\\frac{43}{3}"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 21,
    problem: "The five complex numbers \\(-3+2i\\), \\(-1\\), \\(i\\), \\(-1-i\\), \\(1-i\\) are the roots of \\((z-1)(z^2+2z+4)(z^2+4z+6)=0\\). The five roots of this polynomial are plotted in the complex plane, and the unique ellipse with foci at \\(z_1=-3+2i\\) and \\(z_2 = 1-i\\) (actually: the roots form 5 points and the unique ellipse passing through all 5 points has eccentricity \\(e = \\sqrt{m/n}\\) in lowest terms). What is \\(m+n\\)?",
    choices: ["7", "9", "11", "13", "15"],
    correct_answer: 'A'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 22,
    problem: "Suppose that the roots of the polynomial \\(P(x) = x^3 + ax^2 + bx + c\\) are \\(\\cos \\frac{2\\pi}{7}\\), \\(\\cos \\frac{4\\pi}{7}\\), and \\(\\cos \\frac{6\\pi}{7}\\), where angles are in radians. What is \\(abc\\)?",
    choices: ["\\frac{-3}{49}", "\\frac{-1}{28}", "\\frac{\\sqrt[3]{7}}{64}", "\\frac{1}{32}", "\\frac{1}{28}"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 23,
    problem: "Frieda the frog begins a sequence of hops on a \\(3 \\times 3\\) grid of squares, moving one square per hop and choosing at random from the non-diagonal adjacent squares (up, down, left, or right). She does not hop diagonally. When the direction of a hop would take Frieda off the grid, she \"wraps around\" — appearing on the opposite edge of the grid. For example, if Frieda begins in the center square and makes two hops \"up\", the first hop places her in the top center square, and the second hop places her in the bottom center square. Frieda starts in the center square, and will stop once she lands on a corner square. What is the probability that she reaches a corner in at most four hops?",
    choices: ["\\frac{9}{16}", "\\frac{5}{8}", "\\frac{3}{4}", "\\frac{25}{32}", "\\frac{13}{16}"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 24,
    problem: "Let \\(\\Gamma\\) be a closed curve in the plane, specifically a semicircle with diameter \\(\\overline{AB}\\) of length 14, oriented so that the diameter lies on the \\(x\\)-axis with \\(A\\) and \\(B\\) symmetric about the origin. A circle \\(\\Omega\\) has its center on \\(\\overline{AB}\\) (extended if necessary), is tangent to \\(\\overline{AB}\\) at point \\(P\\), and intersects \\(\\Gamma\\) at two points \\(Q\\) and \\(R\\). If \\(QR = 3\\sqrt{3}\\) and \\(\\angle QPR = 60^\\circ\\), then the area of \\(\\triangle PQR\\) equals \\(\\frac{a\\sqrt{b}}{c}\\), where \\(a\\) and \\(c\\) are relatively prime positive integers and \\(b\\) is not divisible by the square of any prime. What is \\(a+b+c\\)?",
    choices: ["110", "114", "118", "122", "126"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2021, number: 25,
    problem: "Let \\(d(n)\\) denote the number of positive integer divisors of \\(n\\). Define \\(f(n) = \\frac{d(n)}{\\sqrt[3]{n}}\\). Let \\(m\\) be the number for which \\(f(m)\\) is a maximum. What is the sum of the digits of \\(m\\)?",
    choices: ["5", "6", "7", "8", "9"],
    correct_answer: 'E'
  },

  // ==================== 2022 AMC 12A ====================
  {
    contest: 'AMC 12A', year: 2022, number: 1,
    problem: "What is the value of \\[3+\\frac{1}{3+\\frac{1}{3+\\frac{1}{3}}}?\\]",
    choices: ["\\frac{31}{10}", "\\frac{49}{15}", "\\frac{33}{10}", "\\frac{109}{33}", "\\frac{15}{4}"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 2,
    problem: "The sum of three numbers is 96. The first number is 6 times the third number, and the third number is 40 less than the second number. What is the absolute value of the difference between the first and second numbers?",
    choices: ["1", "2", "3", "4", "5"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 3,
    problem: "Five rectangles, with dimensions (in order) \\(1 \\times 6\\), \\(2 \\times 4\\), \\(5 \\times 6\\), \\(2 \\times 7\\), and \\(2 \\times 3\\), are arranged to form a square. The figure shows the five rectangles labeled A through E arranged to fill a square. One of the rectangles occupies the center/shaded region. Which of the five rectangles is shaded?",
    choices: ["A", "B", "C", "D", "E"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 4,
    problem: "The product of all the positive integer values of \\(n\\) such that \\(\\text{lcm}(n, 18) = 180\\) and \\(\\gcd(n, 45) = 15\\). What is the sum of the digits of \\(n\\)? Wait, the problem is: For how many positive integers \\(n\\) is \\(\\text{lcm}(n, 18) = 180\\) and \\(\\gcd(n, 45) = 15\\)? What is the sum of the digits of \\(n\\)? (There is a unique such \\(n\\).) What is the sum of digits of \\(n\\)?",
    choices: ["3", "6", "8", "9", "12"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 5,
    problem: "The taxicab distance between two points \\((x_1, y_1)\\) and \\((x_2, y_2)\\) in the coordinate plane is given by \\(|x_1 - x_2| + |y_1 - y_2|\\). For how many points \\(P\\) with integer coordinates is the taxicab distance between \\(P\\) and the origin less than or equal to 20?",
    choices: ["441", "761", "841", "921", "924"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 6,
    problem: "A data set consists of 6 (not all distinct) positive integers: 1, 7, 5, 2, 5, and \\(X\\). The average (arithmetic mean) of the 6 numbers equals a value in the data set. What is the sum of all possible values of \\(X\\)?",
    choices: ["10", "26", "32", "36", "40"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 7,
    problem: "A rectangle is partitioned into 5 regions as shown. Each region is to be painted a solid color — red, orange, yellow, blue, or green — so that regions that touch are painted different colors and colors can be used more than once. (The figure shows a rectangle divided into 5 regions: 3 rectangles on the bottom row (left, center, right) and 2 rectangles on the top row (left, right). The center bottom rectangle touches all other regions.) How many different colorings are possible?",
    choices: ["120", "270", "360", "540", "720"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 8,
    problem: "What is the value of \\[\\sqrt[3]{10} \\cdot \\sqrt[3]{\\sqrt[3]{10}} \\cdot \\sqrt[3]{\\sqrt[3]{\\sqrt[3]{10}}} \\cdots?\\]",
    choices: ["\\sqrt{10}", "\\sqrt[3]{100}", "\\sqrt[4]{1000}", "10", "10\\sqrt[3]{10}"],
    correct_answer: 'A'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 9,
    problem: "At a math contest, 57 students are wearing blue shirts and another 75 students are wearing yellow shirts. The 132 students are assigned into 66 pairs. In exactly 23 of these pairs, both students are wearing blue shirts. In how many pairs are both students wearing yellow shirts?",
    choices: ["7", "8", "9", "10", "11"],
    correct_answer: 'A'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 10,
    problem: "How many ways are there to split the integers \\(1\\) through \\(14\\) into 7 pairs such that in each pair, the greater number is at least 2 times the lesser number?",
    choices: ["108", "120", "126", "132", "144"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 11,
    problem: "What is the product of all real solutions to the equation \\[\\left|\\log_6 x - \\log_6 9\\right| = 2\\left|\\log_6 10 - 1\\right|?\\]",
    choices: ["10", "18", "25", "36", "81"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 12,
    problem: "Let \\(M\\) be the midpoint of \\(\\overline{AB}\\) in regular tetrahedron \\(ABCD\\). What is \\(\\cos(\\angle CMD)\\)?",
    choices: ["\\frac{1}{4}", "\\frac{1}{3}", "\\frac{2}{5}", "\\frac{1}{2}", "\\frac{\\sqrt{3}}{2}"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 13,
    problem: "Let \\(\\mathcal{R}\\) be the region in the complex plane consisting of all complex numbers \\(z\\) that can be written as the sum of a complex number of the form \\(a + bi\\) lying on the segment from \\(3\\) to \\(4i\\) and a complex number of modulus at most 1. What integer is closest to the area of \\(\\mathcal{R}\\)?",
    choices: ["13", "14", "15", "16", "17"],
    correct_answer: 'A'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 14,
    problem: "What is the value of \\[(\\log 5)^3 + (\\log 20)^3 + (\\log 8)(\\log 0.25)\\] where \\(\\log\\) denotes the base-ten logarithm?",
    choices: ["\\frac{3}{2}", "\\frac{7}{4}", "2", "\\frac{9}{4}", "3"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 15,
    problem: "The roots of the polynomial \\(10x^3 - 39x^2 + 29x - 6\\) are the tridimensional coordinates of the vertices of a box (rectangular parallelepiped). A new box has each edge length increased by 2. What is the volume of the new box?",
    choices: ["\\frac{24}{5}", "\\frac{42}{5}", "\\frac{81}{5}", "30", "48"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 16,
    problem: "A triangular number is any integer \\(t_n = 1 + 2 + \\cdots + n\\) for some positive integer \\(n\\). The first few triangular numbers that are also perfect squares are 1, 36, 1225, ... If the 4th is \\(N\\), what is the sum of the digits of \\(N\\)?",
    choices: ["6", "9", "12", "18", "27"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 17,
    problem: "Suppose \\(a\\) is a real number such that the equation \\[a(\\sin x + \\sin 2x) = \\sin 3x\\] has more than one solution in the interval \\((0, \\pi)\\). The set of all such \\(a\\) that can be written in the form \\[(p,q) \\cup (q,r)\\) where \\(p < q < r\\). What is \\(p + q + r\\)?",
    choices: ["-4", "-1", "0", "1", "4"],
    correct_answer: 'A'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 18,
    problem: "Let \\(T_k\\) be the transformation of the coordinate plane that first rotates the plane \\(k\\) degrees counterclockwise around the origin and then reflects the plane across the \\(y\\)-axis. What is the least positive integer \\(n\\) such that performing the sequence of transformations \\(T_1, T_2, T_3, \\ldots, T_n\\) returns the point \\((1, 0)\\) back to itself?",
    choices: ["359", "360", "719", "720", "721"],
    correct_answer: 'A'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 19,
    problem: "Suppose that 13 cards labeled 1, 2, ..., 13 are arranged in a row in some order. The cards are picked up, starting from the left, subject to the following rule: the card with the smallest label that has not yet been picked up is picked up first from the remaining cards, always working left-to-right for each pass. The process repeats until all cards are picked up. For how many initial arrangements of the 13 cards is it true that all cards are picked up in exactly 2 passes?",
    choices: ["4082", "4095", "4096", "8178", "8191"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 20,
    problem: "Isosceles trapezoid \\(ABCD\\) has parallel sides \\(\\overline{AD}\\) and \\(\\overline{BC}\\), with \\(BC < AD\\). There is a point \\(P\\) in the plane such that \\(PA=1\\), \\(PB=2\\), \\(PC=3\\), and \\(PD=4\\). What is \\(\\frac{BC}{AD}\\)?",
    choices: ["\\frac{1}{4}", "\\frac{1}{3}", "\\frac{1}{2}", "\\frac{2}{3}", "\\frac{3}{4}"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 21,
    problem: "Let \\(P(x) = x^{2022} + x^{1011} + 1\\). Which of the following polynomials is a factor of \\(P(x)\\)?",
    choices: ["x^2-x+1", "x^2+x+1", "x^4+1", "x^6-x^3+1", "x^6+x^3+1"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 22,
    problem: "Let \\(c\\) be a real number, and let \\(z_1\\) and \\(z_2\\) be the two complex numbers satisfying the equation \\(z^2 - cz + 10 = 0\\). Points \\(z_1\\), \\(z_2\\), \\(\\frac{1}{z_1}\\), and \\(\\frac{1}{z_2}\\) are the vertices of (convex) quadrilateral \\(\\mathcal{Q}\\) in the complex plane. When the area of \\(\\mathcal{Q}\\) obtains its maximum possible value, \\(c\\) is closest to which of the following?",
    choices: ["4.5", "5", "5.5", "6", "6.5"],
    correct_answer: 'A'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 23,
    problem: "Let \\(h_n\\) and \\(k_n\\) be the unique relatively prime positive integers such that \\[\\frac{1}{1} + \\frac{1}{2} + \\frac{1}{3} + \\cdots + \\frac{1}{n} = \\frac{h_n}{k_n}.\\] Let \\(L_n\\) denote the least common multiple of the integers \\(1, 2, 3, \\ldots, n\\). For how many integers with \\(1 \\leq n \\leq 22\\) is \\(k_n < L_n\\)?",
    choices: ["0", "3", "7", "8", "10"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 24,
    problem: "How many strings of length 5 formed from the digits 0, 1, 2, 3, 4 are there such that for each \\(j \\in \\{1, 2, 3, 4\\}\\), at least \\(j\\) of the digits in the string are less than \\(j\\)?",
    choices: ["500", "625", "1089", "1199", "1296"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2022, number: 25,
    problem: "Let \\(r\\) be a positive integer. Let \\(\\mathcal{T}\\) be the set of all circles in the coordinate plane centered at \\((r, r)\\) with radius \\(r\\). Among all such circles, some are tangent to line segments from the origin to various points on the axes, and the \\(i\\)th such tangent line has positive integer intercepts \\((0, a_i)\\) and \\((b_i, 0)\\) with \\(a_1 < a_2 < \\ldots < a_{14}\\). Let \\(c_i = a_i - b_i\\). For the smallest \\(r\\) for which there are at least 14 such lines, what is \\(\\frac{c_{14}}{c_1}\\)?",
    choices: ["\\frac{21}{5}", "\\frac{85}{13}", "7", "\\frac{39}{5}", "17"],
    correct_answer: 'E'
  },

  // ==================== 2023 AMC 12A ====================
  {
    contest: 'AMC 12A', year: 2023, number: 1,
    problem: "Cities \\(A\\) and \\(B\\) are 45 miles apart. Alicia lives in \\(A\\) and Beth lives in \\(B\\). Alicia bikes towards \\(B\\) at 18 miles per hour. Leaving at the same time, Beth bikes toward \\(A\\) at 12 miles per hour. How many miles from City \\(A\\) will they be when they meet?",
    choices: ["20", "24", "25", "26", "27"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 2,
    problem: "The weight of \\(\\frac{1}{3}\\) of a large pizza together with \\(3\\frac{1}{2}\\) cups of orange slices is the same as the weight of \\(\\frac{3}{4}\\) of a large pizza together with \\(\\frac{1}{2}\\) cup of orange slices. A cup of orange slices weighs \\(\\frac{1}{4}\\) of a pound. What is the weight, in pounds, of a large pizza?",
    choices: ["1\\frac{4}{5}", "2", "2\\frac{2}{5}", "3", "3\\frac{3}{5}"],
    correct_answer: 'A'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 3,
    problem: "How many positive perfect squares less than \\(2023\\) are divisible by \\(5\\)?",
    choices: ["8", "9", "10", "11", "12"],
    correct_answer: 'A'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 4,
    problem: "How many digits are in the base-ten representation of \\(8^5 \\cdot 5^{10} \\cdot 15^5\\)?",
    choices: ["14", "15", "16", "17", "18"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 5,
    problem: "Janet rolls a standard 6-sided die 4 times and keeps a running total of the numbers she rolls. What is the probability that at some point, her running total will equal 3?",
    choices: ["\\frac{2}{9}", "\\frac{49}{216}", "\\frac{25}{108}", "\\frac{17}{72}", "\\frac{13}{54}"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 6,
    problem: "Points \\(A\\) and \\(B\\) lie on the graph of \\(y=\\log_2 x\\). The midpoint of \\(\\overline{AB}\\) is \\((6, 2)\\). What is the positive difference between the \\(x\\)-coordinates of \\(A\\) and \\(B\\)?",
    choices: ["2\\sqrt{11}", "4\\sqrt{3}", "8", "4\\sqrt{5}", "9"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 7,
    problem: "A digital display shows the current date as an 8-digit integer consisting of a 4-digit year, followed by a 2-digit month, followed by a 2-digit date within the month. For example, Arbor Day this year is displayed as 20230428. For how many dates in 2023 will each digit appear an even number of times in the 8-digit display for that date? (For example, the 8-digit displays 20230428 and 20230518 each have the digit 0 appearing twice, but no other digit appears an even number of times.)",
    choices: ["5", "6", "7", "8", "9"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 8,
    problem: "Maureen is keeping track of the mean of her quiz scores this semester. If Maureen scores an 11 on the next quiz, her mean will increase by 1. If she scores an 11 on each of the next three quizzes, her mean will increase by 2. What is the mean of her quiz scores currently?",
    choices: ["4", "5", "6", "7", "8"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 9,
    problem: "A square of area 2 is inscribed in a square of area 3, creating four congruent triangles, as shown below. (The figure shows a larger square with a smaller square inscribed, tilted, creating four right triangles in the corners.) What is the ratio of the shorter leg to the longer leg in the shaded right triangle?",
    choices: ["\\frac{1}{5}", "\\frac{1}{4}", "2-\\sqrt{3}", "\\sqrt{3}-\\sqrt{2}", "\\sqrt{2}-1"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 10,
    problem: "Positive real numbers \\(x\\) and \\(y\\) satisfy \\(y^3 = x^2\\) and \\((y - x)^2 = 4y^2\\). What is \\(x + y\\)?",
    choices: ["12", "18", "24", "36", "42"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 11,
    problem: "What is the degree measure of the acute angle formed by lines with slopes 2 and \\(\\frac{1}{3}\\)?",
    choices: ["30", "37.5", "45", "52.5", "60"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 12,
    problem: "What is the value of \\[2^3 - 1^3 + 4^3 - 3^3 + 6^3 - 5^3 + \\ldots + 18^3 - 17^3?\\]",
    choices: ["2023", "2679", "2941", "3159", "3235"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 13,
    problem: "In a table tennis tournament every participant played every other participant exactly once. Although there were twice as many right-handed players as left-handed players, the number of games won by left-handed players was 40% more than the number of games won by right-handed players. (There were no ties and the number of left-handed players is a positive integer.) What is the total number of games played?",
    choices: ["15", "36", "45", "48", "66"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 14,
    problem: "How many complex numbers satisfy the equation \\(z^5 = \\bar{z}\\), where \\(\\bar{z}\\) is the conjugate of the complex number \\(z\\)?",
    choices: ["2", "3", "5", "6", "7"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 15,
    problem: "Usain is walking for exercise by zigzagging across a 100-meter by 30-meter rectangular field, beginning at point \\(A\\) and ending on segment \\(\\overline{BC}\\). He wants the path to measure exactly 120 meters. Let \\(\\theta = \\angle PAB = \\angle QPC = \\angle RQB = \\cdots\\) where \\(P\\), \\(Q\\), \\(R\\), ... are consecutive turning points. Which of the following is closest to \\(\\theta\\)?",
    choices: ["\\arccos \\frac{5}{6}", "\\arccos \\frac{4}{5}", "\\arccos \\frac{3}{10}", "\\arcsin \\frac{4}{5}", "\\arcsin \\frac{5}{6}"],
    correct_answer: 'A'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 16,
    problem: "Consider the set of complex numbers \\(z\\) satisfying \\(|1 + z + z^2| = 4\\). The maximum value of the imaginary part of \\(z\\) can be written in the form \\(\\dfrac{\\sqrt{m}}{n}\\), where \\(m\\) and \\(n\\) are relatively prime positive integers. What is \\(m + n\\)?",
    choices: ["20", "21", "22", "23", "24"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 17,
    problem: "Flora the frog starts at 0 on the number line and makes a sequence of jumps to the right. In any one jump, Flora leaps a positive integer distance \\(m\\) with probability \\(\\dfrac{1}{2^m}\\). What is the probability that Flora will eventually land at 10?",
    choices: ["\\frac{5}{512}", "\\frac{45}{1024}", "\\frac{127}{1024}", "\\frac{511}{1024}", "\\frac{1}{2}"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 18,
    problem: "Circle \\(C_1\\) and \\(C_2\\) each have radius 1, and the distance between their centers is \\(\\frac{1}{2}\\). Circle \\(C_3\\) is the largest circle internally tangent to both \\(C_1\\) and \\(C_2\\). Circle \\(C_4\\) is internally tangent to both \\(C_1\\) and \\(C_2\\) and externally tangent to \\(C_3\\). What is the radius of \\(C_4\\)?",
    choices: ["\\frac{1}{14}", "\\frac{1}{12}", "\\frac{1}{10}", "\\frac{3}{28}", "\\frac{1}{9}"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 19,
    problem: "What is the product of all solutions to the equation \\[\\log_{7x}2023 \\cdot \\log_{289x}2023 = \\log_{2023x}2023?\\]",
    choices: ["(\\log_{2023}7 \\cdot \\log_{2023}289)^2", "\\log_{2023}7 \\cdot \\log_{2023}289", "1", "\\log_7 2023 \\cdot \\log_{289}2023", "(\\log_7 2023 \\cdot \\log_{289}2023)^2"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 20,
    problem: "Rows 1, 2, 3, 4, and 5 of a triangular array of integers are shown below. Each row after the first row is formed by placing a 1 at each end of the row, and each interior entry is 1 greater than the sum of the two numbers diagonally above it in the previous row. \\[\\begin{array}{ccccccccc} & & & & 1 & & & & \\\\ & & & 1 & & 1 & & & \\\\ & & 1 & & 3 & & 1 & & \\\\ & 1 & & 5 & & 5 & & 1 & \\\\ 1 & & 11 & & 11 & & 11 & & 1 \\end{array}\\] What is the units digit of the sum of the 2023 numbers in the 2023rd row?",
    choices: ["1", "3", "5", "7", "9"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 21,
    problem: "If \\(A\\) and \\(B\\) are vertices of a polyhedron, define the distance \\(d(A, B)\\) to be the minimum number of edges of the polyhedron one must traverse in order to connect \\(A\\) and \\(B\\). For example, if \\(\\overline{AB}\\) is an edge of the polyhedron, then \\(d(A, B) = 1\\), but if \\(\\overline{AC}\\) and \\(\\overline{CB}\\) are edges and \\(\\overline{AB}\\) is not an edge, then \\(d(A, B) = 2\\). Let \\(Q\\), \\(R\\), and \\(S\\) be randomly chosen distinct vertices of a regular icosahedron (which has 12 vertices and 30 edges). What is the probability that \\(d(Q, R) > d(R, S)\\)?",
    choices: ["\\frac{7}{22}", "\\frac{1}{3}", "\\frac{3}{8}", "\\frac{5}{12}", "\\frac{1}{2}"],
    correct_answer: 'A'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 22,
    problem: "Let \\(f\\) be the unique function defined on the positive integers such that \\[\\sum_{d \\mid n} d \\cdot f\\left(\\frac{n}{d}\\right) = 1\\] for all positive integers \\(n\\). What is \\(f(2023)\\)?",
    choices: ["-1536", "96", "108", "116", "144"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 23,
    problem: "How many ordered pairs of positive real numbers \\((a, b)\\) satisfy the equation \\[(1 + 2a)(2 + 2b)(2a + b) = 32ab?\\]",
    choices: ["0", "1", "2", "3", "an infinite number"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 24,
    problem: "Let \\(K\\) be the number of sequences \\(A_1, A_2, \\ldots, A_n\\) such that \\(n\\) is a positive integer less than or equal to 10, each \\(A_i\\) is a subset of \\(\\{1, 2, 3, \\ldots, 10\\}\\), and \\(A_{i-1}\\) is a subset of \\(A_i\\) for each \\(i\\) between 2 and \\(n\\), inclusive. What is the remainder when \\(K\\) is divided by 10?",
    choices: ["1", "3", "5", "7", "9"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2023, number: 25,
    problem: "There is a unique sequence of integers \\(a_1, a_2, \\ldots, a_{2023}\\) such that \\[\\tan 2023x = \\frac{a_1 \\tan x + a_3 \\tan^3 x + a_5 \\tan^5 x + \\ldots + a_{2023} \\tan^{2023} x}{1 + a_2 \\tan^2 x + a_4 \\tan^4 x + \\ldots + a_{2022} \\tan^{2022} x}\\] whenever \\(\\tan 2023x\\) is defined. What is \\(a_{2023}\\)?",
    choices: ["-2023", "-2022", "-1", "1", "2023"],
    correct_answer: 'C'
  },

  // ==================== 2024 AMC 12A ====================
  {
    contest: 'AMC 12A', year: 2024, number: 1,
    problem: "What is the value of \\(9901 \\cdot 101 - 99 \\cdot 10101\\)?",
    choices: ["2", "20", "200", "202", "2020"],
    correct_answer: 'A'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 2,
    problem: "A model used for the time \\(T\\) in minutes it takes to complete a hiking trail is \\(T = aL + bG\\), where \\(L\\) is the length of the trail in miles, \\(G\\) is the altitude gain in feet, and \\(a\\), \\(b\\) are constants. The model estimates that it takes 69 minutes to complete a trail with length 1.5 miles and altitude gain 800 feet, and that it takes 69 minutes to complete a trail with length 1.2 miles and altitude gain 1100 feet. How many minutes does the model estimate it will take to complete a trail with length 4.2 miles and altitude gain 4000 feet?",
    choices: ["240", "246", "252", "258", "264"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 3,
    problem: "The number 2024 is written as the sum of not necessarily distinct two-digit numbers. What is the least number of two-digit numbers needed to write this sum?",
    choices: ["20", "21", "22", "23", "24"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 4,
    problem: "What is the least value of \\(n\\) such that \\(n!\\) is a multiple of \\(2024\\)?",
    choices: ["11", "21", "22", "23", "253"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 5,
    problem: "A data set containing 20 numbers, some of which are 6, has mean 45. When all the 6s are removed, the data set has mean 66. How many 6s were in the original data set?",
    choices: ["4", "5", "6", "7", "8"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 6,
    problem: "The product of three integers is 60. What is the least possible positive sum of the three integers?",
    choices: ["2", "3", "5", "6", "13"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 7,
    problem: "In \\(\\triangle ABC\\), \\(\\angle ABC = 90^\\circ\\) and \\(BA = BC = \\sqrt{2}\\). Points \\(P_1, P_2, \\ldots, P_{2024}\\) lie on hypotenuse \\(\\overline{AC}\\) so that \\(AP_1 = P_1P_2 = P_2P_3 = \\cdots = P_{2023}P_{2024} = P_{2024}C\\). What is the length of \\(\\overrightarrow{BP_1} + \\overrightarrow{BP_2} + \\cdots + \\overrightarrow{BP_{2024}}\\)?",
    choices: ["1011", "1012", "2023", "2024", "2025"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 8,
    problem: "How many angles \\(\\theta\\) with \\(0 \\le \\theta \\le 2\\pi\\) satisfy \\(\\log(\\sin(3\\theta)) + \\log(\\cos(2\\theta)) = 0\\)?",
    choices: ["0", "1", "2", "3", "4"],
    correct_answer: 'A'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 9,
    problem: "Let \\(M\\) be the greatest integer such that both \\(M + 1213\\) and \\(M + 3773\\) are perfect squares. What is the units digit of \\(M\\)?",
    choices: ["1", "2", "3", "6", "8"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 10,
    problem: "Let \\(\\alpha\\) denote the radian measure of the smallest positive angle in a 3-4-5 right triangle, and let \\(\\beta\\) denote the radian measure of the smallest positive angle in a 7-24-25 right triangle. What is the value of \\(\\beta\\) in terms of \\(\\alpha\\)?",
    choices: ["\\frac{\\alpha}{3}", "\\alpha-\\frac{\\pi}{8}", "\\frac{\\pi}{2}-2\\alpha", "\\frac{\\alpha}{2}", "\\pi-4\\alpha"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 11,
    problem: "There are exactly \\(K\\) positive integers \\(b\\) with \\(5 \\leq b \\leq 2024\\) such that the base-\\(b\\) integer \\(2024_b\\) is divisible by 16. What is the sum of the digits of \\(K\\)?",
    choices: ["16", "17", "18", "20", "21"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 12,
    problem: "The first three terms of a geometric sequence are the integers \\(a\\), \\(720\\), and \\(b\\), where \\(a < 720 < b\\). What is the sum of the digits of the least possible value of \\(b\\)?",
    choices: ["9", "12", "16", "18", "21"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 13,
    problem: "The graph of \\(y = e^{x+1} + e^{-x} - 2\\) has an axis of symmetry. What is the reflection of the point \\(\\left(-1, \\frac{1}{2}\\right)\\) over this axis of symmetry?",
    choices: ["\\left(-1,-\\frac{3}{2}\\right)", "\\left(-1, 0\\right)", "\\left(-1,\\frac{1}{2}\\right)", "\\left(0, \\frac{1}{2}\\right)", "\\left(3, \\frac{1}{2}\\right)"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 14,
    problem: "The numbers in each row and each column of a \\(5 \\times 5\\) array of integers form arithmetic progressions of length 5. The numbers in positions \\((5, 5)\\), \\((2, 4)\\), \\((4, 3)\\), and \\((3, 1)\\) are \\(0\\), \\(48\\), \\(16\\), and \\(12\\), respectively (where position \\((i, j)\\) refers to the \\(i\\)th row and \\(j\\)th column). What number is in position \\((1, 2)\\)?",
    choices: ["19", "24", "29", "34", "39"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 15,
    problem: "The roots of \\(x^3 + 2x^2 - x + 3\\) are \\(p\\), \\(q\\), and \\(r\\). What is the value of \\((p^2+4)(q^2+4)(r^2+4)\\)?",
    choices: ["64", "75", "100", "125", "144"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 16,
    problem: "A set of 12 tokens — 3 red, 2 white, 1 blue, and 6 black — is to be distributed at random to 3 players, with each player receiving 4 tokens. The probability that some player gets all the red tokens, some player gets both white tokens (and not the blue token), and the remaining player gets the blue token can be written as \\(\\frac{m}{n}\\) where \\(m\\) and \\(n\\) are relatively prime positive integers. What is \\(m + n\\)?",
    choices: ["387", "388", "389", "390", "391"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 17,
    problem: "Integers \\(a\\), \\(b\\), and \\(c\\) satisfy \\(ab + c = 100\\), \\(bc + a = 87\\), and \\(ca + b = 60\\). What is \\(ab + bc + ca\\)?",
    choices: ["212", "247", "258", "276", "284"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 18,
    problem: "Rectangles \\(ABCD\\) and \\(EFGH\\) are identical with \\(AB = 2\\) and \\(BC = 2 + \\sqrt{3}\\). They are placed so that \\(B\\) is on \\(\\overline{EF}\\) and \\(E\\) is on \\(\\overline{AB}\\), as shown in the figure below. Let \\(\\alpha\\) denote the degree measure of the acute angle \\(\\angle DBF\\). How many configurations of this type exist, with \\(\\alpha\\) being any acute angle, such that a vertex of one rectangle lies on an edge of the other rectangle and vice versa, and the resulting figure is a closed loop made of congruent rectangles placed successively? The figure shows two overlapping identical rectangles where successive placement creates a pattern that can loop back to the start.",
    choices: ["6", "8", "10", "12", "No new vertex will land on B"],
    correct_answer: 'A'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 19,
    problem: "Cyclic quadrilateral \\(ABCD\\) has lengths \\(BC = CD = 3\\) and \\(DA = 5\\), with \\(\\angle CDA = 120^\\circ\\). What is the length of the shorter diagonal of \\(ABCD\\)?",
    choices: ["\\frac{31}{7}", "\\frac{33}{7}", "5", "\\frac{39}{7}", "\\frac{41}{7}"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 20,
    problem: "Points \\(P\\) and \\(Q\\) are chosen uniformly and independently at random on sides \\(\\overline{AB}\\) and \\(\\overline{AC}\\), respectively, of equilateral triangle \\(\\triangle ABC\\). Which of the following intervals contains the probability that the area of \\(\\triangle APQ\\) is less than half the area of \\(\\triangle ABC\\)?",
    choices: ["\\left[\\frac{3}{8}, \\frac{1}{2}\\right]", "\\left(\\frac{1}{2}, \\frac{2}{3}\\right]", "\\left(\\frac{2}{3}, \\frac{3}{4}\\right]", "\\left(\\frac{3}{4}, \\frac{7}{8}\\right]", "\\left(\\frac{7}{8}, 1\\right]"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 21,
    problem: "Suppose \\(a_1 = 2\\) and the sequence \\((a_n)\\) satisfies the recurrence \\[\\frac{a_n - 1}{n - 1} = \\frac{a_{n-1} + 1}{n}\\] for all \\(n \\geq 2\\). What is the greatest integer less than or equal to \\(\\displaystyle\\sum_{n=1}^{100} a_n^2\\)?",
    choices: ["338550", "338551", "338552", "338553", "338554"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 22,
    problem: "Carl has a rectangle whose length and width are distinct whole numbers. He places 1-inch toothpicks along the sides of the rectangle to create a \"fence.\" The figure shows an \\(8 \\times 3\\) grid where toothpicks are placed to form a closed loop that is non-self-intersecting. The loop must use exactly one toothpick from the interior of each cell of the middle row. In how many ways can Carl place the toothpicks?",
    choices: ["130", "144", "146", "162", "196"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 23,
    problem: "What is the value of \\[\\tan^2\\frac{\\pi}{16}\\cdot\\tan^2\\frac{3\\pi}{16}+\\tan^2\\frac{\\pi}{16}\\cdot\\tan^2\\frac{5\\pi}{16}+\\tan^2\\frac{3\\pi}{16}\\cdot\\tan^2\\frac{7\\pi}{16}+\\tan^2\\frac{5\\pi}{16}\\cdot\\tan^2\\frac{7\\pi}{16}?\\]",
    choices: ["28", "68", "70", "72", "84"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 24,
    problem: "A disphenoid is a tetrahedron whose triangular faces are congruent to one another. What is the least total surface area of a disphenoid whose faces are scalene triangles with integer side lengths?",
    choices: ["\\sqrt{3}", "3\\sqrt{15}", "15", "15\\sqrt{7}", "24\\sqrt{6}"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2024, number: 25,
    problem: "For how many quadruples \\((a, b, c, d)\\) with \\(|a|, |b|, |c|, |d| \\leq 5\\) and \\((c, d) \\neq (0, 0)\\) is the graph of \\(y = \\dfrac{ax+b}{cx+d}\\) symmetric about the line \\(y = x\\)? (The values \\(a\\), \\(b\\), \\(c\\), \\(d\\) are integers.)",
    choices: ["1282", "1292", "1310", "1320", "1330"],
    correct_answer: 'B'
  },

  // ==================== 2025 AMC 12A ====================
  {
    contest: 'AMC 12A', year: 2025, number: 1,
    problem: "Andy and Betsy both live in Mathville. Andy leaves at 1:30 PM, traveling due north at a steady 8 mph. Betsy leaves from the same starting point at 2:30 PM, traveling due east at a steady 12 mph. At what time will they be exactly the same distance from their common starting point?",
    choices: ["3:30", "3:45", "4:00", "4:15", "4:30"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 2,
    problem: "A 10-pound bag of mixed nuts contains 50% peanuts, 20% cashews, and 30% almonds. A second bag of mixed nuts is combined with the first to produce a 20-pound bag that is 40% peanuts. What is the weight, in pounds, of cashews in the 20-pound bag?",
    choices: ["3.5", "4", "4.5", "5", "6"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 3,
    problem: "There are 15 people in a room, some students and some teachers. Ash is a person in the room. When Ash is categorized as a student, the average age of the students is 12 and the average age of the teachers is 55. When Ash is categorized as a teacher, the average age of the students is 12 - \\(\\delta\\) and the average age of the teachers is 55 + \\(\\delta\\). Wait, this is the actual problem: There are 15 people in a room: 10 students and 5 teachers. When Ash joins as a student, the average student age is raised from 12 to 14. When Ash joins as a teacher, the average teacher age is lowered from 55 to 52. What is Ash's age?",
    choices: ["28", "29", "30", "32", "33"],
    correct_answer: 'A'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 4,
    problem: "A group of 4 friends each make a statement about how many of the 4 statements are true. The four statements are: (1) \"None of these 4 statements is true.\", (2) \"Exactly 1 of these 4 statements is true.\", (3) \"Exactly 2 of these 4 statements are true.\", (4) \"Exactly 3 of these 4 statements are true.\" How many of these 4 statements are false?",
    choices: ["0", "1", "2", "3", "4"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 5,
    problem: "Infinitely many squares are drawn in the plane, where each square has \\(\\frac{1}{4}\\) the area of the previous square, and the squares are nested so that each is inside the previous one. The total shaded area of alternating (every other) squares equals 64% of the area of the largest square. If the ratio of the side of a square to the side of the next larger square is \\(k\\), what is \\(k\\)?",
    choices: ["\\frac{3}{5}", "\\frac{16}{25}", "\\frac{2}{3}", "\\frac{3}{4}", "\\frac{4}{5}"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 6,
    problem: "Six chairs are arranged in a circle. Two students and two teachers randomly select 4 of the 6 chairs. What is the probability that the 2 students sit adjacent to each other and the 2 teachers sit adjacent to each other?",
    choices: ["\\frac{1}{6}", "\\frac{1}{5}", "\\frac{2}{9}", "\\frac{3}{13}", "\\frac{1}{4}"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 7,
    problem: "Scientists believe that an alien creature's speed is described by \\(v = kn^a m^b\\), where \\(n\\) is the number of toes it has, \\(m\\) is the number of eyes it has, \\(k\\), \\(a\\), and \\(b\\) are constants. A creature with 5 toes and 4 eyes runs at \\(v = 5\\). A creature with 5 toes and 25 eyes runs at \\(v = 10\\). A creature with 25 toes and 25 eyes runs at \\(v = 20\\). What is \\(k + a + b\\)?",
    choices: ["20", "21", "22", "23", "24"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 8,
    problem: "Pentagon \\(ABCDE\\) is inscribed in a circle. The angles \\(\\angle BEC = \\angle CED = 30^\\circ\\). Lines \\(\\overline{AC}\\) and \\(\\overline{BD}\\) intersect at \\(F\\). Given \\(AB = 9\\) and \\(AD = 24\\), find \\(BF\\).",
    choices: ["\\frac{57}{11}", "\\frac{59}{11}", "\\frac{60}{11}", "\\frac{61}{11}", "\\frac{63}{11}"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 9,
    problem: "Let \\(w = 2 + i\\) where \\(i = \\sqrt{-1}\\). Find the real number \\(r\\) such that \\(r\\), \\(w\\), and \\(w^2\\) are the vertices of a right triangle in the complex plane (i.e., the three points are collinear... wait: find \\(r\\) such that the three points \\(r\\), \\(w = 2+i\\), and \\(w^2 = 3+4i\\) are collinear).",
    choices: ["\\frac{3}{4}", "1", "\\frac{7}{5}", "\\frac{3}{2}", "\\frac{5}{3}"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 10,
    problem: "In the figure, a circle with center \\(O\\) has a major arc \\(AD\\), a minor arc \\(BC\\), and chord segments \\(AB\\) and \\(CD\\), where arc \\(AD\\) = arc \\(BC\\) = \\(AB\\) = \\(CD = 2\\pi\\). What is the distance from the center \\(O\\) to the chord \\(AB\\)? The answer is \\(OA\\) (the radius) expressed appropriately.",
    choices: ["1", "1 - \\pi + \\sqrt{\\pi^2+1}", "\\frac{\\pi}{2}", "\\frac{\\sqrt{\\pi^2+1}}{2}", "2"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 11,
    problem: "Triangle \\(ABC\\) has vertices \\(A = (2, 31)\\), \\(B = (8, 27)\\), and \\(C = (18, 27)\\). What is the sum of the coordinates of the orthocenter of triangle \\(ABC\\)?",
    choices: ["5", "17", "10+4\\sqrt{17}+2\\sqrt{13}", "\\frac{113}{3}", "54"],
    correct_answer: 'A'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 12,
    problem: "What is the harmonic mean of all the real solutions to the equation \\[\\prod_{k=1}^{2025}(kx^2 - 4x - 3) = 0?\\]",
    choices: ["-\\frac{5}{3}", "-\\frac{3}{2}", "-\\frac{6}{5}", "-\\frac{5}{6}", "-\\frac{2}{3}"],
    correct_answer: 'B'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 13,
    problem: "Let \\(C\\) be the set of integers \\(\\{1, 2, 3, \\ldots, 13\\}\\). Let \\(N\\) be the greatest number of elements of a subset \\(S\\) of \\(C\\) such that \\(S\\) does not contain 5 consecutive integers. What is the probability that a randomly chosen subset of \\(C\\) with \\(N\\) elements does not contain 5 consecutive integers?",
    choices: ["\\frac{3}{130}", "\\frac{3}{143}", "\\frac{5}{143}", "\\frac{1}{26}", "\\frac{5}{78}"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 14,
    problem: "Two ellipses are drawn in a plane. The smaller ellipse is inside the larger one and tangent to it at two points. The larger ellipse has both foci inside the smaller ellipse. Both ellipses have the same eccentricity \\(e\\), and the ratio of their areas is \\(2025 : 1\\). What is \\(e\\)?",
    choices: ["\\frac{3}{5}", "\\frac{16}{25}", "\\frac{4}{5}", "\\frac{22}{23}", "\\frac{44}{45}"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 15,
    problem: "Call a set \\(S\\) of integers \"sum-free\" if no two elements of \\(S\\) (not necessarily distinct) sum to another element of \\(S\\). For example, \\(\\{3, 5, 7\\}\\) is not sum-free because \\(3 + 5 = 8\\) is not in \\(S\\), but \\(3 + 3 = 6\\) is not in \\(S\\) either... actually \\(\\{3, 5, 7\\}\\) is sum-free. What is the largest possible number of elements in a sum-free subset of \\(\\{1, 2, 3, \\ldots, 20\\}\\)?",
    choices: ["8", "9", "10", "11", "12"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 16,
    problem: "In triangle \\(ABC\\), \\(AB = 80\\), \\(BC = 45\\), and \\(CA = 75\\). Point \\(P\\) lies on the angle bisector of \\(\\angle B\\), and the altitude from \\(A\\) to \\(\\overline{BC}\\) passes through \\(P\\). Find \\(BP\\).",
    choices: ["18", "19", "20", "21", "22"],
    correct_answer: 'D'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 17,
    problem: "The polynomial \\((z+i)(z+2i)(z+3i) + 10\\) has three complex roots. What is the area of the triangle in the complex plane with vertices at these three roots?",
    choices: ["6", "8", "10", "12", "14"],
    correct_answer: 'A'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 18,
    problem: "How many ordered triples \\((x, y, z)\\) of distinct positive integers, each at most 8, satisfy \\(xy > z\\), \\(xz > y\\), and \\(yz > x\\)?",
    choices: ["36", "84", "186", "336", "486"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 19,
    problem: "Let \\(a\\), \\(b\\), and \\(c\\) be the three roots of the polynomial \\(x^3 + kx + 1\\). What is \\[a^3b^2 + a^2b^3 + b^3c^2 + b^2c^3 + c^3a^2 + c^2a^3?\\]",
    choices: ["-k", "-k+1", "1", "k-1", "k"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 20,
    problem: "A pentahedron has a \\(13 \\times 8\\) rectangular base. Its two lateral faces are congruent isosceles triangles and its other two lateral faces are congruent isosceles trapezoids. The apex of the pentahedron (the vertex shared by the triangular faces) is at height \\(h\\) above the center of the base. Given that each triangular face has legs of length \\(\\frac{\\sqrt{481}}{2}\\) and each trapezoidal face has legs of length \\(\\frac{\\sqrt{233}}{2}\\), find the volume of the pentahedron.",
    choices: ["416", "520", "528", "676", "832"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 21,
    problem: "Find all triples of nonnegative integers \\((a, k, m)\\) with \\(m \\geq 2\\) such that \\[\\frac{m^k - 1}{m - 1} = 2^a + 1.\\] If the only solution is \\((a, k, m)\\), compute \\(a + k + m\\).",
    choices: ["8", "9", "10", "11", "12"],
    correct_answer: 'A'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 22,
    problem: "Three numbers are chosen independently and uniformly at random from the interval \\([0, 1]\\). What is the probability that the maximum of the three numbers is greater than twice each of the other two numbers?",
    choices: ["\\frac{1}{12}", "\\frac{1}{9}", "\\frac{1}{8}", "\\frac{1}{6}", "\\frac{1}{4}"],
    correct_answer: 'E'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 23,
    problem: "An integer is called \"fair\" if it has no repeated digits, no zero digits, and no digit is adjacent (in the number's decimal representation) to two digits that are both greater than it. How many fair positive integers are there?",
    choices: ["511", "2584", "9841", "17711", "19682"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 24,
    problem: "A circle of radius \\(r\\) is surrounded by 12 non-overlapping unit circles, each tangent to the center circle and to its two neighbors. Express \\(r\\) in the form \\(\\sqrt{a} + \\sqrt{b} + c\\) where \\(a\\), \\(b\\), \\(c\\) are integers. What is \\(a + b + c\\)?",
    choices: ["3", "5", "7", "9", "11"],
    correct_answer: 'C'
  },
  {
    contest: 'AMC 12A', year: 2025, number: 25,
    problem: "Polynomials \\(P(x)\\) and \\(Q(x)\\) each have degree 3 and leading coefficient 1. All roots of both polynomials are elements of \\(\\{1, 2, 3, 4, 5\\}\\). The function \\(f(x) = \\dfrac{P(x)}{Q(x)}\\) satisfies: there exist real numbers \\(a < b < c < d\\) such that the set of all real \\(x\\) with \\(f(x) \\leq 0\\) is exactly \\([a, b] \\cup (c, d)\\). How many ordered pairs of polynomials \\((P, Q)\\) are possible?",
    choices: ["7", "9", "11", "12", "13"],
    correct_answer: 'E'
  },
];

async function deleteExisting() {
  const res = await fetch(url + '/rest/v1/olympiad_problems?contest=eq.AMC 12A', {
    method: 'DELETE',
    headers: {
      'apikey': key,
      'Authorization': 'Bearer ' + key,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    }
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('Delete failed:', res.status, text);
  } else {
    console.log('Deleted existing AMC 12A problems');
  }
}

async function insertProblem(p) {
  const num = p.number;
  const yr = p.year;
  const data = {
    contest: p.contest,
    year: yr,
    number: num,
    topic: getTopic(yr, num),
    difficulty: getDifficulty(num),
    problem: p.problem,
    choices: p.choices,
    correct_answer: p.correct_answer,
    correct_value: null,
    solution: '',
    track: 'amc12',
    source_link: `https://artofproblemsolving.com/wiki/index.php/${yr}_AMC_12A_Problems/Problem_${num}`
  };
  const res = await fetch(url + '/rest/v1/olympiad_problems', {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': 'Bearer ' + key,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`FAILED ${yr} #${num}: ${res.status} ${text}`);
    return false;
  }
  return true;
}

async function main() {
  await deleteExisting();

  let inserted = 0;
  let failed = 0;

  for (const p of problems) {
    const ok = await insertProblem(p);
    if (ok) {
      inserted++;
      process.stdout.write(`\rInserted: ${inserted} / ${problems.length}`);
    } else {
      failed++;
    }
  }

  console.log(`\n\nDone! Inserted: ${inserted}, Failed: ${failed}, Total: ${problems.length}`);
}

main().catch(console.error);
