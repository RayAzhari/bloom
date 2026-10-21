// Unit 3 — Limits
// Scope (from the supplied course overview): finite limits; limit definitions of
// continuity and differentiability; limits at infinity; relative growth rates among
// different function families.

const limits = {
  id: 'limits',
  number: 3,
  title: 'Limits',
  blurb: 'What a function approaches, whether it connects, and who wins in the long run.',
  scope: [
    'Finite limits',
    'Limit definitions of continuity and differentiability',
    'Limits at infinity',
    'Relative growth rates among different function families',
  ],

  concepts: [
    {
      id: 'lim-finite',
      title: 'Finite limits',
      summary: '`lim_{x→a} f(x) = L` means f(x) gets as close to L as we like when x is close enough to a (but not equal to a).',
      body: [
        'A limit describes the values **near** `a`, not the value **at** `a`. A function can have a limit at a point where it is undefined, and its value there can be different from the limit.',
        '**One-sided limits:** `lim_{x→a^{−}}` uses inputs to the left, and `lim_{x→a^{+}}` uses inputs to the right. The two-sided limit exists only when both one-sided limits exist and are equal.',
        '**Computing:** if direct substitution gives a real number (and the function is a polynomial, rational function with nonzero denominator, etc.), that is the limit. If it gives `0/0`, simplify by factoring, cancelling, or multiplying by a conjugate, then substitute.',
      ],
      table: { rows: [['x', 2.9, 2.99, 2.999, 3.001, 3.01, 3.1], ['(x² − 9)/(x − 3)', 5.9, 5.99, 5.999, 6.001, 6.01, 6.1]] },
      body2: ['The table suggests `lim_{x→3} (x^{2} − 9)/(x − 3) = 6`, even though the expression is undefined at `x = 3`.'],
      plot: {
        x: [0, 5], y: [0, 10],
        fns: [{ f: (x) => x + 3, color: 'rose' }],
        points: [{ x: 3, y: 6, open: true, color: 'rose', label: 'hole at (3, 6)' }],
      },
      plotCaption: '`y = (x^{2} − 9)/(x − 3)` is the line `y = x + 3` with a hole at `x = 3`.',
      mistakes: ['Concluding “the limit doesn’t exist” because substitution gives `0/0`. That form means *simplify*, not *stop*.', 'Thinking `f(a)` must equal the limit. That only happens when f is continuous at a.'],
    },
    {
      id: 'lim-continuity',
      title: 'Continuity',
      summary: '`f` is continuous at `a` when `lim_{x→a} f(x) = f(a)`. You can draw through `a` without lifting your pencil.',
      body: [
        'The definition packs in three requirements: (1) `f(a)` is defined, (2) `lim_{x→a} f(x)` exists, and (3) the two are equal.',
        'Polynomials, exponentials, and `ln x` (for `x > 0`) are continuous on their domains. Rational functions are continuous wherever the denominator isn’t zero.',
        'For **piecewise** functions, check the break points: compute the left limit, the right limit, and the function value, and see whether all three agree.',
      ],
      mistakes: ['Checking only that the two one-sided limits match, and forgetting to compare them with `f(a)`.'],
    },
    {
      id: 'lim-differentiability',
      title: 'Differentiability',
      summary: '`f` is differentiable at `a` when `lim_{h→0} (f(a + h) − f(a))/h` exists, meaning there is a single well-defined tangent slope.',
      body: [
        '**Differentiable ⇒ continuous.** If a function has a derivative at `a`, it is continuous there.',
        'The converse fails. `f(x) = |x − 1|` is continuous at 1 but has a **corner**: the difference quotient approaches −1 from the left and +1 from the right, so the two-sided limit doesn’t exist.',
        'A function fails to be differentiable at a point where it is discontinuous, has a corner or cusp, or has a vertical tangent.',
        'For piecewise functions, check continuity first. Then compare the one-sided limits of the difference quotient (for polynomial pieces, this matches comparing the pieces’ derivatives at the break point).',
      ],
      plot: {
        x: [-1, 3], y: [0, 2.5],
        fns: [{ f: (x) => Math.abs(x - 1), color: 'rose' }],
        points: [{ x: 1, y: 0, label: 'corner' }],
      },
      plotCaption: '`|x − 1|` is continuous at 1 but not differentiable there (slopes −1 and +1 disagree).',
      mistakes: ['Assuming “no break” means “differentiable.” Corners are continuous.', 'Comparing derivatives of the pieces without first checking that the function is continuous.'],
    },
    {
      id: 'lim-infinity',
      title: 'Limits at infinity',
      summary: 'What happens as `x` grows without bound. Horizontal asymptotes come from here.',
      body: [
        '`lim_{x→∞} f(x) = L` means `f(x)` gets close to `L` for all sufficiently large `x`. Then `y = L` is a **horizontal asymptote**.',
        '**Rational functions:** divide top and bottom by the highest power of `x` in the denominator. Equivalently, compare degrees:',
        'If the top degree is less than the bottom degree, the limit is 0. If the degrees are equal, the limit is the ratio of the leading coefficients. If the top degree is greater, the function is unbounded (no horizontal asymptote).',
        'Useful facts: `1/x^{p} → 0` for `p > 0`, and `b^{x} → 0` as `x → ∞` when `0 < b < 1`.',
      ],
      plot: {
        x: [0, 20], y: [0, 1],
        fns: [{ f: (x) => (3 * x * x - 5 * x) / (6 * x * x + 1), color: 'rose', domain: [0, 20] }],
        hlines: [{ y: 0.5 }],
      },
      plotCaption: '`(3x^{2} − 5x)/(6x^{2} + 1)` approaches its horizontal asymptote `y = 1/2` (dashed).',
      mistakes: ['Cancelling non-leading terms (`−5x` and `+1`) as if they were the main story.', 'Saying a function “can never cross” its horizontal asymptote. It can: this one equals 1/2 at `x = −0.1`.'],
    },
    {
      id: 'lim-growth',
      title: 'Relative growth rates',
      summary: 'As x → ∞: logs ≪ powers ≪ exponentials. The ratio of a slower function to a faster one goes to 0.',
      body: [
        'We say `g` **dominates** `f` if `lim_{x→∞} f(x)/g(x) = 0`. The standard ranking for large `x`:',
        '$$ ln x  ≪  x^{p} (p > 0)  ≪  b^{x} (b > 1) $$',
        'Among powers, a higher power dominates. Among exponentials, a larger base dominates. Coefficients never change the ranking: `1000x^{2}` is still dominated by `0.001x^{3}`.',
        'Example: `lim_{x→∞} x^{3}/e^{x} = 0` even though `x^{3}` is larger for a long while (e.g., at `x = 4`, `64 > 54.6`).',
      ],
      table: { rows: [['x', 1, 5, 10, 20], ['ln x', '0', '1.61', '2.30', '3.00'], ['x²', 1, 25, 100, 400], ['2ˣ', 2, 32, '1,024', '1,048,576']] },
      mistakes: ['Judging growth by small x-values. Exponentials can start smaller and still win eventually.', 'Thinking a big coefficient can beat a faster family in the long run.'],
    },
  ],

  examples: [
    {
      id: 'lim-ex-factor',
      conceptId: 'lim-finite',
      title: 'A 0/0 limit by factoring',
      problem: 'Find `lim_{x→3} (x^{2} − 9)/(x − 3)`.',
      steps: [
        { do: 'Direct substitution gives `0/0`.', why: '`0/0` is indeterminate. It tells us to simplify, not that the limit fails to exist.' },
        { do: 'Factor: `(x − 3)(x + 3)/(x − 3)`.', why: 'Difference of squares exposes a common factor.' },
        { do: 'Cancel to `x + 3` for `x ≠ 3`.', why: 'The limit only looks at `x` near 3, never at 3, so cancelling is legitimate.' },
        { do: '`lim_{x→3} (x + 3) = 6`.', why: '`x + 3` is continuous, so substitute.' },
      ],
      answer: '6. The table of values agrees: 5.99, 5.999, … and 6.001, 6.01, ….',
      mistakes: ['Writing “= x + 3 = 6” without the limit notation. The expressions are equal only for `x ≠ 3`.'],
      similar: 'lim-p3',
    },
    {
      id: 'lim-ex-piecewise',
      conceptId: 'lim-continuity',
      title: 'Making a piecewise function continuous',
      problem: 'Find `k` so that `f(x) = x^{2} + k` for `x < 2`, and `f(x) = 3x − 1` for `x ≥ 2`, is continuous at `x = 2`.',
      steps: [
        { do: 'Left limit: `lim_{x→2^{−}} (x^{2} + k) = 4 + k`.', why: 'Inputs just left of 2 use the top piece.' },
        { do: 'Right limit and value: `lim_{x→2^{+}} (3x − 1) = 5 = f(2)`.', why: 'Inputs at and right of 2 use the bottom piece.' },
        { do: 'Set equal: `4 + k = 5`, so `k = 1`.', why: 'Continuity requires left limit = right limit = f(2).' },
      ],
      answer: '`k = 1`.',
      mistakes: ['Plugging 2 into the wrong piece. Check the inequality signs.'],
      similar: 'lim-p6',
    },
    {
      id: 'lim-ex-corner',
      conceptId: 'lim-differentiability',
      title: 'Continuous but not differentiable',
      problem: 'Is `f(x) = |x − 1|` differentiable at `x = 1`?',
      steps: [
        { do: 'Continuity: `lim_{x→1} |x − 1| = 0 = f(1)`. ✓', why: 'Differentiability can only happen where f is continuous, so check that first.' },
        { do: 'Difference quotient: `(f(1 + h) − f(1))/h = |h|/h`.', why: 'Plug into the definition of `f′(1)`.' },
        { do: 'For `h > 0`, `|h|/h = 1`; for `h < 0`, `|h|/h = −1`.', why: '`|h| = h` for positive `h` and `−h` for negative `h`.' },
        { do: 'One-sided limits are 1 and −1. They are unequal, so `f′(1)` doesn’t exist.', why: 'A two-sided limit needs both sides to agree.' },
      ],
      answer: 'No. `f` is continuous at 1 but not differentiable (corner).',
      mistakes: ['Saying “`f′(1) = 0` because it’s the minimum.” Zero slope requires a smooth bottom, not a corner.'],
      similar: 'lim-p8',
    },
    {
      id: 'lim-ex-infinity',
      conceptId: 'lim-infinity',
      title: 'A limit at infinity',
      problem: 'Find `lim_{x→∞} (3x^{2} − 5x)/(6x^{2} + 1)`.',
      steps: [
        { do: 'Divide every term by `x^{2}`: `(3 − 5/x)/(6 + 1/x^{2})`.', why: '`x^{2}` is the highest power in the denominator. Dividing top and bottom by it doesn’t change the value.' },
        { do: 'As `x → ∞`: `5/x → 0` and `1/x^{2} → 0`.', why: 'Constants over growing powers shrink to 0.' },
        { do: 'Limit `= 3/6 = 1/2`.', why: 'Equal degrees means the ratio of leading coefficients.' },
      ],
      answer: '`1/2`, so the horizontal asymptote is `y = 1/2`.',
      mistakes: ['Answering 3 or ∞ by looking only at the numerator.'],
      similar: 'lim-p5',
    },
    {
      id: 'lim-ex-growth',
      conceptId: 'lim-growth',
      title: 'Ranking growth',
      problem: 'Order from slowest to fastest growth as `x → ∞`: `2^{x}`, `x^{10}`, `ln x`, `1.1^{x}`, `√x`.',
      steps: [
        { do: 'Logs are slowest: `ln x` first.', why: '`ln x / x^{p} → 0` for every `p > 0`.' },
        { do: 'Powers next, smaller power first: `√x = x^{1/2}`, then `x^{10}`.', why: 'Higher powers dominate lower powers.' },
        { do: 'Exponentials last, smaller base first: `1.1^{x}`, then `2^{x}`.', why: 'Any exponential with base > 1 beats any power; a larger base beats a smaller base, since `(1.1/2)^{x} → 0`.' },
      ],
      answer: '`ln x`, `√x`, `x^{10}`, `1.1^{x}`, `2^{x}`.',
      mistakes: ['Putting `x^{10}` above `1.1^{x}` because `x^{10}` is much larger for moderate x. It does stay larger for a long time, but `1.1^{x}` eventually wins.'],
      similar: 'lim-p7',
    },
  ],

  practice: [
    {
      id: 'lim-p1', level: 'intro', type: 'numeric',
      prompt: 'Find `lim_{x→2} (x^{2} + 3x)`.',
      answer: 10, tolerance: 1e-9, display: '10',
      traps: [],
      hints: ['Polynomials are continuous. Can you substitute directly?'],
      solution: [{ do: '`2^{2} + 3·2 = 10`.', why: 'For continuous functions, the limit equals the value.' }],
    },
    {
      id: 'lim-p2', level: 'intro', type: 'mc',
      prompt: 'Suppose `lim_{x→a^{−}} f(x) = 4`, `lim_{x→a^{+}} f(x) = 4`, and `f(a) = 7`. Which is true?',
      choices: [
        { text: '`lim_{x→a} f(x) = 4`, and f is not continuous at a.', correct: true, why: 'Equal one-sided limits mean the limit exists, but it doesn’t match f(a). ✓' },
        { text: '`lim_{x→a} f(x) = 7`', why: 'The limit depends on nearby values, not on f(a).' },
        { text: 'The limit does not exist.', why: 'Both one-sided limits exist and agree, so the two-sided limit exists.' },
        { text: 'f is continuous at a.', why: 'Continuity needs the limit to equal f(a), and 4 ≠ 7.' },
      ],
      hints: ['When does a two-sided limit exist?', 'Continuity also compares the limit to `f(a)`.'],
      solution: [{ do: 'The limit is 4 (sides agree); continuity fails because 4 ≠ 7.', why: 'This is a removable discontinuity, like a misplaced point.' }],
    },
    {
      id: 'lim-p3', level: 'core', type: 'numeric',
      prompt: 'Find `lim_{x→4} (x^{2} − 16)/(x − 4)`.',
      answer: 8, tolerance: 1e-9, display: '8',
      traps: [{ value: 0, why: 'Substitution gives 0/0, which is indeterminate. Factor first.' }],
      hints: ['Substitution gives 0/0. Factor the numerator.', '`x^{2} − 16 = (x − 4)(x + 4)`.'],
      solution: [{ do: 'Cancel `(x − 4)`: `lim_{x→4} (x + 4) = 8`.', why: 'The expressions agree for x ≠ 4, which is all a limit sees.' }],
    },
    {
      id: 'lim-p4', level: 'challenge', type: 'numeric',
      prompt: 'Find `lim_{x→0} (√(x + 9) − 3)/x`. Give an exact fraction or round to four decimals.',
      answer: 1 / 6, tolerance: 0.00006, display: '1/6 ≈ 0.1667', rounding: 'four decimal places',
      traps: [{ value: 0, why: 'This is 0/0. Multiply by the conjugate √(x + 9) + 3 to simplify.' }, { value: 1 / 3, why: 'After rationalizing, the denominator is √(x + 9) + 3, which approaches 3 + 3 = 6.' }],
      hints: ['Multiply top and bottom by the conjugate `√(x + 9) + 3`.', 'Numerator becomes `(x + 9) − 9 = x`.', 'You get `1/(√(x + 9) + 3)`. Now let x → 0.'],
      solution: [
        { do: 'Multiply by `(√(x + 9) + 3)/(√(x + 9) + 3)`.', why: 'Using `(a − b)(a + b) = a^{2} − b^{2}` removes the square root from the numerator.' },
        { do: '`= x / (x(√(x + 9) + 3)) = 1/(√(x + 9) + 3)` for `x ≠ 0`.', why: 'Cancel the common factor x.' },
        { do: 'Limit `= 1/(3 + 3) = 1/6`.', why: 'Now the expression is continuous at 0.' },
      ],
    },
    {
      id: 'lim-p5', level: 'core', type: 'mc',
      prompt: 'Find `lim_{x→∞} (5x^{3} + 2)/(2x^{3} − x)`.',
      choices: [
        { text: '`5/2`', correct: true, why: 'Equal degrees, so the limit is the ratio of leading coefficients. ✓' },
        { text: '`∞`', why: 'The denominator grows just as fast as the numerator.' },
        { text: '`0`', why: 'That happens when the numerator has the lower degree.' },
        { text: '`−2`', why: 'This divides the lower-order coefficients (2 and −1). Those terms become negligible as x → ∞.' },
      ],
      hints: ['Divide everything by `x^{3}`.', 'Which terms go to 0?'],
      solution: [{ do: '`(5 + 2/x^{3})/(2 − 1/x^{2}) → 5/2`.', why: 'All lower-order terms vanish.' }],
    },
    {
      id: 'lim-p6', level: 'core', type: 'numeric',
      prompt: 'Find `k` so that `f(x) = kx + 1` for `x < 3` and `f(x) = x^{2} − 2` for `x ≥ 3` is continuous.',
      answer: 2, tolerance: 1e-9, display: '`k = 2`',
      traps: [{ value: 7, why: '7 is the value both pieces must reach at x = 3. Solve 3k + 1 = 7 for k.' }],
      hints: ['Right side at 3: `3^{2} − 2 = 7`.', 'Left limit at 3: `3k + 1`. Set them equal.'],
      solution: [{ do: '`3k + 1 = 7 ⇒ k = 2`.', why: 'Continuity at 3: left limit = right limit = f(3) = 7.' }],
    },
    {
      id: 'lim-p7', level: 'challenge', type: 'mc',
      prompt: 'Which function grows fastest as `x → ∞`?',
      choices: [
        { text: '`1.01^{x}`', correct: true, why: 'Any exponential with base > 1 eventually dominates every power and every log. ✓' },
        { text: '`x^{100}`', why: 'Enormous for a long time, but `x^{100}/1.01^{x} → 0`.' },
        { text: '`50x^{2}`', why: 'Coefficients don’t change the ranking, and degree 2 is below degree 100 anyway.' },
        { text: '`(ln x)^{5}`', why: 'Powers of logs are dominated by any positive power of x.' },
      ],
      hints: ['Recall the ranking: logs ≪ powers ≪ exponentials.', 'Does the size of the exponent 100 change which *family* wins?'],
      solution: [{ do: 'Exponential (base 1.01 > 1) beats any power, so `1.01^{x}` wins in the long run.', why: 'Relative growth is about the ratio’s limit, not about which function is bigger for moderate x.' }],
    },
    {
      id: 'lim-p8', level: 'challenge', type: 'mc',
      prompt: 'Let `f(x) = x^{2}` for `x ≤ 1` and `f(x) = 2x − 1` for `x > 1`. At `x = 1`, f is…',
      plot: { x: [-1, 2.5], y: [-0.5, 4], fns: [{ f: (x) => x * x, color: 'rose', domain: [-1, 1] }, { f: (x) => 2 * x - 1, color: 'sage', domain: [1, 2.5] }], points: [{ x: 1, y: 1, label: '(1, 1)' }] },
      choices: [
        { text: 'continuous and differentiable', correct: true, why: 'Both pieces meet at 1, and the one-sided difference quotients both approach 2. ✓' },
        { text: 'continuous but not differentiable', why: 'Check the slopes: left 2x → 2, right slope 2. No corner.' },
        { text: 'differentiable but not continuous', why: 'Impossible: differentiability always implies continuity.' },
        { text: 'neither continuous nor differentiable', why: 'Left limit 1, right limit 1, f(1) = 1, so f is continuous.' },
      ],
      hints: ['First check continuity: left limit, right limit, and f(1).', 'Then compare the one-sided slopes at 1.', 'Left: `((1 + h)^{2} − 1)/h = 2 + h`. Right: `(2(1 + h) − 1 − 1)/h = 2`.'],
      solution: [
        { do: 'Continuity: `1^{2} = 1`, `2(1) − 1 = 1`, `f(1) = 1`. ✓', why: 'All three agree.' },
        { do: 'Left difference quotient `2 + h → 2`; right difference quotient `= 2`.', why: 'Equal one-sided limits, so `f′(1) = 2` exists.' },
      ],
    },
    {
      id: 'lim-p9', level: 'challenge', type: 'numeric',
      prompt: 'Find `lim_{x→∞} √(4x^{2} + x)/(x + 5)`.',
      answer: 2, tolerance: 1e-9, display: '2',
      traps: [{ value: 4, why: 'Remember the square root: √(4x²) = 2x for x > 0.' }],
      hints: ['For large positive x, `√(4x^{2} + x) ≈ √(4x^{2}) = 2x`.', 'Divide top and bottom by x. Inside the root, that means dividing by `x^{2}`.'],
      solution: [
        { do: 'For `x > 0`: `√(4x^{2} + x)/x = √(4 + 1/x)`, and `(x + 5)/x = 1 + 5/x`.', why: 'Dividing by `x = √(x^{2})` (valid for `x > 0`).' },
        { do: 'Limit `= √4 / 1 = 2`.', why: '`1/x → 0` and `5/x → 0`.' },
      ],
    },
  ],

  check: [
    {
      id: 'lim-c1', level: 'intro', type: 'mc',
      prompt: 'Which statement is always true?',
      choices: [
        { text: 'If f is differentiable at a, then f is continuous at a.', correct: true, why: 'Differentiability is the stronger condition.' },
        { text: 'If f is continuous at a, then f is differentiable at a.', why: 'Counterexample: |x| at 0.' },
        { text: 'If `lim_{x→a} f(x)` exists, then f(a) exists.', why: 'Limits can exist at holes.' },
        { text: 'If substitution gives 0/0, the limit does not exist.', why: '0/0 means “simplify further.”' },
      ],
      hints: [], solution: [],
    },
    {
      id: 'lim-c2', level: 'intro', type: 'numeric',
      prompt: 'Find `lim_{x→∞} (7x + 1)/(2x^{2} − 3)`.',
      answer: 0, tolerance: 1e-9, display: '0',
      traps: [{ value: 3.5, why: 'The degrees differ: the bottom (degree 2) beats the top (degree 1).' }],
      hints: [], solution: [{ do: 'Numerator degree 1 < denominator degree 2, so the limit is 0.', why: 'Divide by `x^{2}`: `(7/x + 1/x^{2})/(2 − 3/x^{2}) → 0/2`.' }],
    },
    {
      id: 'lim-c3', level: 'intro', type: 'mc',
      prompt: 'As `x → ∞`, what is `lim x^{3}/e^{x}`?',
      choices: [
        { text: '0', correct: true, why: 'Exponentials dominate powers.' },
        { text: '∞', why: 'The denominator grows faster.' },
        { text: '1', why: 'The two functions don’t grow at the same rate.' },
        { text: '3', why: 'There’s no reason for 3 to appear.' },
      ],
      hints: [], solution: [],
    },
  ],
}

export default limits
