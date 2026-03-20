#!/usr/bin/env python3
"""Generate aime_all.json with all AIME problems 2020-2025."""

import json

def classify_topic(problem_text, number):
    """Heuristic topic classification based on problem keywords."""
    t = problem_text.lower()

    # Geometry keywords
    geo_kw = ['triangle', 'circle', 'rectangle', 'square', 'polygon', 'quadrilateral',
              'circumscri', 'inscri', 'tangent', 'perpendicular', 'angle', 'parallelogram',
              'trapezoid', 'rhombus', 'sphere', 'cone', 'cube', 'tetrahedron', 'hexagon',
              'pentagon', 'octagon', 'dodecagon', 'parabola', 'ellipse', 'hyperbola',
              'diagonal', 'radius', 'diameter', 'incircle', 'circumcircle', 'altitude',
              'midpoint', 'bisect', 'equilateral', 'isosceles', 'vertex', 'vertices',
              'coordinate', 'torus', 'area of', 'perimeter', 'side length', 'right angle',
              'congruent', 'similar', 'rotation', 'reflection', 'face diagonal',
              'circumradius', 'inradius', 'parallelepiped', 'grid']

    # Number theory keywords
    nt_kw = ['divisor', 'divides', 'divisible', 'prime', 'gcd', 'lcm', 'remainder',
             'modulo', 'mod ', 'congruent', 'base-', 'base ', 'digit', 'factorial',
             'multiple', 'coprime', 'relatively prime', 'perfect square', 'integer',
             'positive integer']

    # Combinatorics keywords
    comb_kw = ['how many', 'number of ways', 'number of ordered', 'number of arrangement',
               'permutation', 'combination', 'subset', 'sequence', 'coloring', 'color',
               'arrange', 'choose', 'assign', 'counting', 'committee', 'seating',
               'number of subset', 'number of collection', 'ways to place']

    # Probability keywords
    prob_kw = ['probability', 'expected', 'random', 'uniformly', 'equally likely',
               'at random']

    # Algebra keywords
    alg_kw = ['log', 'polynomial', 'equation', 'root', 'solve', 'sum of', 'product',
              'arithmetic progression', 'geometric progression', 'sequence', 'series',
              'function', 'recurs', 'floor', 'ceiling', 'fractional part', 'real number',
              'complex number', 'satisf', 'system']

    geo_score = sum(1 for k in geo_kw if k in t)
    nt_score = sum(1 for k in nt_kw if k in t)
    comb_score = sum(1 for k in comb_kw if k in t)
    prob_score = sum(1 for k in prob_kw if k in t)
    alg_score = sum(1 for k in alg_kw if k in t)

    # Boost probability if it has probability keywords
    if prob_score > 0:
        prob_score += 3

    scores = {
        'Geometry': geo_score,
        'Number Theory': nt_score,
        'Combinatorics': comb_score,
        'Probability': prob_score,
        'Algebra': alg_score
    }

    best = max(scores, key=scores.get)
    if scores[best] == 0:
        return 'Algebra'
    return best


def difficulty(number):
    if number <= 5:
        return "easy"
    elif number <= 10:
        return "medium"
    else:
        return "hard"


# All answer keys
answer_keys = {
    (2020, "AIME I"): ["547","017","621","093","052","173","081","103","077","407","510","270","036","085","058"],
    (2020, "AIME II"): ["231","171","103","108","151","626","298","101","090","239","071","248","060","010","717"],
    (2021, "AIME I"): ["097","109","050","331","031","192","063","057","567","059","301","019","672","125","285"],
    (2021, "AIME II"): ["550","336","080","330","736","454","145","049","295","335","258","047","797","592","258"],
    (2022, "AIME I"): ["116","227","242","834","550","228","289","378","247","756","150","245","392","459","033"],
    (2022, "AIME II"): ["154","125","021","112","072","841","192","080","244","004","180","023","220","188","140"],
    (2023, "AIME I"): ["191","881","607","012","106","051","049","125","738","944","235","075","125","608","349"],
    (2023, "AIME II"): ["220","585","250","273","719","035","928","024","033","144","081","247","167","751","363"],
    (2024, "AIME I"): ["204","025","809","116","104","294","540","197","480","113","371","385","110","104","721"],
    (2024, "AIME II"): ["073","236","045","033","080","055","699","127","902","468","601","023","321","211","315"],
    (2025, "AIME I"): ["070","588","016","117","279","504","821","077","062","081","259","510","204","060","735"],
    (2025, "AIME II"): ["468","049","082","106","336","293","237","610","149","907","113","019","248","104","240"],
}

# All problems - organized by (year, contest)
problems = {}

problems[(2020, "AIME I")] = [
    "In triangle ABC with AB = AC, point D lies strictly between A and C on side AC, and point E lies strictly between A and B on side AB such that AE = ED = DB = BC. The degree measure of angle ABC is m/n, where m and n are relatively prime positive integers. Find m + n.",
    "There is a unique positive real number x such that the three numbers log_8(2x), log_4(x), and log_2(x), in that order, form a geometric progression with positive common ratio. The number x can be written as m/n, where m and n are relatively prime positive integers. Find m + n.",
    "A positive integer N has base-eleven representation abc and base-eight representation 1bca, where a, b, and c represent (not necessarily distinct) digits. Find the least such N expressed in base ten.",
    "Let S be the set of positive integers N with the property that the last four digits of N are 2020, and when the last four digits are removed, the result is a divisor of N. Find the sum of all the digits of all the numbers in S.",
    "Six cards numbered 1 through 6 are to be lined up in a row. Find the number of arrangements of these six cards where one of the cards can be removed leaving the remaining five cards in either ascending or descending order.",
    "A flat board has a circular hole with radius 1 and a circular hole with radius 2 such that the distance between the centers of the two holes is 7. Two spheres with equal radii sit in the two holes such that the spheres are tangent to each other. The square of the radius of the spheres is m/n, where m and n are relatively prime positive integers. Find m + n.",
    "A club consisting of 11 men and 12 women needs to choose a committee from among its members so that the number of women on the committee is one more than the number of men on the committee. The committee could have as few as 1 member or as many as 23 members. Let N be the number of such committees that can be formed. Find the sum of the prime numbers that divide N.",
    "A bug walks all day and sleeps all night. On the first day, it starts at point O, faces east, and walks a distance of 5 units due east. Each night the bug rotates 60 degrees counterclockwise. Each day it walks in this new direction half as far as it walked the previous day. The bug gets arbitrarily close to the point P. Then OP^2 = m/n, where m and n are relatively prime positive integers. Find m + n.",
    "Let S be the set of positive integer divisors of 20^9. Three numbers are chosen independently and at random with replacement from the set S and labeled a_1, a_2, and a_3 in the order they are chosen. The probability that both a_1 divides a_2 and a_2 divides a_3 is m/n, where m and n are relatively prime positive integers. Find m.",
    "Let m and n be positive integers satisfying the conditions: gcd(m + n, 210) = 1, m^m is a multiple of n^n, and m is not a multiple of n. Find the least possible value of m + n.",
    "For integers a, b, c and d, let f(x) = x^2 + ax + b and g(x) = x^2 + cx + d. Find the number of ordered triples (a, b, c) of integers with absolute values not exceeding 10 for which there is an integer d such that g(f(2)) = g(f(4)) = 0.",
    "Let n be the least positive integer for which 149^n - 2^n is divisible by 3^3 * 5^5 * 7^7. Find the number of positive integer divisors of n.",
    "Point D lies on side BC of triangle ABC so that AD bisects angle BAC. The perpendicular bisector of AD intersects the bisectors of angles ABC and ACB in points E and F, respectively. Given that AB = 4, BC = 5, and CA = 6, the area of triangle AEF can be written as m*sqrt(n)/p, where m and p are relatively prime positive integers, and n is a positive integer not divisible by the square of any prime. Find m + n + p.",
    "Let P(x) be a quadratic polynomial with complex coefficients whose x^2 coefficient is 1. Suppose the equation P(P(x)) = 0 has four distinct solutions, x = 3, 4, a, b. Find the sum of all possible values of (a + b)^2.",
    "Let triangle ABC be an acute triangle with circumcircle omega, and let H be the intersection of the altitudes of triangle ABC. Suppose the tangent to the circumcircle of triangle HBC at H intersects omega at points X and Y with HA = 3, HX = 2, and HY = 6. The area of triangle ABC can be written in the form m*sqrt(n), where m and n are positive integers, and n is not divisible by the square of any prime. Find m + n.",
]

problems[(2020, "AIME II")] = [
    "Find the number of ordered pairs of positive integers (m, n) such that m^2 * n = 20^20.",
    "Let P be a point chosen uniformly at random in the interior of the unit square with vertices at (0,0), (1,0), (1,1), and (0,1). The probability that the slope of the line determined by P and the point (5/8, 3/8) is greater than or equal to 1/2 can be written as m/n, where m and n are relatively prime positive integers. Find m + n.",
    "The value of x that satisfies log_(2^x)(3^20) = log_(2^(x+3))(3^2020) can be written as m/n, where m and n are relatively prime positive integers. Find m + n.",
    "Triangles ABC and A'B'C' lie in the coordinate plane with vertices A(0,0), B(0,12), C(16,0), A'(24,18), B'(36,18), C'(24,2). A rotation of m degrees clockwise around the point (x,y) where 0 < m < 180, will transform triangle ABC to triangle A'B'C'. Find m + x + y.",
    "For each positive integer n, let f(n) be the sum of the digits in the base-four representation of n and let g(n) be the sum of the digits in the base-eight representation of f(n). For example, f(2020) = f(133210_4) = 10 = 12_8, and g(2020) = 3. Let N be the least value of n such that the base-sixteen representation of g(n) cannot be expressed using only the digits 0 through 9. Find the remainder when N is divided by 1000.",
    "Define a sequence recursively by t_1 = 20, t_2 = 21, and t_n = (5*t_(n-1) + 1)/(25*t_(n-2)) for all n >= 3. Then t_2020 can be written as p/q, where p and q are relatively prime positive integers. Find p + q.",
    "Two congruent right circular cones each with base radius 3 and height 8 have axes of symmetry that intersect at right angles at a point in the interior of the cones a distance 3 from the base of each cone. A sphere with radius r lies within both cones. The maximum possible value of r^2 is m/n, where m and n are relatively prime positive integers. Find m + n.",
    "Define a sequence recursively by f_1(x) = |x - 1| and f_n(x) = f_(n-1)(|x - n|) for integers n > 1. Find the least value of n such that the sum of the zeros of f_n exceeds 500,000.",
    "While watching a show, Ayako, Billy, Carlos, Dahlia, Ehuang, and Frank sat in that order in a row of six chairs. During the break, they went to the kitchen for a snack. When they came back, they sat on those six chairs in such a way that if two of them sat next to each other before the break, then they did not sit next to each other after the break. Find the number of possible seating orders they could have chosen after the break.",
    "Find the sum of all positive integers n such that when 1^3 + 2^3 + 3^3 + ... + n^3 is divided by n + 5, the remainder is 17.",
    "Let P(x) = x^2 - 3x - 7, and let Q(x) and R(x) be two quadratic polynomials also with the coefficient of x^2 equal to 1. David computes each of the three sums P + Q, P + R, and Q + R and is surprised to find that each pair of these sums has a common root, and these three common roots are distinct. If Q(0) = 2, then R(0) = m/n, where m and n are relatively prime positive integers. Find m + n.",
    "Let m and n be odd integers greater than 1. An m x n rectangle is made up of unit squares where the squares in the top row are numbered left to right with the integers 1 through n, those in the second row are numbered left to right with the integers n + 1 through 2n, and so on. Square 200 is in the top row, and square 2000 is in the bottom row. Find the number of ordered pairs (m, n) of odd integers greater than 1 with the property that, in the m x n rectangle, the line through the centers of squares 200 and 2000 intersects the interior of square 1099.",
    "Convex pentagon ABCDE has side lengths AB = 5, BC = CD = DE = 6, and EA = 7. Moreover, the pentagon has an inscribed circle (a circle tangent to each side of the pentagon). Find the area of ABCDE.",
    "For real number x let floor(x) be the greatest integer less than or equal to x, and define {x} = x - floor(x) to be the fractional part of x. Define f(x) = x*{x}, and let N be the number of real-valued solutions to the equation f(f(f(x))) = 17 for 0 <= x <= 2020. Find the remainder when N is divided by 1000.",
    "Let triangle ABC be an acute scalene triangle with circumcircle omega. The tangents to omega at B and C intersect at T. Let X and Y be the projections of T onto lines AB and AC, respectively. Suppose BT = CT = 16, BC = 22, and TX^2 + TY^2 + XY^2 = 1143. Find XY^2.",
]

problems[(2021, "AIME I")] = [
    "Zou and Chou are practicing 100-meter sprints by running 6 races. Zou wins the first race, and after that, a runner wins a given race with probability 2/3 if they won the previous race and probability 1/3 if they lost the previous race. The probability that Zou will win exactly 5 of the 6 races is m/n, where m and n are relatively prime positive integers. Find m + n.",
    "In the diagram, rectangle ABCD has dimensions AB = 3 and BC = 11. Rectangle AECF has dimensions AF = 7 and FC = 9. The area of the shaded region common to both rectangles is m/n, where m and n are relatively prime positive integers. Find m + n.",
    "Find the number of positive integers less than 1000 that can be expressed as the difference of two integral powers of 2.",
    "Find the number of ways 66 identical coins can be separated into three nonempty piles so that there are fewer coins in the first pile than in the second pile and fewer coins in the second pile than in the third pile.",
    "Call a three-term strictly increasing arithmetic sequence of integers special if the sum of the squares of the three terms equals the product of the middle term and the square of the common difference. Find the sum of the third terms of all special sequences.",
    "Segments AB, AC, and AD are edges of a cube and AG is a diagonal through the center of the cube. Point P satisfies BP = 60*sqrt(10), CP = 60*sqrt(5), DP = 120*sqrt(2), and GP = 36*sqrt(7). Find AP.",
    "Find the number of pairs (m, n) of positive integers with 1 <= m < n <= 30 such that there exists a real number x satisfying sin(mx) + sin(nx) = 2.",
    "Find the number of integers c such that the equation ||20|x| - x^2| - c| = 21 has exactly 12 distinct real solutions.",
    "Let ABCD be an isosceles trapezoid with AD = BC and AB < CD, where the distance from A to line BC is 15, the distance from A to line CD is 18, and the distance from A to line BD is 10. Let K be the area of ABCD. Find sqrt(2) * K.",
    "Consider the sequence (a_k) defined by a_1 = 2020/2021 and a_(k+1) = (m + 18)/(n + 19) when a_k = m/n is in lowest terms. Find the sum of all positive integers j such that a_j = t/(t + 1) for some positive integer t.",
    "Let ABCD be a cyclic quadrilateral with sides AB = 4, BC = 5, CD = 6, DA = 7. Let A_1 and C_1 denote the feet of the perpendiculars from A and C to line BD, and let B_1 and D_1 denote the feet of the perpendiculars from B and D to line AC. The perimeter of A_1B_1C_1D_1 is m/n where m and n are relatively prime positive integers. Find m + n.",
    "Three frogs initially sit at vertices A_4, A_8, and A_12 of a regular dodecagon with vertices labeled A_1, A_2, ..., A_12. Every minute, each frog jumps to one of the two adjacent vertices, chosen randomly with equal probability. The frogs stop jumping as soon as two frogs arrive at the same vertex. The expected number of minutes until the frogs stop is m/n, where m and n are relatively prime positive integers. Find m + n.",
    "Circles omega_1 and omega_2 with radii 961 and 625, respectively, intersect at distinct points A and B. A third circle omega is externally tangent to both omega_1 and omega_2. Suppose line AB intersects omega at two points P and Q such that the measure of minor arc PQ is 120 degrees. Find the distance between the centers of omega_1 and omega_2.",
    "For any positive integer a, let sigma(a) denote the sum of the positive integer divisors of a. Let n be the least positive integer such that sigma(a^n) - 1 is divisible by 2021 for all positive integers a. Find the sum of the prime factors in the prime factorization of n.",
    "Let S be the set of positive integers k such that the two parabolas y = x^2 - k and x = 2(y - 20)^2 - k intersect in four distinct points, and these four points lie on a circle with radius at most 21. Find the sum of the least element of S and the greatest element of S.",
]

problems[(2021, "AIME II")] = [
    "Find the arithmetic mean of all three-digit palindromes. (A palindrome is a number that reads the same forward and backward, such as 777 or 383.)",
    "Equilateral triangle ABC has side length 840. Point D lies on the same side of line BC as A such that BD is perpendicular to BC. The line l through D parallel to line BC intersects sides AB and AC at points E and F, respectively. Point G lies on l such that F is between E and G, triangle AFG is isosceles, and the ratio of the area of triangle AFG to the area of triangle BED is 8:9. Find AF.",
    "Find the number of permutations x_1, x_2, x_3, x_4, x_5 of the numbers 1, 2, 3, 4, 5 such that the sum x_1*x_2*x_3 + x_2*x_3*x_4 + x_3*x_4*x_5 + x_4*x_5*x_1 + x_5*x_1*x_2 is divisible by 3.",
    "There are real numbers a, b, c, and d such that -20 is a root of x^3 + ax + b and -21 is a root of x^3 + cx^2 + d. These two polynomials share a complex root m + sqrt(n)*i, where m and n are positive integers and i = sqrt(-1). Find m + n.",
    "For positive real numbers s, let tau(s) denote the set of all obtuse triangles that have area s and two sides with lengths 4 and 10. The set of all s for which tau(s) is nonempty, but all triangles in tau(s) are congruent, is an interval [a, b). Find a^2 + b^2.",
    "For any finite set S, let |S| denote the number of elements in S. Find the number of ordered pairs (A, B) such that A and B are (not necessarily distinct) subsets of {1, 2, 3, 4, 5} that satisfy |A| * |B| = |A intersect B| * |A union B|.",
    "Let a, b, c, and d be real numbers that satisfy the system of equations: a + b = -3, ab + bc + ca = -4, abc + bcd + cda + dab = 14, abcd = 30. There exist relatively prime positive integers m and n such that a^2 + b^2 + c^2 + d^2 = m/n. Find m + n.",
    "An ant makes a sequence of moves on a cube where a move consists of walking from one vertex to an adjacent vertex along an edge of the cube. Initially the ant is at a vertex of the bottom face and chooses one of the three adjacent vertices to move to as its first move. For all moves after the first, the ant does not return to its previous vertex, but chooses to move to one of the other two adjacent vertices with equal probability. The probability that after exactly 8 moves the ant is at a vertex of the top face is m/n, where m and n are relatively prime positive integers. Find m + n.",
    "Find the number of ordered pairs (m, n) such that m and n are positive integers in the set {1, 2, ..., 30} and the greatest common divisor of 2^m + 1 and 2^n - 1 is not 1.",
    "Two spheres with radii 36 and one sphere with radius 13 are each externally tangent to the other two spheres and to two different planes P and Q. The intersection of planes P and Q is the line l. The distance from line l to the point where the sphere with radius 13 is tangent to plane P is m/n, where m and n are relatively prime positive integers. Find m + n.",
    "A teacher was leading a class of four perfectly logical students. The teacher chose a set S of four integers and gave a different number in S to each student. Then the teacher announced to the class that the numbers in S were four consecutive two-digit positive integers, that some number in S was divisible by 6, and a different number in S was divisible by 7. The teacher then asked if any of the students could deduce what S is, but in unison, all of the students replied no. However, upon hearing that all four students replied no, each student was able to determine the elements of S. Find the sum of all possible values of the greatest element of S.",
    "A convex quadrilateral has area 30 and side lengths 5, 6, 9, and 7, in that order. Denote by theta the measure of the acute angle formed by the diagonals of the quadrilateral. Then tan(theta) can be written in the form m/n, where m and n are relatively prime positive integers. Find m + n.",
    "Find the least positive integer n for which 2^n + 5^n - n is a multiple of 1000.",
    "Let triangle ABC be an acute triangle with circumcenter O and centroid G. Let X be the intersection of the line tangent to the circumcircle of triangle ABC at A and the line perpendicular to GO at G. Let Y be the intersection of lines XG and BC. Given that the measures of angles ABC, BCA, and XOY are in the ratio 13:2:17, the degree measure of angle BAC can be written as m/n, where m and n are relatively prime positive integers. Find m + n.",
    "Let f(n) and g(n) be functions satisfying f(n) = sqrt(n) if sqrt(n) is an integer, and 1 + f(n + 1) otherwise; and g(n) = sqrt(n) if sqrt(n) is an integer, and 2 + g(n + 2) otherwise, for positive integers n. Find the least positive integer n such that f(n)/g(n) = 4/7.",
]

problems[(2022, "AIME I")] = [
    "Quadratic polynomials P(x) and Q(x) have leading coefficients 2 and -2, respectively. The graphs of both polynomials pass through the two points (16, 54) and (20, 53). Find P(0) + Q(0).",
    "Find the three-digit positive integer whose representation in base nine is bca_9, where the original number in base ten is abc.",
    "In isosceles trapezoid ABCD, parallel bases AB and CD have lengths 500 and 650, respectively, and AD = BC = 333. The angle bisectors of angle A and angle D meet at P, and the angle bisectors of angle B and angle C meet at Q. Find PQ.",
    "Let w = (sqrt(3) + i)/2 and z = (-1 + i*sqrt(3))/2, where i = sqrt(-1). Find the number of ordered pairs (r, s) of positive integers not exceeding 100 that satisfy the equation i * w^r = z^s.",
    "A straight river that is 264 meters wide flows from west to east at a rate of 14 meters per minute. Melanie and Sherry sit on the south bank of the river with Melanie a distance of D meters downstream from Sherry. Relative to the water, Melanie swims at 80 meters per minute, and Sherry swims at 60 meters per minute. At the same time, Melanie and Sherry begin swimming in straight lines to a point on the north bank of the river that is equidistant from their starting positions. The two women arrive at this point simultaneously. Find D.",
    "Find the number of ordered pairs of integers (a, b) such that the sequence 3, 4, 5, a, b, 30, 40, 50 is strictly increasing and no set of four (not necessarily consecutive) terms forms an arithmetic progression.",
    "Let a, b, c, d, e, f, g, h, i be distinct integers from 1 to 9. The minimum possible positive value of (a*b*c - d*e*f)/(g*h*i) can be written as m/n, where m and n are relatively prime positive integers. Find m + n.",
    "Equilateral triangle ABC is inscribed in circle omega with radius 18. Circle omega_A is tangent to sides AB and AC and is internally tangent to omega. Circles omega_B and omega_C are defined analogously. Circles omega_A, omega_B, and omega_C meet in six points -- two for each pair of circles. The three intersection points closest to the vertices of triangle ABC are the vertices of a large equilateral triangle in the interior of triangle ABC, and the other three intersection points are the vertices of a smaller equilateral triangle in the interior of triangle ABC. The side length of the smaller equilateral triangle can be written as sqrt(a) - sqrt(b), where a and b are positive integers. Find a + b.",
    "Ellina has twelve blocks, two each of red (R), blue (B), yellow (Y), green (G), orange (O), and purple (P). Call an arrangement of blocks even if there is an even number of blocks between each pair of blocks of the same color. Ellina arranges her blocks in a row in random order. The probability that her arrangement is even is m/n, where m and n are relatively prime positive integers. Find m + n.",
    "Three spheres with radii 11, 13, and 19 are mutually externally tangent. A plane intersects the spheres in three congruent circles centered at A, B, and C, respectively, and the centers of the spheres all lie on the same side of this plane. Suppose that AB^2 = 560. Find AC^2.",
    "Let ABCD be a parallelogram with angle BAD < 90 degrees. A circle tangent to sides DA, AB, and BC intersects diagonal AC at points P and Q with AP < AQ, as shown. Suppose that AP = 3, PQ = 9, and QC = 16. Then the area of ABCD can be expressed in the form m*sqrt(n), where m and n are positive integers, and n is not divisible by the square of any prime. Find m + n.",
    "For any finite set X, let |X| denote the number of elements in X. Define S_n = sum of |A intersect B| where the sum is taken over all ordered pairs (A, B) such that A and B are subsets of {1, 2, 3, ..., n} with |A| = |B|. Let S_2022/S_2021 = p/q, where p and q are relatively prime positive integers. Find the remainder when p + q is divided by 1000.",
    "Let S be the set of all rational numbers that can be expressed as a repeating decimal in the form 0.abcdabcd..., where at least one of the digits a, b, c, or d is nonzero. Let N be the number of distinct numerators obtained when numbers in S are written as fractions in lowest terms. Find the remainder when N is divided by 1000.",
    "Given triangle ABC and a point P on one of its sides, call line l the splitting line of triangle ABC through P if l passes through P and divides triangle ABC into two polygons of equal perimeter. Let triangle ABC be a triangle where BC = 219 and AB and AC are positive integers. Let M and N be the midpoints of AB and AC, respectively, and suppose that the splitting lines of triangle ABC through M and N intersect at 30 degrees. Find the perimeter of triangle ABC.",
    "Let x, y, and z be positive real numbers satisfying the system of equations: sqrt(2x - xy) + sqrt(2y - xy) = 1, sqrt(2y - yz) + sqrt(2z - yz) = sqrt(2), sqrt(2z - zx) + sqrt(2x - zx) = sqrt(3). Then [(1-x)(1-y)(1-z)]^2 can be written as m/n, where m and n are relatively prime positive integers. Find m + n.",
]

problems[(2022, "AIME II")] = [
    "Adults made up 5/12 of the crowd of a concert. After a bus carrying 50 more people arrived, adults made up 11/25 of the people at the concert. Find the minimum number of adults who could have been at the concert after the bus arrived.",
    "Azar, Carl, Jon, and Sergey are the four remaining players in a singles tennis tournament. They are randomly assigned into two semifinal matches, and the winners of those matches play each other in the final. When Azar plays Carl, Azar will win with probability 2/3. When either Azar or Carl plays either Jon or Sergey, Azar or Carl will win with probability 3/4. Assume the game outcomes are independent. The probability that Carl wins the tournament is p/q, where p and q are relatively prime positive integers. Find p + q.",
    "A right square pyramid with volume 54 has a base with side length 6. The five vertices of the pyramid all lie on a sphere with radius m/n, where m and n are relatively prime positive integers. Find m + n.",
    "There is a positive real number x not equal to either 1/20 or 1/2 such that log_(20x)(22x) = log_(2x)(202x). The value of log_(20x)(22x) can be written as log_10(m/n), where m and n are relatively prime positive integers. Find m + n.",
    "Twenty distinct points are marked on a circle and labeled 1 through 20 in clockwise order. A line segment is drawn between every pair of points whose labels differ by 2, 3, 5, 7, 11, or 13. Find the number of triangles formed whose vertices are among the original 20 points.",
    "Let x_1 <= x_2 <= ... <= x_100 be real numbers such that |x_1| + |x_2| + ... + |x_100| = 1 and x_1 + x_2 + ... + x_100 = 0. Among all such 100-tuples of numbers, the greatest value that x_76 - x_16 can achieve is m/n, where m and n are relatively prime positive integers. Find m + n.",
    "A circle with radius 6 is externally tangent to a circle with radius 24. Find the area of the triangular region bounded by the three common tangent lines of these two circles.",
    "Find the number of positive integers n <= 600 whose value can be uniquely determined when the values of floor(n/4), floor(n/5), and floor(n/6) are given.",
    "Let l_A denote a line on which 7 points A_1, A_2, ..., A_7 lie (in order) and l_B a parallel line on which 5 points B_1, B_2, ..., B_5 lie (in order). A line segment is drawn connecting every point on l_A with every point on l_B. Find the number of bounded regions in the resulting figure, assuming no three of the segments are concurrent at a point strictly between the lines.",
    "Find the remainder when C(C(3,2), 2) + C(C(4,2), 2) + ... + C(C(40,2), 2) is divided by 1000, where C(n,k) denotes the binomial coefficient.",
    "Let ABCD be a convex quadrilateral with AB = 2, AD = 7, and CD = 3 such that the bisectors of acute angles DAB and ADC intersect at the midpoint of BC. Find the square of the area of ABCD.",
    "Find the value of a + b when a > 4, b > 1 are the minimum values such that an ellipse x^2/a^2 + y^2/(a^2-16) = 1 and an ellipse (x-20)^2/(b^2-1) + (y-11)^2/b^2 = 1 are tangent.",
    "There is a polynomial P(x) with integer coefficients such that P(x) = (x^2310 - 1)^6 / ((x^105 - 1)(x^70 - 1)(x^42 - 1)(x^30 - 1)) for 0 < x < 1. Find the coefficient of x^2022 in P(x).",
    "For positive integers a, b, c with a < b < c, consider the set of postage stamp denominations {a, b, c} and define f(a, b, c) as the greatest postage that cannot be formed. Find the sum of the three least values of c such that f(a, b, c) = 97.",
    "Circles omega_1 and omega_2 with centers O_1 and O_2 are externally tangent to each other. Circle Omega passes through O_1 and O_2. Line AB is a common external tangent to omega_1 and omega_2 with A on omega_1 and B on omega_2. Given AB = 2, O_1O_2 = 15, and line CD is a common internal tangent with C on omega_1 and D on omega_2 with CD = 16. Find the area of hexagon ABO_1CDO_2.",
]

problems[(2023, "AIME I")] = [
    "Five men and nine women stand equally spaced around a circle in random order. The probability that every man stands diametrically opposite a woman is m/n, where m and n are relatively prime positive integers. Find m + n.",
    "Positive real numbers b (not equal to 1) and n satisfy the equations sqrt(log_b(n)) = log_b(sqrt(n)) and b * log_b(n) = log_b(bn). The value of n is j/k, where j and k are relatively prime positive integers. Find j + k.",
    "A plane contains 40 lines, no 2 of which are parallel. Suppose there are 3 points where exactly 3 lines intersect, 4 points where exactly 4 lines intersect, 5 points where exactly 5 lines intersect, 6 points where exactly 6 lines intersect, and no points where more than 6 lines intersect. Find the number of points where exactly 2 lines intersect.",
    "The sum of all positive integers m such that 13!/m is a perfect square can be written as 2^a * 3^b * 5^c * 7^d * 11^e * 13^f, where a, b, c, d, e, and f are positive integers. Find a + b + c + d + e + f.",
    "Let P be a point on the circle circumscribing square ABCD that satisfies PA * PC = 56 and PB * PD = 90. Find the area of ABCD.",
    "Alice knows that 3 red cards and 3 black cards will be revealed to her one at a time in random order. Before each card is revealed, Alice must guess its color. If Alice plays optimally, the expected number of cards she will guess correctly is m/n, where m and n are relatively prime positive integers. Find m + n.",
    "Call a positive integer n extra-distinct if the remainders when n is divided by 2, 3, 4, 5, and 6 are distinct. Find the number of extra-distinct positive integers less than 1000.",
    "Rhombus ABCD has angle BAD < 90 degrees. There is a point P on the incircle of the rhombus such that the distances from P to the lines DA, AB, and BC are 9, 5, and 16, respectively. Find the perimeter of ABCD.",
    "Find the number of cubic polynomials p(x) = x^3 + ax^2 + bx + c, where a, b, and c are integers in {-20, -19, ..., 19, 20}, such that there is a unique integer m not equal to 2 with p(m) = p(2).",
    "There exists a unique positive integer a for which the sum U = sum from n=1 to 2023 of floor((n^2 - n*a)/5) is an integer strictly between -1000 and 1000. For that unique a, find a + U.",
    "Find the number of subsets of {1, 2, 3, ..., 10} that contain exactly one pair of consecutive integers.",
    "Let triangle ABC be an equilateral triangle with side length 55. Points D, E, and F lie on BC, CA, and AB, respectively, with BD = 7, CE = 30, and AF = 40. Point P inside triangle ABC has the property that angle AEP = angle BFP = angle CDP. Find tan^2(angle AEP).",
    "Each face of two noncongruent parallelepipeds is a rhombus whose diagonals have lengths sqrt(21) and sqrt(31). The ratio of the volume of the larger of the two polyhedra to the volume of the smaller is m/n, where m and n are relatively prime positive integers. Find m + n.",
    "An analog clock has two hands that can move independently of each other. Initially, both hands point to the number 12. The clock performs a sequence of hand movements so that on each movement, one of the two hands moves clockwise to the next number on the clock face while the other hand does not move. Let N be the number of sequences of 144 hand movements such that during the sequence, every possible positioning of the hands appears exactly once, and at the end of the 144 movements, the hands have returned to their initial position. Find the remainder when N is divided by 1000.",
    "Find the largest prime number p < 1000 for which there exists a complex number z satisfying the real and imaginary parts of z are both integers, |z| = sqrt(p), and there exists a triangle whose three side lengths are p, the real part of z^3, and the imaginary part of z^3.",
]

problems[(2023, "AIME II")] = [
    "The numbers of apples growing on each of six apple trees form an arithmetic sequence where the greatest number of apples growing on any of the six trees is double the least number of apples growing on any of the six trees. The total number of apples growing on all six trees is 990. Find the greatest number of apples growing on any of the six trees.",
    "Find the greatest integer less than or equal to 1000 that is a palindrome in both base ten and base eight.",
    "In isosceles right triangle ABC with angle A = 90 degrees, point P lies inside the triangle such that angle PAB = angle PBC = angle PCA and AP = 10. Find the area of triangle ABC.",
    "Let x, y, z be real numbers satisfying the system xy + 4z = 60, yz + 4x = 60, zx + 4y = 60. Let S be the set of possible values of x. Find the sum of the squares of the elements of S.",
    "Let S be the set of all positive rational numbers r such that when r and 55r are written in lowest terms, their numerators and denominators have equal sums. The sum of all elements of S can be written as p/q in lowest terms. Find p + q.",
    "Two points are selected independently and uniformly at random inside an L-shaped region formed by three unit squares. The probability that the midpoint of the line segment connecting these two points also lies inside the L-shaped region is m/n, where m and n are relatively prime positive integers. Find m + n.",
    "Each vertex of a regular 12-gon is to be colored either red or blue, and a coloring is called good if no four vertices colored the same color are the four vertices of a rectangle. Find the number of good colorings.",
    "Let omega = cos(2*pi/7) + i*sin(2*pi/7), where i = sqrt(-1). Find the value of the product from k = 0 to 6 of (omega^(3k) + omega^k + 1).",
    "Circles omega_1 and omega_2 intersect at two points P and Q. The common tangent line closer to P of omega_1 and omega_2 touches omega_1 and omega_2 at points A and B, respectively. The line through P parallel to line AB meets omega_1 again at X and omega_2 again at Y. Suppose PX = 10, PY = 14, and PQ = 5. The area of trapezoid XABY can be written as m*sqrt(n), where m and n are positive integers and n is not divisible by the square of any prime. Find m + n.",
    "The 12 integers {1, 2, 3, ..., 12} are to be placed in the cells of a 2 x 6 grid so that for every two cells sharing a side, the difference of the numbers in those cells is not divisible by 3. The number of ways the integers can be placed is N. Find the number of positive divisors of N.",
    "Find the number of collections of 16 distinct subsets of {1, 2, 3, 4, 5} with the property that for any two subsets in the collection, they have a nonempty intersection.",
    "In triangle ABC with AB = 13, BC = 14, and CA = 15, let M be the midpoint of BC. Let P be a point on the circumcircle of triangle ABC such that M lies on segment AP. There exists a unique point Q on segment AM such that angle PBQ = angle PCQ. Then AQ can be written as m/n, where m and n are relatively prime positive integers. Find m + n.",
    "For acute angle A with tan(A) = 2*cos(A), find the number of positive integers n with n <= 1000 such that sec^n(A) + tan^n(A) is a positive integer whose units digit is 9.",
    "A unit cube has vertices A, B, C, D where AB and CD are parallel edges and AC and BD are face diagonals. The cube is positioned so that ABDC is perpendicular to a horizontal plane P, with vertex A at height 0, B at height 2, C at height 8, and D at height 10 meters above P. Water fills part of the cube to a height of 7 meters. The volume of water is m/n, where m and n are relatively prime positive integers. Find m + n.",
    "For each positive integer n, let a_n be the least positive multiple of 23 for which a_n is congruent to 1 modulo 2^n. Find the number of positive integers n with n <= 1000 such that a_n = a_(n+1).",
]

problems[(2024, "AIME I")] = [
    "Every morning Aya goes for a 9-kilometer-long walk and stops at a coffee shop afterwards. When she walks at a constant speed of s kilometers per hour, the walk takes her 4 hours, including t minutes spent in the coffee shop. When she walks at s + 2 kilometers per hour, the walk takes her 2 hours and 24 minutes, including t minutes spent in the coffee shop. Suppose Aya walks at s + 1/2 kilometers per hour. Find the number of minutes the walk takes her, including the t minutes spent in the coffee shop.",
    "There exist real numbers x and y, both greater than 1, such that log_x(y^x) = log_y(x^(4y)) = 10. Find xy.",
    "Alice and Bob play the following game. A stack of n tokens lies before them. The players take turns with Alice going first. On each turn, the player removes either 1 token or 4 tokens from the stack. Whoever removes the last token wins. Find the number of positive integers n less than or equal to 2024 for which there exists a strategy that guarantees that Bob wins.",
    "Jen enters a lottery by picking 4 distinct numbers from S = {1, 2, 3, ..., 9, 10}. 4 numbers are randomly drawn from S. Jen wins a prize if at least two of her numbers were drawn, and she wins the grand prize if all four of her numbers were drawn. The probability of winning the grand prize given that Jen won a prize is m/n, where m and n are relatively prime positive integers. Find m + n.",
    "Rectangle ABCD has dimensions AB = 107 and BC = 16, and rectangle EFGH has dimensions EF = 184 and FG = 17. Points D, E, C, F lie on line DF in that order, and A and H lie on opposite sides of line DF. Points A, D, H, G lie on a common circle. Find CE.",
    "Consider paths of length 16 that follow the edges from the lower left corner to the upper right corner of an 8 x 8 grid. Find the number of such paths that change direction exactly four times.",
    "Find the largest possible real part of (75 + 117i)*z + (96 + 144i)/z where z is a complex number with |z| = 4.",
    "Eight circles of radius 34 are sequentially tangent to each other and to side BC of triangle ABC, with the first tangent to AB and the last tangent to AC. Similarly, 2024 circles of radius 1 are sequentially tangent to each other and to side BC, with the first tangent to AB and the last tangent to AC. The inradius of triangle ABC can be expressed as m/n, where m and n are relatively prime positive integers. Find m + n.",
    "Let A, B, C, D be points on the hyperbola x^2/20 - y^2/24 = 1 such that ABCD is a rhombus whose diagonals intersect at the origin. Find the greatest real number that is less than BD^2 for all such rhombi.",
    "Let triangle ABC have side lengths AB = 5, BC = 9, and CA = 10. The tangents to the circumcircle of triangle ABC at B and C intersect at point D, and AD intersects the circumcircle at P (not equal to A). The length AP is m/n, where m and n are relatively prime positive integers. Find m + n.",
    "Each vertex of a regular octagon is independently colored either red or blue with equal probability. The probability that the octagon can then be rotated so that all of the blue vertices end up at positions where there had been red vertices is m/n, where m and n are relatively prime positive integers. Find m + n.",
    "Define f(x) = ||x| - 1/2| and g(x) = ||x| - 1/4|. Find the number of intersections of the graphs of y = 4*g(f(sin(2*pi*x))) and x = 4*g(f(cos(3*pi*y))).",
    "Let p be the least prime number for which there exists a positive integer n such that n^4 + 1 is divisible by p^2. Find the least positive integer m such that m^4 + 1 is divisible by p^2.",
    "Let ABCD be a tetrahedron such that AB = CD = sqrt(41), AC = BD = sqrt(80), and BC = AD = sqrt(89). There exists a point I inside the tetrahedron such that the distances from I to each of the faces of the tetrahedron are all equal. This distance can be written in the form m*sqrt(n)/p, where m, n, and p are positive integers, m and p are relatively prime, and n is not divisible by the square of any prime. Find m + n + p.",
    "Let B be the set of rectangular boxes with surface area 54 and volume 23. Let r be the radius of the smallest sphere that can contain each of the rectangular boxes that are elements of B. The value of r^2 can be written as p/q, where p and q are relatively prime positive integers. Find p + q.",
]

problems[(2024, "AIME II")] = [
    "Among the 900 residents of Aimeville, there are 195 who own a diamond ring, 367 who own a set of golf clubs, and 562 who own a garden spade. In addition, each of the 900 residents owns a bag of candy hearts. There are 437 residents who own exactly two of these things, and 234 residents who own exactly three of these things. Find the number of residents of Aimeville who own all four of these things.",
    "A list of positive integers has the following properties: the sum of the items in the list is 30; the unique mode of the list is 9; the median of the list is a positive integer that does not appear in the list itself. Find the sum of the squares of all the items in the list.",
    "Find the number of ways to place a digit in each cell of a 2 x 3 grid so that the sum of the two numbers formed by reading left to right is 999, and the sum of the three numbers formed by reading top to bottom is 99.",
    "Let x, y, and z be positive real numbers that satisfy the following system of equations: log_2(x/(yz)) = 1/2, log_2(y/(xz)) = 1/3, log_2(z/(xy)) = 1/4. Then the value of |log_2(x^4 * y^3 * z^2)| can be written as m/n, where m and n are relatively prime positive integers. Find m + n.",
    "Let ABCDEF be a convex equilateral hexagon in which all pairs of opposite sides are parallel. The triangle whose sides are extensions of segments AB, CD, and EF has side lengths 200, 240, and 300. Find the side length of the hexagon.",
    "Alice chooses a set A of positive integers. Then Bob lists all finite nonempty sets B of positive integers with the property that the maximum element of B belongs to A. Bob's list has 2024 sets in it. Find the sum of the elements of A.",
    "Let N be the greatest four-digit integer with the property that whenever one of its digits is changed to 1, the resulting four-digit number is divisible by 7. Let Q and R be the quotient and remainder, respectively, when N is divided by 1000. Find Q + R.",
    "Torus T is the surface produced by revolving a circle with radius 3 around an axis in the plane of the circle that is a distance 6 from the center of the circle. Let S be a sphere with radius 11. When T rests on the inside of S, it is internally tangent to S along a circle with radius r_i, and when T rests on the outside of S, it is externally tangent to S along a circle with radius r_o. The value r_i - r_o can be written as m/n, where m and n are relatively prime positive integers. Find m + n.",
    "There is a collection of 25 indistinguishable white chips and 25 indistinguishable black chips. Find the number of ways to place some of these chips in the 25 unit cells of a 5 x 5 grid such that: each cell contains at most one chip; all chips in the same row and all chips in the same column have the same color; and any additional chip placed on the grid would violate one or more of the previous two conditions.",
    "Let triangle ABC have incenter I and circumcenter O with inradius 6 and circumradius 13. Given that IA is perpendicular to OI, find AB * AC.",
    "Find the number of triples of nonnegative integers (a, b, c) satisfying a + b + c = 300 and a^2*b + a^2*c + b^2*a + b^2*c + c^2*a + c^2*b = 6,000,000.",
    "Let O = (0, 0), A = (1/2, 0), and B = (0, sqrt(3)/2) be points in the coordinate plane. Let F be the family of segments PQ of unit length lying in the first quadrant with P on the x-axis and Q on the y-axis. There is a unique point C on AB, distinct from A and B, that does not belong to any member of F other than AB. Then OC^2 = p/q, where p and q are relatively prime positive integers. Find p + q.",
    "Let omega be a primitive 13th root of unity (omega != 1). Find the remainder when the product from k = 0 to 12 of (2 - 2*omega^k + omega^(2k)) is divided by 1000.",
    "Let b >= 2 be an integer. Call a positive integer n b-eautiful if it has exactly 2 digits when expressed in base b and these two digits sum to sqrt(n). For example, 81 is 13-eautiful because 81 = 63 in base 13 and 6 + 3 = sqrt(81). Find the least integer b >= 2 for which there are more than ten b-eautiful integers.",
    "Find the number of rectangles that can be formed inside a fixed regular dodecagon where each side of the rectangle lies on either a side or a diagonal of the dodecagon.",
]

problems[(2025, "AIME I")] = [
    "Find the sum of all integer bases b > 9 for which 17_b is a divisor of 97_b.",
    "In triangle ABC, points A, D, E, and B lie in that order on side AB with AD = 4, DE = 16, and EB = 8. Points A, F, G, and C lie in that order on side AC with AF = 13, FG = 52, and GC = 26. Let M be the reflection of D through F, and let N be the reflection of G through E. Quadrilateral DEGF has area 288. Find the area of heptagon AFNBCEM.",
    "The 9 members of a baseball team went to an ice cream parlor after their game. Each player had a single scoop cone of chocolate, vanilla, or strawberry ice cream. At least one player chose each flavor, and the number of players who chose chocolate was greater than the number who chose vanilla, which was greater than the number who chose strawberry. Let N be the number of different assignments of flavors to players that meet these conditions. Find the remainder when N is divided by 1000.",
    "Find the number of ordered pairs (x, y), where both x and y are integers between -100 and 100 inclusive, such that 12x^2 - xy - 6y^2 = 0.",
    "There are 8! = 40320 eight-digit positive integers that use each of the digits 1, 2, 3, 4, 5, 6, 7, 8 exactly once. Let N be the number of these integers that are divisible by 22. Find the difference between N and 2025.",
    "An isosceles trapezoid has an inscribed circle tangent to each of its four sides. The radius of the circle is 3, and the area of the trapezoid is 72. Let the parallel sides have lengths r and s, with r != s. Find r^2 + s^2.",
    "The twelve letters A, B, C, D, E, F, G, H, I, J, K, and L are randomly grouped into six pairs of letters. The two letters in each pair are placed next to each other in alphabetical order to form six two-letter words, and then those six words are listed alphabetically. The probability that the last word listed contains G is m/n, where m and n are relatively prime positive integers. Find m + n.",
    "Let k be a real number such that the system |25 + 20i - z| = 5 and |z - 4 - k| = |z - 3i - k| has exactly one complex solution z. The sum of all possible values of k can be written as m/n, where m and n are relatively prime positive integers. Find m + n.",
    "The parabola with equation y = x^2 - 4 is rotated 60 degrees counterclockwise around the origin. The unique point in the fourth quadrant where the original parabola and its image intersect has y-coordinate (a - sqrt(b))/c, where a, b, and c are positive integers, and a and c are relatively prime. Find a + b + c.",
    "The 27 cells of a 3 x 9 grid are filled in using the numbers 1 through 9 so that each row contains 9 different numbers, and each of the three 3 x 3 blocks contains 9 different numbers, as in the first three rows of a Sudoku puzzle. The number of ways to fill such a grid can be written as p^a * q^b * r^c * s^d where p, q, r, and s are distinct primes and a, b, c, d are positive integers. Find p*a + q*b + r*c + s*d.",
    "A piecewise linear function is defined by f(x) = x if -1 <= x < 1 and f(x) = 2 - x if 1 <= x < 3, with f(x + 4) = f(x) for all real numbers x. The parabola x = 34y^2 intersects the graph of f at finitely many points. The sum of the y-coordinates of these points can be expressed as (a + b*sqrt(c))/d, where a, b, c, d are positive integers with gcd(a, b, d) = 1 and c is squarefree. Find a + b + c + d.",
    "The set of points in 3-dimensional coordinate space that lie in the plane x + y + z = 75 whose coordinates satisfy the inequalities x - yz < y - zx < z - xy forms three disjoint convex regions. Exactly one of those regions has finite area. The area of this finite region can be expressed in the form a*sqrt(b), where a and b are positive integers and b is squarefree. Find a + b.",
    "Alex divides a disk into four quadrants with two perpendicular diameters intersecting at the center of the disk. He draws 25 more line segments through the disk, each connecting two randomly chosen points on the boundary in different quadrants. Find the expected number of regions into which these 27 line segments divide the disk.",
    "Let ABCDE be a convex pentagon with AB = 14, BC = 7, CD = 24, DE = 13, EA = 26, and angle B = angle E = 60 degrees. For each point X in the plane, define f(X) = AX + BX + CX + DX + EX. The least possible value of f(X) can be expressed as m + n*sqrt(p), where m and n are positive integers and p is not divisible by the square of any prime. Find m + n + p.",
    "Let N denote the number of ordered triples of positive integers (a, b, c) such that a, b, c <= 3^6 and a^3 + b^3 + c^3 is a multiple of 3^7. Find the remainder when N is divided by 1000.",
]

problems[(2025, "AIME II")] = [
    "Six points A, B, C, D, E, and F lie in a straight line in that order. G is a point not on the line such that AC = 26, BD = 22, CE = 31, DF = 33, AF = 73, CG = 40, and DG = 30. Find the area of triangle BGE.",
    "Find the sum of all positive integers n such that n + 2 divides the product 3(n + 3)(n^2 + 9).",
    "Four unit squares form a 2 x 2 grid. Each of the 12 unit line segments forming the sides of the squares is colored either red or blue such that each unit square has exactly 2 red sides and 2 blue sides. Find the number of such colorings.",
    "Evaluate the product from k = 4 to 63 of log_k(5^(k^2-1)) / log_(k+1)(5^(k^2-4)), written as m/n in lowest terms. Find m + n.",
    "Triangle ABC has angles BAC = 84 degrees, ABC = 60 degrees, and ACB = 36 degrees. Points D, E, F are the midpoints of BC, AC, AB respectively. The circumcircle of triangle DEF intersects segments BD, AE, AF at points G, H, J respectively (other than D, E, F). Find the degree measure of angle GHJ + 2 * angle HJF + 3 * angle FGD.",
    "Circle omega_1 with radius 6 and center A is internally tangent to circle omega_2 with radius 15 at point B. Points C and D lie on omega_2 such that BC is a diameter of omega_2 and BC is perpendicular to AD. Rectangle EFGH is inscribed in omega_1 with EF perpendicular to BC. Triangles DGF and CHG have equal areas. The area of rectangle EFGH can be written as m/n where m and n are relatively prime positive integers. Find m + n.",
    "Let A be the set of positive integer divisors of 2025. A subset B of A is selected at random. The probability that B is nonempty and the least common multiple of its elements equals 2025 is m/n, where m and n are relatively prime positive integers. Find m + n.",
    "Using the greedy algorithm to make change with 1-cent, 10-cent, and 25-cent coins, find the number of values N between 1 and 1000 inclusive for which the greedy algorithm succeeds (uses the minimum number of coins).",
    "Let f(x) = sin(7*pi*sin(5x)). Let n be the number of values of x in (0, 2*pi) where f(x) = 0, and let t be the number of those x values where the graph of f is tangent to the x-axis. Find n + t.",
    "Sixteen chairs are arranged in a row. Eight people each select a chair in which to sit so that no person sits next to two other people. Let N be the number of subsets of 8 chairs that could be selected. Find the remainder when N is divided by 1000.",
    "Let S be the set of vertices of a regular 24-gon. Find the number of ways to draw 12 segments of equal length with endpoints in S such that each vertex in S is an endpoint of exactly one of the 12 segments.",
    "Polygon A_1A_2...A_11 is an 11-sided polygon with the property that the area of triangle A_i A_1 A_(i+1) equals 1 for 2 <= i <= 10, and cos(angle A_i A_1 A_(i+1)) = 12/13 for the same range. The perimeter of the polygon is 20. The value of A_1A_2 + A_1A_11 can be expressed as (m*sqrt(n) - p)/q where m, n, p, q are positive integers. Find m + n + p + q.",
    "A sequence is defined by x_1 = 25/11, and x_(k+1) = (1/3)(x_k + 1/(x_k) - 1) for k >= 1. Express x_2025 as m/n in lowest terms. Find the remainder when m + n is divided by 1000.",
    "Right triangle ABC has angle A = 90 degrees and BC = 38. Points K and L lie inside the triangle such that AK = AL = BK = CL = KL = 14. The area of quadrilateral BKLC is n*sqrt(3). Find n.",
    "Find the sum of exactly three positive real values of k for which the function f(x) = (x - 18)(x - 72)(x - 98)(x - k)/x achieves its minimum value at exactly two positive real values of x.",
]

# Generate all problem entries
all_problems = []

for year in [2020, 2021, 2022, 2023, 2024, 2025]:
    for contest in ["AIME I", "AIME II"]:
        key = (year, contest)
        if key not in problems:
            continue
        probs = problems[key]
        answers = answer_keys[key]
        source = f"https://artofproblemsolving.com/wiki/index.php/{year}_{contest.replace(' ', '_')}_Problems"

        for i, prob_text in enumerate(probs):
            num = i + 1
            ans = answers[i]
            # Strip leading zeros for the answer value
            ans_int = str(int(ans))

            entry = {
                "contest": contest,
                "year": year,
                "number": num,
                "topic": classify_topic(prob_text, num),
                "difficulty": difficulty(num),
                "problem": prob_text,
                "choices": None,
                "correct_answer": ans_int,
                "correct_value": ans_int,
                "solution": "See AoPS wiki for detailed solution.",
                "track": "math",
                "source_link": source
            }
            all_problems.append(entry)

# Write the JSON file
output_path = "/Users/krishnaharish/olympiadAI/scripts/data/aime_all.json"
with open(output_path, "w") as f:
    json.dump(all_problems, f, indent=2, ensure_ascii=False)

print(f"Wrote {len(all_problems)} problems to {output_path}")

# Print summary
for year in [2020, 2021, 2022, 2023, 2024, 2025]:
    for contest in ["AIME I", "AIME II"]:
        count = sum(1 for p in all_problems if p["year"] == year and p["contest"] == contest)
        print(f"  {year} {contest}: {count} problems")
