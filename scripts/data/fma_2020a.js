const problems = [
  {
    contest: 'F=ma',
    year: 2020,
    number: 1,
    topic: 'energy',
    problem: 'A ball is launched straight toward the ground from height h above the ground. When it bounces off the ground, it loses half of its kinetic energy. It then rises and reaches a maximum height of 2h before falling back to the ground again. What was the initial speed of the ball? (A) sqrt(gh) (B) sqrt(2gh) (C) sqrt(3gh) (D) sqrt(4gh) (E) sqrt(6gh)',
    choices: '{"A":"sqrt(gh)","B":"sqrt(2gh)","C":"sqrt(3gh)","D":"sqrt(4gh)","E":"sqrt(6gh)"}',
    correct_answer: 'E',
    solution: 'At height h the ball has KE = (1/2)mv^2 and PE = mgh. Just before hitting the ground, total KE = (1/2)mv^2 + mgh. After the bounce it retains half: (1/2)((1/2)mv^2 + mgh). This must equal the PE at height 2h: mg(2h). Solving: (1/4)mv^2 + (1/2)mgh = 2mgh, so v^2 = 6gh and v = sqrt(6gh).',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 2,
    topic: 'rotational',
    problem: 'A rigid ball of radius R rolls without slipping along the inside corner (rib) of a right-angle chute formed by two flat surfaces meeting at 90 degrees. The ball contacts the two surfaces at points A and B, has center O, lowest point P, and highest point Q. Which point on the ball has the maximum speed? (A) All points on the ball have the same speed (B) The contact points A and B (C) The center O (D) The lowest point P (E) The highest point Q',
    choices: '{"A":"All points on the ball have the same speed","B":"The contact points A and B","C":"The center O","D":"The lowest point P","E":"The highest point Q"}',
    correct_answer: 'E',
    solution: 'Since the ball rolls without slipping, the instantaneous axis of rotation passes through the two contact points A and B. The speed of any point is proportional to its distance from this axis. The highest point Q is farthest from the line through A and B, so it has the maximum speed.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 3,
    topic: 'energy',
    problem: 'When an axe is swung with kinetic energy E directly at a large piece of wood, the blade of the axe is buried to a depth L into the wood. The axe is wedge-shaped with a constant opening angle, and the resistive force per unit contact area between the axe and the wood is proportional to the depth. If the axe is swung with kinetic energy 2E at an identical piece of wood, how deep will it be buried? (A) 2^(1/4) * L (B) 2^(1/3) * L (C) sqrt(2) * L (D) 2L (E) 4L',
    choices: '{"A":"2^(1/4) * L","B":"2^(1/3) * L","C":"sqrt(2) * L","D":"2L","E":"4L"}',
    correct_answer: 'B',
    solution: 'The contact area scales as depth squared (wedge shape), and force per unit area is proportional to depth, so total force scales as depth cubed. Energy = integral of F dx scales as depth^3 integrated, giving E proportional to L^3. Doubling energy gives depth (2)^(1/3) * L.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 4,
    topic: 'rotational',
    problem: 'Four identical thin rods, each of mass m and length 2d, are joined at their ends to form a square. The square is then spun around its center at angular frequency omega. What is the magnitude of the force that the joints must exert? (A) m*omega^2*d/2 (B) m*omega^2*d/sqrt(2) (C) m*omega^2*d (D) sqrt(2)*m*omega^2*d (E) 2*m*omega^2*d',
    choices: '{"A":"m*omega^2*d/2","B":"m*omega^2*d/sqrt(2)","C":"m*omega^2*d","D":"sqrt(2)*m*omega^2*d","E":"2*m*omega^2*d"}',
    correct_answer: 'B',
    solution: 'Each rod\'s center of mass is at distance d from the center of the square. The centripetal force needed for each rod is m*omega^2*d directed inward. By symmetry of the square, the joint forces act along the diagonals. Resolving forces gives the joint force magnitude as m*omega^2*d/sqrt(2).',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 5,
    topic: 'oscillations',
    problem: 'A pendulum of length L hangs inside a box. A person shakes the box back and forth horizontally at angular frequency omega with a fixed amplitude. The final amplitude of the pendulum\'s oscillation is maximized when: (A) omega = sqrt(g/L) (B) omega = 2*sqrt(g/L) (C) omega = (1/2)*sqrt(g/L) (D) The shaking will have no effect on the pendulum for any omega (E) None of the above',
    choices: '{"A":"omega = sqrt(g/L)","B":"omega = 2*sqrt(g/L)","C":"omega = (1/2)*sqrt(g/L)","D":"The shaking will have no effect on the pendulum for any omega","E":"None of the above"}',
    correct_answer: 'A',
    solution: 'The pendulum\'s natural frequency is omega_0 = sqrt(g/L). Resonance occurs when the driving frequency matches the natural frequency, so the amplitude is maximized when omega = sqrt(g/L).',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 6,
    topic: 'gravity',
    problem: 'A planet orbits a star in a circular orbit of radius r0. Over a very long period of time, the star slowly and isotropically loses 1% of its mass. The orbit remains approximately circular throughout this process. The final orbit radius is closest to: (A) 1.02*r0 (B) 1.01*r0 (C) r0 (D) 0.99*r0 (E) 0.98*r0',
    choices: '{"A":"1.02*r0","B":"1.01*r0","C":"r0","D":"0.99*r0","E":"0.98*r0"}',
    correct_answer: 'B',
    solution: 'For adiabatic (slow) mass loss, the orbital angular momentum L = m*v*r is conserved, and for a circular orbit v = sqrt(GM/r). Since GM*r = const (from L conservation), reducing M by 1% increases r by 1%. Final radius is 1.01*r0.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 7,
    topic: 'gravity',
    problem: 'An astronaut aboard the International Space Station throws three pieces of trash in three different directions: (I) to the left (toward Earth), (II) to the right (away from Earth), and (III) straight up (perpendicular to the orbital plane). After waiting several hours, which pieces of trash will return to the astronaut? (A) II only (B) III only (C) I and II only (D) II and III only (E) All three (I, II, and III)',
    choices: '{"A":"II only","B":"III only","C":"I and II only","D":"II and III only","E":"All three (I, II, and III)"}',
    correct_answer: 'E',
    solution: 'Each piece of trash is given a very small velocity change relative to the station. The resulting orbits are very close to the station\'s orbit. After one orbital period, all objects in nearby orbits return to approximately the same point. Therefore all three pieces return to the astronaut.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 8,
    topic: 'kinematics',
    problem: 'An object moves along the x-axis. A plot of its velocity v as a function of position x is a straight line that passes through the origin with positive slope (v = kx for some constant k > 0, starting from v = 0 at x = 0). Which of the following best describes the plot of acceleration a as a function of position x? (A) a is constant (nonzero) (B) a curves upward from zero (C) a increases linearly through the origin (D) a is constant at first, then drops to zero (E) a curves downward from a maximum',
    choices: '{"A":"a is constant (nonzero)","B":"a curves upward from zero","C":"a increases linearly through the origin","D":"a is constant at first, then drops to zero","E":"a curves downward from a maximum"}',
    correct_answer: 'C',
    solution: 'Since v = kx, we use a = v*(dv/dx) = (kx)*k = k^2*x. The acceleration is proportional to x, giving a straight line through the origin with positive slope.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 9,
    topic: 'forces',
    problem: 'A block of mass M hangs from a string that passes over a frictionless pulley attached to the ceiling. The other end of the string extends horizontally. A small mass m is hung from the midpoint of the horizontal section of the string, causing it to sag. Assuming the system reaches equilibrium and neglecting the mass of the string, what is the tension in the string? (A) mg/2 (B) Mg (C) (M+m)g/2 (D) (M+m)g (E) sqrt(M^2 + m^2)*g',
    choices: '{"A":"mg/2","B":"Mg","C":"(M+m)g/2","D":"(M+m)g","E":"sqrt(M^2 + m^2)*g"}',
    correct_answer: 'B',
    solution: 'The string is massless and the pulley is frictionless, so the tension is the same throughout the entire string. On the side with the hanging block M, the tension must support Mg. Therefore the tension everywhere in the string is Mg.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 10,
    topic: 'forces',
    problem: 'Continuing from Problem 9: The horizontal distance between the pulley and the wall where the string is attached is L. When the small mass m is hung from the midpoint of the horizontal string segment, the block M is raised by approximately what height? Assume m is much less than M. (A) 0.15L (B) 0.23L (C) 0.31L (D) 0.37L (E) 0.40L',
    choices: '{"A":"0.15L","B":"0.23L","C":"0.31L","D":"0.37L","E":"0.40L"}',
    correct_answer: 'A',
    solution: 'The small mass causes the horizontal string to sag, forming a V-shape. The two string segments each make an angle theta with the horizontal. Vertical equilibrium of mass m gives 2T*sin(theta) = mg, with T = Mg, so sin(theta) = m/(2M). The increase in string length used for the sag reduces the length available on the vertical side, raising M by approximately 0.15L.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 11,
    topic: 'mechanics',
    problem: 'Plain carbon steel has a tensile strength of approximately 415 MPa (megapascals). What is the maximum mass that can be hung from a vertical steel rod of diameter 2 cm without the rod breaking? (A) 1,300 kg (B) 5,200 kg (C) 13,000 kg (D) 52,000 kg (E) The answer depends on the length of the rod',
    choices: '{"A":"1,300 kg","B":"5,200 kg","C":"13,000 kg","D":"52,000 kg","E":"The answer depends on the length of the rod"}',
    correct_answer: 'C',
    solution: 'The cross-sectional area is A = pi*(0.01 m)^2 = pi*10^-4 m^2. Maximum force = 415*10^6 * pi*10^-4 = 415*pi*10^2 N approximately equals 130,000 N. Maximum mass = 130,000/10 = 13,000 kg.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 12,
    topic: 'oscillations',
    problem: 'A point mass m is glued to the inside of a uniform hollow thin rod of length L and negligible mass. When the rod is pivoted at one end and allowed to swing as a pendulum, the period is T. When pivoted at the other end, the period is 2T. How far is the point mass from the center of the rod? (A) L/8 (B) L/6 (C) L/4 (D) 3L/10 (E) 2L/5',
    choices: '{"A":"L/8","B":"L/6","C":"L/4","D":"3L/10","E":"2L/5"}',
    correct_answer: 'D',
    solution: 'Let the mass be at distance d1 from one end and d2 = L - d1 from the other end. The period of a simple pendulum is T = 2*pi*sqrt(d/g), so T1/T2 = sqrt(d1/d2). Given T1 = T and T2 = 2T: 1/2 = sqrt(d1/d2), so d1/d2 = 1/4. With d1 + d2 = L: d1 = L/5, d2 = 4L/5. Distance from center = |L/2 - L/5| = 3L/10.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 13,
    topic: 'rotational',
    problem: 'A ballerina is spinning about a vertical axis with angular velocity omega. She holds a pen at arm\'s length at radius R from the axis. She releases the pen, which then flies outward and eventually hits the floor. What happens to the total vertical component of the angular momentum of the ballerina-pen system? (A) It decreases continuously until the pen hits the floor (B) It increases continuously until the pen hits the floor (C) It always stays the same (D) It initially stays the same but decreases when the pen hits the floor (E) It initially stays the same but increases when the pen hits the floor',
    choices: '{"A":"It decreases continuously until the pen hits the floor","B":"It increases continuously until the pen hits the floor","C":"It always stays the same","D":"It initially stays the same but decreases when the pen hits the floor","E":"It initially stays the same but increases when the pen hits the floor"}',
    correct_answer: 'C',
    solution: 'There are no external torques about the vertical axis on the system. Gravity acts vertically (producing no vertical torque), and the normal force from the floor on the ballerina also acts vertically. Therefore the vertical angular momentum is always conserved, even when the pen hits the floor (the floor exerts no torque about the vertical axis).',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 14,
    topic: 'mechanics',
    problem: 'Two blocks, each of mass m, are stacked on top of each other. The bottom block rests on a frictionless surface. There is friction between the two blocks with coefficients mu_s (static) and mu_k (kinetic). A constant horizontal force F is applied to the bottom block. Which graph correctly shows the acceleration of the bottom block as a function of F? Note: Due to a typo in the original problem (mu_s was listed as less than mu_k), credit was given for all answers. (A) Linear increase through origin (B) Linear increase, then a jump up, then steeper linear increase (C) Linear increase then smooth curve (D) Linear increase, plateau, then linear increase (E) Two linear segments with no jump',
    choices: '{"A":"Linear increase through origin","B":"Linear increase, then a jump up, then steeper linear increase","C":"Linear increase then smooth curve","D":"Linear increase, plateau, then linear increase","E":"Two linear segments with no jump"}',
    correct_answer: 'B',
    solution: 'For small F, both blocks move together with a = F/(2m). When F exceeds the static friction limit, the blocks separate. At that moment friction drops from mu_s*mg to mu_k*mg, causing a discontinuous jump in acceleration. Above the threshold, a = (F - mu_k*mg)/m. Note: Credit was given for all answers due to a typo in the original problem.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 15,
    topic: 'fluids',
    problem: 'A tapered vessel (wider at top, narrower at bottom) contains two immiscible liquids. The top liquid has density rho_1 and depth h1, and the bottom liquid has density rho_2 and depth h2. The area of the interface between the liquids is s1 and the area of the bottom of the vessel is s2. What is the gauge pressure at the bottom of the vessel? (A) (rho_1*h1 + rho_2*h2)*g (B) (rho_1*s1*h1 + rho_2*s2*h2)*g / s2 (C) (1/2)*(rho_1 + rho_2)*(h1 + h2)*g (D) (rho_1 + rho_2)*(h1 + h2)*g (E) rho_2*(h1 + h2)*g',
    choices: '{"A":"(rho_1*h1 + rho_2*h2)*g","B":"(rho_1*s1*h1 + rho_2*s2*h2)*g / s2","C":"(1/2)*(rho_1 + rho_2)*(h1 + h2)*g","D":"(rho_1 + rho_2)*(h1 + h2)*g","E":"rho_2*(h1 + h2)*g"}',
    correct_answer: 'A',
    solution: 'Pressure at any depth in a fluid depends only on the height of fluid above, not on the shape of the container. The gauge pressure at the bottom is P = rho_1*g*h1 + rho_2*g*h2 = (rho_1*h1 + rho_2*h2)*g.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 16,
    topic: 'energy',
    problem: 'Two identical small spherical liquid droplets, each of radius r, coalesce into a single larger droplet. The excess surface energy is converted entirely into kinetic energy, launching the merged droplet upward. How does the maximum height h reached by the merged droplet depend on the initial radius r of the small droplets? (A) h is proportional to r (B) h is proportional to r^(1/2) (C) h is proportional to r^(-1/2) (D) h is proportional to r^(-1) (E) h is proportional to r^(-2)',
    choices: '{"A":"h proportional to r","B":"h proportional to r^(1/2)","C":"h proportional to r^(-1/2)","D":"h proportional to r^(-1)","E":"h proportional to r^(-2)"}',
    correct_answer: 'D',
    solution: 'Surface energy is proportional to surface area, which scales as r^2. The mass of the merged droplet scales as r^3. Setting the released surface energy equal to mgh: r^2 ~ r^3 * h, so h ~ r^(-1). The height is inversely proportional to the radius.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 17,
    topic: 'momentum',
    problem: 'Paul the Giant stands on a scale that reads 5000 N. He wears a very large hat with a flat top of area 1 m^2. It starts to rain. The rain falls vertically at 1 m/s and accumulates on his hat at a rate of 1 mm/s (the water does not flow off). The density of water is 1000 kg/m^3. What does the scale read as a function of time t (in seconds) after the rain starts? (A) 5001 + 11t N (B) 5001 + 10t N (C) 5000 + 11t N (D) 5001 + 1.1t N (E) 5001 + t N',
    choices: '{"A":"5001 + 11t","B":"5001 + 10t","C":"5000 + 11t","D":"5001 + 1.1t","E":"5001 + t"}',
    correct_answer: 'B',
    solution: 'The rate of mass accumulation is dm/dt = rho * A * (1 mm/s) = 1000 * 1 * 0.001 = 1 kg/s. The weight of accumulated water at time t is 10t N. The momentum transfer force from stopping the rain is (dm/dt)*v = 1 * 1 = 1 N (constant). Total reading = 5000 + 1 + 10t = 5001 + 10t N.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 18,
    topic: 'rotational',
    problem: 'A massless rod of length L has a point mass M attached at one end and is pivoted at the other end. The rod is held horizontally and released, swinging down. At the bottom of the swing, the mass M at the end of the rod has speed v. At this instant, the mass M strikes and sticks to another point mass M located at the midpoint of the rod. What is the kinetic energy of the system immediately after the collision? (A) (1/4)*M*v^2 (B) (1/3)*M*v^2 (C) (7/18)*M*v^2 (D) (2/5)*M*v^2 (E) (1/2)*M*v^2',
    choices: '{"A":"(1/4)*M*v^2","B":"(1/3)*M*v^2","C":"(7/18)*M*v^2","D":"(2/5)*M*v^2","E":"(1/2)*M*v^2"}',
    correct_answer: 'D',
    solution: 'Before collision, angular momentum about pivot is L_i = M*v*L. After collision, the system has mass M at L and M at L/2. Moment of inertia I = M*L^2 + M*(L/2)^2 = (5/4)*M*L^2. Angular momentum conservation: M*v*L = (5/4)*M*L^2*omega, so omega = 4v/(5L). Final KE = (1/2)*I*omega^2 = (1/2)*(5/4)*M*L^2*(4v/(5L))^2 = (2/5)*M*v^2.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 19,
    topic: 'rotational',
    problem: 'A system consists of three layers of identical cylinders, each of radius r, spinning with angular velocity omega, separated by flat horizontal plates. The bottom plate (floor) is stationary. The first layer of cylinders sits on the floor and supports the first moving plate. The second layer of cylinders sits on the first plate and supports the second plate. The third layer sits on the second plate and supports the top plate. All cylinders roll without slipping on the plates above and below them. What is the speed of the top plate? (A) omega*r (B) 2*omega*r (C) 3*omega*r (D) 4*omega*r (E) 6*omega*r',
    choices: '{"A":"omega*r","B":"2*omega*r","C":"3*omega*r","D":"4*omega*r","E":"6*omega*r"}',
    correct_answer: 'E',
    solution: 'For a cylinder rolling without slipping between two plates, if the bottom plate has speed v_b, the top of the cylinder (and hence the top plate) has speed v_b + 2*omega*r. Starting from the stationary floor: first plate speed = 2*omega*r, second plate speed = 4*omega*r, top plate speed = 6*omega*r.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 20,
    topic: 'mechanics',
    problem: 'A car drives at constant speed v0 into a headwind. The wind has average speed v but fluctuates in strength. The aerodynamic drag force on the car is F = A*(v_rel)^2, where v_rel is the relative speed of the air with respect to the car and A is a constant. The power dissipated by the car to overcome air resistance is P. What can be said about P compared to A*v0*(v0 + v)^2? (A) P = A*v0*(v0 + v)^2 (B) P > A*v0*(v0 + v)^2 (C) P < A*v0*(v0 + v)^2 (D) Both B and C are possible depending on the fluctuations (E) Both A and C are possible depending on the fluctuations',
    choices: '{"A":"P = A*v0*(v0 + v)^2","B":"P > A*v0*(v0 + v)^2","C":"P < A*v0*(v0 + v)^2","D":"Both B and C are possible","E":"Both A and C are possible"}',
    correct_answer: 'B',
    solution: 'The instantaneous power is P_inst = A*v0*(v0 + v_wind)^2. The average power is P = A*v0*<(v0 + v_wind)^2>. By Jensen\'s inequality (or expanding the square), <(v0 + v_wind)^2> = (v0 + v)^2 + <(delta_v)^2> > (v0 + v)^2 since the variance is positive. Therefore P > A*v0*(v0 + v)^2.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 21,
    topic: 'mechanics',
    problem: 'A circular table of mass m and radius R has N identical legs equally spaced around its edge, each of height h. What is the minimum horizontal force applied to the edge of the table that is needed to tip it over? (Note: Both B and C were accepted as correct answers.) (A) mgR/h (B) mgR*sin((N-2)*pi/(2N))/h (C) mgR*cos(pi/N)/h (D) mgR*tan((N-2)*pi/(2N))/h (E) mgR*sin(pi/(2N))/h',
    choices: '{"A":"mgR/h","B":"mgR*sin((N-2)*pi/(2N))/h","C":"mgR*cos(pi/N)/h","D":"mgR*tan((N-2)*pi/(2N))/h","E":"mgR*sin(pi/(2N))/h"}',
    correct_answer: 'C',
    solution: 'The table tips over the line connecting two adjacent legs. The optimal push direction is perpendicular to the table edge, aimed between two adjacent legs. The perpendicular distance from the center to the line between two adjacent legs is R*cos(pi/N). Taking torques about the tipping edge: F*h = mg*R*cos(pi/N), so F = mgR*cos(pi/N)/h. Note: Both B and C simplify to the same expression and were accepted.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 22,
    topic: 'momentum',
    problem: 'In a collision between two point masses, the change in total momentum Delta_P and the change in total kinetic energy Delta_K are computed. These quantities are then computed in a different reference frame. Which of the following is true? (A) Neither Delta_P nor Delta_K depends on the reference frame (B) Neither depends on frame for elastic collisions; Delta_P may depend on frame for inelastic (C) Neither depends on frame for elastic; Delta_K may depend on frame for inelastic (D) Neither depends on frame for elastic; both may depend on frame for inelastic (E) Both may depend on frame for any type of collision',
    choices: '{"A":"Neither Delta_P nor Delta_K depends on the reference frame","B":"Neither depends for elastic; Delta_P may depend for inelastic","C":"Neither depends for elastic; Delta_K may depend for inelastic","D":"Neither depends for elastic; both may depend for inelastic","E":"Both may depend on frame for any collision"}',
    correct_answer: 'A',
    solution: 'Momentum is always conserved in collisions (Delta_P = 0 in all frames), so it is trivially frame-independent. The change in kinetic energy equals the energy converted to heat/deformation, which is a frame-invariant scalar quantity. Therefore both Delta_P and Delta_K are independent of reference frame for all collisions.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 23,
    topic: 'measurement',
    problem: 'Steve measures a spring constant k by applying a force F to a spring and measuring the displacement Delta_x. Both F and Delta_x have the same constant absolute uncertainty delta. His uncertainty in k is delta_k_S. Tiffany repeats the experiment using a force 5F on the same spring (with the same absolute uncertainties delta in force and displacement measurements). What is Tiffany\'s uncertainty delta_k_T in the spring constant relative to Steve\'s? (A) 0.04*delta_k_S (B) 0.08*delta_k_S (C) 0.2*delta_k_S (D) 0.4*delta_k_S (E) 0.5*delta_k_S',
    choices: '{"A":"0.04*delta_k_S","B":"0.08*delta_k_S","C":"0.2*delta_k_S","D":"0.4*delta_k_S","E":"0.5*delta_k_S"}',
    correct_answer: 'C',
    solution: 'k = F/Delta_x, so delta_k/k = sqrt((delta_F/F)^2 + (delta_x/Delta_x)^2). With 5 times the force, both F and Delta_x are 5 times larger, so relative uncertainties are each 1/5 as large. Therefore delta_k_T/k = (1/5)*delta_k_S/k, giving delta_k_T = 0.2*delta_k_S.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 24,
    topic: 'mechanics',
    problem: 'A mass m is attached to a "zero-length spring" with spring constant k. The other end of the spring is attached to a fixed horizontal pole. The natural length of the spring is zero, meaning the spring force is F = k*d where d is the actual length of the spring. The mass swings in a horizontal circular orbit of radius R around the pole. What is the vertical distance h between the center of the circular orbit and the pole? (A) sqrt(mgR/k) (B) R*sqrt((R + mg/k)/(R - mg/k)) (C) R - mg/k (D) mg/k (E) sqrt(R^2 - (mg/k)^2)',
    choices: '{"A":"sqrt(mgR/k)","B":"R*sqrt((R + mg/k)/(R - mg/k))","C":"R - mg/k","D":"mg/k","E":"sqrt(R^2 - (mg/k)^2)"}',
    correct_answer: 'D',
    solution: 'The spring length is d = sqrt(R^2 + h^2) and the spring force has magnitude k*d = k*sqrt(R^2 + h^2). The vertical component of the spring force must balance gravity: k*d*(h/d) = mg, which simplifies to k*h = mg, giving h = mg/k. This elegant result is independent of R.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2020,
    number: 25,
    topic: 'oscillations',
    problem: 'A ball of mass m is connected to two vertical springs inside a box of height 2*l0. Spring 1 (constant k1) is attached to the top of the box and spring 2 (constant k2) is attached to the bottom. Both springs have natural length l0, so in equilibrium the ball sits at the center of the box with both springs at their natural length. Under what condition is this equilibrium stable with respect to small horizontal displacements of the ball? (A) k1 > k2 (B) k2 > k1 (C) k1 - k2 > mg/l0 (D) k1*k2/(k1 + k2) > mg/l0 (E) k1*k2/(k1 - k2) > mg/l0',
    choices: '{"A":"k1 > k2","B":"k2 > k1","C":"k1 - k2 > mg/l0","D":"k1*k2/(k1 + k2) > mg/l0","E":"k1*k2/(k1 - k2) > mg/l0"}',
    correct_answer: 'C',
    solution: 'For a small horizontal displacement x, the top spring (stretched beyond l0) provides a restoring horizontal force, while the bottom spring (compressed below l0) provides a destabilizing horizontal force. The net horizontal restoring force per unit displacement is approximately (k1 - k2 - mg/l0). For stability this must be positive: k1 - k2 > mg/l0.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2020_F%3Dma_Problems'
  }
];

module.exports = problems;
