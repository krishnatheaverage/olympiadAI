#!/usr/bin/env python3
"""Build AMC 12A JSON data file from parsed AoPS wiki data."""
import json
import os

problems = []

def add(year, num, problem, choices, answer, topic, contest_label="AMC 12A"):
    diff = "easy" if num <= 8 else ("medium" if num <= 18 else "hard")
    choice_map = {chr(65+i): c for i, c in enumerate(choices)}
    correct_value = choice_map.get(answer, "")
    slug_year = str(year)
    if "Fall" in contest_label:
        slug = f"{year}_Fall_AMC_12A_Problems"
    else:
        slug = f"{year}_AMC_12A_Problems"
    problems.append({
        "contest": contest_label,
        "year": year,
        "number": num,
        "topic": topic,
        "difficulty": diff,
        "problem": problem,
        "choices": choices,
        "correct_answer": answer,
        "correct_value": correct_value,
        "solution": "See AoPS wiki for detailed solution.",
        "track": "math",
        "source_link": f"https://artofproblemsolving.com/wiki/index.php/{slug}"
    })

# =====================================================================
# 2020 AMC 12A
# =====================================================================
ans = list("CCEBCDBCEEBBBBD BDDCADBABC".replace(" ",""))
# answers: C C E B C D B C E E B B B B D B D D C A D B A B C

add(2020, 1, "Carlos took 70% of a whole pie. Maria took one third of the remainder. What portion of the whole pie was left?", ["10%","15%","20%","30%","35%"], "C", "Algebra")
add(2020, 2, "The acronym AMC is shown in a rectangular grid with grid lines spaced 1 unit apart. In units, what is the sum of the lengths of the line segments that form the acronym AMC?", ["17","15 + 2*sqrt(2)","13 + 4*sqrt(2)","11 + 6*sqrt(2)","21"], "C", "Geometry")
add(2020, 3, "A driver travels for 2 hours at 60 miles per hour, during which her car gets 30 miles per gallon of gasoline. She is paid $0.50 per mile, and her only expense is gasoline at $2.00 per gallon. What is her net rate of pay, in dollars per hour, after this expense?", ["20","22","24","25","26"], "E", "Algebra")
add(2020, 4, "How many 4-digit positive integers (between 1000 and 9999, inclusive) having only even digits are divisible by 5?", ["80","100","125","200","500"], "B", "Number Theory")
add(2020, 5, "The 25 integers from -10 to 14, inclusive, can be arranged to form a 5-by-5 square in which the sum of the numbers in each row, column, and along each main diagonal are all the same. What is the value of this common sum?", ["2","5","10","25","50"], "C", "Algebra")
add(2020, 6, "In a plane figure, 3 unit squares have been shaded. What is the least number of additional unit squares that must be shaded so that the resulting figure has two lines of symmetry?", ["4","5","6","7","8"], "D", "Geometry")
add(2020, 7, "Seven cubes with volumes 1, 8, 27, 64, 125, 216, and 343 cubic units are stacked vertically with volumes decreasing from bottom to top. Except for the bottom cube, the bottom face of each cube lies completely on top of the cube below it. What is the total surface area of the tower (including the bottom) in square units?", ["644","658","664","720","749"], "B", "Geometry")
add(2020, 8, "What is the median of the list of 4040 numbers: 1, 2, 3, ..., 2020, 1^2, 2^2, 3^2, ..., 2020^2?", ["1974.5","1975.5","1976.5","1977.5","1978.5"], "C", "Algebra")
add(2020, 9, "How many solutions does the equation tan(2x) = cos(x/2) have on the interval [0, 2*pi]?", ["1","2","3","4","5"], "E", "Algebra")
add(2020, 10, "There is a unique positive integer n such that log_2(log_16(n)) = log_4(log_4(n)). What is the sum of the digits of n?", ["4","7","8","11","13"], "E", "Algebra")
add(2020, 11, "A frog at point (1, 2) jumps with length 1 parallel to coordinate axes in random directions. The sequence ends when reaching a side of the square with vertices (0,0), (0,4), (4,4), and (4,0). What is the probability the sequence ends on a vertical side?", ["1/2","5/8","2/3","3/4","7/8"], "B", "Probability")
add(2020, 12, "Line l has equation 3x - 5y + 40 = 0. This line is rotated 45 degrees counterclockwise about the point (20, 20) to obtain line k. What is the x-coordinate of the x-intercept of line k?", ["10","15","20","25","30"], "B", "Geometry")
add(2020, 13, "There are integers a, b, and c, each greater than 1, such that the a-th root of (N times the b-th root of (N times the c-th root of N)) equals the 36th root of N^25 for all N > 1. What is b?", ["2","3","4","5","6"], "B", "Algebra")
add(2020, 14, "Regular octagon ABCDEFGH has area n. Let m be the area of quadrilateral ACEG. What is m/n?", ["sqrt(2)/4","sqrt(2)/2","3/4","3*sqrt(2)/5","2*sqrt(2)/3"], "B", "Geometry")
add(2020, 15, "Let A be the set of solutions to z^3 - 8 = 0 and B be the set of solutions to z^3 - 8z^2 - 8z + 64 = 0 in the complex plane. What is the greatest distance between a point of A and a point of B?", ["2*sqrt(3)","6","9","2*sqrt(21)","9 + sqrt(3)"], "D", "Algebra")
add(2020, 16, "A point is chosen at random within a square with vertices (0,0), (2020,0), (2020,2020), and (0,2020). The probability that the point is within d units of a lattice point is 1/2. What is d to the nearest tenth?", ["0.3","0.4","0.5","0.6","0.7"], "B", "Probability")
add(2020, 17, "The vertices of a quadrilateral lie on the graph of y = ln(x), and the x-coordinates of these vertices are consecutive positive integers. The area of the quadrilateral is ln(91/90). What is the x-coordinate of the leftmost vertex?", ["6","7","10","12","13"], "D", "Algebra")
add(2020, 18, "Quadrilateral ABCD satisfies angle ABC = angle ACD = 90 degrees, AC = 20, and CD = 30. Diagonals AC and BD intersect at point E, and AE = 5. What is the area of quadrilateral ABCD?", ["330","340","350","360","370"], "D", "Geometry")
add(2020, 19, "There exists a unique strictly increasing sequence of nonnegative integers a_1 < a_2 < ... < a_k such that (2^289 + 1)/(2^17 + 1) = 2^(a_1) + 2^(a_2) + ... + 2^(a_k). What is k?", ["117","136","137","273","306"], "C", "Number Theory")
add(2020, 20, "Triangle T has vertices (0,0), (4,0), and (0,3). Consider five isometries: rotations of 90, 180, and 270 degrees counterclockwise about the origin, reflection across the x-axis, and reflection across the y-axis. How many of the 125 sequences of three transformations will return T to its original position?", ["12","15","17","20","25"], "A", "Combinatorics")
add(2020, 21, "How many positive integers n are there such that n is a multiple of 5, and lcm(5!, n) = 5 * gcd(10!, n)?", ["12","24","36","48","72"], "D", "Number Theory")
add(2020, 22, "Let (a_n) and (b_n) be sequences of real numbers such that (2 + i)^n = a_n + b_n*i for all integers n >= 0. What is the sum from n=0 to infinity of (a_n * b_n) / 7^n?", ["3/8","7/16","1/2","9/16","4/7"], "B", "Algebra")
add(2020, 23, "Jason rolls three fair six-sided dice. He then chooses a subset of the dice to reroll. After rerolling, he wins if and only if the sum is exactly 7. Jason always plays optimally. What is the probability that he chooses to reroll exactly two of the dice?", ["7/36","5/24","2/9","17/72","1/4"], "A", "Probability")
add(2020, 24, "Suppose triangle ABC is an equilateral triangle of side length s, with a unique point P inside such that AP = 1, BP = sqrt(3), and CP = 2. What is s?", ["1 + sqrt(2)","sqrt(7)","8/3","sqrt(5 + sqrt(5))","2*sqrt(2)"], "B", "Geometry")
add(2020, 25, "The number a = p/q (where p and q are relatively prime positive integers) has the property that the sum of all real numbers x satisfying floor(x) * {x} = a * x^2 is 420, where {x} = x - floor(x). What is p + q?", ["245","593","929","1331","1332"], "C", "Number Theory")

# =====================================================================
# 2021 AMC 12A
# =====================================================================
add(2021, 1, "What is the value of 2^(1+2+3) - (2^1 + 2^2 + 2^3)?", ["0","50","52","54","57"], "B", "Algebra")
add(2021, 2, "Under what conditions is sqrt(a^2 + b^2) = a + b true, where a and b are real numbers?", ["It is never true","It is true if and only if ab = 0","It is true if and only if a + b >= 0","It is true if and only if ab = 0 and a + b >= 0","It is always true"], "D", "Algebra")
add(2021, 3, "The sum of two natural numbers is 17,402. One is divisible by 10. If the units digit of that number is erased, the other number is obtained. What is the difference?", ["10,272","11,700","13,362","14,238","15,426"], "D", "Algebra")
add(2021, 4, "Tom has 13 snakes: 4 purple and 5 happy. All happy snakes can add. No purple snakes can subtract. All snakes that can't subtract also can't add. Which conclusion follows?", ["Purple snakes can add","Purple snakes are happy","Snakes that can add are purple","Happy snakes are not purple","Happy snakes can't subtract"], "D", "Logic")
add(2021, 5, "A student multiplied 66 by 1.abab... (repeating) but mistakenly computed 66 * 1.ab instead. His answer was 0.5 less than correct. What is the 2-digit number ab?", ["15","30","45","60","75"], "E", "Algebra")
add(2021, 6, "A deck has only red and black cards. P(red) = 1/3. When 4 black cards are added, P(red) = 1/4. How many cards were in the deck originally?", ["6","9","12","15","18"], "C", "Algebra")
add(2021, 7, "What is the least possible value of (xy - 1)^2 + (x + y)^2?", ["0","1/4","1/2","1","2"], "D", "Algebra")
add(2021, 8, "Sequence: D_0 = 0, D_1 = 0, D_2 = 1, D_n = D_(n-1) + D_(n-3) for n >= 3. What are the parities of (D_2021, D_2022, D_2023)?", ["(odd, even, odd)","(even, even, odd)","(even, odd, even)","(odd, odd, even)","(odd, odd, odd)"], "C", "Number Theory")
add(2021, 9, "Which expression equals (2+3)(2^2+3^2)(2^4+3^4)(2^8+3^8)(2^16+3^16)(2^32+3^32)(2^64+3^64)?", ["3^127 + 2^127","3^127 + 2^127 + 2*3^63 + 3*2^63","3^128 - 2^128","3^128 + 2^128","5^127"], "C", "Algebra")
add(2021, 10, "Two cones with vertices down contain equal liquid volumes. Liquid surface radii are 3 cm and 6 cm. A marble of radius 1 cm sinks into each. What is the ratio of liquid rise in narrow cone to wide cone?", ["1:1","47:43","2:1","40:13","4:1"], "E", "Geometry")
add(2021, 11, "A laser at (3,5) bounces off the y-axis, then x-axis, then hits (7,5). What is total distance traveled?", ["2*sqrt(10)","5*sqrt(2)","10*sqrt(2)","15*sqrt(2)","10*sqrt(5)"], "C", "Geometry")
add(2021, 12, "All roots of z^6 - 10z^5 + Az^4 + Bz^3 + Cz^2 + Dz + 16 are positive integers. What is B?", ["-88","-80","-64","-41","-40"], "A", "Algebra")
add(2021, 13, "Which complex number z has the property that z^5 has the greatest real part?", ["-2","-sqrt(3) + i","-sqrt(2) + sqrt(2)*i","-1 + sqrt(3)*i","2i"], "B", "Algebra")
add(2021, 14, "What is (sum from k=1 to 20 of log_(5^k)(3^(k^2))) * (sum from k=1 to 100 of log_(9^k)(25^k))?", ["21","100*log_5(3)","200*log_3(5)","2200","21000"], "E", "Algebra")
add(2021, 15, "Select singers: 6 tenors, 8 basses. Difference in numbers must be a multiple of 4. Group needs at least one. How many groups N? Find N mod 100.", ["47","48","83","95","96"], "D", "Combinatorics")
add(2021, 16, "List where integer n appears n times for 1 <= n <= 200: 1, 2, 2, 3, 3, 3, ... What is the median?", ["100.5","134","142","150.5","167"], "C", "Algebra")
add(2021, 17, "Trapezoid ABCD: AB parallel to CD, BC = CD = 43, AD perpendicular to BD. Diagonals intersect at O. P is midpoint of BD. OP = 11. AD = m*sqrt(n). What is m + n?", ["65","132","157","194","215"], "D", "Geometry")
add(2021, 18, "Function f on positive rationals: f(a*b) = f(a) + f(b), f(p) = p for primes p. For which x is f(x) < 0?", ["17/32","11/16","7/9","7/6","25/11"], "E", "Number Theory")
add(2021, 19, "How many solutions to sin(pi/2 * cos(x)) = cos(pi/2 * sin(x)) in [0, pi]?", ["0","1","2","3","4"], "C", "Algebra")
add(2021, 20, "Parabola with vertex V and focus F. Point A: AF = 20, AV = 21. What is the sum of all possible FV values?", ["13","40/3","41/3","14","43/3"], "B", "Geometry")
add(2021, 21, "Roots of (z-1)(z^2+2z+4)(z^2+4z+6) = 0 written as x_k + y_k*i. Ellipse passes through five points. Eccentricity = sqrt(m/n). What is m + n?", ["7","9","11","13","15"], "A", "Geometry")
add(2021, 22, "Roots of P(x) = x^3 + ax^2 + bx + c are cos(2*pi/7), cos(4*pi/7), cos(6*pi/7). What is abc?", ["-3/49","-1/28","cbrt(7)/64","1/32","1/28"], "D", "Algebra")
add(2021, 23, "Frieda on 3x3 grid, center start, random hops (up/down/left/right), wraps around. Stops at corners. At most 4 hops. Probability of reaching corner?", ["9/16","5/8","3/4","25/32","13/16"], "D", "Probability")
add(2021, 24, "Semicircle Gamma: diameter AB = 14. Circle Omega tangent to AB at P, intersects Gamma at Q, R. QR = 3*sqrt(3), angle QPR = 60 degrees. Area of triangle PQR = a*sqrt(b)/c. What is a + b + c?", ["110","114","118","122","126"], "D", "Geometry")
add(2021, 25, "d(n) = number of positive divisors of n. f(n) = d(n) / cbrt(n). Unique N maximizes f(N). Sum of digits of N?", ["5","6","7","8","9"], "E", "Number Theory")

# =====================================================================
# 2021 Fall AMC 12A
# =====================================================================
add(2021, 1, "What is the value of (2112 - 2021)^2 / 169?", ["7","21","49","64","91"], "C", "Algebra", "2021 Fall AMC 12A")
add(2021, 2, "Menkara has a 4 x 6 index card. If she shortens the length of one side by 1 inch, the card would have area 18 square inches. What would the area be if instead she shortens the other side by 1 inch?", ["16","17","18","19","20"], "E", "Algebra", "2021 Fall AMC 12A")
add(2021, 3, "Mr. Lopez has two routes to work. Route A is 6 miles at 30 mph. Route B is 5 miles at 40 mph except for a 1/2-mile school zone at 20 mph. By how many minutes is Route B quicker?", ["2 3/4","3 3/4","4 1/2","5 1/2","6 3/4"], "B", "Algebra", "2021 Fall AMC 12A")
add(2021, 4, "The six-digit number 2021 0A is prime for only one digit A. What is A?", ["1","3","5","7","9"], "E", "Number Theory", "2021 Fall AMC 12A")
add(2021, 5, "Elmer takes 44 equal strides to walk between consecutive telephone poles. Oscar covers the same distance in 12 equal leaps. The 41st pole is exactly one mile (5280 feet) from the first pole. How much longer, in feet, is Oscar's leap than Elmer's stride?", ["6","8","10","11","15"], "B", "Algebra", "2021 Fall AMC 12A")
add(2021, 6, "Point E lies opposite to point A across line CD such that angle CDE = 110 degrees. Point F lies on AD with DE = DF, and ABCD is a square. What is the degree measure of angle AFE?", ["160","164","166","170","174"], "D", "Geometry", "2021 Fall AMC 12A")
add(2021, 7, "A school has 100 students and 5 teachers. Class enrollments are 50, 20, 20, 5, and 5. Let t be the average class size picked by a random teacher. Let s be the average class size picked by a random student. What is t - s?", ["-18.5","-13.5","0","13.5","18.5"], "B", "Algebra", "2021 Fall AMC 12A")
add(2021, 8, "Let M be the LCM of integers 10 through 30. Let N be the LCM of M, 32, 33, 34, 35, 36, 37, 38, 39, and 40. What is N/M?", ["1","2","37","74","2886"], "D", "Number Theory", "2021 Fall AMC 12A")
add(2021, 9, "A right rectangular prism has surface area and volume numerically equal, with edge lengths log_2(x), log_3(x), and log_4(x). What is x?", ["2*sqrt(6)","6*sqrt(6)","24","48","576"], "E", "Algebra", "2021 Fall AMC 12A")
add(2021, 10, "The base-nine representation of N is 27,006,000,052 (base 9). What is the remainder when N is divided by 5?", ["0","1","2","3","4"], "D", "Number Theory", "2021 Fall AMC 12A")
add(2021, 11, "Two concentric circles have radii 17 and 19. The larger circle has a chord with half its length inside the smaller circle. What is the chord length?", ["12*sqrt(2)","10*sqrt(3)","sqrt(17*19)","18","8*sqrt(6)"], "E", "Geometry", "2021 Fall AMC 12A")
add(2021, 12, "How many terms with rational coefficients appear in the expansion of (x*cbrt(2) + y*sqrt(3))^1000?", ["0","166","167","500","501"], "C", "Combinatorics", "2021 Fall AMC 12A")
add(2021, 13, "The angle bisector of the acute angle formed at the origin by y = x and y = 3x has equation y = kx. What is k?", ["(1 + sqrt(5))/2","(1 + sqrt(7))/2","(2 + sqrt(3))/2","2","(2 + sqrt(5))/2"], "A", "Geometry", "2021 Fall AMC 12A")
add(2021, 14, "Equilateral hexagon ABCDEF has three nonadjacent 30-degree angles. The area is 6*sqrt(3). What is the perimeter?", ["4","4*sqrt(3)","12","18","12*sqrt(3)"], "E", "Geometry", "2021 Fall AMC 12A")
add(2021, 15, "Let f(z) = 4i * conjugate(z). Polynomial P(z) = z^4 + 4z^3 + 3z^2 + 2z + 1 has roots z_1, z_2, z_3, z_4. Polynomial Q(z) has roots f(z_1), f(z_2), f(z_3), f(z_4). What is B + D (the z^2 and constant coefficients of Q)?", ["-304","-208","12i","208","304"], "D", "Algebra", "2021 Fall AMC 12A")
add(2021, 16, "An organization has 30 employees: 20 with brand A computers, 10 with brand B. Cables connect A to B only. A technician randomly connects computers until all can communicate. What is the maximum possible number of cables?", ["190","191","192","195","196"], "B", "Combinatorics", "2021 Fall AMC 12A")
add(2021, 17, "For how many ordered pairs (b, c) of positive integers do neither x^2 + bx + c = 0 nor x^2 + cx + b = 0 have two distinct real solutions?", ["4","6","8","12","16"], "B", "Algebra", "2021 Fall AMC 12A")
add(2021, 18, "Twenty balls are tossed into 5 bins. Let p = probability of bins with 3, 5, 4, 4, 4 balls. Let q = probability of all bins with 4 balls. What is p/q?", ["1","4","8","12","16"], "E", "Probability", "2021 Fall AMC 12A")
add(2021, 19, "Let x be the least real number greater than 1 where sin(x) = sin(x^2) in degrees. What is x rounded up to the nearest integer?", ["10","13","14","19","20"], "B", "Algebra", "2021 Fall AMC 12A")
add(2021, 20, "Let f_1(n) = twice the number of positive divisors of n. For j >= 2, let f_j(n) = f_1(f_(j-1)(n)). For how many n <= 50 is f_50(n) = 12?", ["7","8","9","10","11"], "D", "Number Theory", "2021 Fall AMC 12A")
add(2021, 21, "Isosceles trapezoid ABCD has BC parallel to AD, AB = CD. Points X and Y lie on AC with angle AXD = angle BYC = 90 degrees, AX = 3, XY = 1, YC = 2. What is the area of ABCD?", ["15","5*sqrt(11)","3*sqrt(35)","18","7*sqrt(7)"], "C", "Geometry", "2021 Fall AMC 12A")
add(2021, 22, "Azar and Carl play tic-tac-toe randomly. Carl wins when placing his third O. How many final board configurations are possible?", ["36","112","120","148","160"], "D", "Combinatorics", "2021 Fall AMC 12A")
add(2021, 23, "A quadratic with leading coefficient 1 is 'disrespectful' if p(p(x)) = 0 has exactly three real solutions. Among disrespectful polynomials, one uniquely maximizes the sum of roots. What is p_tilde(1)?", ["5/16","1/2","5/8","1","9/8"], "A", "Algebra", "2021 Fall AMC 12A")
add(2021, 24, "Convex quadrilateral ABCD has AB = 18, angle A = 60 degrees, AB parallel to CD. The four side lengths form an arithmetic progression (in some order) with AB as maximum. What is the sum of all possible values of a (another side length)?", ["24","42","60","66","84"], "E", "Geometry", "2021 Fall AMC 12A")
add(2021, 25, "Let m >= 5 be odd. D(m) counts quadruples (a_1, a_2, a_3, a_4) of distinct integers 1 <= a_i <= m where m divides a_1 + a_2 + a_3 + a_4. A polynomial q(x) = c_3*x^3 + c_2*x^2 + c_1*x + c_0 satisfies D(m) = q(m) for all odd m >= 5. What is c_1?", ["-6","-1","4","6","11"], "E", "Combinatorics", "2021 Fall AMC 12A")

# =====================================================================
# 2022 AMC 12A
# =====================================================================
add(2022, 1, "Evaluate: 3 + 1/(3 + 1/(3 + 1/3))", ["31/10","49/15","33/10","109/33","15/4"], "D", "Algebra")
add(2022, 2, "Three numbers sum to 96. The first is 6 times the third, and the third is 40 less than the second. Find the absolute difference between the first and second numbers.", ["1","2","3","4","5"], "E", "Algebra")
add(2022, 3, "Five rectangles (1x6, 2x4, 5x6, 2x7, 2x3) fill a square. Which rectangle is shaded in the middle?", ["A","B","C","D","E"], "B", "Geometry")
add(2022, 4, "Find the sum of digits of n, where lcm(n, 18) = 180 and gcd(n, 45) = 15.", ["3","6","8","9","12"], "B", "Number Theory")
add(2022, 5, "How many lattice points P satisfy taxicab distance from origin <= 20?", ["441","761","841","921","924"], "C", "Combinatorics")
add(2022, 6, "Dataset: 1, 7, 5, 2, 5, X. The average equals a value in the set. Find the sum of all possible X values.", ["10","26","32","36","40"], "D", "Algebra")
add(2022, 7, "A rectangle is divided into 5 regions to be colored with 5 colors such that adjacent regions differ. How many colorings exist?", ["120","270","360","540","720"], "D", "Combinatorics")
add(2022, 8, "Evaluate: 10^(1/3) * 10^(1/9) * 10^(1/27) * ...", ["sqrt(10)","100^(1/3)","1000^(1/4)","10","10*10^(1/3)"], "A", "Algebra")
add(2022, 9, "31 children are truth-tellers, liars, or alternaters. After three questions: 22 answered yes to 'Are you a truth-teller?', 15 to 'Are you an alternater?', 9 to 'Are you a liar?' How much candy did truth-tellers receive?", ["7","12","21","27","31"], "A", "Logic")
add(2022, 10, "Split integers 1-14 into 7 pairs where each pair's larger number is at least twice the smaller. How many ways?", ["108","120","126","132","144"], "E", "Combinatorics")
add(2022, 11, "Find the product of all x where |log_6(x) - log_6(9)| = 2|log_6(10) - 1|.", ["10","18","25","36","81"], "E", "Algebra")
add(2022, 12, "M is the midpoint of edge AB in regular tetrahedron ABCD. Find cos(angle CMD).", ["1/4","1/3","2/5","1/2","sqrt(3)/2"], "B", "Geometry")
add(2022, 13, "Region R consists of sums z_1 + z_2 where z_1 lies on segment from 3 to 4i, and |z_2| <= 1. What integer is closest to the area?", ["13","14","15","16","17"], "A", "Geometry")
add(2022, 14, "Evaluate: (log 5)^3 + (log 20)^3 + (log 8)(log 0.25) using base-10 logarithms.", ["3/2","7/4","2","9/4","3"], "C", "Algebra")
add(2022, 15, "The roots of 10x^3 - 39x^2 + 29x - 6 are box dimensions. Lengthen each edge by 2 units. Find new volume.", ["24/5","42/5","81/5","30","48"], "D", "Algebra")
add(2022, 16, "Triangular numbers that are perfect squares include t_1=1, t_8=36, t_49=1225. Find digit sum of the fourth such number.", ["6","9","12","18","27"], "D", "Number Theory")
add(2022, 17, "Find p + q + r where the solution set for a*(sin(x) + sin(2x)) = sin(3x) having multiple solutions in (0, pi) is (p, q) union (q, r).", ["-4","-1","0","1","4"], "A", "Algebra")
add(2022, 18, "Transformation T_k rotates k degrees counterclockwise then reflects across y-axis. Find least n where T_1, T_2, ..., T_n returns (1,0) to itself.", ["359","360","719","720","721"], "A", "Geometry")
add(2022, 19, "Cards 1-13 are picked in order left-to-right repeatedly. How many arrangements require exactly two passes?", ["4082","4095","4096","8178","8191"], "D", "Combinatorics")
add(2022, 20, "Isosceles trapezoid ABCD has point P with PA = 1, PB = 2, PC = 3, PD = 4. Find BC/AD.", ["1/4","1/3","1/2","2/3","3/4"], "B", "Geometry")
add(2022, 21, "Which polynomial divides P(x) = x^2022 + x^1011 + 1?", ["x^2 - x + 1","x^2 + x + 1","x^4 + 1","x^6 - x^3 + 1","x^6 + x^3 + 1"], "E", "Algebra")
add(2022, 22, "For z^2 - cz + 10 = 0 with roots z_1, z_2, the quadrilateral with vertices z_1, z_2, 1/z_1, 1/z_2 maximizes area when c equals approximately:", ["4.5","5","5.5","6","6.5"], "A", "Geometry")
add(2022, 23, "For harmonic sums h_n/k_n = 1 + 1/2 + ... + 1/n in lowest terms, how many n with 1 <= n <= 22 satisfy k_n < L_n (where L_n = lcm(1,...,n))?", ["0","3","7","8","10"], "D", "Number Theory")
add(2022, 24, "How many 5-digit strings from {0,1,2,3,4} have at least j digits less than j for each j in {1,2,3,4}?", ["500","625","1089","1199","1296"], "E", "Combinatorics")
add(2022, 25, "A circle with integer radius r centered at (r, r) has 14 tangent segments from (0, a_i) to (b_i, 0) with lengths c_i. Find c_14/c_1 for minimum r.", ["21/5","85/13","7","39/5","17"], "E", "Geometry")

# =====================================================================
# 2023 AMC 12A
# =====================================================================
add(2023, 1, "Cities A and B are 45 miles apart. Alicia lives in A and bikes toward B at 18 mph. Beth lives in B and bikes toward A at 12 mph. How many miles from City A will they meet?", ["20","24","25","26","27"], "E", "Algebra")
add(2023, 2, "The weight of 1/3 of a large pizza plus 3.5 cups of orange slices equals 3/4 of a large pizza plus 1/2 cup of orange slices. A cup of orange slices weighs 1/4 pound. What is the weight of a large pizza in pounds?", ["1 4/5","2","2 2/5","3","3 3/5"], "A", "Algebra")
add(2023, 3, "How many positive perfect squares less than 2023 are divisible by 5?", ["8","9","10","11","12"], "A", "Number Theory")
add(2023, 4, "How many digits are in the base-ten representation of 8^5 * 5^10 * 15^5?", ["14","15","16","17","18"], "E", "Number Theory")
add(2023, 5, "Janet rolls a standard 6-sided die 4 times and keeps a running total. What is the probability that at some point her running total equals 3?", ["2/9","49/216","25/108","17/72","13/54"], "B", "Probability")
add(2023, 6, "Points A and B lie on y = log_2(x). The midpoint of AB is (6, 2). What is the positive difference between the x-coordinates of A and B?", ["2*sqrt(11)","4*sqrt(3)","8","4*sqrt(5)","9"], "D", "Algebra")
add(2023, 7, "A digital display shows dates as YYYYMMDD. For how many dates in 2023 will each digit appear an even number of times?", ["5","6","7","8","9"], "E", "Combinatorics")
add(2023, 8, "If Maureen scores 11 on the next quiz, her mean increases by 1. If she scores 11 on each of the next three quizzes, her mean increases by 2. What is her current mean?", ["4","5","6","7","8"], "D", "Algebra")
add(2023, 9, "A square of area 2 is inscribed in a square of area 3. What is the ratio of the shorter leg to the longer leg in the resulting right triangle?", ["1/5","1/4","2 - sqrt(3)","sqrt(3) - sqrt(2)","sqrt(2) - 1"], "C", "Geometry")
add(2023, 10, "Positive real numbers x and y satisfy y^3 = x^2 and (y - x)^2 = 4y^2. What is x + y?", ["12","18","24","36","42"], "D", "Algebra")
add(2023, 11, "What is the degree measure of the acute angle formed by lines with slopes 2 and 1/3?", ["30","37.5","45","52.5","60"], "C", "Geometry")
add(2023, 12, "What is 2^3 - 1^3 + 4^3 - 3^3 + 6^3 - 5^3 + ... + 18^3 - 17^3?", ["2023","2679","2941","3159","3235"], "D", "Algebra")
add(2023, 13, "In a round-robin tournament, there were twice as many right-handed players as left-handed players. Left-handed players won 40% more games than right-handed players. What is the total number of games played?", ["15","36","45","48","66"], "B", "Combinatorics")
add(2023, 14, "How many complex numbers satisfy z^5 = conjugate(z)?", ["2","3","5","6","7"], "E", "Algebra")
add(2023, 15, "Usain zigzags across a 100m by 30m field starting at corner A. With angle theta at each turn, what theta produces a 120-meter path?", ["arccos(5/6)","arccos(4/5)","arccos(3/10)","arcsin(4/5)","arcsin(5/6)"], "A", "Geometry")
add(2023, 16, "The maximum imaginary part of z satisfying |1 + z + z^2| = 4 is sqrt(m)/n. What is m + n?", ["20","21","22","23","24"], "B", "Algebra")
add(2023, 17, "Flora jumps distance m with probability 1/2^m. What is the probability she lands at 10?", ["5/512","45/1024","127/1024","511/1024","1/2"], "E", "Probability")
add(2023, 18, "Circles C_1 and C_2 have radius 1 with centers 1/2 apart. C_3 is the largest circle internally tangent to both. C_4 is internally tangent to both and externally tangent to C_3. What is the radius of C_4?", ["1/14","1/12","1/10","3/28","1/9"], "D", "Geometry")
add(2023, 19, "What is the product of all solutions to log_(7x)(2023) * log_(289x)(2023) = log_(2023x)(2023)?", ["(log_2023(7) * log_2023(289))^2","log_2023(7) * log_2023(289)","1","log_7(2023) * log_289(2023)","(log_7(2023) * log_289(2023))^2"], "C", "Algebra")
add(2023, 20, "A triangular array has rows where interior entries equal 1 plus the sum of the two numbers above. What is the units digit of the sum of all 2023 numbers in row 2023?", ["1","3","5","7","9"], "C", "Number Theory")
add(2023, 21, "For a regular icosahedron, if Q, R, S are random distinct vertices and d is edge-distance, what is P(d(Q,R) > d(R,S))?", ["7/22","1/3","3/8","5/12","1/2"], "A", "Combinatorics")
add(2023, 22, "Function f satisfies sum over d|n of d*f(n/d) = 1. What is f(2023)?", ["-1536","96","108","116","144"], "B", "Number Theory")
add(2023, 23, "How many ordered pairs (a, b) of positive reals satisfy (1 + 2a)(2 + 2b)(2a + b) = 32ab?", ["0","1","2","3","infinitely many"], "B", "Algebra")
add(2023, 24, "K counts chains A_1 subset A_2 subset ... subset A_n where n <= 10 and each A_i subset {1,2,...,10}. What is K mod 10?", ["1","3","5","7","9"], "C", "Combinatorics")
add(2023, 25, "tan(2023x) has the form (a_1*tan(x) + a_3*tan^3(x) + ... + a_2023*tan^2023(x)) / (1 + a_2*tan^2(x) + a_4*tan^4(x) + ... + a_2022*tan^2022(x)). What is a_2023?", ["-2023","-2022","-1","1","2023"], "C", "Algebra")

# =====================================================================
# 2024 AMC 12A
# =====================================================================
add(2024, 1, "What is the value of 9901 * 101 - 99 * 10101?", ["2","20","200","202","2020"], "A", "Algebra")
add(2024, 2, "A model estimates hiking time as T = aL + bG, where T is time in minutes, L is trail length in miles, and G is altitude gain in feet. It takes 69 minutes for a 1.5-mile trail with 800 feet of gain, and also 69 minutes for a 1.2-mile trail with 1100 feet of gain. How many minutes for a 4.2-mile trail with 4000 feet of gain?", ["240","246","252","258","264"], "B", "Algebra")
add(2024, 3, "The number 2024 is written as a sum of two-digit numbers. What is the least count needed?", ["20","21","22","23","24"], "B", "Number Theory")
add(2024, 4, "What is the least value of n such that n! is a multiple of 2024?", ["11","21","22","23","253"], "D", "Number Theory")
add(2024, 5, "A dataset with 20 numbers, some being 6, has mean 45. Removing all 6s gives mean 66. How many 6s were in the original set?", ["4","5","6","7","8"], "D", "Algebra")
add(2024, 6, "The product of three integers is 60. What is the least possible positive sum?", ["2","3","5","6","13"], "B", "Number Theory")
add(2024, 7, "In triangle ABC with angle ABC = 90 degrees and BA = BC = sqrt(2), points P_1 through P_2024 divide hypotenuse AC into 2025 equal segments. What is the magnitude of the vector sum BP_1 + BP_2 + ... + BP_2024?", ["1011","1012","2023","2024","2025"], "D", "Geometry")
add(2024, 8, "How many angles theta with 0 <= theta <= 2*pi satisfy log(sin(3*theta)) + log(cos(2*theta)) = 0?", ["0","1","2","3","4"], "A", "Algebra")
add(2024, 9, "Let M be the greatest integer such that both M + 1213 and M + 3773 are perfect squares. What is the units digit of M?", ["1","2","3","6","8"], "E", "Number Theory")
add(2024, 10, "Let alpha be the smallest angle in a 3-4-5 right triangle (in radians), and beta be the smallest angle in a 7-24-25 right triangle. Express beta in terms of alpha.", ["alpha/3","alpha - pi/8","pi/2 - 2*alpha","alpha/2","pi - 4*alpha"], "C", "Geometry")
add(2024, 11, "How many bases b with 5 <= b <= 2024 make 2024 in base b divisible by 16 (in base 10)? Find the digit sum of this count.", ["16","17","18","20","21"], "D", "Number Theory")
add(2024, 12, "The first three terms of a geometric sequence are integers a, 720, and b, where a < 720 < b. What is the digit sum of the least possible value of b?", ["9","12","16","18","21"], "E", "Number Theory")
add(2024, 13, "The graph of y = e^(x+1) + e^(-x) - 2 has an axis of symmetry. What is the reflection of the point (-1, 1/2) over this axis?", ["(-1, -3/2)","(-1, 0)","(-1, 1/2)","(0, 1/2)","(3, 1/2)"], "D", "Algebra")
add(2024, 14, "A 5x5 array has rows and columns forming arithmetic progressions. Given certain entries at positions (5,5)=0, (2,4)=48, (4,3)=16, (3,1)=12, find the value at position (1,2).", ["19","24","29","34","39"], "C", "Algebra")
add(2024, 15, "The roots of x^3 + 2x^2 - x + 3 are p, q, and r. What is (p^2 + 4)(q^2 + 4)(r^2 + 4)?", ["64","75","100","125","144"], "D", "Algebra")
add(2024, 16, "Distribute 12 tokens (3 red, 2 white, 1 blue, 6 black) to 3 players with 4 tokens each. Probability that one gets all red, another gets all white, and the third gets the blue token is m/n. Find m + n.", ["387","388","389","390","391"], "C", "Probability")
add(2024, 17, "Integers a, b, c satisfy: ab + c = 100, bc + a = 87, ca + b = 60. What is ab + bc + ca?", ["212","247","258","276","284"], "D", "Algebra")
add(2024, 18, "Identical rectangular cards (dimensions 1 by 2 + sqrt(3)) are placed iteratively with diagonals aligned. After rotating clockwise and adding successive cards, how many cards are needed until a vertex lands exactly on vertex B?", ["6","8","10","12","No new vertex will land on B"], "A", "Geometry")
add(2024, 19, "Cyclic quadrilateral ABCD has BC = CD = 3, DA = 5, and angle CDA = 120 degrees. What is the length of the shorter diagonal?", ["31/7","33/7","5","39/7","41/7"], "D", "Geometry")
add(2024, 20, "Points P and Q are chosen uniformly on sides AB and AC respectively of equilateral triangle ABC. Which interval contains the probability that area of triangle APQ is less than half the area of triangle ABC?", ["[3/8, 1/2]","(1/2, 2/3]","(2/3, 3/4]","(3/4, 7/8]","(7/8, 1]"], "D", "Probability")
add(2024, 21, "Sequence satisfies: a_1 = 2 and (a_n - 1)/(n - 1) = (a_(n-1) + 1)/n for n >= 2. What is floor(sum of a_n^2 from n=1 to 100)?", ["338550","338551","338552","338553","338554"], "B", "Algebra")
add(2024, 22, "On an 8x3 grid of unit squares, place toothpicks along square sides to form a closed non-intersecting loop. Middle row cells must have exactly 1 side covered. How many ways?", ["130","144","146","162","196"], "C", "Combinatorics")
add(2024, 23, "Evaluate: tan^2(pi/16)*tan^2(3*pi/16) + tan^2(pi/16)*tan^2(5*pi/16) + tan^2(3*pi/16)*tan^2(7*pi/16) + tan^2(5*pi/16)*tan^2(7*pi/16)", ["28","68","70","72","84"], "B", "Algebra")
add(2024, 24, "A disphenoid is a tetrahedron with congruent triangular faces. What is the least total surface area if faces are scalene triangles with integer side lengths?", ["sqrt(3)","3*sqrt(15)","15","15*sqrt(7)","24*sqrt(6)"], "D", "Geometry")
add(2024, 25, "For how many integer quadruples (a,b,c,d) with |a|,|b|,|c|,|d| <= 5 (and c,d not both 0) is the graph of y = (ax+b)/(cx+d) symmetric about the line y = x?", ["1282","1292","1310","1320","1330"], "B", "Algebra")

# =====================================================================
# 2025 AMC 12A
# =====================================================================
add(2025, 1, "Andy leaves at 1:30 traveling north at 8 mph. Betsy leaves at 2:30 traveling east at 12 mph. When are they equidistant from the starting point?", ["3:30","3:45","4:00","4:15","4:30"], "E", "Algebra")
add(2025, 2, "A 10-pound nut mix is 50% peanuts, 20% cashews, 30% almonds. A second mix (20% peanuts, 40% cashews, 40% almonds) is added, creating a new mix that is 40% peanuts. How many pounds of cashews are in the final box?", ["3.5","4","4.5","5","6"], "B", "Algebra")
add(2025, 3, "Total of 15 students and teachers. Ash joining students increases their average age from 12 to 14. Ash joining teachers decreases their average from 55 to 52. How old is Ash?", ["28","29","30","32","33"], "A", "Algebra")
add(2025, 4, "Agnes writes four statements about truth values. How many are false?", ["0","1","2","3","4"], "B", "Logic")
add(2025, 5, "Infinitely many nested squares with ratio k between successive side lengths. Shaded area is 64% of original. Find k.", ["3/5","16/25","2/3","3/4","4/5"], "D", "Geometry")
add(2025, 6, "Six chairs around a table. Two students and two teachers randomly select four chairs. Probability both pairs sit adjacent?", ["1/6","1/5","2/9","3/13","1/4"], "B", "Probability")
add(2025, 7, "Speed formula: v = k*(n^a)*(m^b). When n=5: log(v) = 4 + 2*log(m). When m=25: log(v) = 4 + 4*log(n). Find k + a + b.", ["20","21","22","23","24"], "C", "Algebra")
add(2025, 8, "Pentagon ABCDE inscribed in circle. Angles BEC = CED = 30 degrees. AB = 9, AD = 24. Lines AC and BD intersect at F. Find BF.", ["57/11","59/11","60/11","61/11","63/11"], "E", "Geometry")
add(2025, 9, "Complex number w = 2 + i. Find real r such that r, w, w^2 are collinear in the complex plane.", ["3/4","1","7/5","3/2","5/3"], "E", "Algebra")
add(2025, 10, "Major arc AD and minor arc BC share center O. Major arc, minor arc, and segments AB and CD all have length 2*pi. Find distance from O to A.", ["1","1 - pi + sqrt(pi^2 + 1)","pi/2","sqrt(pi^2 + 1)/2","2"], "B", "Geometry")
add(2025, 11, "Triangle vertices: A(2, 31), B(8, 27), C(18, 27). Find sum of orthocenter coordinates.", ["5","17","10 + 4*sqrt(17) + 2*sqrt(13)","113/3","54"], "A", "Geometry")
add(2025, 12, "Find harmonic mean of all real roots of the product: (x^2 - 4x - 3)(2x^2 - 4x - 3)...(2025x^2 - 4x - 3)", ["-5/3","-3/2","-6/5","-5/6","-2/3"], "B", "Algebra")
add(2025, 13, "C = {1, 2, ..., 13}. N is largest subset size with no five consecutive integers. If N integers chosen randomly, probability of no five consecutive?", ["3/130","3/143","5/143","1/26","5/78"], "D", "Combinatorics")
add(2025, 14, "Two ellipses: one with foci G, H; one with foci F, G. Same eccentricity. Area ratio is 2025. Find eccentricity.", ["3/5","16/25","4/5","22/23","44/45"], "D", "Geometry")
add(2025, 15, "Largest sum-free subset of {1, 2, ..., 20}? (Sum-free means if x, y in set, then x + y not in set)", ["8","9","10","11","12"], "C", "Combinatorics")
add(2025, 16, "Triangle ABC: AB = 80, BC = 45, AC = 75. Angle B bisector and altitude to AB intersect at P. Find BP.", ["18","19","20","21","22"], "D", "Geometry")
add(2025, 17, "Polynomial (z + i)(z + 2i)(z + 3i) + 10 has three complex roots. Find triangle area formed by them.", ["6","8","10","12","14"], "A", "Algebra")
add(2025, 18, "Ordered triples (x, y, z) of distinct positive integers <= 8 satisfying: xy > z, xz > y, yz > x?", ["36","84","186","336","486"], "C", "Combinatorics")
add(2025, 19, "Roots a, b, c of x^3 + kx + 1. Find: a^3*b^2 + a^2*b^3 + b^3*c^2 + b^2*c^3 + c^3*a^2 + c^2*a^3", ["-k","-k + 1","1","k - 1","k"], "E", "Algebra")
add(2025, 20, "Pentahedron with 13 x 8 rectangular base, two isosceles triangles, two isosceles trapezoids. Find volume.", ["416","520","528","676","832"], "C", "Geometry")
add(2025, 21, "Find nonnegative integers a, k, m where: [4^a + 4^(a+k) + ... + 4^(a+mk)] / [2^a + 2^(a+k) + ... + 2^(a+mk)] = 964. Calculate a + k + m.", ["8","9","10","11","12"], "A", "Algebra")
add(2025, 22, "Three random numbers from [0, 1]. Probability that the largest exceeds 2 times each of the other two?", ["1/12","1/9","1/8","1/6","1/4"], "E", "Probability")
add(2025, 23, "A 'fair' positive integer: no repeated digits, no zeros, no digit adjacent to two greater digits. Count fair integers.", ["511","2584","9841","17711","19682"], "C", "Combinatorics")
add(2025, 24, "Central circle radius r surrounded by 12 unit circles, each externally tangent to center and sequentially to each other. Express r = sqrt(a) + sqrt(b) + c. Find a + b + c.", ["3","5","7","9","11"], "C", "Geometry")
add(2025, 25, "Polynomials P(x), Q(x) degree 3, leading coefficient 1, roots from {1,2,3,4,5}. Function f(x) = P(x)/Q(x) such that f(x) <= 0 on [a,b] union (c,d) for a < b < c < d. Count possible pairs (P, Q).", ["9","11","12","13","8"], "B", "Algebra")

# Write output
out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "amc12a_all.json")
with open(out_path, "w") as f:
    json.dump(problems, f, indent=2)

print(f"Wrote {len(problems)} problems to {out_path}")
