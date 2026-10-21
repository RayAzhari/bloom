// "Help me understand" lessons for Math MA.
// Fixed six-step sequence: explain → example → step-by-step reasoning → hint →
// your attempt → solution & mistakes. These are prepared lessons, not AI-generated.
// To add one, append an object with the same shape.

export const mathLessons = [
  {
    id: 'ml-growth',
    unitId: 'functions',
    title: 'Linear vs. exponential growth',
    explain: [
      'Linear change adds the **same amount** each step. Exponential change multiplies by the **same factor** each step, which is the same as changing by a constant percent.',
      'A quick test: if the description says “per year, add/subtract a number,” think linear. If it says “grows/shrinks by r%,” think exponential with factor `1 ± r`.',
    ],
    example: {
      problem: 'A plant is 4 cm tall and grows 10% per week. How tall is it after 3 weeks?',
      answer: '`4(1.1)^{3} = 5.324` cm.',
    },
    steps: [
      { do: 'Spot the type: “10% per week” is a constant percent, so the model is exponential.', why: 'Each week’s growth is 10% of a *bigger* plant than the week before.' },
      { do: 'Factor `b = 1 + 0.10 = 1.1`; initial value `a = 4`.', why: 'Growing by 10% means keeping 100% and adding 10%.' },
      { do: '`H(t) = 4(1.1)^{t}`, so `H(3) = 4 · 1.331 = 5.324` cm.', why: '`1.1^{3} = 1.331`.' },
    ],
    hint: 'Translate the percent into a growth factor first, then raise it to the number of years.',
    question: {
      id: 'ml-growth-q', type: 'numeric',
      prompt: 'A savings account starts with $500 and earns 3% interest per year, compounded yearly. How much is in it after 10 years? Round to the nearest cent.',
      answer: 500 * Math.pow(1.03, 10), tolerance: 0.006, display: '`500(1.03)^{10} ≈ $671.96`', rounding: 'nearest cent',
      traps: [
        { value: 650, why: 'That is linear thinking: adding $15 every year. Interest is earned on the growing balance, so the model multiplies by 1.03 each year.' },
        { value: 500 * Math.pow(1.3, 10), why: '3% as a decimal is 0.03, so the factor is 1.03, not 1.3.' },
      ],
      solution: [
        { do: 'Model: `A(t) = 500(1.03)^{t}`.', why: 'Constant percent growth means an exponential model.' },
        { do: '`A(10) = 500 · 1.343916… ≈ 671.96`.', why: 'Round only at the end.' },
      ],
    },
  },
  {
    id: 'ml-avg-inst',
    unitId: 'rates',
    title: 'Average vs. instantaneous rate',
    explain: [
      'An **average** rate compares two moments: total change divided by elapsed input. An **instantaneous** rate is what the average becomes as the two moments squeeze together.',
      'Graphically: average means the slope of a secant line through two points, and instantaneous means the slope of the tangent line at one point.',
    ],
    example: {
      problem: 'For `s(t) = t^{2}` (meters), compare the average velocity on `[2, 3]` with the instantaneous velocity at `t = 2`.',
      answer: 'Average: 5 m/s. Instantaneous: 4 m/s.',
      plot: {
        x: [0, 3.5], y: [0, 12],
        fns: [{ f: (t) => t * t, color: 'rose' }],
        lines: [{ x1: 0, y1: -6, x2: 3.5, y2: 11.5, color: 'butter', dashed: true }, { x1: 0, y1: -4, x2: 3.5, y2: 10, color: 'sage' }],
        points: [{ x: 2, y: 4, label: '(2, 4)' }, { x: 3, y: 9, label: '(3, 9)' }],
      },
    },
    steps: [
      { do: 'Average on `[2, 3]`: `(9 − 4)/(3 − 2) = 5`.', why: 'Secant slope between t = 2 and t = 3.' },
      { do: 'Average on `[2, 2 + h]`: `((2 + h)^{2} − 4)/h = 4 + h`.', why: 'General version, so we can watch h shrink.' },
      { do: 'As `h → 0`, this approaches 4.', why: 'The limit of average rates is the instantaneous rate, `s′(2) = 4`.' },
    ],
    hint: 'For the instantaneous rate, differentiate and then substitute. For an average rate, use two endpoints.',
    question: {
      id: 'ml-avg-inst-q', type: 'numeric',
      prompt: 'A cart’s position is `s(t) = 3t^{2}` meters. What is its **instantaneous** velocity at `t = 1` (m/s)?',
      answer: 6, tolerance: 1e-9, display: '6 m/s',
      traps: [
        { value: 3, why: 'That is the average velocity on [0, 1]: (3 − 0)/1. The instantaneous rate at 1 is s′(1).' },
        { value: 9, why: 'That is the average velocity on [1, 2]: (12 − 3)/1. Shrink the interval instead.' },
      ],
      solution: [
        { do: '`s′(t) = 6t`.', why: 'Power rule.' },
        { do: '`s′(1) = 6` m/s.', why: 'Equivalently, `(3(1 + h)^{2} − 3)/h = 6 + 3h → 6`.' },
      ],
    },
  },
  {
    id: 'ml-chain',
    unitId: 'rates',
    title: 'The chain rule',
    explain: [
      'Use the chain rule for a function **inside** another function. Differentiate the outside (leaving the inside alone), then multiply by the derivative of the inside.',
      'In rate language, rates multiply. If `y` changes 3 times as fast as `u`, and `u` changes 2 times as fast as `x`, then `y` changes 6 times as fast as `x`.',
    ],
    example: {
      problem: 'Differentiate `y = (x^{2} + 1)^{5}`.',
      answer: '`y′ = 5(x^{2} + 1)^{4} · 2x = 10x(x^{2} + 1)^{4}`.',
    },
    steps: [
      { do: 'Outside: `u^{5}`; inside: `u = x^{2} + 1`.', why: 'Name the layers before differentiating.' },
      { do: 'Outside derivative: `5u^{4} = 5(x^{2} + 1)^{4}`.', why: 'Power rule, with the inside left untouched.' },
      { do: 'Multiply by inside derivative `2x`.', why: 'This is the step people forget. It accounts for how fast the inside changes.' },
    ],
    hint: 'Name the inside function `u`. What is `du/dx`?',
    question: {
      id: 'ml-chain-q', type: 'numeric',
      prompt: 'If `f(x) = (3x + 1)^{4}`, find `f′(0)`.',
      answer: 12, tolerance: 1e-9, display: '12',
      traps: [
        { value: 4, why: 'Missing the inside derivative: multiply 4(3x + 1)³ by 3.' },
        { value: 1, why: 'That is f(0). Differentiate first.' },
        { value: 108, why: 'Evaluate the inside at x = 0: (3·0 + 1)³ = 1, so f′(0) = 4·1·3.' },
      ],
      solution: [
        { do: '`f′(x) = 4(3x + 1)^{3} · 3 = 12(3x + 1)^{3}`.', why: 'Outside power rule times inside derivative 3.' },
        { do: '`f′(0) = 12 · 1 = 12`.', why: '`3·0 + 1 = 1`.' },
      ],
    },
  },
  {
    id: 'ml-infinity',
    unitId: 'limits',
    title: 'Limits at infinity',
    explain: [
      'As `x` grows huge, the **highest-power terms** dominate and smaller terms become negligible.',
      'For a rational function, divide top and bottom by the highest power in the denominator. Every term like `c/x^{p}` vanishes, leaving the comparison of leading terms.',
    ],
    example: {
      problem: 'Find `lim_{x→∞} (3x^{2} − 5x)/(6x^{2} + 1)`.',
      answer: '`1/2`',
    },
    steps: [
      { do: 'Divide by `x^{2}`: `(3 − 5/x)/(6 + 1/x^{2})`.', why: 'Same value, but now each piece has an obvious limit.' },
      { do: '`5/x → 0`, `1/x^{2} → 0`.', why: 'Fixed numbers divided by growing powers shrink.' },
      { do: 'Result: `3/6 = 1/2`.', why: 'Equal degrees means the ratio of leading coefficients.' },
    ],
    hint: 'Compare the degrees of top and bottom. If they match, look at the leading coefficients.',
    question: {
      id: 'ml-infinity-q', type: 'numeric',
      prompt: 'Find `lim_{x→∞} (6x^{2} + x)/(3x^{2} − 2)`.',
      answer: 2, tolerance: 1e-9, display: '2',
      traps: [
        { value: 0, why: 'The degrees are equal (2 and 2), so the limit isn’t 0.' },
        { value: -0.5, why: 'Lower-order terms (x and −2) don’t determine the limit at infinity.' },
      ],
      solution: [
        { do: 'Divide by `x^{2}`: `(6 + 1/x)/(3 − 2/x^{2})`.', why: 'Highest power in the denominator.' },
        { do: 'Limit `= 6/3 = 2`.', why: 'The small terms vanish.' },
      ],
    },
  },
  {
    id: 'ml-optimize',
    unitId: 'applications',
    title: 'Setting up an optimization problem',
    explain: [
      'Most of the difficulty is in the **setup**: choose a variable, write the quantity to optimize as a function of that one variable, and state its domain.',
      'After that, the calculus is routine. Find critical points, then compare with the endpoints or use a derivative test.',
    ],
    example: {
      problem: '120 m of fence encloses a rectangle along a river (no fence on the river side). Maximize the area.',
      answer: '30 m × 60 m, area 1800 m².',
    },
    steps: [
      { do: 'Variable: `x` = side perpendicular to the river. Constraint gives the other side `120 − 2x`.', why: 'One variable makes it a Calc I problem.' },
      { do: '`A(x) = x(120 − 2x)` on `0 < x < 60`.', why: 'Objective function plus its realistic domain.' },
      { do: '`A′(x) = 120 − 4x = 0 ⇒ x = 30`, and `A″ = −4 < 0` means a max.', why: 'Critical point plus a test to confirm it.' },
    ],
    hint: 'If one side is `x`, the perimeter constraint tells you the other side. Then area = length × width.',
    question: {
      id: 'ml-optimize-q', type: 'numeric',
      prompt: 'A rectangle has perimeter 40 cm. What is the **largest possible area** (cm²)?',
      answer: 100, tolerance: 1e-9, display: '100 cm²',
      traps: [
        { value: 10, why: '10 cm is the optimal side length. The question asks for the area 10 × 10.' },
        { value: 400, why: 'If one side is x, the other is 20 − x (half the perimeter minus x), not 40 − x.' },
      ],
      solution: [
        { do: 'Sides `x` and `20 − x`; `A(x) = x(20 − x)`, `0 < x < 20`.', why: '`2x + 2y = 40 ⇒ y = 20 − x`.' },
        { do: '`A′(x) = 20 − 2x = 0 ⇒ x = 10`; `A″ = −2 < 0`.', why: 'Max at a 10 × 10 square.' },
        { do: 'Maximum area `= 100` cm².', why: 'Answer the question asked: area, with units.' },
      ],
    },
  },
]
