// insert_usnco_national_part2.js
// Inserts USNCO National Exam Part II problems (free-response, screenshot-based,
// AI-graded on the 0-7 chemistry scale).
//
// Part II problems are stored as screenshots: each row points at an image in
// public/images/usnco_national/part2/ via image_url, and the trainer's grader
// (Opus, multimodal) reads the statement straight from the picture. No answer
// choices / answer key -> the row routes to the strict chemistry grader.
//
// To add a problem: drop its screenshot in public/images/usnco_national/part2/
// (e.g. 2024_q1.png) and add an entry to the `problems` array below.

const SUPABASE_URL = 'https://rrjhdokniecigtekmpjz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qk42EmpxYFxXsAGkjLAzJA_kGznRof4';

// Each entry: { year, number, topic, difficulty?, problem?, image? }
//  - problem: full text statement (multi-part a./b./c. renders as tabs)
//  - image: OPTIONAL filename inside public/images/usnco_national/part2/.
//    If present, the multimodal grader reads the statement straight from it
//    and it renders under the problem. Use this for diagram-heavy problems.
const problems = [
  {
    year: 2025,
    number: 1,
    topic: 'stoichiometry',
    difficulty: 'hard',
    image: '2025_q1.png',
    problem:
      'Copper(II) sulfate pentahydrate, $\\mathrm{CuSO_4 \\cdot 5H_2O}$, is a blue crystalline ' +
      'solid. Upon gentle heating, it loses water to form anhydrous $\\mathrm{CuSO_4}$, which is a ' +
      'white solid.\n\n' +
      'a. When 5.000 g $\\mathrm{CuSO_4 \\cdot 5H_2O}$ is heated to remove all of its water, what ' +
      'mass of anhydrous $\\mathrm{CuSO_4}$ will be produced?\n\n' +
      'b. Explain the change in color on dehydration of $\\mathrm{CuSO_4 \\cdot 5H_2O}$.\n\n' +
      'c. A solution of 0.0506 g $\\mathrm{Cu(CH_3COO)_2 \\cdot H_2O}$ is made up with water to a ' +
      'volume of 5.00 mL water. This solution in a 1-cm cuvette produces the visible spectrum ' +
      'shown below. What wavelength would be the best choice to determine the concentration of ' +
      '$\\mathrm{Cu(II)}$?\n\n' +
      'd. A student determines the value of $n$ in an unknown crystalline hydrate of copper(II) ' +
      'nitrate, $\\mathrm{Cu(NO_3)_2 \\cdot nH_2O}$, by preparing 5.00 mL of an aqueous solution of ' +
      'a known mass of the compound and measuring its absorbance at the wavelength determined in ' +
      'part c. However, the student inserts the cuvette into the spectrophotometer without first ' +
      'wiping fingerprints from it. How will this affect the value of $n$ determined in the ' +
      'experiment?\n\n' +
      'e. An alternative method for determining the degree of hydration of the copper nitrate is ' +
      'to allow a known mass of compound to react with excess KI solution, which produces a ' +
      'yellow-brown suspension. Write a balanced net ionic equation for this reaction.\n\n' +
      'f. The experiment in part e is carried out with 0.1000 g of the hydrated copper(II) ' +
      'nitrate. To the resulting mixture is added a 0.0250 M solution of sodium thiosulfate, ' +
      '$\\mathrm{Na_2S_2O_3}$, until the color of the mixture has just dissipated, leaving a milky ' +
      'white suspension. This requires 17.20 mL of added sodium thiosulfate solution. What is the ' +
      'value of $n$ for the $\\mathrm{Cu(NO_3)_2 \\cdot nH_2O}$?',
  },
  {
    year: 2025,
    number: 2,
    topic: 'equilibrium',
    difficulty: 'hard',
    problem:
      'Calcium oxalate, $\\mathrm{CaC_2O_4}$, has a $K_{sp}$ of $2.7 \\times 10^{-9}$. Oxalic acid, ' +
      '$\\mathrm{H_2C_2O_4}$, has two ionizable hydrogens with $\\mathrm{p}K_{a1} = 1.27$ and ' +
      '$\\mathrm{p}K_{a2} = 4.28$.\n\n' +
      'a. Draw a Lewis structure for oxalate ion, $\\mathrm{C_2O_4^{2-}}$, including all bonds, ' +
      'lone pairs, and formal charges.\n\n' +
      'b. Calculate the molar solubility of calcium oxalate in pure water.\n\n' +
      'c. Calculate the molar solubility of calcium oxalate in a 0.100 M $\\mathrm{CaCl_2}$ ' +
      'solution.\n\n' +
      'd. A 0.100 mol sample of solid $\\mathrm{CaC_2O_4}$ is suspended in 1.00 L of water and ' +
      '$\\mathrm{HCl}(g)$ is bubbled through the solution until all of the solid just dissolves. ' +
      'What is the pH of the final homogeneous solution? You may assume the final volume of ' +
      'solution is 1.00 L.\n\n' +
      'e. How many moles of $\\mathrm{HCl}(g)$ are added in part d?\n\n' +
      'f. Will the molar solubility of $\\mathrm{CaC_2O_4}$ in 0.1 M $\\mathrm{NaHC_2O_4}$ be ' +
      'significantly greater than, significantly less than, or within 10% of the molar solubility ' +
      'of calcium oxalate in pure water? Justify your answer.',
  },
  {
    year: 2025,
    number: 3,
    topic: 'thermodynamics',
    difficulty: 'hard',
    image: '2025_q3.png',
    problem:
      'N,N-Dimethylethanolamine ($\\mathrm{(CH_3)_2NCH_2CH_2OH}$, DMEA, $M = 89.14$) is a ' +
      'Brønsted base whose conjugate acid, $\\mathrm{DMEAH^+}$, has a $\\mathrm{p}K_a = 9.22$ ' +
      '($K_a = 6.0 \\times 10^{-10}$). Acetic acid ($\\mathrm{CH_3COOH}$, $M = 60.05$) has a ' +
      '$\\mathrm{p}K_a = 4.75$ ($K_a = 1.8 \\times 10^{-5}$).\n\n' +
      'a. Calculate $\\Delta G^\\circ_{rxn}$ at 298 K for the acid-base reaction of DMEA with ' +
      '$\\mathrm{CH_3COOH}$.\n\n' +
      'b. A solution consisting of 7.84 g $\\mathrm{CH_3COOH}$ and 107.17 g water is placed in a ' +
      'well-insulated (Dewar) flask. To this solution is added DMEA in small portions. After each ' +
      'portion of DMEA is added, the solution is stirred and the temperature measured with a ' +
      'digital thermometer. The data obtained are plotted (temperature $T$ in °C vs. grams of ' +
      'DMEA added). The solid line is the best linear fit to the data with $< 12$ g added DMEA, ' +
      'with equation $y = 1.141x + 19.03$; the dashed line is the average of the data with ' +
      '$\\geq 12$ g added DMEA, with equation $y = 31.84$. Calculate $\\Delta H^\\circ_{rxn}$ for ' +
      'the reaction of DMEA with $\\mathrm{CH_3COOH}$. You may assume that all solutions have the ' +
      'same specific heat capacity as pure water.\n\n' +
      'c. Calculate $\\Delta S^\\circ_{rxn}$ for the reaction of DMEA with $\\mathrm{CH_3COOH}$.\n\n' +
      'd. The $\\Delta S^\\circ$ calculated in part c. is negative. What features of the reaction ' +
      'of DMEA with $\\mathrm{CH_3COOH}$ cause it to have a negative entropy of reaction?',
  },
  {
    year: 2025,
    number: 4,
    topic: 'electrochemistry',
    difficulty: 'hard',
    image: '2025_q4.png',
    problem:
      'A galvanic cell is set up as follows and the cell potential measured as a function of ' +
      'temperature to give the graph shown. (The cell consists of a Pb electrode in a beaker of ' +
      '1.00 M $\\mathrm{Pb^{2+}}$ and a Zn electrode in a beaker of 1.00 M $\\mathrm{Zn^{2+}}$, ' +
      'connected by a salt bridge and a voltmeter. The measured cell potential $E$ (in V) is a ' +
      'linear function of temperature $T$ (in K) over 280–340 K, with best-fit line ' +
      '$E = 0.7887 - 0.000515\\,T$.)\n\n' +
      'a. Which electrode is the anode and which is the cathode?\n\n' +
      'b. The standard reduction potential for $\\mathrm{Zn^{2+}}(aq)$ at 298 K is $-0.762$ V. ' +
      'What is the standard reduction potential for $\\mathrm{Pb^{2+}}(aq)$ at 298 K?\n\n' +
      'c. What are $\\Delta G^\\circ$ (at 298 K), $\\Delta H^\\circ$, and $\\Delta S^\\circ$ for ' +
      'the reaction shown below?\n' +
      '$$\\mathrm{Zn}(s) + \\mathrm{Pb^{2+}}(aq) \\rightarrow \\mathrm{Zn^{2+}}(aq) + ' +
      '\\mathrm{Pb}(s)$$\n\n' +
      'd. Explain the sign of $\\Delta S^\\circ$ for the reaction given in part c.\n\n' +
      'e. The temperature-dependence of the cell is remeasured with the same cell, except that ' +
      'the concentration of $\\mathrm{Pb^{2+}}(aq)$ in the left-hand compartment is changed to ' +
      '0.100 M. Describe how the $E$-vs-$T$ plot for this new cell compares to the standard cell ' +
      '(both slope and intercept), and briefly justify your answer.',
  },
  {
    year: 2025,
    number: 5,
    topic: 'reactions',
    difficulty: 'hard',
    problem:
      'Write net equations for each of the reactions below. Use appropriate ionic and molecular ' +
      'formulas and omit formulas for all ions or molecules that do not take part in a reaction. ' +
      'Write structural formulas for all organic substances, and clearly show stereochemistry ' +
      'where relevant. You need not balance the equations or show the phases of the species.\n\n' +
      'a. Carbon dioxide is bubbled through a saturated solution of barium hydroxide.\n\n' +
      'b. Potassium permanganate is mixed with iron(II) sulfate in dilute sulfuric acid.\n\n' +
      'c. Solid silver chloride is added to concentrated aqueous ammonia.\n\n' +
      'd. Phosphorus trichloride reacts with potassium chlorate.\n\n' +
      'e. Para-xylene (1,4-dimethylbenzene) is heated with a mixture of concentrated nitric and ' +
      'sulfuric acids.\n\n' +
      'f. Fluorine-18 emits a positron.',
  },
  {
    year: 2025,
    number: 6,
    topic: 'bonding',
    difficulty: 'hard',
    problem:
      'Oxygen has two stable allotropes, $\\mathrm{O_2}$ (dioxygen) and $\\mathrm{O_3}$ ' +
      '(ozone).\n\n' +
      'a. Explain why $\\mathrm{O_2}$ has a higher normal boiling point than either ' +
      '$\\mathrm{N_2}$ or $\\mathrm{F_2}$.\n\n' +
      'b. Explain why both atomic oxygen (O) and $\\mathrm{O_2}$ have two unpaired electrons in ' +
      'their ground states.\n\n' +
      'c. Molecular oxygen has an excited state with no unpaired electrons, which emits light with ' +
      'a wavelength of 1270 nm to return to the ground state. What is the energy (in ' +
      '$\\mathrm{kJ\\,mol^{-1}}$) by which the excited state is higher than the ground state?\n\n' +
      'd. Explain why $\\mathrm{O_2}$ does not absorb light in the infrared region of the ' +
      'electromagnetic spectrum but $\\mathrm{O_3}$ does.\n\n' +
      'e. Dioxygen can be oxidized to form dioxygenyl cation ($\\mathrm{O_2^+}$) or reduced to ' +
      'form superoxide ion ($\\mathrm{O_2^-}$) or peroxide ion ($\\mathrm{O_2^{2-}}$), while ozone ' +
      'can be reduced to form ozonide ion ($\\mathrm{O_3^-}$). Among these six species ' +
      '($\\mathrm{O_2}$, $\\mathrm{O_2^+}$, $\\mathrm{O_2^-}$, $\\mathrm{O_2^{2-}}$, ' +
      '$\\mathrm{O_3}$, $\\mathrm{O_3^-}$), the O–O bond distances are 112 pm, 121 pm, 127 pm, ' +
      '128 pm, 135 pm, and 154 pm. Assign the correct distance to each of the six species and ' +
      'briefly justify your assignments. (You may consider 127 and 128 pm as essentially the same ' +
      'in this problem.)',
  },
  {
    year: 2025,
    number: 7,
    topic: 'solid state',
    difficulty: 'hard',
    image: '2025_q7.png',
    problem:
      'Cesium lead iodide, $\\mathrm{CsPbI_3}$, is of interest in solar photovoltaic cells. It ' +
      'adopts a structure called a perovskite whose cubic unit cell is shown below (small gray ' +
      'spheres on the cube corners, medium-sized white spheres on the cube edges/faces, and one ' +
      'large black sphere at the body center).\n\n' +
      'a. Which element corresponds to the small gray spheres, which to the medium sized white ' +
      'spheres, and which to the large black spheres?\n\n' +
      'b. Describe the coordination number and the identity of the nearest neighbor atoms for each ' +
      'of the types of atoms in $\\mathrm{CsPbI_3}$.\n\n' +
      'c. The length of the unit cell edge in $\\mathrm{CsPbI_3}$ is 628 pm. What is the density ' +
      'of $\\mathrm{CsPbI_3}$, in $\\mathrm{g\\,cm^{-3}}$?\n\n' +
      'd. A mixed-metal oxide that is of interest in high-temperature superconductivity research, ' +
      '$\\mathrm{YBa_2Cu_3O_7}$, adopts a structure related to the perovskite structure. One unit ' +
      'cell of this structure is shown below (it contains four types of spheres: dotted, white, ' +
      'black, and gray). Identify which elements correspond to the four types of spheres in the ' +
      'diagram.\n\n' +
      'e. Give the oxidation numbers of each element in $\\mathrm{YBa_2Cu_3O_7}$.\n\n' +
      'f. The atoms represented by the black spheres have two different coordination geometries in ' +
      'the structure shown. What are the geometries? How is this observation related to the ' +
      'oxidation numbers you determined in part e?',
  },
  {
    year: 2025,
    number: 8,
    topic: 'organic',
    difficulty: 'hard',
    problem:
      'Many organic compounds react with elemental halogens such as $\\mathrm{Br_2}$ or ' +
      '$\\mathrm{I_2}$.\n\n' +
      'a. Under appropriate conditions, 3-methylpentane will react with $\\mathrm{Br_2}$ to form a ' +
      'single monobromide with the formula $\\mathrm{C_6H_{13}Br}$. Give appropriate reaction ' +
      'conditions and the structural formula of the product.\n\n' +
      'b. Cyclohexene forms different products when reacted with $\\mathrm{Br_2}$ in water than ' +
      'when reacted in carbon tetrachloride. Give structural formulas for the products formed in ' +
      'the two solvents, including stereochemistry if relevant.\n\n' +
      'c. Benzene reacts with bromine in the presence of a Lewis acid catalyst. Give an example of ' +
      'a suitable catalyst and the structural formula of the major organic product of the ' +
      'reaction.\n\n' +
      'd. Cyclopentanone reacts with excess bromine in the presence of base to give a ' +
      'tetrabromide. Give a structural formula for the product and explain why the reaction does ' +
      'not give good yields of a monobromide product even when only one equivalent of ' +
      '$\\mathrm{Br_2}$ is used.\n\n' +
      'e. Acetophenone, $\\mathrm{C_6H_5COCH_3}$, reacts with excess iodine in the presence of ' +
      'aqueous sodium hydroxide to give a yellow precipitate and a water-soluble organic species. ' +
      'Give structural formulas for these two products.',
  },

  // ===== 2024 USNCO National Exam, Part II =====
  {
    year: 2024,
    number: 1,
    topic: 'stoichiometry',
    difficulty: 'hard',
    // image: '2024_q1.png', // part d is a blank answer grid only — no data to read
    problem:
      'An unknown salt $\\mathrm{MX_2}$ is a group 2 metal halide.\n\n' +
      'a. 10.00 g $\\mathrm{MX_2}$ dissolves in 50.0 g water to give a homogeneous solution. The ' +
      'freezing point of this solution is $-4.50$ °C. What is the molar mass of $\\mathrm{MX_2}$? ' +
      'For water, $K_f = 1.86$ °C/$m$.\n\n' +
      'b. 10.00 g $\\mathrm{Na_2CO_3}$ and 10.00 g $\\mathrm{MX_2}$ are mixed in 200.0 mL of water. ' +
      'A precipitate of $\\mathrm{MCO_3}$ forms. What is the pH of the supernatant? The $K_a$ of ' +
      '$\\mathrm{H_2CO_3}$ is $4.3 \\times 10^{-7}$ and the $K_a$ of $\\mathrm{HCO_3^-}$ is ' +
      '$4.7 \\times 10^{-11}$.\n\n' +
      'c. A solution of 10.00 g $\\mathrm{MX_2}$ in water is treated with excess silver nitrate. ' +
      'The precipitate is dried; the mass of the dried compound is 15.2 g. What is the identity of ' +
      '$\\mathrm{MX_2}$?\n\n' +
      'd. A sample of 10.00 g $\\mathrm{MX_2}$ dissolved in 50 mL water is treated with increasing ' +
      'amounts of $\\mathrm{Na_2SO_4}$ up to 10 g in total. How will the mass of precipitate formed ' +
      'vary with the mass of added $\\mathrm{Na_2SO_4}$? Describe the shape of the graph (mass of ' +
      'precipitate formed, g, vs. mass of $\\mathrm{Na_2SO_4}$ added, g, from 0 to 10 g).\n\n' +
      'e. What color flame test does $\\mathrm{MX_2}$ give?',
  },
  {
    year: 2024,
    number: 2,
    topic: 'equilibrium',
    difficulty: 'hard',
    image: '2024_q2.png', // data graph: [Ca2+] (mmol/L) vs pH 2-7
    problem:
      'A sample of solid calcium fluoride is suspended in water in an unreactive container and ' +
      'stirred until it achieves equilibrium. The pH of the solution is lowered by careful ' +
      'addition of nitric acid, and the pH and concentration of $\\mathrm{Ca^{2+}}(aq)$ are noted ' +
      'at several points as shown on the graph (see attached image). Note that the units on the ' +
      '$y$ axis are millimoles per liter. Approximate data: at pH 2.0, $[\\mathrm{Ca^{2+}}] \\approx ' +
      '1.35$ mmol/L; pH 2.5, $\\approx 0.68$; pH 3.0, $\\approx 0.38$; pH 3.5, $\\approx 0.26$; ' +
      'pH 4.0, $\\approx 0.22$; pH 4.5–7.0, levels off at $\\approx 0.20$ mmol/L.\n\n' +
      'a. Determine the $K_{sp}$ of $\\mathrm{CaF_2}$ from the data provided.\n\n' +
      'b. Qualitatively, what is the cause for the increase in solubility of $\\mathrm{CaF_2}$ at ' +
      'low pH?\n\n' +
      'c. From the data provided, determine the $K_a$ of HF.\n\n' +
      'd. How many moles of $\\mathrm{HNO_3}$ must be added to the $\\mathrm{CaF_2}$/water mixture ' +
      'to achieve a pH $= 3.00$ in this experiment? The volume of solution is 1.00 L.\n\n' +
      'e. Carbon dioxide dissolves in water at 25 °C and 1 atm pressure to the extent of 0.0345 ' +
      'mol L$^{-1}$. An aliquot of the solution taken from the above experiment at pH $= 5$ is ' +
      'stirred under 1 atm $\\mathrm{CO_2}$ and the pH slowly raised by addition of solid NaOH ' +
      'until $\\mathrm{CaCO_3}$ just begins to precipitate. What is the pH of the solution at this ' +
      'point? The $K_{sp}$ of $\\mathrm{CaCO_3}$ is $8.7 \\times 10^{-9}$, the $K_a$ of aqueous ' +
      '$\\mathrm{CO_2}$ ("$\\mathrm{H_2CO_3}$") is $4.3 \\times 10^{-7}$, and the $K_a$ of ' +
      '$\\mathrm{HCO_3^-}$ is $4.7 \\times 10^{-11}$.',
  },
  {
    year: 2024,
    number: 3,
    topic: 'thermodynamics',
    difficulty: 'hard',
    image: '2024_q3.png', // Arrhenius plot (line equations also given in text)
    problem:
      'Ethene, $\\mathrm{C_2H_4}$, can react in the gas phase in the presence of radicals $R$ to ' +
      'form polyethylene as shown in the equation below. Here $n$ is the degree of polymerization. ' +
      'The forward reaction is second-order while the reverse reaction is first-order. The values ' +
      'of these rate constants are independent of the degree of polymerization $n$ and the ' +
      'identity of $R$:\n' +
      '$$\\mathrm{C_2H_4}(g) + {\\cdot}\\mathrm{CH_2(CH_2)_{2n}CH_2}R \\;' +
      '\\underset{k_r}{\\overset{k_f}{\\rightleftharpoons}}\\; ' +
      '{\\cdot}\\mathrm{CH_2(CH_2)_{2n+2}CH_2}R$$\n' +
      'An Arrhenius plot of $\\ln(k)$ vs. $1/T$ (K$^{-1}$) gives two straight lines: for the ' +
      'forward rate constant $k_f$ (s$^{-1}$), $y = -14500x + 31.7$; for the reverse rate constant ' +
      '$k_r$ (bar$^{-1}$ s$^{-1}$), $y = -4010x + 15.2$.\n\n' +
      'a. A sample of polyethylene has an average degree of polymerization $n = 1200$. How many ' +
      'polymer chains are present in 1.0 g of this material?\n\n' +
      'b. Calculate $\\Delta H^\\circ$ and $\\Delta S^\\circ$ for the polymerization reaction.\n\n' +
      'c. The bond dissociation enthalpy (BDE) for a typical carbon-carbon single bond is 345 ' +
      'kJ mol$^{-1}$. From the data given, what is the BDE of the carbon-carbon double bond in ' +
      'ethene?\n\n' +
      'd. Ethene is charged to a fixed vessel at 25 bar and 720 K. Traces of radical are then added ' +
      'to initiate polymerization. What is the percent conversion of ethene into polymer at ' +
      'equilibrium under these conditions?\n\n' +
      'e. In the presence of a catalyst for the polymerization reaction, the forward rate constant ' +
      'as a function of temperature is $\\ln(k_f) = -3050(1/T) + 21.0$. By what factor does the ' +
      'catalyst accelerate the rate of the forward reaction at 500 K?\n\n' +
      'f. By what factor does the catalyst change the rate of the reverse reaction at 500 K?',
  },
  {
    year: 2024,
    number: 4,
    topic: 'electrochemistry',
    difficulty: 'hard',
    image: '2024_q4a.png', // E vs mL HNO3 titration data graph (cell apparatus described in text)
    problem:
      'Copper(II) forms a complex ion with ammonia, $\\mathrm{Cu(NH_3)_4^{2+}}$, with $K_f = 1.7 ' +
      '\\times 10^{13}$. An electrochemical cell is set up as shown (see attached image) at 298 K. ' +
      'Half-cell A contains 100 mL of 1.00 M $\\mathrm{Cu(NO_3)_2}$, while half-cell B contains 100 ' +
      'mL of a solution that contains a small amount of copper(II) and is 0.100 M in ' +
      '$\\mathrm{NH_3}$. A solution of nitric acid is slowly added to half-cell B and the potential ' +
      'measured by the voltmeter is recorded as a function of the added volume of $\\mathrm{HNO_3}$. ' +
      'The cell consists of a Cu electrode in each half-cell, a salt bridge, a voltmeter, and a ' +
      'buret of $\\mathrm{HNO_3}$ above half-cell B. The measured potential $E$ (V) vs. mL added ' +
      '$\\mathrm{HNO_3}$ starts near $0.41$ V at 0 mL, decreases slowly to about $0.36$ V by ~2 mL, ' +
      'then drops steeply between ~2.5 and ~3.0 mL to a plateau near $0.14$ V for 3.0–4.0 mL.\n\n' +
      'a. Which half-cell is the cathode and which is the anode? Justify your answer.\n\n' +
      'b. Qualitatively explain the shape of the graph.\n\n' +
      'c. What is the total concentration of copper(II) in the solution in half-cell B?\n\n' +
      'd. What is the concentration of nitric acid in the buret?\n\n' +
      'e. Suppose that the experiment is set up again with silver metal in place of copper metal ' +
      'and silver(I) ion in place of copper(II) ion, but with all concentrations and all other ' +
      'reagents identical. What would the graph of $E$ vs. mL added $\\mathrm{HNO_3}$ look like in ' +
      'this experiment? Describe (sketch) your result and explain your answer. Silver(I) forms a ' +
      'complex ion with ammonia, $\\mathrm{Ag(NH_3)_2^+}$, with $K_f = 1.7 \\times 10^7$.',
  },
  {
    year: 2024,
    number: 5,
    topic: 'reactions',
    difficulty: 'hard',
    problem:
      'Write net equations for each of the reactions below. Use appropriate ionic and molecular ' +
      'formulas and omit formulas for all ions or molecules that do not take part in a reaction. ' +
      'Write structural formulas for all organic substances, and clearly show stereochemistry ' +
      'where relevant. You need not balance the equations or show the phase of the species.\n\n' +
      'a. Aqueous ammonia and acetic acid are mixed.\n\n' +
      'b. Sodium iodate is added to an excess of hydriodic acid.\n\n' +
      'c. Manganese(IV) oxide is added to concentrated aqueous hydrochloric acid.\n\n' +
      'd. Propyl benzoate is heated with aqueous sodium hydroxide.\n\n' +
      'e. Calcium oxide and graphite are heated to 2200 °C.\n\n' +
      'f. Iodine-124 undergoes radioactive decay by electron capture.',
  },
  {
    year: 2024,
    number: 6,
    topic: 'periodicity',
    difficulty: 'hard',
    image: '2024_q6.png', // group 1 properties table (also transcribed in text)
    problem:
      'Consider the properties of the group 1 elements, whose valence shell electron configuration ' +
      'is $ns^1$, in the table below.\n\n' +
      '| Element $M$ | $n$ | First ionization energy, kJ mol$^{-1}$ | Energy required to excite ' +
      'the valence electron to the $(n{+}1)s$ orbital, kJ mol$^{-1}$ | Molar density of solid ' +
      '$M$Cl, mol cm$^{-3}$ |\n' +
      '|---|---|---|---|---|\n' +
      '| H | 1 | 1312 | 984 | 0.0403 |\n' +
      '| Li | 2 | 520 | 325 | 0.0507 |\n' +
      '| Na | 3 | 496 | 308 | 0.0371 |\n' +
      '| K | 4 | 420 | 252 | 0.0266 |\n' +
      '| Rb | 5 | 403 | 241 | 0.0232 |\n' +
      '| Cs | 6 | 376 | 222 | 0.0237 |\n\n' +
      'a. Rationalize the observed trend in first ionization energies with increasing $n$.\n\n' +
      'b. Suppose a hydrogen atom were excited to its $2s^1$ state. If that excited state atom were ' +
      'to transfer its electron to $\\mathrm{Cs^+}$ to form a ground-state Cs atom, how much energy ' +
      'would that reaction absorb or release?\n\n' +
      'c. All but one of the atoms listed in the table have an excited state that is significantly ' +
      'lower in energy than the $(n{+}1)s^1$ state described in the table. Explain this ' +
      'observation, noting which atom is the exception and why.\n\n' +
      'd. All but one of the atoms listed in the table have an excited state that is modestly higher ' +
      'in energy ($38 - 55$ kJ mol$^{-1}$) than the $(n{+}1)s^1$ state described in the table. ' +
      'Explain this observation, noting which atom is the exception and why.\n\n' +
      'e. The compounds $M$Cl($s$) show a smooth decrease in their molar densities, except that ' +
      'HCl($s$) is less dense than expected from the trend and CsCl($s$) is more dense than ' +
      'expected. Explain this periodic trend, and give reasons for the two exceptions to the ' +
      'trend.\n\n' +
      'f. $^{137}$Cs (136.9070895 amu) undergoes radioactive decay to give a stable product whose ' +
      'atomic mass is 136.9058274 amu. What type of radioactive decay is this, and what is the ' +
      'identity of the decay product?\n\n' +
      'g. Calculate the energy, in kJ mol$^{-1}$, released by the radioactive decay of ' +
      '$^{137}$Cs.',
  },
  {
    year: 2024,
    number: 7,
    topic: 'bonding',
    difficulty: 'hard',
    image: '2024_q7.png', // carbonyl azide & diazirinone structures + BDE table
    problem:
      'Flash vacuum pyrolysis of carbonyl azide ($\\mathrm{CON_6}$) at 420 °C gives low yields of a ' +
      'cyclic compound, diazirinone, as shown in the equation below. The illustrations show the ' +
      'connectivity of the atoms but are NOT correct Lewis structures. Carbonyl azide has ' +
      'connectivity N–N–N–C(=O)–N–N–N (a central carbon bearing a double-bonded O and two ' +
      'terminal azide chains); it converts to diazirinone (a three-membered C–N–N ring with the ' +
      'carbon also double-bonded to O) plus $2\\,\\mathrm{N_2}$. Bond dissociation enthalpies ' +
      '(BDE, in kJ mol$^{-1}$):\n\n' +
      '| Bond | BDE | Bond | BDE | Bond | BDE | Bond | BDE |\n' +
      '|---|---|---|---|---|---|---|---|\n' +
      '| C–O | 350 | C–N | 290 | N–N | 160 | N–O | 200 |\n' +
      '| C=O | 741 | C=N | 615 | N=N | 418 | N=O | 480 |\n' +
      '| C≡O | 1080 | C≡N | 891 | N≡N | 949 | | |\n\n' +
      'a. Draw complete Lewis structures for carbonyl azide and for diazirinone, including all lone ' +
      'pairs and nonzero formal charges. You need only draw one Lewis structure for each molecule, ' +
      'even if there are multiple possible resonance structures.\n\n' +
      'b. Diazirinone decomposes in the gas phase over the course of several days at room ' +
      'temperature to give carbon monoxide and nitrogen gas. Based on the given BDEs, calculate ' +
      '$\\Delta H^\\circ$ for this decomposition reaction.\n\n' +
      'c. The actual $\\Delta H^\\circ$ for the decomposition of diazirinone is $-347$ kJ mol' +
      '$^{-1}$. Comment on any discrepancy you find between this value and the value you determined ' +
      'in part b. Be sure your comment addresses the direction of deviation of the two values.\n\n' +
      'd. Will $\\Delta G^\\circ$ for decomposition at 298 K be algebraically greater than, less ' +
      'than, or equal to $\\Delta H^\\circ$ for decomposition? Briefly justify your answer.\n\n' +
      'e. There is an isomer of diazirinone that has a chain structure with the connectivity NCNO. ' +
      'Draw a Lewis structure for this molecule and clearly describe or sketch its geometry.\n\n' +
      'f. Would you expect acyclic NCNO to be more or less stable than diazirinone? Clearly justify ' +
      'your prediction.',
  },
  {
    year: 2024,
    number: 8,
    topic: 'organic',
    difficulty: 'hard',
    image: '2024_q8.png', // stitched: isomers I-III (parts a-c) over heterocycles IV/V (parts d-e)
    problem:
      'Consider the three isomers of $\\mathrm{C_4H_9NO_2}$ shown below (see attached image):\n' +
      '  I: $\\mathrm{CH_3O\\text{–}CH_2CH_2\\text{–}C(=O)\\text{–}NH_2}$ ' +
      '(3-methoxypropanamide);\n' +
      '  II: $\\mathrm{H_2N\\text{–}CH_2CH_2\\text{–}C(=O)\\text{–}OCH_3}$ (methyl ' +
      '3-aminopropanoate);\n' +
      '  III: $\\mathrm{HO\\text{–}CH_2CH_2CH_2\\text{–}CH{=}N\\text{–}OH}$ (4-hydroxybutanal ' +
      'oxime).\n\n' +
      'a. Which compound is the most basic? Justify your answer.\n\n' +
      'b. Draw the structures of the conjugate acids of the three compounds.\n\n' +
      'c. Draw the structure of a chiral isomer of $\\mathrm{C_4H_9NO_2}$.\n\n' +
      'Consider the two nitrogen heterocycles shown below: IV is 1-methylpyrrole ' +
      '(N-methylpyrrole) and V is 1-methylimidazole (N-methylimidazole).\n\n' +
      'd. Which compound is more basic? Draw the structure of its conjugate acid.\n\n' +
      'e. Which compound is more reactive towards $\\mathrm{Br_2}$? Explain why it is more reactive ' +
      'and draw the structure of a major product of its reaction with $\\mathrm{Br_2}$.',
  },

  // ----- 2023 USNCO National Exam Part II (8 free-response questions) -----
  {
    year: 2023,
    number: 1,
    topic: 'stoichiometry',
    difficulty: 'hard',
    image: '2023_q1.png', // pH-vs-mL titration curve (key data — endpoint at 25.0 mL — is given in the text)
    problem:
      '$\\mathbf{A}$ is an ionic compound that contains only the elements hydrogen, nitrogen, and oxygen.\n\n' +
      'a. A 1.000-g sample of $\\mathbf{A}$ is dissolved in 20 mL water and titrated with 0.5000 M NaOH ' +
      'solution. The titration curve (pH versus mL of 0.5000 M NaOH added) shows the behavior of a weak ' +
      'monoprotic acid with a single equivalence point at 25.0 mL of added NaOH (the pH rises through a ' +
      'buffer region near pH 9 before climbing to a plateau near pH 13). What is the molar mass of ' +
      '$\\mathbf{A}$?\n\n' +
      'b. When a 1.000-g sample of $\\mathbf{A}$ is heated at 230 °C in an evacuated 1.50 L vessel, it ' +
      'decomposes into gaseous products, giving a final pressure of 784 mm Hg. How many moles of gas are ' +
      'formed in this reaction?\n\n' +
      'c. If the gases produced from the decomposition of 1.000 g of $\\mathbf{A}$ are instead first ' +
      'passed through a column packed with magnesium perchlorate (which strongly absorbs water vapor) and ' +
      'then collected at 25 °C and a pressure of 755 mm Hg, the total volume of gas is 308 mL. How many ' +
      'moles of gas are collected in this experiment?\n\n' +
      'd. What is the formula of $\\mathbf{A}$? Explain your reasoning.\n\n' +
      'e. Write Lewis structures for the cation and the anion present in $\\mathbf{A}$ and for the ' +
      'product(s) of its decomposition at 230 °C. Your Lewis structures should include all bonds, lone ' +
      'pairs, and nonzero formal charges. You should show all significant resonance structures for each ' +
      'species.',
  },
  {
    year: 2023,
    number: 2,
    topic: 'equilibrium',
    difficulty: 'hard',
    problem:
      'When water is bound to a metal ion, its acidity increases. For example, the $\\mathrm{p}K_a$ of ' +
      '$\\mathrm{Zn^{2+}}(aq)$ is 8.96.\n\n' +
      'a. Calculate the pH of a 0.010 M solution of zinc nitrate, $\\mathrm{Zn(NO_3)_2}$.\n\n' +
      'b. Calculate the pH of a 0.010 M solution of zinc acetate, $\\mathrm{Zn(CH_3COO)_2}$. The ' +
      '$\\mathrm{p}K_a$ of $\\mathrm{CH_3COOH}$ is 4.75.\n\n' +
      'c. Zinc hydroxide is sparingly soluble, with $K_{sp} = 4.5 \\times 10^{-17}$. Calculate the pH of a ' +
      'solution of water saturated with solid $\\mathrm{Zn(OH)_2}$.\n\n' +
      'd. Under what circumstances, if any, will a solution of zinc acetate spontaneously form a ' +
      'precipitate of $\\mathrm{Zn(OH)_2}$? If precipitation is possible, specify the circumstances under ' +
      'which it is spontaneous. If it is not possible, justify why not.\n\n' +
      'e. Zinc also forms a complex ion, $\\mathrm{Zn(OH)_4^{2-}}$, with $K_f = 5.0 \\times 10^{14}$. ' +
      'Calculate the solubility of $\\mathrm{Zn(OH)_2}$ in a solution with pH = 12.00.',
  },
  {
    year: 2023,
    number: 3,
    topic: 'thermodynamics',
    difficulty: 'hard',
    problem:
      'Hydrogen gas reacts with oxygen gas to give water vapor with ' +
      '$\\Delta H^\\circ_{rxn} = -241.8$ kJ mol⁻¹ and $\\Delta S^\\circ_{rxn} = -44.5$ J mol⁻¹ K⁻¹.\n\n' +
      '$$\\mathrm{H_2}(g) + \\tfrac{1}{2}\\,\\mathrm{O_2}(g) \\to \\mathrm{H_2O}(g)$$\n\n' +
      '| Species | $S^\\circ$ (J mol⁻¹ K⁻¹) | $C_p$ (J mol⁻¹ K⁻¹) |\n' +
      '| --- | --- | --- |\n' +
      '| $\\mathrm{H_2O}(g)$ | ??? | 4.18 |\n' +
      '| $\\mathrm{H_2}(g)$ | 130.7 | 14.4 |\n' +
      '| $\\mathrm{O_2}(g)$ | 205.2 | 0.92 |\n\n' +
      'a. Calculate $S^\\circ$ of $\\mathrm{H_2O}(g)$.\n\n' +
      'b. The bond dissociation enthalpy (BDE) of an average O–H bond in water is 463 kJ mol⁻¹ and the ' +
      'BDE of the H–H bond in $\\mathrm{H_2}$ is 436 kJ mol⁻¹. What is the BDE of the O=O bond in ' +
      '$\\mathrm{O_2}$?\n\n' +
      'c. 0.100 mol $\\mathrm{H_2}(g)$ and 0.100 mol $\\mathrm{O_2}(g)$, both initially at 100 °C, react ' +
      'completely in a sealed vessel that is maintained at 1 bar pressure. The vessel is machined as part ' +
      'of a 1.00-kg block of aluminum ($C_p = 0.89$ J g⁻¹ K⁻¹), which efficiently absorbs the heat ' +
      'generated in the reaction but which is well insulated from its surroundings. What is the final ' +
      'temperature of the aluminum block and the contents of the reaction vessel? Assume that $C_p$ and ' +
      '$\\Delta H^\\circ_{rxn}$ are independent of temperature.\n\n' +
      'd. Humid air at 298 K has an overall pressure of 1.0 bar and is 20. vol% $\\mathrm{O_2}$ and ' +
      '3.1 vol% $\\mathrm{H_2O}$. What is the minimum volume percentage of $\\mathrm{H_2}(g)$ in humid air ' +
      'necessary for its combustion to be spontaneous?\n\n' +
      'e. The lower flammability limit (LFL) of a substance is its minimum volumetric concentration ' +
      'needed to propagate a flame under a given set of conditions. The LFL of hydrogen gas in humid air ' +
      'is approximately 4%. Account for the difference between your answer in part d and the experimental ' +
      'value for the LFL.',
  },
  {
    year: 2023,
    number: 4,
    topic: 'thermodynamics',
    difficulty: 'hard',
    problem:
      'The vapor pressure of pure water at its melting point, 0.0 °C, is 611 Pa ' +
      '($6.11 \\times 10^{-3}$ bar).\n\n' +
      'a. 0.880 mol $\\mathrm{MgCl_2}$ is added to 1.00 kg liquid water at 0.0 °C. Calculate the vapor ' +
      'pressure of this solution.\n\n' +
      'b. The enthalpy of sublimation of ice is 51.1 kJ mol⁻¹ at 0.0 °C and the enthalpy of vaporization ' +
      'of liquid water is 45.1 kJ mol⁻¹ at 0.0 °C. Assuming these enthalpies are independent of ' +
      'temperature, calculate the temperature at which pure ice has the same vapor pressure as the ' +
      'magnesium chloride solution at 0.0 °C calculated in part a.\n\n' +
      'c. At the freezing point temperature of the aqueous magnesium chloride solution, the vapor ' +
      'pressure of the solution is equal to the vapor pressure of pure ice. Explain why this statement is ' +
      'true.\n\n' +
      'd. Using the principle enunciated in part c, calculate the freezing point temperature of the ' +
      'solution of 0.880 mol $\\mathrm{MgCl_2}$ dissolved in 1.00 kg water.\n\n' +
      'e. The temperature calculated in part d is the temperature of the system when the first solid ' +
      'appears at equilibrium as the system is cooled. As more solid is formed, do you expect the ' +
      'temperature to increase, decrease, or remain constant? Briefly justify your choice.',
  },
  {
    year: 2023,
    number: 5,
    topic: 'reactions',
    difficulty: 'hard',
    problem:
      'Write net equations for each of the reactions below. Use appropriate ionic and molecular formulas ' +
      'and omit formulas for all ions or molecules that do not take part in a reaction. Write structural ' +
      'formulas for all organic substances, and clearly show stereochemistry where relevant. You need not ' +
      'balance the equations or show the phase of the species.\n\n' +
      'a. Aqueous hydrochloric acid is added to a solution of sodium hypochlorite.\n\n' +
      'b. Aluminum foil is added to concentrated aqueous potassium hydroxide solution.\n\n' +
      'c. Metallic sodium is added to liquid ammonia in the presence of a trace amount of iron(III) ' +
      'nitrate.\n\n' +
      'd. Potassium tetrachloroplatinate is heated with two equivalents of aqueous ammonia.\n\n' +
      'e. Sodium *tert*-butoxide is added to 3-bromo-3-ethylpentane in $N,N$-dimethylformamide (DMF) ' +
      'solution.\n\n' +
      'f. Cobalt-57 undergoes radioactive decay by electron capture.',
  },
  {
    year: 2023,
    number: 6,
    topic: 'electrochemistry',
    difficulty: 'hard',
    image: '2023_q6.png', // electrolytic cell diagram (Pt / Ag half-cells; also described in text)
    problem:
      'The standard reduction potentials of some compounds of platinum and silver at 298 K are given ' +
      'below.\n\n' +
      '| Half-reaction | $E^\\circ$ (V) |\n' +
      '| --- | --- |\n' +
      '| $\\mathrm{Pt^{2+}}(aq) + 2e^- \\to \\mathrm{Pt}(s)$ | +1.188 |\n' +
      '| $\\mathrm{PtCl_4^{2-}}(aq) + 2e^- \\to \\mathrm{Pt}(s) + 4\\,\\mathrm{Cl^-}(aq)$ | +0.758 |\n' +
      '| $\\mathrm{PtCl_6^{2-}}(aq) + 2e^- \\to \\mathrm{PtCl_4^{2-}}(aq) + 2\\,\\mathrm{Cl^-}(aq)$ | +0.726 |\n' +
      '| $\\mathrm{Ag^+}(aq) + e^- \\to \\mathrm{Ag}(s)$ | +0.799 |\n\n' +
      'a. What is $K_f$ for the $\\mathrm{PtCl_4^{2-}}$ ion?\n\n' +
      'b. What is $E^\\circ$ for the reduction of hexachloroplatinate(IV) to give platinum metal?\n\n' +
      '$$\\mathrm{PtCl_6^{2-}}(aq) + 4e^- \\to \\mathrm{Pt}(s) + 6\\,\\mathrm{Cl^-}(aq)$$\n\n' +
      'An electrolytic cell is set up as follows: a Pt electrode sits in a solution that is 0.0010 M ' +
      '$\\mathrm{PtCl_4^{2-}}$ and 0.10 M $\\mathrm{Cl^-}$, and an Ag electrode sits in a solution that is ' +
      '0.10 M $\\mathrm{Ag^+}$; the two half-cells are joined by a salt bridge and connected through an ' +
      'external battery.\n\n' +
      'c. What is the minimum potential that would need to be applied in order to cause the platinum ' +
      'electrode to dissolve to form $\\mathrm{PtCl_4^{2-}}(aq)$ and the $\\mathrm{Ag^+}(aq)$ to deposit ' +
      'on the Ag electrode?\n\n' +
      'd. As electrolysis is carried out, is it thermodynamically possible for a significant amount of ' +
      'hexachloroplatinate(IV) to be produced at the anode? Justify your answer.',
  },
  {
    year: 2023,
    number: 7,
    topic: 'bonding',
    difficulty: 'hard',
    image: '2023_q7.png', // boiling-point & bond-length comparison graphs (trends also summarized in text)
    problem:
      'Fluorine atoms and methyl groups each form one bond, so there are often analogous compounds with ' +
      'the formulas $\\mathrm{AF}_n$ and $\\mathrm{A(CH_3)}_n$. The normal boiling points and the A–X bond ' +
      'distances of a series of $\\mathrm{AX}_n$ molecules are compared in the data provided (A = 2p ' +
      'element; X = F or $\\mathrm{CH_3}$), spanning the species $\\mathrm{BX_3}$, $\\mathrm{CX_4}$, ' +
      '$\\mathrm{NX_3}$, $\\mathrm{OX_2}$, and $\\mathrm{FX}$. In the boiling-point comparison, the ' +
      '$\\mathrm{X = CH_3}$ series lies well above the $\\mathrm{X = F}$ series across all central atoms. ' +
      'In the bond-length comparison, the A–$\\mathrm{CH_3}$ distances decrease from about 158 pm ' +
      '(at $\\mathrm{BX_3}$) to about 138 pm (at $\\mathrm{FX}$), while the A–F distances increase from ' +
      'about 130 pm (at $\\mathrm{BX_3}$) to about 142 pm (at $\\mathrm{FX}$).\n\n' +
      'a. Draw or clearly describe the shapes of the molecules $\\mathrm{BF_3}$ and $\\mathrm{NF_3}$.\n\n' +
      'b. In all cases, the normal boiling points of the $\\mathrm{AF}_n$ molecules are lower than those ' +
      'of the $\\mathrm{A(CH_3)}_n$ molecules. Explain this observation.\n\n' +
      'c. Not counting the boron compounds, the trend in boiling points is that they decrease as the ' +
      'central atom A moves to the right in the periodic table. Explain this trend.\n\n' +
      'd. Explain why $\\mathrm{BF_3}$ has a higher boiling point than $\\mathrm{CF_4}$, while ' +
      '$\\mathrm{B(CH_3)_3}$ has a lower boiling point than $\\mathrm{C(CH_3)_4}$.\n\n' +
      'e. Explain why the A–C bond distances decrease as A moves to the right in the periodic table.\n\n' +
      'f. Explain why the A–F bond distances increase as A moves to the right in the periodic table.',
  },
  {
    year: 2023,
    number: 8,
    topic: 'organic',
    difficulty: 'hard',
    image: '2023_q8.png', // structures of cyclopentanone & 1-methylcyclopentene (both also named in text)
    problem:
      'Consider the two cyclic compounds cyclopentanone (a five-membered carbocyclic ring bearing a ' +
      'ketone C=O group) and 1-methylcyclopentene (a cyclopentene ring with a methyl group on one of the ' +
      'doubly bonded carbons).\n\n' +
      'a. Which compound has the higher normal boiling point? Justify your choice.\n\n' +
      'b. One of the two compounds will rapidly decolorize bromine in carbon tetrachloride solvent. Which ' +
      'one? Draw the structure of the major product formed in the reaction, clearly showing ' +
      'stereochemistry if relevant.\n\n' +
      'c. One of the two compounds will react rapidly with the Grignard reagent methylmagnesium bromide. ' +
      'Which one? Draw the structure of the major organic product formed in the reaction (as isolated ' +
      'after workup with dilute aqueous acid), clearly showing stereochemistry if relevant.\n\n' +
      'd. The product of the reaction in part c can be transformed into either cyclopentanone or ' +
      '1-methylcyclopentene in good yield in a single reaction. Specify which compound is the product and ' +
      'the reagent(s) needed to accomplish this transformation.\n\n' +
      'e. Both cyclopentanone and 1-methylcyclopentene are achiral. Draw the structure of an acyclic ' +
      'isomer of 1-methylcyclopentene that is chiral.',
  },

  // ----- 2022 USNCO National Exam Part II (8 free-response questions) -----
  {
    year: 2022,
    number: 1,
    topic: 'stoichiometry',
    difficulty: 'hard',
    problem:
      'Compound $\\mathbf{A}$ contains only carbon, fluorine, and chlorine.\n\n' +
      'a. The vapor density of $\\mathbf{A}$ at 1.00 bar and 25.0 °C is 6.895 g L⁻¹. What is the molar ' +
      'mass of $\\mathbf{A}$?\n\n' +
      'b. Chlorofluorocarbons such as $\\mathbf{A}$ react with sodium metal to convert all the chlorine ' +
      'present into sodium chloride. The products from the reaction of sodium with 100.0 mL of gaseous ' +
      '$\\mathbf{A}$ (at 1.00 bar and 25.0 °C) are dissolved in water and a few drops of sodium chromate ' +
      'solution are added. This solution is then titrated with 0.3540 M $\\mathrm{AgNO_3}$ solution until ' +
      'a bright red precipitate appears, which requires 22.79 mL of the titrant. How many chlorine atoms ' +
      'are there in a molecule of $\\mathbf{A}$?\n\n' +
      'c. What is the molecular formula of $\\mathbf{A}$? Justify your answer.\n\n' +
      'd. There is only one known isomer of $\\mathbf{A}$, compound $\\mathbf{B}$. The two compounds have ' +
      'nearly identical boiling points, but can be distinguished by $^{19}\\mathrm{F}$ NMR spectroscopy, a ' +
      'technique that is sensitive to small differences in the chemical environments of fluorine atoms in ' +
      'compounds. When analyzed by this method, compound $\\mathbf{A}$ exhibits only a single type of ' +
      'chemical environment for fluorine, while compound $\\mathbf{B}$ shows two distinct environments for ' +
      'its fluorine atoms. Draw structural formulas for compounds $\\mathbf{A}$ and $\\mathbf{B}$ that are ' +
      'consistent with these observations.',
  },
  {
    year: 2022,
    number: 2,
    topic: 'equilibrium',
    difficulty: 'hard',
    problem:
      'A chemist prepares an ammonia/ammonium chloride buffer from solid ammonium chloride, 0.80 M ' +
      '$\\mathrm{NH_3}$, and distilled water.\n\n' +
      'a. What is the pH of the 0.80 M $\\mathrm{NH_3}$ solution? (The $K_a$ of $\\mathrm{NH_4^+}$ is ' +
      '$5.6 \\times 10^{-10}$.)\n\n' +
      'b. What mole ratio of ammonia to ammonium chloride is required for the buffer to have ' +
      'pH = 9.20?\n\n' +
      'c. Calculate the volume of ammonia solution and mass of ammonium chloride needed to make up 500 mL ' +
      'of the pH = 9.20 buffer with a total concentration of nitrogen-containing species ' +
      '($\\mathrm{NH_3}$ or $\\mathrm{NH_4^+}$) of 0.50 mol L⁻¹.\n\n' +
      'd. To the solution described in (c) is added 10.0 mL of 0.10 M $\\mathrm{AgNO_3}$.\n\n' +
      '  i. Some AgCl precipitates from this mixture. Justify that this is the case. The $K_{sp}$ of AgCl ' +
      'is $1.8 \\times 10^{-10}$ and the $K_f$ of $\\mathrm{Ag(NH_3)_2^+}$ is $1.6 \\times 10^7$.\n\n' +
      '  ii. What is the final concentration of free $\\mathrm{Ag^+}$ in solution after this mixture ' +
      'achieves equilibrium?\n\n' +
      '  iii. What is the mass of AgCl that precipitates from solution?',
  },
  {
    year: 2022,
    number: 3,
    topic: 'thermodynamics',
    difficulty: 'hard',
    problem:
      'Gaseous molecular and atomic bromine have the following thermodynamic properties:\n\n' +
      '| Species | $\\Delta H^\\circ_f$ (kJ mol⁻¹) | $S^\\circ$ (J mol⁻¹ K⁻¹) |\n' +
      '| --- | --- | --- |\n' +
      '| $\\mathrm{Br_2}(g)$ | 30.9 | 245.4 |\n' +
      '| $\\mathrm{Br}(g)$ | 111.9 | 175.0 |\n\n' +
      'a. What is the bond dissociation enthalpy (BDE) of the bromine–bromine bond in ' +
      '$\\mathrm{Br_2}(g)$?\n\n' +
      'b. How many atoms of $\\mathrm{Br}(g)$ will be present at equilibrium in a 1.00-L container with ' +
      '0.100 bar of $\\mathrm{Br_2}(g)$ at 298 K?\n\n' +
      'c. The ionization energy of $\\mathrm{Br}(g)$ is 1145.9 kJ mol⁻¹, while the ionization energy of ' +
      '$\\mathrm{Br_2}(g)$ is 1025.1 kJ mol⁻¹. What is the bond dissociation enthalpy of ' +
      '$\\mathrm{Br_2^+}(g)$ (defined as the enthalpy of reaction of $\\mathrm{Br_2^+}(g)$ to form ' +
      '$\\mathrm{Br^+}(g)$ and $\\mathrm{Br}(g)$)?\n\n' +
      'd. Propose an explanation for the difference in BDE between $\\mathrm{Br_2}(g)$ and ' +
      '$\\mathrm{Br_2^+}(g)$ in terms of the bonding in these two species.\n\n' +
      'e. The vapor pressure of liquid bromine at 298 K is 0.283 bar. What is the absolute entropy ' +
      '$S^\\circ$ of $\\mathrm{Br_2}(l)$?\n\n' +
      'f. The absolute entropies of the gas-phase atoms of the fourth period given in the table below ' +
      'exhibit a non-monotonic pattern. Explain why the absolute entropies of $\\mathrm{Se}(g)$ and ' +
      '$\\mathrm{Br}(g)$ are larger than the absolute entropies of either $\\mathrm{As}(g)$ or ' +
      '$\\mathrm{Kr}(g)$.\n\n' +
      '| | $\\mathrm{As}(g)$ | $\\mathrm{Se}(g)$ | $\\mathrm{Br}(g)$ | $\\mathrm{Kr}(g)$ |\n' +
      '| --- | --- | --- | --- | --- |\n' +
      '| $S^\\circ$ (J mol⁻¹ K⁻¹) | 163.2 | 176.7 | 175.0 | 164.1 |',
  },
  {
    year: 2022,
    number: 4,
    topic: 'kinetics',
    difficulty: 'hard',
    problem:
      'Iodide ion reacts with hydrogen peroxide in acidic solution according to the following ' +
      'equation:\n\n' +
      '$$2\\,\\mathrm{I^-}(aq) + \\mathrm{H_2O_2}(aq) + 2\\,\\mathrm{H^+}(aq) \\to \\mathrm{I_2}(aq) + ' +
      '2\\,\\mathrm{H_2O}(l) \\quad (4)$$\n\n' +
      'The reaction is carried out at 18.8 °C in the presence of a mixture of $\\mathrm{CH_3COOH}$ and ' +
      'NaOH to regulate the pH, sodium thiosulfate (which reacts very rapidly with $\\mathrm{I_2}$ to form ' +
      'tetrathionate ions), and starch. All the components except the hydrogen peroxide are premixed, and ' +
      'then the hydrogen peroxide solution is added and a stopwatch is started. The solution remains ' +
      'colorless until it suddenly turns blue, at which point the time $t$ is recorded. The following data ' +
      'are obtained:\n\n' +
      '| Run | 1.0 M $\\mathrm{CH_3COOH}$, mL | 1.0 M NaOH, mL | 0.20 M KI, mL | 0.20 M $\\mathrm{H_2O_2}$, mL | 0.020 M $\\mathrm{Na_2S_2O_3}$, mL | Distilled $\\mathrm{H_2O}$, mL | $t$, s |\n' +
      '| --- | --- | --- | --- | --- | --- | --- | --- |\n' +
      '| A | 2.0 | 1.0 | 2.0 | 2.0 | 1.0 | 2.0 | 68.2 |\n' +
      '| B | 4.0 | 1.0 | 2.0 | 2.0 | 1.0 | 0.0 | 68.9 |\n' +
      '| C | 2.0 | 1.0 | 4.0 | 2.0 | 1.0 | 0.0 | 33.2 |\n' +
      '| D | 2.0 | 1.0 | 2.0 | 4.0 | 1.0 | 0.0 | 32.9 |\n\n' +
      'a. Give a qualitative explanation for why the solution suddenly turns blue after a certain amount ' +
      'of time has elapsed.\n\n' +
      'b. Calculate the initial $[\\mathrm{H^+}]$ in runs A and B and explain why $[\\mathrm{H^+}]$ will ' +
      'not change significantly over the course of the respective reactions. (The $K_a$ of ' +
      '$\\mathrm{CH_3COOH}$ is $1.8 \\times 10^{-5}$.)\n\n' +
      'c. The rate law for reaction (4) has the form ' +
      '$\\mathrm{Rate} = k_4[\\mathrm{I^-}]^m[\\mathrm{H_2O_2}]^n[\\mathrm{H^+}]^p$, where $m$, $n$, and ' +
      '$p$ are integers. What are the values of $m$, $n$, and $p$ under these experimental conditions? ' +
      'Briefly explain your reasoning.\n\n' +
      'd. What is the value of the rate constant $k_4$ for this reaction?\n\n' +
      'e. The following mechanism for reaction (4) has been proposed:\n\n' +
      '$$\\mathrm{H_2O_2}(aq) + \\mathrm{H^+}(aq) \\rightleftharpoons \\mathrm{H_3O_2^+}(aq) \\quad (\\text{fast, unfavorable})$$\n\n' +
      '$$\\mathrm{H_3O_2^+}(aq) + \\mathrm{I^-}(aq) \\to \\mathrm{HOI}(aq) + \\mathrm{H_2O}(l) \\quad (\\text{slow})$$\n\n' +
      '$$\\mathrm{HOI}(aq) + \\mathrm{H^+}(aq) \\rightleftharpoons \\mathrm{H_2OI^+}(aq) \\quad (\\text{fast, unfavorable})$$\n\n' +
      '$$\\mathrm{H_2OI^+}(aq) + \\mathrm{I^-}(aq) \\to \\mathrm{I_2}(aq) + \\mathrm{H_2O}(l) \\quad (\\text{fast})$$\n\n' +
      'Is this mechanism consistent with the given data? Justify your answer.\n\n' +
      'f. The experiments are repeated under the same conditions as Runs A and B above, except that ' +
      'phosphoric acid ($\\mathrm{H_3PO_4}$, $K_a = 7.6 \\times 10^{-3}$) is substituted for acetic acid. ' +
      'The observed times for the solutions to turn blue with this substitution are 46.7 s and 31.5 s, ' +
      'respectively. Propose an interpretation for these observations.',
  },
  {
    year: 2022,
    number: 5,
    topic: 'reactions',
    difficulty: 'hard',
    problem:
      'Write net equations for each of the reactions below. Use appropriate ionic and molecular formulas ' +
      'and omit formulas for all ions or molecules that do not take part in a reaction. Write structural ' +
      'formulas for all organic substances. You need not balance the equations.\n\n' +
      'a. Diiodine pentoxide is added to a barium hydroxide solution.\n\n' +
      'b. Sulfur dioxide is bubbled through an acidified solution of potassium permanganate.\n\n' +
      'c. Iron(III) oxide is heated with carbon monoxide gas at 1200 °C.\n\n' +
      'd. Aqueous hydrobromic acid is electrolyzed at platinum electrodes.\n\n' +
      'e. 1-Butanol reacts with an acidified solution of potassium dichromate.\n\n' +
      'f. Oganesson-294 undergoes alpha decay.',
  },
  {
    year: 2022,
    number: 6,
    topic: 'electrochemistry',
    difficulty: 'hard',
    problem:
      'A galvanic cell is constructed at 298 K with one half-cell consisting of a 10.00 g silver wire ' +
      'immersed in 1.00 L of a 0.100 M solution of silver nitrate and the second half-cell consisting of ' +
      'a 20.00 g copper plate immersed in 1.00 L of a 0.200 M solution of copper(II) sulfate.\n\n' +
      '| Half-reaction | $E^\\circ$ (V) |\n' +
      '| --- | --- |\n' +
      '| $\\mathrm{Ag^+}(aq) + e^- \\to \\mathrm{Ag}(s)$ | 0.800 |\n' +
      '| $\\mathrm{Cu^{2+}}(aq) + 2e^- \\to \\mathrm{Cu}(s)$ | 0.337 |\n\n' +
      'a. What voltage is measured for this galvanic cell?\n\n' +
      'b. The cell is discharged at a constant current of 0.150 A until the mass of the silver electrode ' +
      'is equal to the mass of the copper electrode. How much time does this take?\n\n' +
      'c. A chemist wishes to add sodium oxalate to one of the half-cells in the original cell to ' +
      'decrease the measured voltage. To which cell should the sodium oxalate be added, and why?\n\n' +
      'd. What mass of sodium oxalate would need to be added to the appropriate half-cell to cause the ' +
      'voltage in the original cell to become 0.200 V? You may assume that there is no change in the ' +
      'volume of the solution. The $K_{sp}$ of $\\mathrm{Ag_2C_2O_4}$ is $3.5 \\times 10^{-11}$ and the ' +
      '$K_{sp}$ of $\\mathrm{CuC_2O_4}$ is $3.0 \\times 10^{-8}$.',
  },
  {
    year: 2022,
    number: 7,
    topic: 'bonding',
    difficulty: 'hard',
    image: '2022_q7.png', // planar (non-Lewis) skeletal depictions of formamide and glyoxal
    problem:
      'Formamide ($\\mathrm{HCONH_2}$) and glyoxal ($\\mathrm{OHC{-}CHO}$) are six-atom molecules with ' +
      'essentially planar structures as depicted in the figure (these are *NOT* Lewis structures).\n\n' +
      'a. Draw complete Lewis structures for these two molecules, including all bonds, lone pairs, and ' +
      'nonzero formal charges.\n\n' +
      'b. One of these compounds has a normal boiling point of 51 °C, while the other has a normal ' +
      'boiling point of 210 °C. Assign which compound has which boiling point, and propose an explanation ' +
      'for the large difference.\n\n' +
      'c. The H–N–H bond angle in formamide (122°) is much larger than the H–N–H angle in ammonia ' +
      '(107°). Explain this difference.\n\n' +
      'd. Rotation of the central bond in the two molecules (the C–N bond in formamide or the C–C bond in ' +
      'glyoxal) occurs at very different rates, with the barrier to rotation in formamide being much ' +
      'larger (74 kJ mol⁻¹ vs. 25 kJ mol⁻¹). Explain why rotation is much more difficult in formamide ' +
      'than in glyoxal.',
  },
  {
    year: 2022,
    number: 8,
    topic: 'organic',
    difficulty: 'hard',
    image: '2022_q8.png', // skeletal structures of the three C3H6O2 isomers A (methoxyacetaldehyde), B (propanoic acid), C (methyl acetate)
    problem:
      'Consider the following isomers with the formula $\\mathrm{C_3H_6O_2}$ (shown in the figure): ' +
      '$\\mathbf{A}$ is methoxyacetaldehyde, $\\mathrm{CH_3OCH_2CHO}$; $\\mathbf{B}$ is propanoic acid, ' +
      '$\\mathrm{CH_3CH_2COOH}$; and $\\mathbf{C}$ is methyl acetate, $\\mathrm{CH_3COOCH_3}$.\n\n' +
      'a. Rank the three compounds in order of increasing normal boiling point, and justify your ' +
      'ordering.\n\n' +
      'b. Compounds $\\mathbf{A}$–$\\mathbf{C}$ are all optically inactive. Draw the structure of an ' +
      'optically active isomer of $\\mathrm{C_3H_6O_2}$.\n\n' +
      'c. Compounds $\\mathbf{A}$ and $\\mathbf{B}$ react reversibly with water in the presence of a ' +
      'suitable catalyst: the aldehyde of $\\mathbf{A}$ and the carboxylic acid carbonyl of $\\mathbf{B}$ ' +
      'each add water to form a geminal diol. Which reaction has the larger equilibrium constant? Explain ' +
      'your answer in terms of the structure or bonding of the species in the reactions.\n\n' +
      'd. Compound $\\mathbf{C}$ reacts with water in the presence of a strong acid to form two new ' +
      'organic compounds. Write a balanced equation for this reaction, including structural formulas for ' +
      'the two organic products.\n\n' +
      'e. In the presence of excess strong base, compound $\\mathbf{C}$ reacts with water irreversibly. ' +
      'Explain why this reaction is irreversible while the reaction in the presence of acid is ' +
      'reversible.',
  },

  // ----- 2021 USNCO National Exam Part II (8 free-response questions) -----
  {
    year: 2021,
    number: 1,
    topic: 'stoichiometry',
    difficulty: 'hard',
    problem:
      'A binary oxide $\\mathrm{X}_m\\mathrm{O}_n$ is a white, slightly volatile solid that reacts with ' +
      'saturated aqueous $\\mathrm{Ba(OH)_2}$ to give a white precipitate.\n\n' +
      'a. A 69.5 mg sample of this oxide is placed in an evacuated 1.00 L container, which is then heated ' +
      'slowly until the solid just vaporizes completely. At this point, the pressure in the container is ' +
      '20.0 mm Hg and the temperature is 239.7 °C. What is the molar mass of the oxide in the gas phase?\n\n' +
      'b. A 1.00 g sample of the oxide is dissolved in aqueous acid and electrolytically reduced, with ' +
      'elemental $\\mathbf{X}$ depositing on the cathode. Complete electrolysis requires 58 minutes with ' +
      'a current of 1.00 A. What is the value of $n$ in the formula $\\mathrm{X}_m\\mathrm{O}_n$?\n\n' +
      'c. What is the chemical formula of the oxide?\n\n' +
      'd. Write a balanced net ionic equation for the reaction of the oxide with a saturated aqueous ' +
      'solution of $\\mathrm{Ba(OH)_2}$.\n\n' +
      'e. The experiment described in part (a) is repeated with a 415.7 mg sample of the oxide, which ' +
      'requires heating to 280.0 °C to just vaporize the solid. What is the standard enthalpy of ' +
      'sublimation of the oxide?',
  },
  {
    year: 2021,
    number: 2,
    topic: 'equilibrium',
    difficulty: 'hard',
    problem:
      'A saturated aqueous solution of $\\mathrm{Ca(OH)_2}$ has pH = 12.40.\n\n' +
      'a. What is the concentration of hydroxide ion in this solution?\n\n' +
      'b. What is the $K_{sp}$ of $\\mathrm{Ca(OH)_2}$?\n\n' +
      'A 100.0 mg sample of $\\mathrm{Ca(OH)_2}$ ($M = 74.09$) is suspended in 100.0 mL of water. The ' +
      'mixture is stirred vigorously and 3 M sulfuric acid is added dropwise to it while monitoring the ' +
      'pH of the solution.\n\n' +
      'c. At the point that the pH reaches 7.00, there is solid calcium sulfate suspended in the ' +
      'solution. What is the concentration of $\\mathrm{Ca^{2+}}(aq)$ in the solution at this point? The ' +
      '$K_{sp}$ of $\\mathrm{CaSO_4}$ is $2.4 \\times 10^{-5}$.\n\n' +
      'd. Does the solution become homogeneous at any point during this titration? Justify your answer.',
  },
  {
    year: 2021,
    number: 3,
    topic: 'electrochemistry',
    difficulty: 'hard',
    image: '2021_q3.png', // vanadium battery cell diagram (initial conditions also given in the text)
    problem:
      'Vanadium can adopt four oxidation states in aqueous solution.\n\n' +
      '| Half-reaction | $E^\\circ$ at 298 K (V) |\n' +
      '| --- | --- |\n' +
      '| $\\mathrm{VO_2^+}(aq) + 2\\,\\mathrm{H^+}(aq) + e^- \\to \\mathrm{VO^{2+}}(aq) + \\mathrm{H_2O}(l)$ | +1.00 |\n' +
      '| $\\mathrm{VO^{2+}}(aq) + 2\\,\\mathrm{H^+}(aq) + e^- \\to \\mathrm{V^{3+}}(aq) + \\mathrm{H_2O}(l)$ | +0.34 |\n' +
      '| $\\mathrm{V^{3+}}(aq) + e^- \\to \\mathrm{V^{2+}}(aq)$ | −0.26 |\n\n' +
      'a. Calculate $E^\\circ$ for the following half-cell at 298 K:\n\n' +
      '$$\\mathrm{VO_2^+}(aq) + 4\\,\\mathrm{H^+}(aq) + 3e^- \\to \\mathrm{V^{2+}}(aq) + 2\\,\\mathrm{H_2O}(l) \\qquad E^\\circ = \\;???$$\n\n' +
      'b. A vanadium battery can be constructed using the reduction of vanadium(V) by vanadium(II). ' +
      'Calculate $\\Delta E^\\circ$ for this reaction at 298 K:\n\n' +
      '$$\\mathrm{VO_2^+}(aq) + \\mathrm{V^{2+}}(aq) + 2\\,\\mathrm{H^+}(aq) \\to \\mathrm{VO^{2+}}(aq) + \\mathrm{V^{3+}}(aq) + \\mathrm{H_2O}(l)$$\n\n' +
      'c. The value of $\\Delta E^\\circ$ for the vanadium battery increases with increasing temperature ' +
      'by $1.76 \\times 10^{-4}$ V K⁻¹. Calculate $\\Delta H^\\circ_{rxn}$ and $\\Delta S^\\circ_{rxn}$ ' +
      'for the vanadium battery.\n\n' +
      'A vanadium battery is set up as shown in the figure, using solutions that are buffered at ' +
      'pH = 1.00. It is then discharged with a constant current of 10.0 A until the cell potential reaches ' +
      '1.14 V. The temperature is maintained at 298 K, and the volume of solution in each beaker is ' +
      '100.0 mL. The initial conditions are: the cathode half-cell has $[\\mathrm{VO_2^+}] = 0.50$ M, ' +
      '$[\\mathrm{VO^{2+}}] = 0.10$ M, pH = 1.00; the anode half-cell has $[\\mathrm{V^{2+}}] = 0.50$ M, ' +
      '$[\\mathrm{V^{3+}}] = 0.10$ M, pH = 1.00.\n\n' +
      'd. What is the concentration of $\\mathrm{V^{3+}}(aq)$ in the anodic cell when the cell voltage ' +
      'reaches 1.14 V?\n\n' +
      'e. How much time is required to achieve this voltage?',
  },
  {
    year: 2021,
    number: 4,
    topic: 'equilibrium',
    difficulty: 'hard',
    problem:
      'The gas-phase equilibrium between nitryl chloride ($\\mathrm{NO_2Cl}$) and nitrosyl chloride ' +
      '($\\mathrm{NOCl}$) was studied:\n\n' +
      '$$\\mathrm{NO_2Cl}(g) + \\mathrm{NO}(g) \\rightleftharpoons \\mathrm{NOCl}(g) + \\mathrm{NO_2}(g) \\qquad (4a)$$\n\n' +
      'The equilibrium constant for reaction 4a was measured as $K_{4a} = 1.12 \\times 10^4$ at 298 K and ' +
      '$K_{4a} = 4.68 \\times 10^3$ at 340 K.\n\n' +
      'a. Calculate $\\Delta G^\\circ_{4a}$ at both 298 K and 340 K.\n\n' +
      'b. Calculate $\\Delta H^\\circ_{4a}$ and $\\Delta S^\\circ_{4a}$ (assuming that they are ' +
      'essentially independent of temperature).\n\n' +
      'c. Which of the four gaseous compounds involved in this equilibrium has the lowest standard molar ' +
      'entropy $S^\\circ$ at 298 K? Justify your choice.\n\n' +
      'd. The normal boiling point of NOCl is −6 °C. Consider reaction 4b that produces liquid NOCl ' +
      'rather than gaseous NOCl:\n\n' +
      '$$\\mathrm{NO_2Cl}(g) + \\mathrm{NO}(g) \\rightleftharpoons \\mathrm{NOCl}(l) + \\mathrm{NO_2}(g) \\qquad (4b)$$\n\n' +
      'At 298 K, how will each of the thermodynamic quantities $\\Delta H^\\circ_{4b}$, ' +
      '$\\Delta S^\\circ_{4b}$, and $\\Delta G^\\circ_{4b}$ compare to the corresponding thermodynamic ' +
      'quantity for reaction 4a (i.e., will the quantity for 4b be greater than, less than, or equal to ' +
      'the quantity for 4a)? Justify your answers.\n\n' +
      'e. In experimental practice, the study of equilibrium 4a is complicated by the fact that ' +
      '$\\mathrm{NO_2}(g)$ is also in equilibrium with $\\mathrm{N_2O_4}(g)$ according to reaction 4c ' +
      'under conditions where reaction 4a attains equilibrium.\n\n' +
      '$$2\\,\\mathrm{NO_2}(g) \\rightleftharpoons \\mathrm{N_2O_4}(g) \\qquad (4c)$$\n\n' +
      'Suppose that samples of $\\mathrm{NO_2Cl}$ and NO are introduced into a reaction vessel and the ' +
      'mixture is allowed to attain equilibrium according to reactions 4a and 4c at 320 K. If the volume ' +
      'of the reaction vessel is doubled, will the number of moles of $\\mathrm{NOCl}(g)$ increase, ' +
      'decrease, or stay the same after the system reattains equilibrium? Justify your answer.',
  },
  {
    year: 2021,
    number: 5,
    topic: 'reactions',
    difficulty: 'hard',
    problem:
      'Write net equations for each of the reactions below. Use appropriate ionic and molecular formulas ' +
      'and omit formulas for all ions or molecules that do not take part in a reaction. Write structural ' +
      'formulas for all organic substances. You need not balance the equations.\n\n' +
      'a. Solid calcium oxide is added to distilled water.\n\n' +
      'b. Acidic aqueous solutions of potassium permanganate and iron(II) sulfate are mixed.\n\n' +
      'c. Gaseous ammonia and boron trifluoride are mixed.\n\n' +
      'd. Solid phosphorus(V) oxide is added to an excess of aqueous sodium carbonate.\n\n' +
      'e. Potassium hydroxide is added to a dimethyl sulfoxide solution of 1-bromobutane.\n\n' +
      'f. Fluorine-18 emits a positron.',
  },
  {
    year: 2021,
    number: 6,
    topic: 'bonding',
    difficulty: 'hard',
    problem:
      'Explain the following observations about complex ions of the transition metals.\n\n' +
      'a. The $\\mathrm{Cr(H_2O)_6^{3+}}$ ion is paramagnetic while the $\\mathrm{Sc(H_2O)_6^{3+}}$ ion ' +
      'is diamagnetic.\n\n' +
      'b. The $\\mathrm{CoF_6^{3-}}$ ion is paramagnetic while the $\\mathrm{Co(CN)_6^{3-}}$ ion is ' +
      'diamagnetic.\n\n' +
      'c. The $\\mathrm{NiCl_4^{2-}}$ ion is paramagnetic while the $\\mathrm{PtCl_4^{2-}}$ ion is ' +
      'diamagnetic.\n\n' +
      'd. The $\\mathrm{CoCl_4^{2-}}$ ion is strongly colored while the $\\mathrm{ZnCl_4^{2-}}$ ion is ' +
      'colorless.\n\n' +
      'e. The $\\mathrm{MnO_4^-}$ ion is strongly colored while the $\\mathrm{ReO_4^-}$ ion is colorless.',
  },
  {
    year: 2021,
    number: 7,
    topic: 'bonding',
    difficulty: 'hard',
    problem:
      'Consider the species whose normal boiling points are listed below.\n\n' +
      '| Species | LiH | $\\mathrm{CH_4}$ | $\\mathrm{NH_3}$ | $\\mathrm{H_2O}$ | HF | Ne |\n' +
      '| --- | --- | --- | --- | --- | --- | --- |\n' +
      '| bp (°C) | > 900 | −164 | −33 | 100 | 19 | −246 |\n\n' +
      'a. Explain why LiH has a much higher boiling point than any of the other species in the table.\n\n' +
      'b. Explain why $\\mathrm{NH_3}$ has a higher boiling point than $\\mathrm{CH_4}$.\n\n' +
      'c. Explain why $\\mathrm{H_2O}$ has a higher boiling point than either $\\mathrm{NH_3}$ or HF.\n\n' +
      'd. Explain why $\\mathrm{CH_4}$ has a higher boiling point than Ne.\n\n' +
      'e. The species $\\mathrm{BH_3}$ does not appear on this list because it is not a stable molecule. ' +
      'Draw a clear picture of the three-dimensional structure of the stable boron hydride that has the ' +
      'empirical formula $\\mathrm{BH_3}$, and predict where the boiling point of this boron hydride ' +
      'falls among the six species listed in the table.',
  },
  {
    year: 2021,
    number: 8,
    topic: 'organic',
    difficulty: 'hard',
    image: '2021_q8.png', // structures of benzene, toluene, and anisole (all also named in text)
    problem:
      'Elemental bromine reacts with different hydrocarbons under different conditions.\n\n' +
      'a. Bromine reacts rapidly with cyclohexene, $\\mathrm{C_6H_{10}}$, at room temperature. Draw a ' +
      'structural formula for the major organic product of this reaction, clearly depicting ' +
      'stereochemistry if relevant.\n\n' +
      'b. Bromine does not react with cyclohexane, $\\mathrm{C_6H_{12}}$, at room temperature in the ' +
      'dark, but does react in the presence of light. Draw a structural formula for the major organic ' +
      'product of this reaction, and clearly explain the role of light in the reaction.\n\n' +
      'c. Bromine does not react readily with benzene, $\\mathrm{C_6H_6}$, in the absence of a catalyst, ' +
      'but in the presence of a suitable catalyst it forms bromobenzene, $\\mathrm{C_6H_5Br}$. Give an ' +
      'example of a suitable catalyst and clearly explain its role in the reaction.\n\n' +
      'd. Under the conditions in (c), each of the benzene derivatives shown in the figure (benzene, ' +
      'toluene, and anisole) reacts with bromine. Indicate which compound reacts the fastest and which ' +
      'the slowest, and explain your reasoning.\n\n' +
      'e. In the presence of excess bromine and a catalyst as described in (c), benzene reacts to form a ' +
      'mixture of isomers of dibromobenzene, $\\mathrm{C_6H_4Br_2}$. Draw structural formulas for the ' +
      'three isomers that are formed and indicate which one is formed in the *smallest* quantity.',
  },
];

async function main() {
  if (problems.length === 0) {
    console.log('No Part II problems defined yet. Add entries to `problems` and rerun.');
    return;
  }

  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
  };

  // Idempotent: wipe existing Part II rows before reinserting.
  console.log('Deleting existing USNCO National Part II problems...');
  const delRes = await fetch(
    SUPABASE_URL + '/rest/v1/olympiad_problems?contest=eq.' +
      encodeURIComponent('USNCO National Part II'),
    { method: 'DELETE', headers }
  );
  console.log('Delete USNCO National Part II:', delRes.status);

  const rows = problems.map(p => ({
    contest: 'USNCO National Part II',
    year: p.year,
    number: p.number,
    topic: p.topic,
    difficulty: p.difficulty || 'hard',
    problem: p.problem || '',
    choices: null,
    correct_answer: null, // free-response -> AI graded (chemistry rubric)
    correct_value: null,
    solution: null,
    track: 'chemistry',
    source_link: null,
    image_url: p.image ? '/images/usnco_national/part2/' + p.image : null,
  }));

  console.log(`Inserting ${rows.length} USNCO National Part II problems...`);
  const res = await fetch(
    SUPABASE_URL + '/rest/v1/olympiad_problems',
    { method: 'POST', headers, body: JSON.stringify(rows) }
  );
  if (res.status >= 400) {
    const text = await res.text();
    console.error(`Insert error (${res.status}):`, text);
  } else {
    console.log(`Done! ${rows.length} USNCO National Part II problems inserted.`);
  }
}

main().catch(console.error);
