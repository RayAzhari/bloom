// Unit 1 — Functions
// Scope (from the supplied course overview): representing functions graphically,
// algebraically, numerically, and verbally; linear, exponential, logarithmic, and
// polynomial functions; modeling with functions and interpreting models.
//
// Content conventions (shared by all units):
//   `...` renders as math; ^{...} superscript, _{...} subscript; "$$ ... $$" is a display line.
//   Questions: { id, level: intro|core|challenge, type: mc|numeric, prompt, hints[], solution[{do, why}] }
//     mc:      choices[{ text, correct?, why }]
//     numeric: answer (number), tolerance, display (exact answer text), rounding (note), traps[{ value, why }]

const functions = {
  id: 'functions',
  number: 1,
  title: 'Functions',
  blurb: 'Four ways to describe a relationship, and the families that model the world.',
  scope: [
    'Representing functions graphically, algebraically, numerically, and verbally',
    'Linear, exponential, logarithmic, and polynomial functions',
    'Modeling with functions and interpreting models',
  ],

  concepts: [
    {
      id: 'fn-representations',
      title: 'Four representations',
      summary: 'A function is a rule that gives exactly one output for each input. The same rule can be shown four ways.',
      body: [
        'A **function** assigns to each input exactly one output. We write `y = f(x)`: `x` is the input (independent variable), `f(x)` is the output (dependent variable).',
        'The skill this unit keeps coming back to is **translation**: reading the same relationship from a formula, a table, a graph, or a sentence, and moving between them. Each view makes different questions easy.',
      ],
      reps: {
        verbal: 'A tutoring service charges a $15 booking fee plus $40 per hour.',
        algebraic: '`C(h) = 15 + 40h`, where `h` is hours and `C` is cost in dollars.',
        numerical: 'h = 0, 1, 2, 3 gives C = 15, 55, 95, 135. Each extra hour adds 40.',
        graphical: 'A straight line crossing the vertical axis at 15 and rising 40 for every 1 unit to the right.',
      },
      plot: {
        x: [0, 4], y: [0, 180],
        fns: [{ f: (h) => 15 + 40 * h, color: 'rose' }],
        points: [{ x: 0, y: 15, label: '(0, 15)' }, { x: 2, y: 95, label: '(2, 95)' }],
        xLabel: 'hours h', yLabel: 'cost C',
      },
      plotCaption: '`C(h) = 15 + 40h` — same relationship as the sentence, formula, and table.',
      mistakes: [
        'Mixing up input and output: `C(2)` means “cost of 2 hours,” not “hours that cost $2.”',
        'Forgetting units. A slope of 40 is “40 dollars per hour,” and the units are part of the meaning.',
      ],
    },
    {
      id: 'fn-linear',
      title: 'Linear functions',
      summary: 'Equal steps in input give equal **differences** in output.',
      body: [
        'A linear function has the form `f(x) = b + mx`. The **slope** `m` is the constant rate of change and the **intercept** `b` is the output when `x = 0`.',
        '$$ m = Δy / Δx = (y_{2} − y_{1}) / (x_{2} − x_{1}) $$',
        'In a table with evenly spaced inputs, a function is linear exactly when the output **differences** are all the same.',
      ],
      table: { rows: [['x', 0, 1, 2, 3], ['f(x)', 5, 8, 11, 14], ['difference', '—', '+3', '+3', '+3']] },
      mistakes: [
        'Computing slope as Δx / Δy (upside down).',
        'Checking only the first difference. All consecutive differences must match, and the input steps must be equal.',
      ],
    },
    {
      id: 'fn-exponential',
      title: 'Exponential functions',
      summary: 'Equal steps in input give equal **ratios** in output, which means a constant percent change.',
      body: [
        'An exponential function has the form `f(x) = a · b^{x}` with `a ≠ 0`, `b > 0`, `b ≠ 1`. Here `a` is the initial value and `b` is the **growth factor**.',
        'If a quantity changes by a rate `r` per step (as a decimal), then `b = 1 + r`. Growth by 4% gives `b = 1.04`; decay by 15% gives `b = 0.85`.',
        'In a table with evenly spaced inputs, a function is exponential exactly when the output **ratios** are all the same.',
      ],
      table: { rows: [['x', 0, 1, 2, 3], ['g(x)', 200, 240, 288, 345.6], ['ratio', '—', '×1.2', '×1.2', '×1.2']] },
      plot: {
        x: [0, 6], y: [0, 40],
        fns: [
          { f: (x) => 2 + 5 * x, color: 'sage', label: 'linear', labelAt: [6, 32] },
          { f: (x) => 2 * Math.pow(1.6, x), color: 'rose', label: 'exponential', labelAt: [5.3, 38] },
        ],
      },
      plotCaption: 'Linear adds the same amount each step; exponential multiplies by the same factor. Eventually exponential wins.',
      mistakes: [
        'Writing 15% decay as `b = 0.15`. The factor is what remains: `b = 1 − 0.15 = 0.85`.',
        'Treating “increases by 3 each year” as exponential. A constant *amount* is linear; a constant *percent* is exponential.',
      ],
    },
    {
      id: 'fn-log',
      title: 'Logarithms',
      summary: 'Logarithms undo exponentials. They answer “what exponent gives this value?”',
      body: [
        '`log_{b}(y) = x` means exactly `b^{x} = y`. The natural log `ln` uses base `e ≈ 2.71828`, and `log` with no base means base 10.',
        'Key rules (for positive inputs): `ln(AB) = ln A + ln B`, `ln(A/B) = ln A − ln B`, and `ln(A^{k}) = k · ln A`. The last rule is the one that lets you solve for an exponent.',
        'To solve `a · b^{t} = c`: divide by `a`, take `ln` of both sides, bring `t` down, divide.',
        '$$ t = ln(c / a) / ln(b) $$',
        'Graphically, `y = ln x` is the reflection of `y = e^{x}` across the line `y = x`. It is defined only for `x > 0`, passes through `(1, 0)`, and grows without bound, but very slowly.',
      ],
      plot: {
        x: [-3, 5], y: [-3, 5],
        fns: [
          { f: (x) => Math.exp(x), color: 'rose', label: 'eˣ', labelAt: [1.9, 4.8] },
          { f: (x) => Math.log(x), color: 'sage', domain: [0.02, 5], label: 'ln x', labelAt: [5, 1.0] },
          { f: (x) => x, color: 'ink', dashed: true },
        ],
      },
      plotCaption: '`e^{x}` and `ln x` are inverses: mirror images across `y = x` (dashed).',
      mistakes: [
        '`ln(A + B)` is **not** `ln A + ln B`. The sum rule is for products.',
        'Taking the log before isolating the exponential term. Divide by the coefficient first.',
      ],
    },
    {
      id: 'fn-polynomial',
      title: 'Polynomials',
      summary: 'Degree and leading coefficient control end behavior; factors reveal the zeros.',
      body: [
        'A polynomial is a sum of terms `a_{k}x^{k}` with whole-number powers. Its **degree** is the highest power, and the **leading term** is the term with that power.',
        'For large `|x|`, the leading term dominates, so it alone decides the **end behavior**. Even degree means both ends go the same way. Odd degree means they go opposite ways. A negative leading coefficient flips the picture.',
        'In factored form, each factor `(x − r)` gives a **zero** at `x = r`.',
      ],
      plot: {
        x: [-4, 3.5], y: [-12, 14],
        fns: [{ f: (x) => -x * (x - 2) * (x + 3), color: 'rose' }],
        points: [{ x: -3, y: 0, label: '−3' }, { x: 0, y: 0, label: '0' }, { x: 2, y: 0, label: '2' }],
      },
      plotCaption: '`f(x) = −x(x − 2)(x + 3)`: zeros at −3, 0, 2; leading term `−x^{3}`, so it rises on the left and falls on the right.',
      mistakes: [
        'Reading the zero of `(x + 3)` as `+3`. It is `x = −3`.',
        'Using the first written term instead of the highest-degree term for end behavior.',
      ],
    },
    {
      id: 'fn-modeling',
      title: 'Modeling & interpreting',
      summary: 'Every parameter in a model should mean something, with units.',
      body: [
        'To build a model from a description: identify the input and output (with units), decide whether change is a constant **amount** (linear) or a constant **percent** (exponential), then use the starting value and the rate.',
        'To interpret a model, translate each number back into words. In `P(t) = 1500(1.04)^{t}`, 1500 is the population at `t = 0`, and 1.04 means the population grows 4% per year.',
        'Always ask whether the answer is reasonable. Check that the units work, the sign makes sense, and the input stays within the domain where the model is believable.',
      ],
      mistakes: [
        'Reporting a number without units or context.',
        'Extrapolating a model far outside the data it was built from.',
      ],
    },
  ],

  examples: [
    {
      id: 'fn-ex-table',
      conceptId: 'fn-exponential',
      title: 'Table → formula: linear or exponential?',
      problem: 'Find a formula for each table.',
      table: { rows: [['x', 0, 1, 2, 3], ['f(x)', 5, 8, 11, 14], ['g(x)', 200, 240, 288, 345.6]] },
      steps: [
        { do: 'For `f`: differences are 8 − 5 = 3, 11 − 8 = 3, 14 − 11 = 3. They are constant.', why: 'Equally spaced inputs with constant differences means a constant rate of change, so `f` is linear.' },
        { do: 'Slope `m = 3`, intercept `f(0) = 5`, so `f(x) = 5 + 3x`.', why: 'In `b + mx`, `b` is the value at `x = 0` and `m` is the change per unit step.' },
        { do: 'For `g`: differences are 40, 48, 57.6, which are not constant. Ratios: 240/200 = 1.2, 288/240 = 1.2, 345.6/288 = 1.2.', why: 'Constant ratios mean each step multiplies by the same factor, so `g` is exponential.' },
        { do: 'Initial value `g(0) = 200`, factor `b = 1.2`, so `g(x) = 200(1.2)^{x}`.', why: 'In `a · b^{x}`, `a` is the value at `x = 0` and `b` is the step-to-step ratio.' },
        { do: 'Check: `g(3) = 200 · 1.728 = 345.6` ✓.', why: 'Plugging a table value back in catches arithmetic slips.' },
      ],
      answer: '`f(x) = 5 + 3x` (linear, +3 per step); `g(x) = 200(1.2)^{x}` (exponential, 20% growth per step).',
      mistakes: ['Deciding “exponential” because the numbers get big fast. Check the ratios, not the vibe.'],
      similar: 'fn-p1',
    },
    {
      id: 'fn-ex-doubling',
      conceptId: 'fn-log',
      title: 'Solving for time with logarithms',
      problem: 'A town’s population is modeled by `P(t) = 1500(1.04)^{t}`, with `t` in years. When does it reach 3000? Round to two decimal places.',
      steps: [
        { do: 'Set up: `1500(1.04)^{t} = 3000`.', why: 'We want the input `t` that gives output 3000.' },
        { do: 'Divide by 1500: `(1.04)^{t} = 2`.', why: 'Isolate the exponential before taking logs. The coefficient is not part of the power.' },
        { do: 'Take ln of both sides: `ln(1.04^{t}) = ln 2`, so `t · ln(1.04) = ln 2`.', why: 'The rule `ln(A^{k}) = k ln A` brings the unknown exponent down.' },
        { do: '`t = ln 2 / ln 1.04 ≈ 0.693147 / 0.039221 ≈ 17.67` years.', why: 'Divide to isolate `t`. Keep full precision until the final rounding.' },
      ],
      answer: 'About 17.67 years. (Exact: `t = ln 2 / ln 1.04`.) This is the doubling time, and it does not depend on the starting 1500.',
      mistakes: ['Dividing 3000 by 1.04 or taking `ln(1500 · 1.04)`. Isolate the power first.', 'Writing `ln 2 / ln 1.04` as `ln(2/1.04)`. A quotient of logs is not the log of a quotient.'],
      similar: 'fn-p4',
    },
    {
      id: 'fn-ex-verbal',
      conceptId: 'fn-modeling',
      title: 'Words → model → interpretation',
      problem: 'A medication’s concentration starts at 80 mg/L and falls by 15% each hour. Write a model and find the concentration after 3 hours. Round to two decimal places.',
      steps: [
        { do: 'Input `t` = hours since dose; output `C` = concentration in mg/L.', why: 'Naming variables with units keeps the interpretation honest.' },
        { do: '“Falls by 15% each hour” is a constant percent change, so the model is exponential with `b = 1 − 0.15 = 0.85`.', why: 'Each hour, 85% of the previous amount remains.' },
        { do: '`C(t) = 80(0.85)^{t}`.', why: 'The initial value is 80 at `t = 0`.' },
        { do: '`C(3) = 80 · 0.85^{3} = 80 · 0.614125 = 49.13` mg/L.', why: '`0.85^{3} = 0.614125` exactly; multiply, then round.' },
      ],
      answer: '`C(t) = 80(0.85)^{t}`; after 3 hours, about 49.13 mg/L.',
      mistakes: ['Using `80 − 0.15 · 3 · 80` (linear thinking): that gives 44, which is wrong because each 15% is taken from a shrinking amount.'],
      similar: 'fn-p6',
    },
    {
      id: 'fn-ex-poly',
      conceptId: 'fn-polynomial',
      title: 'Sketching a polynomial from its factors',
      problem: 'Describe the zeros and end behavior of `f(x) = −x(x − 2)(x + 3)`.',
      steps: [
        { do: 'Zeros: set each factor to zero, giving `x = 0`, `x = 2`, `x = −3`.', why: 'A product is zero exactly when one of its factors is zero.' },
        { do: 'Leading term: multiply the highest powers, `−x · x · x = −x^{3}`.', why: 'For large `|x|` the leading term dominates every other term.' },
        { do: 'Odd degree, negative coefficient: as `x → ∞`, `f(x) → −∞`; as `x → −∞`, `f(x) → ∞`.', why: '`−x^{3}` is very negative for large positive `x` and very positive for large negative `x`.' },
        { do: 'Test a point between zeros, for example `f(1) = −1(−1)(4) = 4 > 0`, so the graph is above the axis on `(0, 2)`.', why: 'The sign is constant between consecutive zeros (for single factors), so one test per interval is enough.' },
      ],
      answer: 'Zeros at −3, 0, 2. Rises to the left, falls to the right. Positive on `(0, 2)`.',
      mistakes: ['Saying the zero from `(x + 3)` is 3.'],
      similar: 'fn-p8',
    },
  ],

  practice: [
    {
      id: 'fn-p1', level: 'intro', type: 'mc',
      prompt: 'Which formula matches this table?',
      table: { rows: [['x', 0, 1, 2, 3], ['y', 4, 12, 36, 108]] },
      choices: [
        { text: '`y = 4 · 3^{x}`', correct: true, why: 'Ratios are 12/4 = 36/12 = 108/36 = 3 and the starting value is 4. ✓' },
        { text: '`y = 4 + 8x`', why: 'This matches the first step (+8) but the next difference is +24, so the table is not linear.' },
        { text: '`y = 3 · 4^{x}`', why: 'This gives y = 3 at x = 0, but the table starts at 4. The initial value and factor are swapped.' },
        { text: '`y = 4x^{3}`', why: 'This gives y = 0 at x = 0. A power function is not the same as an exponential.' },
      ],
      hints: ['Compute the differences. Are they constant?', 'Now compute the ratios 12/4, 36/12, 108/36.', 'An exponential is `a · b^{x}`, with `a` = value at 0 and `b` = the ratio.'],
      solution: [
        { do: 'Differences 8, 24, 72 are not constant, so the function is not linear.', why: 'Linear needs equal differences.' },
        { do: 'Ratios are all 3, so the function is exponential with `b = 3`.', why: 'Equal ratios mean a constant multiplier.' },
        { do: '`a = y(0) = 4`, giving `y = 4 · 3^{x}`.', why: 'Value at `x = 0` is the coefficient.' },
      ],
    },
    {
      id: 'fn-p2', level: 'intro', type: 'numeric',
      prompt: 'A line passes through `(2, 7)` and `(6, 19)`. What is its slope?',
      answer: 3, tolerance: 1e-9, display: '3',
      traps: [{ value: 1 / 3, why: 'That is Δx/Δy. Slope is rise over run: Δy/Δx.' }, { value: -3, why: 'Check signs: both coordinates increase, so the slope is positive.' }],
      hints: ['Slope = (change in y) / (change in x).', 'Δy = 19 − 7 and Δx = 6 − 2.'],
      solution: [{ do: '`m = (19 − 7)/(6 − 2) = 12/4 = 3`.', why: 'Rate of change of y per unit of x.' }],
    },
    {
      id: 'fn-p3', level: 'core', type: 'numeric',
      prompt: 'A car’s value (dollars) is `V(t) = 24000(0.88)^{t}`, `t` in years. By what percent does the value drop each year? Enter a number (e.g. 5 for 5%).',
      answer: 12, tolerance: 1e-9, display: '12%',
      traps: [{ value: 88, why: '0.88 is the fraction that *remains* each year. The drop is 1 − 0.88.' }, { value: 0.12, why: 'Right idea! The question asks for a percent, so 0.12 → 12.' }],
      hints: ['The growth factor is `b = 1 + r`.', 'Here `b = 0.88`, so `r = 0.88 − 1`.'],
      solution: [
        { do: '`b = 0.88 = 1 + r`, so `r = −0.12`.', why: 'The growth factor is one plus the rate.' },
        { do: 'Negative rate means decay of 12% per year.', why: 'The value keeps 88% each year and loses 12%.' },
      ],
    },
    {
      id: 'fn-p4', level: 'core', type: 'numeric',
      prompt: 'Solve for `t`: `5 · 2^{t} = 40`.',
      answer: 3, tolerance: 1e-9, display: '3',
      traps: [{ value: 4, why: '40/5 = 8 and 2⁴ = 16, not 8. Check: 2³ = 8.' }, { value: Math.log(40) / Math.log(2), why: 'That solves 2^t = 40. Divide both sides by 5 before taking logs.' }],
      hints: ['First isolate the power of 2: divide both sides by 5.', 'Which power of 2 equals 8? (Or use `t = ln 8 / ln 2`.)'],
      solution: [
        { do: '`2^{t} = 8`.', why: 'Divide by the coefficient 5 first.' },
        { do: '`t = ln 8 / ln 2 = 3`.', why: 'Since `8 = 2^{3}`, the exponent is 3 exactly.' },
      ],
    },
    {
      id: 'fn-p5', level: 'core', type: 'mc',
      prompt: 'The cost (dollars) to print `n` T-shirts is `C(n) = 350 + 12n`. What does the 12 mean?',
      choices: [
        { text: 'Each additional shirt adds $12 to the cost.', correct: true, why: '12 is the slope: dollars per shirt. ✓' },
        { text: 'There is a $12 setup fee.', why: 'The fixed cost (when n = 0) is 350, not 12.' },
        { text: 'Printing 12 shirts costs $350.', why: 'That mixes the two parameters. C(12) = 350 + 144 = 494.' },
        { text: 'The cost grows by 12% per shirt.', why: 'A percent change would be exponential. Here the change is a constant $12.' },
      ],
      hints: ['Which number is the value at `n = 0`?', 'The other number is the rate of change. What are its units?'],
      solution: [{ do: '`C(n) = 350 + 12n` is linear with slope 12 dollars per shirt.', why: 'Slope = change in cost per one more shirt.' }],
    },
    {
      id: 'fn-p6', level: 'challenge', type: 'numeric',
      prompt: 'A substance has a half-life of 8 days. You start with 50 mg. How much remains after 20 days? Round to two decimal places.',
      answer: 50 * Math.pow(0.5, 20 / 8), tolerance: 0.006, display: '`50(1/2)^{20/8} ≈ 8.84` mg', rounding: 'two decimal places',
      traps: [{ value: 12.5, why: 'That is after 16 days (two half-lives). 20 days is 2.5 half-lives.' }, { value: 0, why: 'Exponential decay never reaches exactly zero.' }],
      hints: ['How many half-lives fit into 20 days?', 'Amount = initial × (1/2)^(number of half-lives).', '20/8 = 2.5, so compute `50 · 0.5^{2.5}`.'],
      solution: [
        { do: 'Model: `A(t) = 50(1/2)^{t/8}`.', why: 'Every 8 days the exponent increases by 1, so the amount halves.' },
        { do: '`A(20) = 50 · (0.5)^{2.5} ≈ 50 · 0.17678 ≈ 8.84` mg.', why: '`0.5^{2.5} = 1/(4√2)`. Round only at the end.' },
      ],
    },
    {
      id: 'fn-p7', level: 'challenge', type: 'mc',
      prompt: 'Which formula could produce this graph? (Horizontal asymptote `y = 0`.)',
      plot: { x: [-1, 5], y: [0, 7], fns: [{ f: (x) => 3 * Math.pow(0.5, x), color: 'rose' }], points: [{ x: 0, y: 3, label: '(0, 3)' }, { x: 1, y: 1.5, label: '(1, 1.5)' }] },
      choices: [
        { text: '`y = 3(0.5)^{x}`', correct: true, why: 'y(0) = 3, y(1) = 1.5, decreasing toward 0. ✓' },
        { text: '`y = 3 · 2^{x}`', why: 'This has the right intercept but increases (factor 2 > 1).' },
        { text: '`y = 3 − 1.5x`', why: 'This matches both points, but a line keeps falling and crosses y = 0 at x = 2. The graph levels off.' },
        { text: '`y = 0.5 · 3^{x}`', why: 'This gives y(0) = 0.5 and increases.' },
      ],
      hints: ['Read the y-intercept to get `a`.', 'From x = 0 to x = 1, by what factor does y change?', 'A line through the two points would cross the x-axis. Does the graph?'],
      solution: [
        { do: 'Intercept 3, so `a = 3`.', why: 'The value at `x = 0` is `a`.' },
        { do: '1.5/3 = 0.5, so `b = 0.5`.', why: 'Equal-step ratio is the growth factor; `b < 1` means decay.' },
        { do: 'The asymptote `y = 0` rules out the linear choice.', why: 'Exponentials approach but never reach 0; lines cross it.' },
      ],
    },
    {
      id: 'fn-p8', level: 'core', type: 'mc',
      prompt: 'For `f(x) = −3x^{4} + x^{3} + 10`, what happens as `x → −∞`?',
      choices: [
        { text: '`f(x) → −∞`', correct: true, why: 'The leading term `−3x^{4}` has even degree and a negative coefficient, so both ends go down. ✓' },
        { text: '`f(x) → ∞`', why: '`x^{4}` is positive for negative x, but it is multiplied by −3.' },
        { text: '`f(x) → 10`', why: '10 is the y-intercept and has no effect on end behavior.' },
        { text: '`f(x) → 0`', why: 'Polynomials of degree ≥ 1 are unbounded as `|x| → ∞`.' },
      ],
      hints: ['Only the leading term matters for end behavior.', 'What is the sign of `−3x^{4}` when x is a large negative number?'],
      solution: [{ do: 'Leading term `−3x^{4}`: `x^{4} > 0` for all `x ≠ 0`, so `−3x^{4} → −∞`.', why: 'The highest power dominates for large `|x|`.' }],
    },
  ],

  check: [
    {
      id: 'fn-c1', level: 'intro', type: 'mc',
      prompt: 'A quantity increases by the same **percent** each year. Which family models it?',
      choices: [
        { text: 'Exponential', correct: true, why: 'A constant percent change means a constant growth factor.' },
        { text: 'Linear', why: 'Linear means a constant *amount* of change.' },
        { text: 'Logarithmic', why: 'Logs grow more and more slowly. They undo exponentials.' },
        { text: 'Quadratic polynomial', why: 'A quadratic has a constant *second difference*, not a constant ratio.' },
      ],
      hints: [], solution: [],
    },
    {
      id: 'fn-c2', level: 'intro', type: 'mc',
      prompt: 'Which expression equals `ln(x^{5})` for `x > 0`?',
      choices: [
        { text: '`5 ln x`', correct: true, why: 'The power rule for logs: `ln(A^{k}) = k ln A`.' },
        { text: '`(ln x)^{5}`', why: 'That raises the log to a power, which is different.' },
        { text: '`ln 5 + ln x`', why: 'That would be `ln(5x)`.' },
        { text: '`ln x / 5`', why: 'The exponent multiplies; it doesn’t divide.' },
      ],
      hints: [], solution: [],
    },
    {
      id: 'fn-c3', level: 'intro', type: 'numeric',
      prompt: 'If `f(x) = 2x^{2} − 3`, what is `f(−2)`?',
      answer: 5, tolerance: 1e-9, display: '5',
      traps: [{ value: -11, why: 'Square first: (−2)² = +4, so 2·4 − 3 = 5.' }, { value: 13, why: '2·(−2)² = 8, then subtract 3.' }],
      hints: [], solution: [{ do: '`2(−2)^{2} − 3 = 2(4) − 3 = 5`.', why: 'Squaring a negative gives a positive.' }],
    },
  ],
}

export default functions
