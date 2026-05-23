#!/usr/bin/env node

/**
 * Insert the 2026 F=ma exam (25 problems) into olympiad_problems.
 *
 * Problem text and choices are LaTeX-formatted by hand from the official
 * AAPT PDF (2026_FMA_exam.pdf). Answers come from the official solutions
 * PDF (2026_FMA_solutions_v2.pdf).
 *
 * Problems that require a figure for their statement OR choices get
 * "[Diagram Required]" prepended to the problem text — the trainer
 * shows a warning banner in that case so students know to consult the
 * original PDF.
 *
 * Usage:
 *   node scripts/insert-2026-fma.mjs            # dry-run
 *   node scripts/insert-2026-fma.mjs --apply    # commit to DB
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const APPLY = process.argv.includes('--apply');

const envPath = resolve(new URL('.', import.meta.url).pathname, '..', '.env.local');
const env = {};
readFileSync(envPath, 'utf-8').split('\n').forEach(l => {
    const m = l.match(/^([^#][^=]*)=(.*)/);
    if (m) env[m[1].trim()] = m[2].trim();
});
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const SOURCE = 'https://www.aapt.org/Programs/PhysicsTeam/2026.cfm';

// Topic taxonomy used by existing F=ma rows (mostly single-word labels)
const PROBLEMS = [
    {
        number: 1,
        topic: 'relativity',
        difficulty: 'hard',
        problem: '[Diagram Required] In astronomy, some galactic objects appear to sweep across the sky faster than light speed, $c$. This effect, called superluminal motion, comes purely from geometry and the finite travel time of light, and it has nothing to do with special relativity.\n\nA jet moves from point $A$ to $B$ at speed $v = \\beta c$. The jet emits a pulse of light at $A$, and a second pulse a time $\\delta t$ later at $B$. An observer sees these pulses at point $O$. The angle between the jet and the line of sight is $\\theta$. Assume the angle $\\phi$ is small, so the distances from $O$ to points $B$ and $C$ can be treated as equal.\n\nFind the apparent transverse velocity $v_T$ along $CB$ as measured by the observer, in terms of $\\beta$ and $\\theta$. Express your answer as $\\beta_T \\equiv v_T/c$.',
        choices: [
            '$\\beta_T = \\dfrac{\\beta \\sin\\theta}{1 - \\beta \\cos\\theta}$',
            '$\\beta_T = \\beta \\sin\\theta (1 - \\beta \\cos\\theta)$',
            '$\\beta_T = \\dfrac{\\beta \\sin\\theta}{1 + \\beta \\cos\\theta}$',
            '$\\beta_T = \\dfrac{\\beta \\sin\\theta}{\\sqrt{1 - \\beta^2}}$',
            '$\\beta_T = \\beta \\tan\\theta$',
        ],
        correct_answer: 'A',
        solution: 'Let $OB = OC = d$. We have $\\delta t = t_2 - t_1$, $t_1\' = t_1 + (d + v\\delta t \\cos\\theta)/c$, and $t_2\' = t_2 + d/c$. Then $\\delta t\' = \\delta t - v\\delta t \\cos\\theta / c$, giving $\\beta_T = v_T/c = (1/c)(v\\delta t \\sin\\theta / \\delta t\') = \\dfrac{\\beta \\sin\\theta}{1 - \\beta \\cos\\theta}$.',
    },
    {
        number: 2,
        topic: 'dimensional analysis',
        difficulty: 'medium',
        problem: 'A series of dominoes are stood upright in a line. The dominoes have mass density $\\rho$, height $h$, and spacing $d$ between them. When the first domino is knocked over, a wave of falling dominoes propagates down the line with speed $v$.\n\nNow, a second set of dominoes is set up identically, but with all dimensions ($h$ and $d$) scaled by $\\lambda$. The mass density is the same. Let $v\'$ denote the wave speed of the scaled system. Which of the following best describes how $v\'$ depends on $\\lambda$?',
        choices: ['$v\' \\sim 1/\\sqrt{\\lambda}$', '$v\' \\sim \\lambda$', '$v\' \\sim 1/\\lambda$', '$v\' \\sim \\sqrt{\\lambda}$', '$v\'$ is independent of $\\lambda$'],
        correct_answer: 'D',
        solution: 'The wave speed scales like the ratio of spacing $d$ to the timescale $\\tau$ of a domino falling. By dimensional analysis $\\tau \\sim \\sqrt{h/g}$, so $v \\sim d\\sqrt{g/h}$. After scaling, $v_\\lambda \\sim \\lambda d \\sqrt{g/(\\lambda h)} \\Rightarrow v\' \\sim \\lambda^{1/2}$.',
    },
    {
        number: 3,
        topic: 'kinematics',
        difficulty: 'easy',
        problem: '[Diagram Required] A point moves in the $xy$ plane along the trajectory shown in the figure. One of the following pairs of graphs shows the time dependence of $v_x$ and $v_y$ for this motion. Select the correct pair. (See original PDF for the trajectory and the five answer graphs.)',
        choices: ['Pair (A) — see PDF', 'Pair (B) — see PDF', 'Pair (C) — see PDF', 'Pair (D) — see PDF', 'Pair (E) — see PDF'],
        correct_answer: 'B',
        solution: 'Starting from the top of the trajectory: on the first segment $v_x > 0$ and $v_y = 0$; on the next $v_x < 0$ and $v_y < 0$; on the last segment $v_x = 0$ and $v_y < 0$.',
    },
    {
        number: 4,
        topic: 'kinematics',
        difficulty: 'easy',
        problem: 'Two small balls are launched simultaneously from the same point at some height above horizontal ground. One ball is launched vertically upward with speed $3\\text{ m/s}$, while the other is launched horizontally with speed $4\\text{ m/s}$ and lands on the ground at a horizontal distance of $20\\text{ m}$ from the launch point. Neglect air resistance. At the moment the second ball lands, how far is it from the first ball?',
        choices: ['$25\\text{ m}$', '$36\\text{ m}$', '$60\\text{ m}$', '$80\\text{ m}$', '$240\\text{ m}$'],
        correct_answer: 'A',
        solution: 'Their relative velocity magnitude is $5\\text{ m/s}$ and it takes $5\\text{ s}$ to cover $20\\text{ m}$ with horizontal velocity $4\\text{ m/s}$. So the separation is $5 \\cdot 5 = 25\\text{ m}$.',
    },
    {
        number: 5,
        topic: 'kinematics',
        difficulty: 'medium',
        problem: 'A helicopter flies at constant height $h$ along a circular trajectory of radius $R$ with constant angular velocity $\\omega$, continuously dropping sand. Ignore air resistance. What is the radius of the curve traced by the sand on the ground?',
        choices: ['$R$', '$R\\sqrt{1 + h^2}$', '$R\\sqrt{1 + 2h^2}$', '$R\\sqrt{1 + h\\omega^2/g}$', '$R\\sqrt{1 + 2h\\omega^2/g}$'],
        correct_answer: 'E',
        solution: 'Each grain falls for time $T = \\sqrt{2h/g}$ while retaining the helicopter\'s horizontal velocity $\\omega R$. The landing point lies at distance $R_\\text{sand} = \\sqrt{R^2 + (\\omega R T)^2} = R\\sqrt{1 + 2h\\omega^2/g}$.',
    },
    {
        number: 6,
        topic: 'dimensional analysis',
        difficulty: 'easy',
        problem: '[Diagram Required] Newton\'s Impact Depth Approximation provides an estimate of how far a projectile will penetrate a material at high speeds. If a projectile of length $L$ and density $\\rho_A$ impacts a wall of density $\\rho_B$, Newton\'s approximation states the projectile will penetrate to a depth of $D = L \\rho_A / \\rho_B$. Assuming this is true for all velocities, how does the average force $F$ the wall exerts on the projectile scale with the initial projectile speed $v$?',
        choices: ['$F \\propto v^{1/2}$', '$F \\propto v$', '$F \\propto v^{3/2}$', '$F \\propto v^2$', '$F \\propto v^{5/2}$'],
        correct_answer: 'D',
        solution: 'The energy of the projectile scales as $v^2$, and since the depth of impact is constant, the force must also scale as $v^2$.',
    },
    {
        number: 7,
        topic: 'gravitation',
        difficulty: 'hard',
        problem: '[Diagram Required] The James Webb telescope lies at a point called the Lagrange Point 2, or L2. This is a point where the telescope would remain stationary in a frame rotating with Earth\'s orbit around the sun, so a telescope placed exactly at L2 would be in an equilibrium position relative to Earth\'s orbit. What is the stability of this equilibrium point with respect to radial and tangential perturbations?',
        choices: [
            'Stable to both radial and tangential perturbations.',
            'Stable to radial perturbations. Unstable to tangential perturbations.',
            'Stable to tangential perturbations. Unstable to radial perturbations.',
            'Unstable to both radial and tangential perturbations.',
            'None of the listed. L2 is not a real equilibrium point because the centrifugal force is a fictitious force.',
        ],
        correct_answer: 'C',
        solution: 'Moving radially outwards increases the centrifugal force and lowers the gravitational force, so L2 is unstable radially. Tangentially, Earth\'s gravity acts as a restoring force, so L2 is stable tangentially.',
    },
    {
        number: 8,
        topic: 'mechanics',
        difficulty: 'medium',
        problem: '[Diagram Required] A puck of mass $m$ moves with speed $v$ toward a heavy bump of mass $M$, where $M \\gg m$. Both the puck and bump slide without friction. The bump moves toward the puck with speed $v/2$ and provides a smooth transition from the horizontal surface onto the bump. The bump is tall enough that the puck slides back down. Find the maximum height $h$ the puck reaches.',
        choices: ['$\\dfrac{v^2}{2g}$', '$\\dfrac{9v^2}{8g}$', '$\\dfrac{3v^2}{8g}$', '$\\dfrac{7v^2}{4g}$', '$\\dfrac{3v^2}{4g}$'],
        correct_answer: 'B',
        solution: 'Work in the bump\'s frame, where the puck approaches at speed $3v/2$. By energy conservation $h = (3v/2)^2/(2g) = 9v^2/(8g)$. (Writing conservation in the lab frame under the assumption that the bump doesn\'t change speed gives the wrong answer $3v^2/(8g)$.)',
    },
    {
        number: 9,
        topic: 'orbits',
        difficulty: 'hard',
        problem: 'A vertical cylindrical pipe with a sealed bottom contains no air and is tall enough that its top is open to outer space (no atmosphere). A heavy plate is mounted at the bottom of the cylinder and vibrates vertically. A small ball inside the pipe undergoes elastic collisions with the plate.\n\nThe plate vibrates in such a way that, during each collision, it is moving upward with a constant speed equal to $v/1000$, where $v$ is the orbital speed at zero altitude above the Earth. The plate moves downward sufficiently fast that the ball collides with the plate only while the plate is moving upward. The ball is initially dropped from rest from a height equal to the Earth\'s radius above the plate.\n\nAfter how many collisions with the plate will the ball escape the Earth\'s gravitational field?',
        choices: ['$207$', '$208$', '$414$', '$415$', '$1000$'],
        correct_answer: 'B',
        solution: 'At the first impact, the ball\'s speed equals the orbital speed from the Earth. In each subsequent elastic collision with the upward-moving plate, the ball\'s speed increases by twice the speed of the plate. After $N$ collisions the total increase is $2N(v/1000)$. Setting the ball\'s speed to the escape speed gives $2N v/1000 = v(\\sqrt{2} - 1)$, so $N = 500(\\sqrt{2} - 1) \\approx 207.1$. After 207 collisions the ball still returns; after the 208th it escapes.',
    },
    {
        number: 10,
        topic: 'gravitation',
        difficulty: 'medium',
        problem: 'Consider the following three solid objects, each of mass $M$ and uniform density:\n(i) a half-ball of radius $a$;\n(ii) a cylinder of radius $a$ and height $a$;\n(iii) a cylinder of radius $a$ and height $2a$.\n\nFor each object, consider the gravitational acceleration at the center of its flat circular face. Let $g_\\text{ball}$, $g_a$, and $g_{2a}$ denote these accelerations for the half-ball, the cylinder of height $a$, and the cylinder of height $2a$, respectively. Which of the following is correct?',
        choices: ['$g_a > g_\\text{ball} > g_{2a}$', '$g_\\text{ball} > g_{2a} > g_a$', '$g_\\text{ball} > g_a > g_{2a}$', '$g_{2a} > g_\\text{ball} > g_a$', '$g_{2a} > g_a > g_\\text{ball}$'],
        correct_answer: 'C',
        solution: 'Symmetry ensures the field is perpendicular to the flat face. Deforming the half-ball into the equal-height cylinder spreads mass farther from the observation point and farther from the axis, reducing the field: $g_\\text{ball} > g_a$. Deforming the equal-height cylinder into the taller one moves mass farther along the symmetry axis: $g_a > g_{2a}$. So $g_\\text{ball} > g_a > g_{2a}$.',
    },
    {
        number: 11,
        topic: 'momentum',
        difficulty: 'medium',
        problem: '[Diagram Required] A circular track of mass $m$ lies flat horizontally on a frictionless table and is free to move on it. A bead also of mass $m$ can slide without friction on the track. The track is initially at rest, and it is labeled every $45°$ with tick marks. The bead is placed on tick 1 and is given an initial velocity $\\vec{v}_0$ tangential to the track as shown.\n\nWhat is the speed of the track\'s center $O$ when the bead reaches tick 3?',
        choices: ['$v_0$', '$v_0/2$', '$\\sqrt{3}\\,v_0/2$', '$v_0/\\sqrt{2}$', '$v_0/(2\\sqrt{2})$'],
        correct_answer: 'D',
        solution: 'Momentum and energy are conserved and the track is frictionless (no torque). With track velocity $\\vec{u}$ and bead velocity $\\vec{v}$: $p_x$: $v_0 = v_x + u_x$; $p_y = 0$: $u_y = -v_y$; energy: $u_x^2 + u_y^2 + v_x^2 + v_y^2 = v_0^2$; constraint at tick 3 (bead tangent perpendicular to $\\hat{x}$): $v_x = u_x$. Solving gives $u = \\sqrt{u_x^2 + u_y^2} = v_0/\\sqrt{2}$.',
    },
    {
        number: 12,
        topic: 'mechanics',
        difficulty: 'medium',
        problem: 'A wake surfer of total mass $M$ (surfer plus board) is being towed at a constant horizontal velocity $v$ across a flat lake. The wakeboard has a specific geometry such that, at this speed, it is partially submerged and provides a static buoyant force $F_B$ (where $F_B < Mg$).\n\nTo support the remainder of the weight, the board moves with an angle of attack $\\theta$ relative to the horizontal water surface. Assume that the water exerts a reaction force strictly normal to the bottom surface of the board. Which of the following expressions represents the horizontal tension $T$ in the tow rope required to maintain this constant velocity?',
        choices: ['$T = Mg \\tan\\theta$', '$T = (Mg - F_B)\\tan\\theta$', '$T = (Mg - F_B)\\sin\\theta$', '$T = Mg\\sin\\theta$', '$T = F_B \\cos\\theta$'],
        correct_answer: 'B',
        solution: 'Vertically: $F_B + R_y = Mg$, so $R_y = Mg - F_B$. The reaction $\\vec{R}$ is normal to the board, tilted by $\\theta$ from vertical, so $R_x = R_y \\tan\\theta$. Tension balances drag: $T = R_x = (Mg - F_B)\\tan\\theta$.',
    },
    {
        number: 13,
        topic: 'friction',
        difficulty: 'medium',
        problem: 'A block of mass $m$ slides along a surface with a coefficient of kinetic friction $\\mu_k$. The block is confined to move between two walls separated by a distance $L$. Attached to each wall is an ideal, perfectly elastic spring with a very large force constant $k$.\n\nThe block is launched from the midpoint between the walls with an initial speed $v_0$ directed toward one of the springs. It bounces back and forth between the springs, losing speed only due to friction with the surface.\n\nAssume the time spent in contact with the springs is negligible compared to the travel time between them. Which of the following expressions correctly gives the total time $T$ required for the block to come to permanent rest?',
        choices: ['$T = \\dfrac{v_0}{2\\mu_k g L}$', '$T = \\dfrac{v_0}{\\mu_k g}\\left(1 - e^{-\\mu_k g / v_0}\\right)$', '$T = \\dfrac{v_0}{\\mu_k g}$', '$T = \\dfrac{v_0}{\\mu_k g L}\\sum_{n=0}^{\\infty}\\left(\\dfrac{1}{2}\\right)^n$', '$T = \\sqrt{\\dfrac{2L}{\\mu_k g}}$'],
        correct_answer: 'C',
        solution: 'Because friction always opposes motion and the elastic bounces take negligible time, the motion is equivalent to a single block sliding on a flat frictional surface from $v_0$ to rest. With deceleration $\\mu_k g$, the stopping time is $T = v_0/(\\mu_k g)$.',
    },
    {
        number: 14,
        topic: 'oscillations',
        difficulty: 'hard',
        problem: '[Diagram Required] In the following swing, all lines are rigid rods and their lengths satisfy the relation $l_1^2 + l_2^2 = a^2 + b^2$. What is the period of small oscillations of the mass at point $C$?',
        choices: ['$2\\pi\\sqrt{\\dfrac{l_1^2 + l_2^2}{ga}}$', '$2\\pi\\sqrt{\\dfrac{l_1 l_2}{ga}}$', '$2\\pi\\sqrt{\\dfrac{l_1 l_2}{g\\sqrt{a^2 + b^2}}}$', '$2\\pi\\sqrt{\\dfrac{a l_1 l_2}{g(l_1^2 + l_2^2)}}$', '$2\\pi\\sqrt{\\dfrac{b l_1 l_2}{g(l_1^2 + l_2^2)}}$'],
        correct_answer: 'B',
        solution: 'The effective point of suspension can be any point on segment $AB$; effective gravity is the projection of actual gravity along the effective pendulum rod. Choosing the point $D$ directly above $C$ makes effective gravity equal to actual gravity. Using the law of sines, $|CD| = l_1 l_2 / a$, giving period $2\\pi\\sqrt{l_1 l_2 / (ga)}$.',
    },
    {
        number: 15,
        topic: 'rotational',
        difficulty: 'medium',
        problem: 'A ball launcher fires balls along the floor at some initial speed, applying no rotation to them. The balls initially slip along the floor, then start rolling without slipping. Ignore the potential deformation of the ball and flooring during this process, as well as air resistance. How does the final speed of the rolling ball depend on the coefficient of friction $\\mu$ between the ball and the floor?',
        choices: [
            'The final speed is larger when $\\mu$ is large.',
            'The final speed is the same regardless of $\\mu$.',
            'The final speed is larger when $\\mu$ is small.',
            'The final speed is larger when $\\mu$ is small for high launch speeds, and when $\\mu$ is large for low launch speeds.',
            'The final speed is larger when $\\mu$ is large for high launch speeds, and when $\\mu$ is small for low launch speeds.',
        ],
        correct_answer: 'B',
        solution: 'While slipping, friction $\\mu m g$ gives linear deceleration $\\dot{v} = -\\mu g$ and angular acceleration $\\dot{\\omega} = \\mu m g r / I$. The ball stops slipping when $v = \\omega r$; the value of $v$ at that moment depends only on the ball\'s properties, not on $\\mu$.',
    },
    {
        number: 16,
        topic: 'collisions',
        difficulty: 'hard',
        problem: '[Diagram Required] A small puck of mass $m$ slides without friction inside a rigid, uniform triangle rack of mass $5m$, whose inner boundary is an equilateral triangle $ABC$. The rack is initially at rest and can move freely on a frictionless horizontal table. All collisions between the puck and the rack are perfectly elastic.\n\nAt some instant, the puck strikes the midpoint of side $AB$ from inside the rack. Just before this collision, the puck\'s velocity is parallel to side $BC$.\n\nAfter the collision at the midpoint of $AB$, the puck collides with the rack again, and then collides once more. At which part of the triangle does this second collision after the initial one occur? (Some answer choices refer to the midpoint $D$ of side $AC$.)',
        choices: [
            'a point in the interior of segment $AB$',
            'a point in the interior of segment $BC$',
            'a point in the interior of segment $AD$',
            'a point in the interior of segment $DC$',
            'the point $D$',
        ],
        correct_answer: 'E',
        solution: 'During each impact the contact force produces zero net torque on the rack about its CM, so the triangle does not rotate. In the rack\'s instantaneous rest frame, each elastic collision is equivalent to specular reflection from a frictionless wall. After the midpoint of $AB$, the puck collides at the midpoint of $BC$, and the subsequent collision asked for occurs at point $D$.',
    },
    {
        number: 17,
        topic: 'rotational',
        difficulty: 'hard',
        problem: 'A ladder is leaning against a vertical wall. The ladder is a uniform rod of mass $M$ and length $L$, and both the wall and the ground are frictionless. The ladder is released from rest from an almost-vertical position and begins to slide. What is the speed of the point of the ladder that is in contact with the floor when it is a horizontal distance $\\sqrt{3}L/2$ away from the wall?',
        choices: ['$0.46\\sqrt{gL}$', '$0.51\\sqrt{gL}$', '$0.56\\sqrt{gL}$', '$0.61\\sqrt{gL}$', '$0.66\\sqrt{gL}$'],
        correct_answer: 'D',
        solution: 'The ladder loses contact with the wall before $x = \\sqrt{3}L/2$. Under the "stays in contact" simplification, $\\Omega^2 = (3g/L)(1 - \\sin\\theta)$ and $v_B^2 = 3gL(1 - \\sin\\theta)\\sin^2\\theta$. At $\\cos\\theta = \\sqrt{3}/2$ ($\\theta = 30°$): $v_B = \\sqrt{3gL/8} \\approx 0.61\\sqrt{gL}$. The exact detachment speed is $(2/3)\\sqrt{gL} \\approx 0.66\\sqrt{gL}$. Both 0.61 and 0.66 are accepted.',
    },
    {
        number: 18,
        topic: 'oscillations',
        difficulty: 'hard',
        problem: '[Diagram Required] Three springs and a block of mass $m$ are connected as shown. The spring constants are $k_1 = k$, $k_2 = k/5$, and $k_3 = k/3$. All pulleys and ropes are massless, and there is no friction anywhere in the system. Find the ratio of the period of oscillations of this system, $T$, to the period $T_0$ of a simple mass–spring system with mass $m$ and spring constant $k$.',
        choices: ['$\\dfrac{2}{3}$', '$\\dfrac{3}{2}$', '$\\dfrac{\\sqrt{2}}{\\sqrt{3}}$', '$\\dfrac{\\sqrt{7}}{6}$', '$\\dfrac{\\sqrt{6}}{7}$'],
        correct_answer: 'B',
        solution: 'Let $y$ be the displacement of mass $m$, related to spring extensions by $y = (x_1 + x_2 + x_3)/2$, with $k_1 x_1 = k_2 x_2 = k_3 x_3$. The equation of motion gives $\\omega^2 = (4/9)(k/m)$, so $T/T_0 = 3/2$.',
    },
    {
        number: 19,
        topic: 'oscillations',
        difficulty: 'hard',
        problem: '[Diagram Required] A point mass $m_1$ is attached to a box of mass $m_2$ by a massless, inextensible rope of fixed length $L$, attached to the center of the box. The box can slide without friction on a horizontal surface. The mass $m_1$ swings freely under gravity, and all motion occurs in the plane of the picture. Neglect air resistance. Find the angular frequency $\\omega$ of small oscillations about the stable equilibrium. (Small-angle expansions: $\\cos\\theta \\approx 1 - \\theta^2/2$, $\\sin\\theta \\approx \\theta - \\theta^3/6$.)',
        choices: ['$\\omega = \\sqrt{\\dfrac{m_1 + m_2}{m_2}\\dfrac{g}{L}}$', '$\\omega = \\sqrt{\\dfrac{m_1 + m_2}{m_1}\\dfrac{g}{L}}$', '$\\omega = \\sqrt{\\dfrac{m_1}{m_1 + m_2}\\dfrac{g}{L}}$', '$\\omega = \\sqrt{\\dfrac{m_2}{m_1 + m_2}\\dfrac{g}{L}}$', '$\\omega = \\sqrt{\\dfrac{g}{L}}$'],
        correct_answer: 'A',
        solution: 'In the inertial frame where total horizontal momentum is zero, $v = -m_1 L\\Omega/(m_1 + m_2)$ where $\\Omega = \\dot\\theta$. Kinetic energy: $T = \\tfrac{1}{2}\\,m_1 m_2/(m_1+m_2)\\,L^2\\Omega^2$. Potential energy: $U \\approx \\tfrac{1}{2} m_1 g L \\theta^2$. So $\\omega = \\sqrt{B/A} = \\sqrt{(m_1+m_2)/m_2 \\cdot g/L}$.',
    },
    {
        number: 20,
        topic: 'rotational',
        difficulty: 'medium',
        problem: '[Diagram Required] Two uniform rigid rods lie in a vertical plane. The lower rod rests on a rough horizontal table at a single point $O$ and makes angle $\\theta \\neq 0$ with the vertical. The rod can pivot about point $O$ without slipping.\n\nThe second rod is rigidly attached at its center of mass to the top of the lower rod at point $P$. A motor causes the second rod to rotate in the plane about $P$. The motor is rigidly attached to the lower rod and does not exert forces or torques on the table.\n\nWhich of the following types of motion of the second rod could keep the angle $\\theta$ fixed in time?',
        choices: [
            'The second rod rotates with constant angular velocity.',
            'The second rod rotates with angular velocity that varies periodically in time.',
            'The system cannot remain at constant $\\theta$ because only internal torques are produced by the motor.',
            'The second rod rotates with angular velocity that increases linearly in time.',
            '$\\theta$ changes because the moment of inertia of the second rod about point $O$ varies during the motion.',
        ],
        correct_answer: 'D',
        solution: 'Keeping $\\theta$ fixed requires the motor\'s torque to balance gravitational torque about $O$. Since the second rod is attached at its CM, gravitational torque on it about $O$ is constant, so $dL_O/dt$ must be constant — i.e. constant angular acceleration of the second rod.',
    },
    {
        number: 21,
        topic: 'rotational',
        difficulty: 'medium',
        problem: 'A student stands on a large horizontal merry-go-round ($R = 2.0\\text{ m}$) at an initial radius of $r_0 = 1.0\\text{ m}$. Both rotate at constant angular speed $\\omega = 1.2\\text{ rad/s}$. The student wants to get off without walking and performs a sequence of identical vertical jumps of height $h = 0.31\\text{ m}$. Ignore air resistance.\n\nWhat is the minimum number of jumps needed for the student to land off the platform? Assume the merry-go-round is much more massive than the student and that friction instantly brings the student back into co-rotation with the platform.',
        choices: ['$3$', '$4$', '$5$', '$6$', 'It is impossible to move outward by purely vertical jumps.'],
        correct_answer: 'C',
        solution: 'Time of flight: $\\tau = 2\\sqrt{2h/g}$. While airborne the tangential speed $v = \\omega r$ is conserved, so after each jump $r$ multiplies by $F = \\sqrt{1 + \\omega^2 \\tau^2}$. After $N$ jumps $r_N \\approx r_0 F^N$. Requiring $r_N \\geq R$ gives $F^N \\geq 2$, i.e. $N > \\ln 2 / \\ln F \\approx 4.5$, so $N = 5$.',
    },
    {
        number: 22,
        topic: 'rotational',
        difficulty: 'hard',
        problem: 'A tricycle of mass $m = 100\\text{ kg}$ is traveling north on a horizontal surface. The geometry of the tricycle is:\n- Wheelbase (distance from front axle to rear axle): $L = 1.0\\text{ m}$\n- Rear track width (distance between rear wheels): $d = 1.0\\text{ m}$\n- Center of mass (CM) location: on the longitudinal symmetry axis, a distance $b = 0.4\\text{ m}$ forward of the rear axle\n- Radius of gyration about the CM: $k = 0.5\\text{ m}$\n\n(The radius of gyration $k$ is defined by $I_\\text{CM} = mk^2$, where $I_\\text{CM}$ is the moment of inertia of the tricycle about a vertical axis through its CM.)\n\nSeeing a patch of ice on their right side ahead, the rider panics and slams on the brakes. The front wheel and the left rear wheel slide on dry pavement with $\\mu_k = 0.5$, while the right rear wheel slides on frictionless ice ($\\mu = 0$).\n\nThis asymmetry in friction forces produces a net torque about the center of mass, causing the tricycle to begin rotating. Calculate the initial angular acceleration $\\alpha$ of the tricycle.',
        choices: ['$3.0\\text{ rad/s}^2$, Counter-Clockwise', '$3.0\\text{ rad/s}^2$, Clockwise', '$3.3\\text{ rad/s}^2$, Counter-Clockwise', '$6.0\\text{ rad/s}^2$, Counter-Clockwise', '$3.3\\text{ rad/s}^2$, Clockwise'],
        correct_answer: 'A',
        solution: 'The asymmetric friction creates a CCW torque. Front normal: $N_f L = mgb \\Rightarrow N_f = 400\\text{ N}$. Rear total: $600\\text{ N}$, so $N_\\text{left} = 300\\text{ N}$. Friction on left rear: $\\mu_k N_\\text{left} = 150\\text{ N}$. Torque about CM: $\\tau = 150 \\cdot d/2 = 75\\text{ N·m}$. Moment of inertia: $I = mk^2 = 25\\text{ kg·m}^2$. So $\\alpha = 75/25 = 3.0\\text{ rad/s}^2$ CCW.',
    },
    {
        number: 23,
        topic: 'rotational',
        difficulty: 'hard',
        problem: '[Diagram Required] Consider the infinitely repeating hexagonal sequence where the largest hexagon has side length $\\sqrt{3}a$ and is filled with mass. Inside it, a smaller hexagon of side length $a$ is rotated $30°$ clockwise and cut out. Then, an even smaller hexagon of side length $a/\\sqrt{3}$ is rotated again by $30°$ clockwise and filled. This pattern continues infinitely. Let $I_1$ be the moment of inertia of this 2D figure about an axis through its center of mass, perpendicular to its plane, and $I_2$ be the moment of inertia of a regular hexagon with side length $\\sqrt{3}a$. What is $I_1/I_2$? (Recall $\\sum_{n=0}^{\\infty} r^n = 1/(1-r)$ for $|r| < 1$.)',
        choices: ['$\\dfrac{1}{4}$', '$\\dfrac{2\\sqrt{3} + 3}{9\\sqrt{3} + 9}$', '$\\dfrac{9}{10}$', '$\\dfrac{3\\sqrt{3} + 6}{9\\sqrt{3} + 6}$', 'none of the listed'],
        correct_answer: 'C',
        solution: 'For a uniform hexagon $I \\propto \\rho a^4$. So $I_2 = 9k\\rho a^4$. The figure is $I_1 = k\\rho [(\\sqrt{3}a)^4 - a^4 + (a/\\sqrt{3})^4 - \\cdots] = 9k\\rho a^4 - k\\rho a^4 \\sum_{n=0}^\\infty (-1/9)^n = 9k\\rho a^4 - k\\rho a^4 \\cdot 9/10 = (81/10)k\\rho a^4$. Thus $I_1/I_2 = 9/10$.',
    },
    {
        number: 24,
        topic: 'fluids',
        difficulty: 'hard',
        problem: '[Diagram Required] A thin sheet of air with density $\\rho$ is blown at a uniform speed $v$ toward a smooth, convex cylindrical surface of radius $R$. The sheet has uniform thickness $t \\ll R$ and remains everywhere tangent to the cylinder while it stays attached. Neglect gravity and viscosity.\n\nThe pressure on the outer side of the air sheet is constant and equal to $P$. The pressure on the side adjacent to the cylinder is lower by an amount $\\Delta P$. The air sheet follows the curvature of the cylinder until it can no longer remain attached.\n\nWith $\\rho = 1.2\\text{ kg/m}^3$, $t = 5.0\\text{ mm}$, $R = 5.0\\text{ cm}$, $\\Delta P_\\text{max} = 120\\text{ Pa}$, what is the maximum integer speed $v_\\text{max}$ for which the sheet can remain attached?',
        choices: ['$8\\text{ m/s}$', '$22\\text{ m/s}$', '$31\\text{ m/s}$', '$44\\text{ m/s}$', '$60\\text{ m/s}$'],
        correct_answer: 'C',
        solution: 'For an arc element $\\delta\\theta$: required centripetal force per unit width is $\\rho t v^2 \\delta\\theta$, pressure force is $\\Delta P R \\delta\\theta$. Setting equal: $\\Delta P = \\rho t v^2 / R$. Attachment requires $\\Delta P \\leq \\Delta P_\\text{max}$, so $v^2 = \\Delta P_\\text{max} R / (\\rho t)$. Plugging in: $v \\approx 31.6\\text{ m/s}$, so $v_\\text{max} = 31\\text{ m/s}$.',
    },
    {
        number: 25,
        topic: 'fluids',
        difficulty: 'medium',
        problem: '[Diagram Required] Five vases (a, b, c, d) are filled with water to the same initial volume and initial height $H$. Each vase has an identical drainage hole at the bottom. Which vase will drain completely in the shortest amount of time? (See PDF for vase profiles.)',
        choices: ['Vase a (wider at top)', 'Vase b (narrower at top)', 'Vase c (cylinder)', 'Vase d (hourglass)', 'All vases drain in the same amount of time.'],
        correct_answer: 'A',
        solution: 'By Torricelli\'s law $v(z) = \\sqrt{2gz}$, the flow rate is fastest when water is at high $z$. Drain time for a slice $\\propto 1/\\sqrt{z}$, so vases with most of their volume located high (i.e. wider at top) drain fastest. Vase a is the wide-top vase.',
    },
];

console.log(`\n2026 F=ma exam: ${PROBLEMS.length} problems prepared`);
console.log(`Mode: ${APPLY ? 'APPLY' : 'DRY RUN'}`);

// Safety: check if any 2026 F=ma already in DB
const { data: existing } = await supabase
    .from('olympiad_problems')
    .select('id, number')
    .eq('contest', 'F=ma')
    .eq('year', 2026);

if (existing && existing.length > 0) {
    console.log(`\nFound ${existing.length} existing 2026 F=ma rows: ${existing.map(r => '#' + r.number).join(', ')}`);
    console.log('Refusing to insert duplicates. Delete those first if you want to re-run.');
    process.exit(1);
}

const rows = PROBLEMS.map(p => ({
    contest: 'F=ma',
    year: 2026,
    number: p.number,
    topic: p.topic,
    difficulty: p.difficulty,
    problem: p.problem,
    choices: p.choices,
    correct_answer: p.correct_answer,
    correct_value: '',
    solution: p.solution,
    track: 'physics',
    source_link: SOURCE,
}));

if (!APPLY) {
    console.log('\nFirst row preview:');
    console.log(JSON.stringify(rows[0], null, 2).slice(0, 800));
    console.log('\nDRY RUN — re-run with --apply to insert.');
    process.exit(0);
}

console.log('\nInserting...');
const { data, error } = await supabase
    .from('olympiad_problems')
    .insert(rows)
    .select('id, number');
if (error) { console.error(error); process.exit(1); }
console.log(`Inserted ${data.length} rows: ${data.map(r => '#' + r.number).join(', ')}`);
