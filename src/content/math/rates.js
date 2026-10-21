// Unit 2 — Rates of change
// Scope (from the supplied course overview): average and instantaneous rates of change;
// the definition and interpretation of the derivative; calculating derivatives.
// (Linear approximation, extrema, optimization, and graph sketching are also part of
// "rates of change" in the overview. They live in Unit 4, Applications.)

const rates = {
  id: 'rates',
  number: 2,
  title: 'Rates of change',
  blurb: 'From “how much on average” to “how fast right now”: the derivative.',
  scope: [
    'Average and instantaneous rates of change',
    'The definition and interpretation of the derivative',
    'Calculating derivatives',
  ],

  concepts: [
    {
      id: 'rc-average',
      title: 'Average rate of change',
      summary: 'Change in output divided by change in input over an interval: the slope of a secant line.',
      body: [
        'The average rate of change of `f` on `[a, b]` is',
        '$$ (f(b) − f(a)) / (b − a) $$',
        'Graphically, it is the slope of the **secant line** joining `(a, f(a))` and `(b, f(b))`. Verbally, it is “on average, the output changed this much per unit of input.” Its units are output units per input unit.',
      ],
      reps: {
        verbal: 'A road trip covers 150 miles in 3 hours: an average of 50 mph, even if you sped up and slowed down.',
        numerical: 'From a table, subtract two outputs and divide by the difference of the inputs.',
        algebraic: '`(f(b) − f(a))/(b − a)`',
        graphical: 'Slope of the line through two points on the graph.',
      },
      mistakes: ['Dividing by `b` instead of `b − a`.', 'Subtracting in opposite orders on top and bottom, which flips the sign.'],
    },
    {
      id: 'rc-instant',
      title: 'Instantaneous rate',
      summary: 'Shrink the interval. The average rates settle toward one number: the rate at a single instant.',
      body: [
        'A speedometer shows an **instantaneous** rate. To get it from positions alone, compute average rates over smaller and smaller intervals starting at the instant you care about and see what number they approach.',
        'For position `s(t) = t^{2}` (meters, seconds), here are average velocities on `[2, 2 + h]`:',
      ],
      table: { rows: [['h', 1, 0.1, 0.01, 0.001], ['avg velocity on [2, 2+h]', 5, 4.1, 4.01, 4.001]] },
      body2: [
        'The averages approach **4 m/s**, the instantaneous velocity at `t = 2`. Graphically, the secant lines rotate toward the **tangent line** at `t = 2`, whose slope is 4.',
      ],
      plot: {
        x: [0, 3.5], y: [0, 12],
        fns: [{ f: (t) => t * t, color: 'rose' }],
        lines: [
          { x1: 0, y1: 4 - 2 * 5, x2: 3.5, y2: 4 + 1.5 * 5, color: 'butter', dashed: true },
          { x1: 0, y1: -4, x2: 3.5, y2: 4 + 1.5 * 4, color: 'sage' },
        ],
        points: [{ x: 2, y: 4, label: 't = 2' }, { x: 3, y: 9, label: 't = 3', color: 'butter' }],
      },
      plotCaption: 'Dashed: secant on `[2, 3]`, slope 5 (average). Solid: tangent at `t = 2`, slope 4 (instantaneous).',
      mistakes: ['Thinking the instantaneous rate is “change over zero time,” 0/0. It is the value the averages approach as the interval shrinks.'],
    },
    {
      id: 'rc-definition',
      title: 'The derivative',
      summary: 'The derivative is the limit of average rates: the slope of the tangent, the instantaneous rate.',
      body: [
        '$$ f′(a) = lim_{h→0} (f(a + h) − f(a)) / h $$',
        'If this limit exists, `f` is **differentiable** at `a`. Three readings of the same number:',
      ],
      reps: {
        graphical: 'Slope of the tangent line to `y = f(x)` at `x = a`.',
        verbal: 'How fast the output is changing per unit input at the instant `x = a`.',
        numerical: 'Approximately `(f(a + h) − f(a))/h` for small `h`, or a symmetric version from a table.',
        algebraic: 'Compute the limit, or use the differentiation rules.',
      },
      body2: [
        '**Units:** if `f` is in dollars and `x` in years, `f′(a)` is in dollars per year.',
        '**Interpretation:** `f′(a) ≈` the change in `f` when `x` increases by one unit from `a`. This is an estimate, not an exact statement.',
        'Treating `a` as a variable gives the **derivative function** `f′(x)`. Its sign tells you where `f` increases (`f′ > 0`) or decreases (`f′ < 0`).',
      ],
      mistakes: ['Saying `f′(5) = 3` means “`f(5) = 3`.” The derivative is a rate, not a value of `f`.', 'Dropping the units in interpretations.'],
    },
    {
      id: 'rc-rules',
      title: 'Differentiation rules',
      summary: 'A small toolkit that handles almost everything without computing limits each time.',
      body: [
        '**Power:** `d/dx[x^{n}] = n·x^{n−1}` (any real `n`). **Constant multiple and sum:** differentiate term by term.',
        '**Exponentials and logs:** `d/dx[e^{x}] = e^{x}`, `d/dx[b^{x}] = (ln b)·b^{x}`, `d/dx[ln x] = 1/x`.',
        '**Product:** `(fg)′ = f′g + fg′`.  **Quotient:** `(f/g)′ = (f′g − fg′)/g^{2}`.',
        '**Chain:** `d/dx[f(g(x))] = f′(g(x)) · g′(x)`, meaning the outside derivative evaluated at the inside, times the inside derivative.',
        'Rewrite before differentiating: `√x = x^{1/2}`, `5/x = 5x^{−1}`.',
      ],
      mistakes: [
        '`(fg)′ = f′g′`. The product rule has two terms.',
        'Forgetting the inside derivative in the chain rule: `d/dx[e^{3x}] = 3e^{3x}`, not `e^{3x}`.',
        'Using the power rule on `2^{x}`. The variable is in the exponent, so use `(ln 2)·2^{x}`.',
      ],
    },
    {
      id: 'rc-graphs',
      title: 'Reading f′ from a graph',
      summary: 'Where the graph rises, f′ > 0. Where it falls, f′ < 0. At a smooth peak or valley, f′ = 0.',
      body: [
        'You can sketch `f′` from `f` by estimating tangent slopes. Steep uphill means large positive `f′`, flat means `f′ = 0`, and downhill means `f′ < 0`.',
        'Example: `f(x) = (x − 1)^{2}` falls until `x = 1` and then rises. So `f′(x) = 2(x − 1)` is negative for `x < 1`, zero at 1, and positive for `x > 1`.',
      ],
      plot: {
        x: [-1, 3], y: [-4, 4],
        fns: [
          { f: (x) => (x - 1) ** 2, color: 'rose', label: 'f', labelAt: [2.9, 3.6] },
          { f: (x) => 2 * (x - 1), color: 'sage', dashed: true, label: "f′", labelAt: [2.9, 2.6] },
        ],
      },
      plotCaption: 'Where `f` (rose) is decreasing, `f′` (sage, dashed) is below the axis.',
      mistakes: ['Reading the *height* of `f` as its slope. A high point can have zero slope.'],
    },
  ],

  examples: [
    {
      id: 'rc-ex-avg-inst',
      conceptId: 'rc-instant',
      title: 'Average vs. instantaneous velocity',
      problem: 'A ball’s position is `s(t) = t^{2}` meters after `t` seconds. Find the average velocity on `[2, 3]`, then estimate the instantaneous velocity at `t = 2`.',
      steps: [
        { do: 'Average on `[2, 3]`: `(s(3) − s(2))/(3 − 2) = (9 − 4)/1 = 5` m/s.', why: 'Average rate = change in position over change in time.' },
        { do: 'Shorter intervals: on `[2, 2.1]`, `(4.41 − 4)/0.1 = 4.1`; on `[2, 2.01]`, `(4.0401 − 4)/0.01 = 4.01`.', why: 'Shrinking the interval isolates what is happening right at `t = 2`.' },
        { do: 'Algebraically: `(s(2 + h) − s(2))/h = (4 + 4h + h^{2} − 4)/h = 4 + h`.', why: 'Expanding shows exactly how the average depends on `h`.' },
        { do: 'As `h → 0`, `4 + h → 4`. Instantaneous velocity is 4 m/s.', why: 'The derivative is the limit of the averages.' },
      ],
      answer: 'Average on `[2, 3]`: 5 m/s. Instantaneous at `t = 2`: `s′(2) = 4` m/s.',
      mistakes: ['Plugging `h = 0` into `(s(2 + h) − s(2))/h` before simplifying, which gives 0/0. Simplify first.'],
      similar: 'rc-p1',
    },
    {
      id: 'rc-ex-definition',
      conceptId: 'rc-definition',
      title: 'Derivative from the limit definition',
      problem: 'Use the definition to find `f′(x)` for `f(x) = x^{2} + 3x`.',
      steps: [
        { do: '`f(x + h) = (x + h)^{2} + 3(x + h) = x^{2} + 2xh + h^{2} + 3x + 3h`.', why: 'Substitute `x + h` everywhere `x` appears, then expand.' },
        { do: '`f(x + h) − f(x) = 2xh + h^{2} + 3h`.', why: 'The `x^{2}` and `3x` terms cancel. They always should.' },
        { do: 'Divide by `h`: `2x + h + 3` (for `h ≠ 0`).', why: 'Every remaining term has a factor of `h`; cancelling it removes the 0/0 problem.' },
        { do: 'Let `h → 0`: `f′(x) = 2x + 3`.', why: 'Now the expression is continuous in `h`, so we can substitute 0.' },
      ],
      answer: '`f′(x) = 2x + 3`, which matches the power rule: `2x + 3·1`.',
      mistakes: ['Writing `f(x + h) = f(x) + h`. Substitute into the formula instead.', 'Forgetting to distribute: `3(x + h) = 3x + 3h`.'],
      similar: 'rc-p3',
    },
    {
      id: 'rc-ex-rules',
      conceptId: 'rc-rules',
      title: 'Using the rules',
      problem: 'Differentiate (a) `f(x) = 4x^{3} − 5/x + 2√x` and (b) `g(t) = t^{2}e^{3t}`.',
      steps: [
        { do: '(a) Rewrite: `f(x) = 4x^{3} − 5x^{−1} + 2x^{1/2}`.', why: 'The power rule needs everything as `x^{n}`.' },
        { do: '`f′(x) = 12x^{2} + 5x^{−2} + x^{−1/2} = 12x^{2} + 5/x^{2} + 1/√x`.', why: 'Power rule term by term: `−5·(−1)x^{−2} = +5x^{−2}` and `2·(1/2)x^{−1/2} = x^{−1/2}`.' },
        { do: '(b) Product of `t^{2}` and `e^{3t}`: `g′ = (t^{2})′e^{3t} + t^{2}(e^{3t})′`.', why: 'Product rule: derivative of the first times the second, plus the first times the derivative of the second.' },
        { do: '`(e^{3t})′ = 3e^{3t}` by the chain rule, so `g′(t) = 2te^{3t} + 3t^{2}e^{3t} = te^{3t}(2 + 3t)`.', why: 'Inside function `3t` has derivative 3. Factoring makes signs and zeros easy to read.' },
      ],
      answer: '(a) `12x^{2} + 5/x^{2} + 1/√x`;  (b) `te^{3t}(2 + 3t)`.',
      mistakes: ['Getting `−5x^{−2}` in (a). The two negatives multiply to a positive.', 'Writing `(t^{2}e^{3t})′ = 2t · 3e^{3t}`, which is not the product rule.'],
      similar: 'rc-p6',
    },
    {
      id: 'rc-ex-interpret',
      conceptId: 'rc-definition',
      title: 'Interpreting a derivative in context',
      problem: '`T(m)` is the temperature (°F) of a cup of coffee `m` minutes after it is poured. Interpret `T(10) = 160` and `T′(10) = −1.8`, and estimate `T(11)`.',
      steps: [
        { do: '`T(10) = 160`: ten minutes after pouring, the coffee is 160 °F.', why: 'A function value is an amount of the output.' },
        { do: '`T′(10) = −1.8`: at the 10-minute mark, the temperature is falling at about 1.8 °F per minute.', why: 'The derivative is a rate with units of output per input. The negative sign means decreasing.' },
        { do: '`T(11) ≈ T(10) + T′(10)·1 = 160 − 1.8 = 158.2` °F.', why: 'Over a short step, the rate is roughly constant. (This is linear approximation, Unit 4.)' },
      ],
      answer: 'About 158.2 °F after 11 minutes. This is an estimate, because the cooling rate itself changes over time.',
      mistakes: ['Saying “the temperature is −1.8 degrees.”', 'Stating the estimate as exact.'],
      similar: 'rc-p5',
    },
  ],

  practice: [
    {
      id: 'rc-p1', level: 'intro', type: 'numeric',
      prompt: 'Find the average rate of change of `f(x) = x^{3}` on `[1, 3]`.',
      answer: 13, tolerance: 1e-9, display: '13',
      traps: [{ value: 26, why: 'You found the change in f (27 − 1). Now divide by the change in x, which is 2.' }, { value: 27, why: 'Use both endpoints: (f(3) − f(1))/(3 − 1).' }],
      hints: ['Average rate = (f(b) − f(a))/(b − a).', '`f(3) = 27`, `f(1) = 1`.'],
      solution: [{ do: '`(27 − 1)/(3 − 1) = 26/2 = 13`.', why: 'Slope of the secant line through (1, 1) and (3, 27).' }],
    },
    {
      id: 'rc-p2', level: 'intro', type: 'mc',
      prompt: 'Which expression gives the **instantaneous** rate of change of `f` at `x = a`?',
      choices: [
        { text: '`lim_{h→0} (f(a + h) − f(a))/h`', correct: true, why: 'The limit of average rates over shrinking intervals is the derivative `f′(a)`. ✓' },
        { text: '`(f(b) − f(a))/(b − a)`', why: 'That is the average rate over `[a, b]`.' },
        { text: '`f(a)/a`', why: 'This is the slope from the origin to the point, which is not a rate of change of f.' },
        { text: '`f(a + h) − f(a)`', why: 'This is a change in output only. You still need to divide by `h` and take a limit.' },
      ],
      hints: ['Instantaneous means the interval shrinks to zero length.', 'Which choice is a limit of average rates?'],
      solution: [{ do: 'The derivative definition is the limit of `(f(a + h) − f(a))/h` as `h → 0`.', why: 'It turns secant slopes into the tangent slope.' }],
    },
    {
      id: 'rc-p3', level: 'core', type: 'numeric',
      prompt: 'If `f(x) = 3x^{4} − 2x + 7`, find `f′(1)`.',
      answer: 10, tolerance: 1e-9, display: '10',
      traps: [{ value: 8, why: 'That is f(1) = 3 − 2 + 7. Differentiate first, then substitute.' }, { value: 17, why: 'The derivative of the constant 7 is 0.' }],
      hints: ['Differentiate term by term with the power rule.', '`f′(x) = 12x^{3} − 2`.'],
      solution: [
        { do: '`f′(x) = 12x^{3} − 2`.', why: 'Power rule; constants differentiate to 0.' },
        { do: '`f′(1) = 12 − 2 = 10`.', why: 'Substitute after differentiating.' },
      ],
    },
    {
      id: 'rc-p4', level: 'core', type: 'numeric',
      prompt: 'Let `g(x) = ln(x^{2} + 1)`. Find `g′(1)`.',
      answer: 1, tolerance: 1e-9, display: '1',
      traps: [{ value: 0.5, why: 'Chain rule: multiply 1/(x² + 1) by the inside derivative 2x.' }],
      hints: ['Outside function: `ln u`, with derivative `1/u`. Inside: `u = x^{2} + 1`.', '`g′(x) = (1/(x^{2} + 1)) · 2x`.'],
      solution: [
        { do: '`g′(x) = 2x/(x^{2} + 1)`.', why: 'Chain rule: outside derivative at the inside, times the inside derivative.' },
        { do: '`g′(1) = 2/2 = 1`.', why: 'Substitute x = 1.' },
      ],
    },
    {
      id: 'rc-p5', level: 'core', type: 'mc',
      prompt: '`P(t)` is a bacteria population (thousands) after `t` hours, and `P′(4) = 2.5`. What does this mean?',
      choices: [
        { text: 'At 4 hours, the population is growing at about 2.5 thousand bacteria per hour.', correct: true, why: 'A derivative is an instantaneous rate, in output units per input unit. ✓' },
        { text: 'After 4 hours there are 2.5 thousand bacteria.', why: 'That would be P(4) = 2.5, a value rather than a rate.' },
        { text: 'The population increased by 2.5 thousand during the first 4 hours.', why: 'That describes total change, P(4) − P(0).' },
        { text: 'It takes 2.5 hours for the population to grow by 4 thousand.', why: 'This swaps the roles of input and output.' },
      ],
      hints: ['Is `P′(4)` an amount or a rate?', 'Units of `P′` are (units of P) per (units of t).'],
      solution: [{ do: '`P′(4) = 2.5` thousand bacteria per hour at the instant t = 4.', why: 'Derivative = instantaneous rate of change.' }],
    },
    {
      id: 'rc-p6', level: 'challenge', type: 'numeric',
      prompt: 'Let `h(x) = x^{2}/(x + 1)`. Find `h′(1)`. (Fraction or decimal is fine.)',
      answer: 0.75, tolerance: 1e-6, display: '3/4',
      traps: [{ value: 2, why: 'You can’t differentiate top and bottom separately (2x/1). Use the quotient rule.' }, { value: -0.25, why: 'Check the order in the numerator: f′g − fg′, i.e. 2x(x + 1) − x²·1.' }],
      hints: ['Quotient rule: `(f′g − fg′)/g^{2}` with `f = x^{2}`, `g = x + 1`.', 'Numerator: `2x(x + 1) − x^{2} = x^{2} + 2x`.', 'At `x = 1`: `(1 + 2)/(2)^{2}`.'],
      solution: [
        { do: '`h′(x) = (2x(x + 1) − x^{2}·1)/(x + 1)^{2} = (x^{2} + 2x)/(x + 1)^{2}`.', why: 'Quotient rule, then simplify the numerator.' },
        { do: '`h′(1) = 3/4`.', why: 'Substitute x = 1: numerator 3, denominator 4.' },
      ],
    },
    {
      id: 'rc-p7', level: 'challenge', type: 'numeric',
      prompt: 'Let `f(x) = 5 · 2^{x}`. Find `f′(0)`. Give an exact answer (like `5ln2`) or round to three decimals.',
      answer: 5 * Math.LN2, tolerance: 0.0006, display: '`5 ln 2 ≈ 3.466`', rounding: 'three decimal places',
      traps: [{ value: 0, why: 'f(0) = 5. The function isn’t flat at 0; exponentials are always changing.' }, { value: 5, why: '`d/dx[2^{x}]` is `(ln 2)2^{x}`, not `2^{x}`. Only base e is its own derivative.' }],
      hints: ['`d/dx[b^{x}] = (ln b) · b^{x}`.', '`f′(x) = 5 (ln 2) 2^{x}`, and `2^{0} = 1`.'],
      solution: [
        { do: '`f′(x) = 5 · ln 2 · 2^{x}`.', why: 'Exponential rule with base 2; constant multiple stays.' },
        { do: '`f′(0) = 5 ln 2 ≈ 3.466`.', why: '`2^{0} = 1`.' },
      ],
    },
    {
      id: 'rc-p8', level: 'core', type: 'numeric',
      prompt: 'A tank’s volume `V` (liters) is measured every 2 minutes. Estimate `V′(4)` using the symmetric difference quotient (the interval centered at 4).',
      table: { rows: [['t (min)', 0, 2, 4, 6], ['V (L)', 10, 14, 20, 28]] },
      answer: 3.5, tolerance: 1e-9, display: '3.5 L/min',
      traps: [{ value: 3, why: 'That uses only [2, 4] (a backward difference). The symmetric estimate uses [2, 6].' }, { value: 4, why: 'That uses only [4, 6] (a forward difference). Centered: (V(6) − V(2))/(6 − 2).' }],
      hints: ['Use the points on either side of t = 4: t = 2 and t = 6.', '`(V(6) − V(2))/(6 − 2)`.'],
      solution: [{ do: '`(28 − 14)/(6 − 2) = 14/4 = 3.5` L/min.', why: 'Averaging over an interval centered at t = 4 usually estimates the instantaneous rate better than a one-sided interval.' }],
    },
    {
      id: 'rc-p9', level: 'intro', type: 'mc',
      prompt: 'The graph shows `f(x) = (x − 1)^{2} + 1`. On which interval is `f′(x)` negative?',
      plot: { x: [-1, 3], y: [0, 5], fns: [{ f: (x) => (x - 1) ** 2 + 1, color: 'rose' }], points: [{ x: 1, y: 1, label: '(1, 1)' }] },
      choices: [
        { text: '`x < 1`', correct: true, why: 'The graph falls to the left of the vertex, so tangent slopes are negative there. ✓' },
        { text: '`x > 1`', why: 'The graph rises there, so `f′ > 0`.' },
        { text: 'Everywhere, because `f(x) > 0`', why: 'The *height* is positive everywhere; the *slope* is not.' },
        { text: 'Nowhere', why: 'The graph clearly decreases on part of the window.' },
      ],
      hints: ['f′ is negative where the graph is going downhill (left to right).'],
      solution: [{ do: '`f′(x) = 2(x − 1) < 0` exactly when `x < 1`.', why: 'Matches the graph falling until the vertex.' }],
    },
  ],

  check: [
    {
      id: 'rc-c1', level: 'intro', type: 'mc',
      prompt: 'The average rate of change of `f` on `[a, b]` is the slope of…',
      choices: [
        { text: 'the secant line through `(a, f(a))` and `(b, f(b))`', correct: true, why: 'Two points on the graph determine the secant.' },
        { text: 'the tangent line at `a`', why: 'That slope is the instantaneous rate `f′(a)`.' },
        { text: 'the line from the origin to `(b, f(b))`', why: 'The origin isn’t involved.' },
        { text: 'the x-axis', why: 'The slope of the x-axis is always 0.' },
      ],
      hints: [], solution: [],
    },
    {
      id: 'rc-c2', level: 'intro', type: 'numeric',
      prompt: 'If `f(x) = e^{2x}`, what is `f′(0)`?',
      answer: 2, tolerance: 1e-9, display: '2',
      traps: [{ value: 1, why: 'Chain rule: the inside 2x contributes a factor of 2.' }],
      hints: [], solution: [{ do: '`f′(x) = 2e^{2x}`, so `f′(0) = 2`.', why: 'Chain rule with inside derivative 2.' }],
    },
    {
      id: 'rc-c3', level: 'intro', type: 'mc',
      prompt: '`C(q)` is the cost (dollars) of producing `q` items. What are the units of `C′(q)`?',
      choices: [
        { text: 'dollars per item', correct: true, why: 'Output units per input unit.' },
        { text: 'dollars', why: 'That is the unit of C itself.' },
        { text: 'items per dollar', why: 'Upside down.' },
        { text: 'items', why: 'That is the unit of q.' },
      ],
      hints: [], solution: [],
    },
  ],
}

export default rates
