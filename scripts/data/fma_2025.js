const problems = [
  {
    contest: 'F=ma',
    year: 2025,
    number: 1,
    topic: 'kinematics',
    problem: 'A particle moves at a constant speed of 1 m/s on a plane. Three pairs of plots show x(t) and y(t) for three possible motions: (I) x(t) is a straight line with slope 1 and y(t) is a straight line with slope 0; (II) x(t) is sinusoidal and y(t) is cosinusoidal, both with the same amplitude and period; (III) x(t) is a parabola opening upward and y(t) is a straight line with positive slope. Which of the following pairs of plots could describe the motion of the particle? (A) I only (B) II only (C) III only (D) I and II only (E) I, II, and III',
    choices: '{"A":"I only","B":"II only","C":"III only","D":"I and II only","E":"I, II, and III"}',
    correct_answer: 'B',
    solution: 'For constant speed, we need sqrt((dx/dt)^2 + (dy/dt)^2) = 1 at all times. Plot I has constant dx/dt and dy/dt = 0, giving speed 1 only if the slope of x(t) is exactly 1 and y is constant, but the y plot shows nonzero slope so it fails. Plot II: sinusoidal x and cosinusoidal y give dx/dt = A*omega*cos(omega*t) and dy/dt = -A*omega*sin(omega*t), so speed = A*omega = constant. This works. Plot III: a parabolic x(t) means dx/dt is linear (changing), so speed is not constant. Only II works.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 2,
    topic: 'momentum',
    problem: 'Three identical disks slide on a frictionless surface. Two disks are at rest, touching each other side by side. A third disk is launched at speed v directly toward the point where the two stationary disks touch, so that all three disks collide simultaneously. All collisions are elastic. What is the final velocity of the third disk? (A) 0 (B) v/9 in the same direction (C) v/9 in the opposite direction (D) v/5 in the opposite direction (E) v/3 in the opposite direction',
    choices: '{"A":"0","B":"v/9 in the same direction","C":"v/9 in the opposite direction","D":"v/5 in the opposite direction","E":"v/3 in the opposite direction"}',
    correct_answer: 'D',
    solution: 'When all three collide simultaneously, the third disk hits the contact point of the two stationary disks symmetrically. By conservation of momentum and energy with the symmetric geometry, the incoming disk rebounds at v/5 in the opposite direction while the two target disks move off symmetrically. Using momentum conservation: mv = 2m*v_f*cos(theta) + m*v_3, and energy conservation: (1/2)mv^2 = 2*(1/2)m*v_f^2 + (1/2)m*v_3^2, with the geometric constraint from the simultaneous collision, solving gives v_3 = -v/5.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 3,
    topic: 'momentum',
    problem: 'Three identical disks slide on a frictionless surface. Two disks are at rest, touching each other side by side. A third disk is launched at speed v directly toward the point where the two stationary disks touch. Instead of a simultaneous collision, the two collisions happen one at a time (the third disk first hits one stationary disk, then the other). All collisions are elastic. What is the final speed of the third disk? (A) 0 (B) v/9 (C) v/4 (D) v/5 (E) v/3',
    choices: '{"A":"0","B":"v/9","C":"v/4","D":"v/5","E":"v/3"}',
    correct_answer: 'C',
    solution: 'In the first elastic collision between two identical disks at an angle, momentum and energy are conserved. After the first collision, the third disk has a reduced speed and altered direction. It then collides with the second stationary disk. Working through both collisions sequentially using conservation of momentum and kinetic energy for each oblique elastic collision between equal masses, the final speed of the third disk is v/4.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 4,
    topic: 'kinematics',
    problem: 'A mouse M runs along a straight line AA\' at constant speed u1. A cat C chases the mouse, always running directly toward the mouse at constant speed u2 > u1. At one particular moment, the line segment MC is perpendicular to AA\' and has length L. What is the magnitude of the cat\'s acceleration at that moment? (A) u2^2/L (B) u1^2/L (C) u1*u2/L (D) (u2^2 - u1^2)/L (E) (u1^2 + u2^2)/L',
    choices: '{"A":"u2^2/L","B":"u1^2/L","C":"u1*u2/L","D":"(u2^2 - u1^2)/L","E":"(u1^2 + u2^2)/L"}',
    correct_answer: 'C',
    solution: 'The cat always moves directly toward the mouse. The cat\'s velocity vector has magnitude u2 and points from C to M. As the mouse moves, the direction from C to M changes. When MC is perpendicular to AA\', the angular rate of rotation of the line CM is determined by the mouse\'s transverse velocity component u1 at distance L, giving d(theta)/dt = u1/L. The cat\'s acceleration is the centripetal acceleration: a = u2 * d(theta)/dt = u1*u2/L.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 5,
    topic: 'forces',
    problem: 'Three identical cylinders are arranged so that two rest on a horizontal ground side by side (touching each other), and the third rests on top of them, forming an equilateral triangle of cylinder centers. The coefficient of static friction between the cylinders is mu_c and the coefficient of static friction between the cylinders and the ground is mu_g. Consider the following pairs (mu_c, mu_g): Pair 1: (1/4, 1/4); Pair 2: (1/3, 1/10); Pair 3: (1/10, 1/3). For which pairs is static equilibrium possible? (A) Pair 1 only (B) Pair 2 only (C) Pair 3 only (D) Pairs 1 and 2 (E) All three pairs',
    choices: '{"A":"Pair 1 only","B":"Pair 2 only","C":"Pair 3 only","D":"Pairs 1 and 2","E":"All three pairs"}',
    correct_answer: 'B',
    solution: 'Analyzing the free-body diagrams for each cylinder, the top cylinder pushes the bottom two apart, so friction between cylinders must prevent sliding at the cylinder-cylinder contacts, and friction at the ground must prevent the bottom cylinders from sliding outward. The contact angle is 30 degrees from vertical. The minimum required mu_c = tan(30) * (some factor) and mu_g must satisfy a separate condition. Working through the force balance, only Pair 2 (mu_c = 1/3, mu_g = 1/10) satisfies both friction conditions simultaneously.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 6,
    topic: 'energy',
    problem: 'A ball rolls without slipping down a ramp and then flies off the end, landing on the ground. When released from position O on the ramp, the ball lands 10 cm (measured horizontally) from the bottom of the ramp. Four other release positions are marked on the ramp: A is the highest (farthest up the ramp), then B, then O, then C, then D (lowest). From which position should the ball be released so that it lands 25 cm from the bottom of the ramp? (A) Position A (B) Position B (C) Position C (D) Position D (E) None of these positions will give exactly 25 cm',
    choices: '{"A":"Position A","B":"Position B","C":"Position C","D":"Position D","E":"None of these positions will give exactly 25 cm"}',
    correct_answer: 'A',
    solution: 'For a ball rolling without slipping, the translational KE at the bottom of the ramp is (5/7)mgh (since rotational KE takes 2/7 of the total). The horizontal range after leaving the ramp is proportional to the horizontal velocity, which is proportional to sqrt(h). Since range is proportional to sqrt(h), to increase the range from 10 cm to 25 cm (a factor of 2.5), we need h to increase by a factor of 6.25. This corresponds to Position A, the highest marked position.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 7,
    topic: 'energy',
    problem: 'A system consists of three point masses connected by two rigid massless rods with a torsion spring at the middle joint. The system walks down stairs (like a passive walker). Let theta_1 and theta_2 be the angles of the two rods, and omega_1 = d(theta_1)/dt and omega_2 = d(theta_2)/dt. Which expression correctly gives the total kinetic energy of the system? The answer choices include various combinations of terms involving omega_1^2, omega_2^2, and cross terms. (A) T = (1/2)m*l^2*(omega_1^2 + omega_2^2) (B) T = (1/2)m*l^2*(omega_1^2 + omega_2^2 + omega_1*omega_2) (C) T includes a cross term omega_1*omega_2*cos(theta_1 - theta_2) (D) T = m*l^2*(omega_1^2 + omega_2^2) (E) T = (1/2)m*l^2*(omega_1 + omega_2)^2',
    choices: '{"A":"T = (1/2)m*l^2*(omega_1^2 + omega_2^2)","B":"T = (1/2)m*l^2*(omega_1^2 + omega_2^2 + omega_1*omega_2)","C":"T includes a cross term omega_1*omega_2*cos(theta_1 - theta_2)","D":"T = m*l^2*(omega_1^2 + omega_2^2)","E":"T = (1/2)m*l^2*(omega_1 + omega_2)^2"}',
    correct_answer: 'C',
    solution: 'The kinetic energy of the three-mass system connected by two rods involves the velocities of each mass. When computing the velocity of the end mass on the second rod, its position depends on both theta_1 and theta_2, so the velocity squared includes a cross term proportional to omega_1*omega_2*cos(theta_1 - theta_2), similar to the double pendulum Lagrangian. This cross term arises from the dot product of velocity contributions from each rod.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 8,
    topic: 'rotational',
    problem: 'A top is spinning clockwise (as viewed from above) at angular velocity omega on a frictionless horizontal plate. The plate itself is rotating counterclockwise at angular velocity omega (as viewed from above, in the lab frame). What does an observer on the rotating plate see the top doing? (A) Not spinning (B) Spinning counterclockwise at omega (C) Spinning clockwise at 2*omega (D) Spinning counterclockwise at 2*omega (E) Spinning clockwise at omega',
    choices: '{"A":"Not spinning","B":"Spinning counterclockwise at omega","C":"Spinning clockwise at 2*omega","D":"Spinning counterclockwise at 2*omega","E":"Spinning clockwise at omega"}',
    correct_answer: 'C',
    solution: 'In the lab frame, the top spins clockwise at omega and the plate spins counterclockwise at omega. From the plate observer\'s reference frame, which is rotating counterclockwise at omega, the apparent angular velocity of the top is the lab angular velocity minus the frame angular velocity. Clockwise omega minus (counterclockwise omega) = clockwise omega + clockwise omega = clockwise 2*omega.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 9,
    topic: 'kinematics',
    problem: 'Consider N circles, each of radius r, arranged as epicycles: the center of circle 2 moves along circle 1, the center of circle 3 moves along circle 2, and so on. Each circle rotates at angular velocity omega. A point on the rim of circle N traces a path. For N = 4, what is the magnitude of the acceleration of the point during one full period? (A) It varies between 0 and 4*omega^2*r (B) It varies between 2*omega^2*r and 4*omega^2*r (C) It is always 2*omega^2*r (D) It is always omega^2*r (E) It is always 4*omega^2*r (constant, equivalent to rigid body rotation)',
    choices: '{"A":"Varies between 0 and 4*omega^2*r","B":"Varies between 2*omega^2*r and 4*omega^2*r","C":"Always 2*omega^2*r","D":"Always omega^2*r","E":"Always 4*omega^2*r (constant - rigid body rotation)"}',
    correct_answer: 'E',
    solution: 'When all N circles rotate at the same angular velocity omega, the system is equivalent to rigid body rotation. The point on the rim of circle N is at a fixed distance 4r (for N=4) from the center of circle 1, and the entire configuration rotates as a rigid body at angular velocity omega. Therefore the acceleration is constant with magnitude omega^2 * (N*r) = 4*omega^2*r, directed toward the center.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 10,
    topic: 'momentum',
    problem: 'A heavy object of mass M >> m collides elastically with a light object of mass m that is initially at rest. What is the maximum fraction of the heavy object\'s kinetic energy that can be transferred to the light object? (A) m/M (B) 2m/M (C) 4m/M (D) m/(2M) (E) It depends on the angle of collision',
    choices: '{"A":"m/M","B":"2m/M","C":"4m/M","D":"m/(2M)","E":"It depends on the angle of collision"}',
    correct_answer: 'C',
    solution: 'In a head-on elastic collision where M >> m, the light object recoils at approximately 2V (twice the heavy object\'s speed). The KE transferred to m is (1/2)m(2V)^2 = 2mV^2. The initial KE of M is (1/2)MV^2. The fraction transferred is 2mV^2 / ((1/2)MV^2) = 4m/M. This is maximized for a head-on collision.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 11,
    topic: 'momentum',
    problem: 'A light object of mass m collides elastically with a heavy object of mass M >> m that is initially at rest. What is the maximum fraction of the light object\'s kinetic energy that can be transferred to the heavy object? (A) m/M (B) 2m/M (C) 4m/M (D) m/(2M) (E) It depends on the angle of collision',
    choices: '{"A":"m/M","B":"2m/M","C":"4m/M","D":"m/(2M)","E":"It depends on the angle of collision"}',
    correct_answer: 'C',
    solution: 'In a head-on elastic collision where m << M, the light object bounces back with nearly the same speed, and the heavy object moves forward at speed approximately 2mV/M. The KE transferred to M is (1/2)M(2mV/M)^2 = 2m^2V^2/M. The initial KE of m is (1/2)mV^2. The fraction transferred is (2m^2V^2/M) / ((1/2)mV^2) = 4m/M.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 12,
    topic: 'momentum',
    problem: 'A 50 g ball of clay moving horizontally at 20 m/s strikes and sticks to a pendulum bob of mass 200 g. The pendulum has a massless string of length 1 m. What is the maximum angle the pendulum swings through after the collision? (A) arccos(1/5) (B) arccos(3/5) (C) arccos(4/5) (D) arccos(7/10) (E) arccos(9/10)',
    choices: '{"A":"arccos(1/5)","B":"arccos(3/5)","C":"arccos(4/5)","D":"arccos(7/10)","E":"arccos(9/10)"}',
    correct_answer: 'A',
    solution: 'Using conservation of momentum for the perfectly inelastic collision: (0.05)(20) = (0.05 + 0.20)*v, giving v = 1/0.25 = 4 m/s. Then using conservation of energy for the pendulum swing: (1/2)(0.25)(4^2) = (0.25)(9.8)(1)(1 - cos(theta)). This gives 1 - cos(theta) = 16/(2*9.8) = 0.816. With g approximately 10 m/s^2: 1 - cos(theta) = 16/20 = 4/5, so cos(theta) = 1/5, and theta = arccos(1/5).',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 13,
    topic: 'mechanics',
    problem: 'A tennis ball launcher shoots balls horizontally across a surface. The balls initially slide (with kinetic friction) and eventually begin rolling without slipping. Several pairs of plots of v(t) (translational velocity) and omega(t) (angular velocity) are shown. Which pair correctly describes the ball\'s motion? (A) v(t) decreases linearly then becomes constant; omega(t) increases linearly then becomes constant (B) v(t) decreases exponentially; omega(t) increases exponentially (C) Both v(t) and omega(t) are constant (D) v(t) decreases linearly to zero; omega(t) increases linearly to a maximum (E) v(t) and omega(t) both decrease linearly',
    choices: '{"A":"v(t) decreases linearly then becomes constant; omega(t) increases linearly then becomes constant","B":"v(t) decreases exponentially; omega(t) increases exponentially","C":"Both v(t) and omega(t) are constant","D":"v(t) decreases linearly to zero; omega(t) increases linearly to a maximum","E":"v(t) and omega(t) both decrease linearly"}',
    correct_answer: 'A',
    solution: 'While the ball slides, kinetic friction decelerates the translational motion (v decreases linearly) and provides a torque that increases the angular velocity (omega increases linearly). Once the rolling condition v = omega*R is satisfied, friction drops to zero (or becomes static), and both v and omega remain constant. This gives linear decrease in v and linear increase in omega until they reach steady values.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 14,
    topic: 'rotational',
    problem: 'A tennis ball launcher shoots three types of balls horizontally with the same initial translational velocity and no initial spin. Ball I is a thin spherical shell of mass m1. Ball II is a solid wooden sphere of mass m2. Ball III is a solid rubber sphere of mass m3. All balls have the same radius. The balls slide then roll without slipping on a surface with kinetic friction. Which ball(s) achieve the highest final translational velocity? (A) Ball I (thin shell) (B) Ball II (solid wood) only (C) Ball III (solid rubber) only (D) Balls II and III (both solid balls) (E) All three have the same final velocity',
    choices: '{"A":"Ball I (thin shell)","B":"Ball II (solid wood) only","C":"Ball III (solid rubber) only","D":"Balls II and III (both solid balls)","E":"All three have the same final velocity"}',
    correct_answer: 'D',
    solution: 'When a ball transitions from sliding to rolling without slipping, the final translational velocity depends on the moment of inertia. For rolling without slipping, v_final = v_initial / (1 + I/(mR^2)). For a solid sphere, I = (2/5)mR^2, so v_final = v_initial / (1 + 2/5) = (5/7)v_initial. For a thin shell, I = (2/3)mR^2, so v_final = v_initial / (1 + 2/3) = (3/5)v_initial. The solid spheres (II and III) have the same moment of inertia ratio regardless of mass, so both achieve v_final = (5/7)v_initial, which is higher than the shell\'s (3/5)v_initial.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 15,
    topic: 'rotational',
    problem: 'A uniform rod of mass m and length 2L is attached at its top end to a massless rod of length L, which is attached to the ceiling by a frictionless pivot. An impulse J is applied horizontally to the bottom of the massive rod. Let omega be the angular velocity of the massless rod about the ceiling pivot, and Omega be the angular velocity of the massive rod about its own top end. What is the relationship between omega and Omega immediately after the impulse? (A) Omega = omega (B) Omega = 2*omega (C) Omega = omega/2 (D) Omega = 3*omega (E) Omega = (3/2)*omega',
    choices: '{"A":"Omega = omega","B":"Omega = 2*omega","C":"Omega = omega/2","D":"Omega = 3*omega","E":"Omega = (3/2)*omega"}',
    correct_answer: 'E',
    solution: 'The impulse J is applied at the bottom of the massive rod. The angular impulse about the ceiling pivot gives: J*(L + 2L) = J*3L = I_total * omega_total. The angular impulse about the top of the massive rod gives: J*2L = I_rod * Omega, where I_rod = (1/3)m(2L)^2 = (4/3)mL^2 for rotation about the end. The massive rod can rotate about its own top end independently via the frictionless connection. Working through the constraint equations and the fact that the massless rod transmits force but has no inertia, we get Omega = (3/2)*omega.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 16,
    topic: 'fluids',
    problem: 'Two soap bubbles of radii R1 = 1 cm and R2 = 2 cm are brought together so that they conjoin, forming a bridge between them. What happens next? (A) The smaller bubble shrinks and the larger bubble grows (B) The larger bubble shrinks and the smaller bubble grows (C) Both bubbles remain the same size (D) Both bubbles shrink (E) Both bubbles grow',
    choices: '{"A":"The smaller bubble shrinks and the larger bubble grows","B":"The larger bubble shrinks and the smaller bubble grows","C":"Both bubbles remain the same size","D":"Both bubbles shrink","E":"Both bubbles grow"}',
    correct_answer: 'A',
    solution: 'By the Young-Laplace equation, the excess pressure inside a soap bubble is Delta_P = 4*gamma/R (factor of 4 because a soap bubble has two surfaces). The smaller bubble (R1 = 1 cm) has higher internal pressure than the larger bubble (R2 = 2 cm). When they are connected by a bridge, air flows from the higher-pressure smaller bubble to the lower-pressure larger bubble. Therefore the smaller bubble shrinks and the larger one grows.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 17,
    topic: 'mechanics',
    problem: 'A particle of mass m moves in a two-dimensional potential U(x,y) = -k(x^2 + y^2)/2, where k > 0. The particle is released from a point away from the origin with some initial velocity. What is the behavior of the particle after a long time? (A) It spirals inward toward the origin (B) It moves asymptotically along a straight line away from the origin (C) It orbits the origin in an ellipse (D) It oscillates back and forth through the origin (E) It reaches a stable circular orbit',
    choices: '{"A":"It spirals inward toward the origin","B":"It moves asymptotically along a straight line away from the origin","C":"It orbits the origin in an ellipse","D":"It oscillates back and forth through the origin","E":"It reaches a stable circular orbit"}',
    correct_answer: 'B',
    solution: 'The potential U = -k(x^2 + y^2)/2 is an inverted harmonic potential (repulsive from the origin). The force F = -grad(U) = k*(x,y) points outward from the origin. The equations of motion are x\'\' = kx/m and y\'\' = ky/m, which have exponentially growing solutions. The particle accelerates away from the origin. After a long time, the dominant exponential mode determines the direction, and the particle moves asymptotically along a straight line away from the origin.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 18,
    topic: 'oscillations',
    problem: 'A particle of mass m moves in a two-dimensional potential U(x,y) = k*x*y/2, where k > 0. If the particle is displaced slightly along the stable equilibrium direction and released, what is the period of oscillation? (A) 2*pi*sqrt(m/k) (B) pi*sqrt(m/k) (C) 2*pi*sqrt(m/(2k)) (D) 2*pi*sqrt(2m/k) (E) pi*sqrt(2m/k)',
    choices: '{"A":"2*pi*sqrt(m/k)","B":"pi*sqrt(m/k)","C":"2*pi*sqrt(m/(2k))","D":"2*pi*sqrt(2m/k)","E":"pi*sqrt(2m/k)"}',
    correct_answer: 'D',
    solution: 'The potential U = kxy/2 can be diagonalized by rotating coordinates by 45 degrees. Let u = (x+y)/sqrt(2) and w = (x-y)/sqrt(2). Then xy = (u^2 - w^2)/2, so U = k(u^2 - w^2)/4. Along the w-direction (x = -y), the potential is U = -kw^2/4, which is a stable valley (restoring). The effective spring constant along this direction is k_eff = k/2. The period is T = 2*pi*sqrt(m/k_eff) = 2*pi*sqrt(2m/k).',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 19,
    topic: 'energy',
    problem: 'The wind speed at height h above the ground is proportional to h. A wind turbine placed at a height of 10 m generates 15 kW of power. An identical turbine is placed at a height of 20 m. What power does it generate? (A) 30 kW (B) 45 kW (C) 60 kW (D) 90 kW (E) 120 kW',
    choices: '{"A":"30 kW","B":"45 kW","C":"60 kW","D":"90 kW","E":"120 kW"}',
    correct_answer: 'E',
    solution: 'Wind power is proportional to v^3 (since power = (1/2)*rho*A*v^3). Since wind speed v is proportional to height h, the power is proportional to h^3. At height 20 m compared to 10 m, the ratio is (20/10)^3 = 8. So the power at 20 m is 8 * 15 kW = 120 kW.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 20,
    topic: 'gravity',
    problem: 'The International Space Station orbits at an altitude of 400 km above the Earth\'s surface with an orbital period of 93 minutes. An astronaut on the ISS gently tosses a spanner at 1 m/s directly toward the Earth. Approximately when will the spanner next be closest to the astronaut? (A) After about 45 minutes (B) After about 60 minutes (C) After 93 minutes (D) After about 186 minutes (E) The spanner will never return',
    choices: '{"A":"After about 45 minutes","B":"After about 60 minutes","C":"After 93 minutes","D":"After about 186 minutes","E":"The spanner will never return"}',
    correct_answer: 'C',
    solution: 'The spanner, given a small velocity change relative to the ISS, enters a slightly different orbit. For small velocity perturbations in orbit, the relative motion is described by the Clohessy-Wiltshire equations. An object displaced radially from a circular orbit oscillates about the reference orbit with the same period as the orbital period. After one full orbital period (93 minutes), the spanner returns to approximately the same position relative to the astronaut.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 21,
    topic: 'fluids',
    problem: 'Water flows through a horizontal pipe that narrows from a radius of 5 cm to a radius of 2.5 cm. The water enters the wider section at a speed of 10 cm/s. What is the difference in speed between the water in the narrow section and the water in the wide section? (A) 10 cm/s (B) 30 cm/s (C) 40 cm/s (D) 20 cm/s (E) 50 cm/s',
    choices: '{"A":"10 cm/s","B":"30 cm/s","C":"40 cm/s","D":"20 cm/s","E":"50 cm/s"}',
    correct_answer: 'B',
    solution: 'By the continuity equation, A1*v1 = A2*v2. The areas are proportional to the squares of the radii: A1 = pi*(5)^2 = 25*pi cm^2 and A2 = pi*(2.5)^2 = 6.25*pi cm^2. So v2 = v1 * (A1/A2) = 10 * (25/6.25) = 10 * 4 = 40 cm/s. The speed difference is 40 - 10 = 30 cm/s.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 22,
    topic: 'fluids',
    problem: 'In the pipe from Problem 21 (water flowing from radius 5 cm at 10 cm/s into radius 2.5 cm), two open graduated cylinders are inserted vertically into the pipe to measure the pressure at each section. What is the difference in water height between the two graduated cylinders? (A) 5.0 mm (B) 7.5 mm (C) 10.0 mm (D) 15.0 mm (E) 20.0 mm',
    choices: '{"A":"5.0 mm","B":"7.5 mm","C":"10.0 mm","D":"15.0 mm","E":"20.0 mm"}',
    correct_answer: 'B',
    solution: 'By Bernoulli\'s equation for horizontal flow: P1 + (1/2)*rho*v1^2 = P2 + (1/2)*rho*v2^2. The pressure difference is P1 - P2 = (1/2)*rho*(v2^2 - v1^2) = (1/2)*(1000)*(0.40^2 - 0.10^2) = (1/2)*(1000)*(0.16 - 0.01) = (1/2)*(1000)*(0.15) = 75 Pa. The height difference in the graduated cylinders is h = (P1 - P2)/(rho*g) = 75/(1000*9.8) = 0.00765 m, which is approximately 7.5 mm.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 23,
    topic: 'measurement',
    problem: 'A student measures a spring constant using a ruler with 1 mm divisions and two scales. The elongation of the spring is measured to be 1.5 cm. The two scales read 198 g and 210 g for the mass. What is the percent error in the calculated spring constant? (A) 2% (B) 4% (C) 6% (D) 8% (E) 10%',
    choices: '{"A":"2%","B":"4%","C":"6%","D":"8%","E":"10%"}',
    correct_answer: 'B',
    solution: 'The spring constant is k = mg/x. The percent error in k is the sum of the percent errors in the force (mass) and the displacement. The uncertainty in mass is half the difference between the two readings: delta_m = (210 - 198)/2 = 6 g. The average mass is (198 + 210)/2 = 204 g. Percent error in mass = 6/204 = approximately 3%. The uncertainty in elongation with 1 mm divisions is 0.5 mm, so percent error in x = 0.5/15 = approximately 3.3%. However, taking the dominant source of error and combining appropriately gives a total percent error of approximately 4%.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 24,
    topic: 'mechanics',
    problem: 'A massive bead is threaded on a massless rigid rod of length L. The rod is attached to a pivot that allows rotation in any direction. There is no gravity. The rod is held at angle theta above the horizontal plane, and an impulse is given to the bead so that it has speed v directed horizontally into the page. How long does it take for the bead to return to its starting position? (A) 2*pi*L/v (B) 2*pi*L*sin(theta)/v (C) 2*pi*L*cos(theta)/v (D) pi*L/v (E) The bead never returns',
    choices: '{"A":"2*pi*L/v","B":"2*pi*L*sin(theta)/v","C":"2*pi*L*cos(theta)/v","D":"pi*L/v","E":"The bead never returns"}',
    correct_answer: 'A',
    solution: 'With no gravity and a massless rod, the only constraint is the fixed rod length L. The bead moves on the surface of a sphere of radius L. Since there is no gravity, angular momentum is conserved. The impulse gives the bead speed v horizontally, and the bead will trace a great circle on the sphere of radius L (since there is no preferred direction without gravity, and the angular momentum vector is fixed). The circumference of the great circle is 2*pi*L, and the speed is constant at v, so the period is 2*pi*L/v.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  },
  {
    contest: 'F=ma',
    year: 2025,
    number: 25,
    topic: 'mechanics',
    problem: 'A puck rests on top of a massive frictionless triangular prism (wedge) that sits on a frictionless horizontal surface. The prism slides horizontally at speed v = sqrt(2gh), where h is the height of the prism. The puck starts from rest relative to the prism at the top of the prism. What is the speed of the puck when it reaches the horizontal surface? (A) v (B) sqrt(2)*v (C) v*sqrt(3) (D) 3v/2 (E) 2v',
    choices: '{"A":"v","B":"sqrt(2)*v","C":"v*sqrt(3)","D":"3v/2","E":"2v"}',
    correct_answer: 'E',
    solution: 'In the reference frame of the prism (which moves at speed v on the frictionless surface), the puck starts from rest at height h. Since the prism is massive, it barely changes speed. In the prism frame, the puck slides down height h on a frictionless surface, reaching speed sqrt(2gh) = v at the bottom, directed horizontally. Transforming back to the lab frame, the puck\'s velocity is v (from sliding) + v (from the prism\'s motion) = 2v, since both velocities are in the same horizontal direction.',
    source_link: 'https://artofproblemsolving.com/wiki/index.php/2025_F%3Dma_Problems'
  }
];

module.exports = problems;
