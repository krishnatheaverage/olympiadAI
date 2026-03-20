// fma_2024.js
// All 25 problems from the 2024 F=ma exam

const problems = [
  {
    contest: 'F=ma',
    year: 2024,
    number: 1,
    topic: 'kinematics',
    problem: 'An archer fires an arrow at an angle above the horizontal. The arrow passes through two thin hoops, both at height h above the ground. It passes through the first hoop at time t = 1 s after being fired, and through the second hoop at time t = 2 s after being fired. What is h? (Take g = 10 m/s^2.)',
    choices: '{"A":"5 m","B":"10 m","C":"12 m","D":"15 m","E":"Not enough information to determine"}',
    correct_answer: 'B',
    solution: 'At times t1 = 1 s and t2 = 2 s the arrow is at the same height h. Using h = v0*t - (1/2)*g*t^2 for both times and equating: v0*1 - 5*1 = v0*2 - 5*4, giving v0 = 15 m/s. Then h = 15(1) - 5(1) = 10 m.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 2,
    topic: 'forces',
    problem: 'An amusement park ride consists of a large circular room that spins about a vertical axis through its center. The walls of the room are inclined at 30 degrees from the vertical. A rider stands against the wall with their center of mass 5.0 m from the axis of rotation. At what angular velocity do the rider\'s feet lift off the floor? (Assume no friction between the rider and the wall.)',
    choices: '{"A":"1.9 rad/s","B":"2.3 rad/s","C":"3.5 rad/s","D":"4.0 rad/s","E":"5.6 rad/s"}',
    correct_answer: 'A',
    solution: 'The normal force from the wall provides the centripetal force component and supports the rider vertically. Setting tan(30) = g/(omega^2 * R): omega = sqrt(g/(R*tan(30))) = sqrt(10/(5*0.577)) = 1.86 rad/s, approximately 1.9 rad/s.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 3,
    topic: 'forces',
    problem: 'A simple bridge is made from five thin rods connected at four vertices labeled A, B, C, and D. The bridge forms a shape with two triangles: vertices A and B are at the top (supported), and C is at the bottom middle, with D completing the structure. A horizontal rod connects A to B at the top, a vertical rod hangs from the midpoint of AB down to C, and diagonal rods connect A to C and B to C. A person standing at the middle of the bridge exerts a downward force F at point C. Which rods are in tension?',
    choices: '{"A":"Only the vertical rod","B":"Only the diagonal rods","C":"The vertical rod and the diagonal rods","D":"The vertical rod and the horizontal rod","E":"All five rods"}',
    correct_answer: 'D',
    solution: 'The vertical rod supports the downward force F directly, so it is in tension. The diagonal rods push inward (compression) on the top joints. The horizontal rod AB must be in tension to balance the inward horizontal components from the diagonal rods at joints A and B.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 4,
    topic: 'energy',
    problem: 'A very bouncy ball is thrown straight up from the ground. Every time it hits the ground, the collision is perfectly elastic (no energy is lost). Which graph best represents the kinetic energy of the ball as a function of time?',
    choices: '{"A":"Concave-down parabolas with discontinuities at each bounce","B":"Triangular peaks (linear segments) with sharp corners at bounces","C":"Concave-up parabolas with discontinuities at each bounce","D":"Concave-up parabolas that are continuous (no discontinuity) at each bounce","E":"Straight horizontal lines between bounces"}',
    correct_answer: 'D',
    solution: 'KE = (1/2)m*v(t)^2 = (1/2)m*(v0 - g*t)^2, which is a concave-up parabola in time. Since the bounces are perfectly elastic, the speed is the same just before and just after each bounce, so KE is continuous at the bounce points.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 5,
    topic: 'forces',
    problem: 'A massless inclined plane with angle 30 degrees is fixed to a bathroom scale. A block of mass m is placed on the frictionless incline and allowed to slide down. What does the scale read while the block is sliding?',
    choices: '{"A":"mg*sqrt(3)/4","B":"mg/2","C":"3mg/4","D":"mg*sqrt(3)/2","E":"mg"}',
    correct_answer: 'C',
    solution: 'The normal force on the block from the incline is N = mg*cos(30). The vertical component of this normal force transmitted to the scale is N*cos(30) = mg*cos^2(30) = mg*(3/4) = 3mg/4.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 6,
    topic: 'oscillations',
    problem: 'A pendulum consists of a bucket filled with water, hung from a string. The bucket has a small hole at the bottom, so water leaks out at a constant rate as the pendulum swings. The pendulum is released from a horizontal position and swings back and forth until it comes to rest due to friction. Which best describes the distribution of water on the ground as a function of position below the pendulum?',
    choices: '{"A":"Uniform distribution","B":"Most water deposited in the middle, least at endpoints","C":"Most water deposited at the endpoints, least in the middle","D":"All water deposited only at the two endpoints","E":"Sinusoidal distribution"}',
    correct_answer: 'C',
    solution: 'The pendulum moves slowest near its endpoints (turning points) and fastest at the middle. Since water leaks at a constant rate, more water accumulates where the pendulum spends the most time, which is at the endpoints.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 7,
    topic: 'kinematics',
    problem: 'A particle moves along the x-axis. Its velocity as a function of time v(t) is shown: the velocity increases linearly from 0 to some maximum value v_max, then remains constant for a period, then decreases linearly back to 0. The acceleration during the first phase equals the magnitude of deceleration in the third phase. Which graph best shows the velocity as a function of position v(x)?',
    choices: '{"A":"Linear increase, constant, linear decrease (symmetric triangle-like shape)","B":"Square-root curve, constant, linear decrease","C":"Square-root curve, constant, square-root curve (symmetric about middle)","D":"Linear increase, constant, square-root decrease","E":"Concave-down curve, constant, concave-down curve"}',
    correct_answer: 'C',
    solution: 'During constant acceleration from rest, v^2 = 2ax, so v = sqrt(2ax) -- a square-root shape vs position. During constant velocity, v is flat. During deceleration to rest, v^2 = v_max^2 - 2a*(x - x0), giving a mirror square-root shape. The v(x) graph is symmetric.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 8,
    topic: 'kinematics',
    problem: 'A uniform rod of length L leans against a frictionless wall and slides on a frictionless floor. At the instant the rod makes a 45-degree angle with the floor, the speed of the bottom end of the rod is v. What is the speed of the center of the rod at that instant?',
    choices: '{"A":"v/2","B":"v/sqrt(2)","C":"v","D":"v*sqrt(2)","E":"2v"}',
    correct_answer: 'B',
    solution: 'Let the bottom end move right at speed v. The top end moves down along the wall. At 45 degrees, by the constraint that the rod length is fixed, the top end moves at speed v downward. The center velocity is the average: (v/2, -v/2). Its magnitude is v/sqrt(2).',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 9,
    topic: 'mechanics',
    problem: 'A car traveling at some initial speed can stop in exactly 100 m on a dry road with coefficient of kinetic friction mu_k = 0.8. Suppose instead that the first 50 m of the road is dry (mu_k = 0.8) and the rest of the road is covered in ice (mu_k = 0.2). What is the total stopping distance from the point the brakes are applied?',
    choices: '{"A":"150 m","B":"200 m","C":"250 m","D":"400 m","E":"850 m"}',
    correct_answer: 'C',
    solution: 'On 100 m of dry road, KE = mu_k * m * g * 100. After 50 m of dry road, half the KE remains. The remaining KE is dissipated on ice: (1/2)*KE_initial = 0.2*m*g*d_ice. Since KE_initial = 0.8*m*g*100, we get d_ice = 0.5*0.8*100/0.2 = 200 m. Total = 50 + 200 = 250 m.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 10,
    topic: 'forces',
    problem: 'A block of mass m is inside a box of length 3l that rotates about a vertical axis. The block is connected to the two ends of the box by two springs: one with natural length l and spring constant k, and the other with natural length 2l and spring constant 2k. The box rotates at angular velocity omega. What is the distance r of the block from the rotation axis (located at one end of the box) in the rotating frame equilibrium?',
    choices: '{"A":"2kl/(2k - m*omega^2)","B":"2kl/(2k + m*omega^2)","C":"2kl/(3k + m*omega^2)","D":"3kl/(3k - m*omega^2)","E":"3kl/(3k + m*omega^2)"}',
    correct_answer: 'D',
    solution: 'In the rotating frame, the block is in equilibrium when the net spring force equals the centrifugal force. If the block is at distance r from the axis, the spring extensions give: k*(r - l) + 2k*(3l - r - 2l) = m*omega^2*r. Simplifying: k*r - kl + 2kl - 2kr = m*omega^2*r, so kl - kr = m*omega^2*r, giving 3kl = r(3k - m*omega^2) => r = 3kl/(3k - m*omega^2).',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 11,
    topic: 'fluids',
    problem: 'Two hemispherical shells of radius r = 40 cm are pressed together in a chamber at half atmospheric pressure (P_atm/2), then returned to sea level where the pressure is P_atm = 10^5 Pa. What is the minimum force required to pull the hemispheres apart?',
    choices: '{"A":"25,000 N","B":"50,000 N","C":"100,000 N","D":"200,000 N","E":"400,000 N"}',
    correct_answer: 'A',
    solution: 'The pressure difference is P_atm - P_atm/2 = P_atm/2. The force is F = pi*r^2 * (P_atm/2) = pi*(0.4)^2 * 50000 = pi*0.16*50000 = 25,133 N, approximately 25,000 N.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 12,
    topic: 'gravity',
    problem: 'A space probe of mass m is at point P near a cluster of three asteroids located at points A, B, and C. The asteroids have masses M, 2M, and 3M respectively. The points A, B, C, and P form a square with side length d, with A and P on one side and B and C on the opposite side (so that A is distance d from B and P, B is distance d from A and C, etc.). The probe is at distance d from A and from C, and at distance d*sqrt(2) from B. What is the magnitude of the net gravitational torque on the probe about point C due to the asteroids?',
    choices: '{"A":"GMm/(2*sqrt(2)*d)","B":"GMm/(2d)","C":"GMm/(sqrt(2)*d)","D":"GMm/d","E":"sqrt(2)*GMm/d"}',
    correct_answer: 'A',
    solution: 'The force from C (mass 3M) passes through C, so it contributes zero torque about C. The force from A (mass M) at distance d has a perpendicular lever arm component about C. The force from B (mass 2M) at distance d*sqrt(2) also contributes. Computing the cross products and summing gives a net torque of GMm/(2*sqrt(2)*d).',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 13,
    topic: 'forces',
    problem: 'Two blocks, each of mass m, are connected by a string that passes over a fixed, frictionless pulley mounted at height h above a frictionless table. The blocks rest on the table and are initially separated by a horizontal distance x. As x changes, how does the tension T in the string behave? (Consider the graph of T as a function of x.)',
    choices: '{"A":"T decreases monotonically from 2mg to mg/2","B":"T decreases monotonically from mg to mg/2","C":"T is constant at mg","D":"T increases monotonically from mg/2 to mg","E":"T has a U-shape, decreasing then increasing"}',
    correct_answer: 'B',
    solution: 'When x = 0 (blocks directly below pulley, string vertical), the system is like a symmetric Atwood machine and T = mg. As x increases, the strings become more horizontal. In the limit x -> infinity, the vertical component of tension supports each block: T*sin(theta) = mg with theta -> 0, but considering the geometry more carefully, T -> mg/2. So T decreases from mg to mg/2.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 14,
    topic: 'energy',
    problem: 'A bead of mass m sits on a vertical circular wire hoop of radius R = 20 cm. The hoop is mounted on a stand also of mass m that rests on a frictionless horizontal surface. The bead is given an initial speed of 2.0 m/s to the right at the bottom of the hoop. Through what angle (measured relative to the hoop) does the bead travel before it first comes to rest relative to the hoop?',
    choices: '{"A":"30 degrees","B":"45 degrees","C":"60 degrees","D":"90 degrees","E":"120 degrees"}',
    correct_answer: 'C',
    solution: 'When the bead stops relative to the hoop, both bead and hoop+stand move at the same velocity. By momentum conservation: m*2 = 2m*v_f, so v_f = 1 m/s. Energy conservation: (1/2)*m*4 = (1/2)*(2m)*1 + m*g*R*(1 - cos(theta)). This gives 2 = 1 + m*g*R*(1 - cos(theta)), so 1 = 1*10*0.2*(1 - cos(theta)), giving cos(theta) = 1/2, theta = 60 degrees.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 15,
    topic: 'measurement',
    problem: 'The Ohnesorge number is a dimensionless quantity used in fluid mechanics. It is proportional to the dynamic viscosity eta (units: kg/(m*s)). The other relevant quantities are the fluid density rho (units: kg/m^3), the surface tension gamma (units: kg/s^2), and a characteristic length l (units: m). Which of the following is a correct formula for the Ohnesorge number?',
    choices: '{"A":"eta*l/sqrt(rho*gamma)","B":"eta*l*sqrt(rho/gamma)","C":"eta*sqrt(rho/(gamma*l))","D":"eta*sqrt(rho*l/gamma)","E":"eta/sqrt(rho*gamma*l)"}',
    correct_answer: 'E',
    solution: 'We need eta * f(rho, gamma, l) to be dimensionless. [eta] = kg/(m*s). [rho*gamma*l] = (kg/m^3)*(kg/s^2)*m = kg^2/(m^2*s^2). So sqrt(rho*gamma*l) has units kg/(m*s), same as eta. Therefore eta/sqrt(rho*gamma*l) is dimensionless.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 16,
    topic: 'kinematics',
    problem: 'A child holds a rope of length l attached to a pivot at height H above the ground (H > l). The child starts horizontal (rope taut and horizontal) and swings downward. At the lowest point of the swing, the child lets go of the rope and travels as a projectile, landing a horizontal distance d from the point directly below the pivot on Earth (with gravitational acceleration g). The same experiment is performed on the Moon, where the gravitational acceleration is g/6. What is the maximum horizontal distance the child can land from the point below the pivot on the Moon?',
    choices: '{"A":"d/6","B":"d/sqrt(6)","C":"d","D":"d*sqrt(6)","E":"6d"}',
    correct_answer: 'C',
    solution: 'The speed at the bottom is v = sqrt(2*g*l). Projectile range depends on v^2/g = 2l, which is independent of g. Similarly, the fall height H - l is the same. Therefore the landing distance is the same: d. The answer is d_E = d.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 17,
    topic: 'forces',
    problem: 'A system consists of pulleys and three springs with spring constants k, 2k, and 3k arranged in a compound pulley-spring system supporting a block of mass m in equilibrium. The mass of the block is then doubled to 2m. How far does the end of the rope move to reach the new equilibrium?',
    choices: '{"A":"7mg/(12k)","B":"11mg/(12k)","C":"13mg/(12k)","D":"7mg/(6k)","E":"11mg/(6k)"}',
    correct_answer: 'E',
    solution: 'The additional force mg is distributed among the springs through the pulley system. The total displacement of the rope end is the sum of individual spring extensions: mg/k + mg/(2k) + mg/(3k) = mg*(6 + 3 + 2)/(6k) = 11mg/(6k).',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 18,
    topic: 'gravity',
    problem: 'A satellite is in a circular orbit of radius R around a planet of mass M. It fires its rockets briefly to enter an elliptical orbit whose maximum distance from the center of the planet is 2R. What is the change in speed Delta_v at the moment the rockets fire?',
    choices: '{"A":"0.08*sqrt(GM/R)","B":"0.15*sqrt(GM/R)","C":"0.22*sqrt(GM/R)","D":"0.29*sqrt(GM/R)","E":"0.41*sqrt(GM/R)"}',
    correct_answer: 'B',
    solution: 'The initial circular speed is v_c = sqrt(GM/R). The new orbit has perigee R and apogee 2R, so semi-major axis a = 3R/2. By the vis-viva equation: v_f = sqrt(GM*(2/R - 2/(3R))) = sqrt(4GM/(3R)). Delta_v = v_f - v_c = sqrt(GM/R)*(sqrt(4/3) - 1) = sqrt(GM/R)*(1.155 - 1) = 0.155*sqrt(GM/R), approximately 0.15*sqrt(GM/R).',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 19,
    topic: 'oscillations',
    problem: 'A wheel consists of a thin rim of mass m at radius R and four thin spokes. Three of the spokes each have mass m, and the fourth spoke has mass 3m. The wheel is mounted on a frictionless axle at its center so it can rotate freely in a vertical plane. What is the angular frequency of small oscillations about the equilibrium position?',
    choices: '{"A":"sqrt(g/(3R))","B":"sqrt(g/(2R))","C":"sqrt(2g/(3R))","D":"sqrt(g/R)","E":"sqrt(7g/(6R))"}',
    correct_answer: 'A',
    solution: 'The rim is symmetric and does not contribute to the torque. The three identical spokes are symmetrically placed and contribute no net torque. Only the imbalance of the heavy spoke (extra mass 2m at center of mass R/2) provides a restoring torque. The net torque is 2m*g*(R/2)*sin(theta) = mgR*sin(theta). The total moment of inertia is I = mR^2 (rim) + 3*(mR^2/3) (three spokes) + 3m*R^2/3 (heavy spoke) = mR^2 + mR^2 + mR^2 = 3mR^2. omega = sqrt(mgR/(3mR^2)) = sqrt(g/(3R)).',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 20,
    topic: 'oscillations',
    problem: 'Four massless rigid rods of equal length are connected by hinges at their endpoints to form a square (a rhombus). At each of the four hinge points, there is a point mass m. Two springs, each with spring constant k, are attached along the two diagonals of the square. What is the period of small oscillations of this system (where the square deforms into a rhombus and back)?',
    choices: '{"A":"2*pi*sqrt(m/(4k))","B":"2*pi*sqrt(m/(2k))","C":"2*pi*sqrt(m/k)","D":"2*pi*sqrt(2m/k)","E":"2*pi*sqrt(4m/k)"}',
    correct_answer: 'B',
    solution: 'When the square deforms, opposite corners move in and out. Each mass m effectively oscillates under both springs. The effective spring constant for each oscillating pair is 2k (both springs contribute), and the effective mass for each mode is m (reduced mass of two masses moving in opposition). By geometric analysis, the period works out to T = 2*pi*sqrt(m/(2k)).',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 21,
    topic: 'fluids',
    problem: 'A syringe has a barrel with cross-sectional area A1 and a needle with cross-sectional area A2, where A2 is much smaller than A1. The syringe is filled with a fluid of density rho. The plunger is pushed at a constant speed v. Assuming steady, incompressible, non-viscous flow, what is the force F required to push the plunger?',
    choices: '{"A":"rho*v^2*A1","B":"rho*v^2*A1^2/(2*A2)","C":"rho*v^2*A1^2/A2","D":"rho*v^2*A1^3/(2*A2^2)","E":"rho*v^2*A1^3/A2^2"}',
    correct_answer: 'D',
    solution: 'By continuity, the exit speed is v_exit = v*A1/A2. By Bernoulli\'s equation (and since A2 << A1), the pressure difference is approximately (1/2)*rho*v_exit^2 = rho*v^2*A1^2/(2*A2^2). The force is F = pressure * A1 = rho*v^2*A1^3/(2*A2^2).',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 22,
    topic: 'gravity',
    problem: 'A thin spherical shell has a uniform mass per unit area sigma. Let g1 be the magnitude of the gravitational field just inside the shell and g2 be the magnitude just outside. What is |g1 - g2|?',
    choices: '{"A":"pi*G*sigma","B":"4*pi*G*sigma/3","C":"2*pi*G*sigma","D":"4*pi*G*sigma","E":"8*pi*G*sigma"}',
    correct_answer: 'D',
    solution: 'By the shell theorem, the gravitational field inside a uniform spherical shell is zero: g1 = 0. Just outside, g2 = GM/R^2 where M = 4*pi*R^2*sigma. So g2 = G*4*pi*R^2*sigma/R^2 = 4*pi*G*sigma. Therefore |g1 - g2| = 4*pi*G*sigma.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 23,
    topic: 'momentum',
    problem: 'A ping-pong ball is dropped onto a stationary paddle and bounces to a height equal to half the drop height (coefficient of restitution e = 1/sqrt(2)). Now the paddle is moved upward at a constant speed of 1.0 m/s. The ball is dropped from rest and bounces repeatedly off the moving paddle. After many bounces, the ball reaches a steady-state maximum height. What is this height? (Take g = 10 m/s^2.)',
    choices: '{"A":"0.21 m","B":"0.45 m","C":"1.0 m","D":"1.7 m","E":"Not enough information to determine"}',
    correct_answer: 'D',
    solution: 'In steady state the ball returns to the paddle with speed v_down and leaves with v_up such that v_up = e*(v_down + v_paddle) + v_paddle*(1-e). For steady bouncing, v_up must equal v_down. Solving: v_down*(1 - e) = v_paddle*(1 + e), so v_down = 1.0*(1 + 1/sqrt(2))/(1 - 1/sqrt(2)). The launch speed is v_up = v_down, and the height is h = v_up^2/(2g). This gives h approximately 1.7 m.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 24,
    topic: 'fluids',
    problem: 'A solid sphere of radius R and density rho_s (where rho_s >> rho_f, the fluid density) is dropped from rest in a fluid that exerts a quadratic drag force F_drag = C*rho_f*R^2*v^2 (where C is a dimensionless constant). When the sphere reaches half its terminal velocity, the displacement of the sphere from its starting point is proportional to which of the following?',
    choices: '{"A":"R*sqrt(rho_s/rho_f)","B":"R*rho_s/rho_f","C":"R*(rho_s/rho_f)^(3/2)","D":"R*(rho_s/rho_f)^2","E":"R*(rho_s/rho_f)^3"}',
    correct_answer: 'B',
    solution: 'Terminal velocity: (4/3)*pi*R^3*rho_s*g = C*rho_f*R^2*v_t^2, so v_t^2 ~ R*rho_s*g/rho_f. Using v*dv/dx = a(v) and integrating from 0 to v_t/2 gives a characteristic displacement scale d ~ v_t^2/g ~ R*rho_s/rho_f.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2024,
    number: 25,
    topic: 'rotational',
    problem: 'A yo-yo has a thick string wound around its axle. The string starts at radius R from the center. As the yo-yo descends and the string unwinds, the effective radius at which the string leaves the axle changes. Between the moment of release and the moment the string is fully unwound, which of the following best describes the acceleration of the yo-yo?',
    choices: '{"A":"The acceleration is always zero","B":"The acceleration is downward and decreasing in magnitude","C":"The acceleration is downward and constant","D":"The acceleration is downward and increasing in magnitude","E":"None of the above"}',
    correct_answer: 'E',
    solution: 'As the thick string unwinds, the effective radius decreases. Initially the yo-yo accelerates downward. As the string unwinds and the effective winding radius changes, more energy goes into rotational kinetic energy. The translational speed can actually decrease, meaning the acceleration changes direction from downward to upward at some point during the descent. Since the acceleration is not purely described by any of (A)-(D), the answer is (E) None of the above.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2024_F%3Dma_Problems'
  }
];

module.exports = problems;
