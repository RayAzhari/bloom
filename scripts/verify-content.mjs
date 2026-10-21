// Content integrity + answer-key verification.
// Run: npm run verify:content
// 1) Structural checks: unique ids, exactly one correct MC choice, valid cross-references.
// 2) Every numeric answer is recomputed here independently (from the problem statement,
//    not copied from the content file) and compared to the stored key.
// 3) Spot-checks of numbers quoted in worked examples and tables.
import functions from '../src/content/math/functions.js'
import rates from '../src/content/math/rates.js'
import limits from '../src/content/math/limits.js'
import applications from '../src/content/math/applications.js'
import { mathLessons } from '../src/content/math/lessons.js'
import { lsCategories } from '../src/content/ls1a/concepts.js'
import { lsCards } from '../src/content/ls1a/cards.js'
import { lsPractice } from '../src/content/ls1a/practice.js'
import { lsLessons } from '../src/content/ls1a/lessons.js'
import { resources } from '../src/content/resources.js'
import { parseNumber } from '../src/lib/parseNumber.js'

let failures = 0
const fail = (msg) => { failures++; console.error('✗', msg) }
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol

// Numerical helpers (independent of content)
const deriv = (f, x, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h)
const limitAt = (f, a) => (f(a + 1e-7) + f(a - 1e-7)) / 2
const atInf = (f) => f(1e8)
function argmaxOn(f, a, b, n = 200000) {
  let best = a, bv = -Infinity
  for (let i = 0; i <= n; i++) { const x = a + ((b - a) * i) / n; const v = f(x); if (v > bv) { bv = v; best = x } }
  return { x: best, v: bv }
}

// Independent recomputations for every numeric question, keyed by id.
const expected = {
  'fn-p2': (19 - 7) / (6 - 2),
  'fn-p3': (1 - 0.88) * 100,
  'fn-p4': Math.log(40 / 5) / Math.log(2),
  'fn-p6': 50 * Math.pow(2, -20 / 8),
  'fn-c3': 2 * 4 - 3,
  'rc-p1': (27 - 1) / 2,
  'rc-p3': deriv((x) => 3 * x ** 4 - 2 * x + 7, 1),
  'rc-p4': deriv((x) => Math.log(x * x + 1), 1),
  'rc-p6': deriv((x) => (x * x) / (x + 1), 1),
  'rc-p7': deriv((x) => 5 * 2 ** x, 0),
  'rc-p8': (28 - 14) / (6 - 2),
  'rc-c2': deriv((x) => Math.exp(2 * x), 0),
  'lim-p1': 4 + 6,
  'lim-p3': limitAt((x) => (x * x - 16) / (x - 4), 4),
  'lim-p4': limitAt((x) => (Math.sqrt(x + 9) - 3) / x, 0),
  'lim-p6': (9 - 2 - 1) / 3,
  'lim-p9': atInf((x) => Math.sqrt(4 * x * x + x) / (x + 5)),
  'lim-c2': atInf((x) => (7 * x + 1) / (2 * x * x - 3)),
  'app-p1': 9 + deriv((x) => x * x, 3) * 0.1,
  'app-p3': Math.log(1) + deriv(Math.log, 1) * 0.05,
  'app-p4': argmaxOn((x) => -(x * x - 8 * x + 3), -10, 10).x,
  'app-p5': argmaxOn((x) => -x * x + 6 * x - 4, 0, 5).v,
  'app-p7': argmaxOn((x) => x * (12 - 2 * x) ** 2, 0, 6).v,
  'app-p9': argmaxOn((q) => 50 * q - 0.5 * q * q - (10 * q + 200), 0, 100).x,
  'app-c3': 2, // verified below via derivative sign change
  'ml-growth-q': 500 * 1.03 ** 10,
  'ml-avg-inst-q': deriv((t) => 3 * t * t, 1),
  'ml-chain-q': deriv((x) => (3 * x + 1) ** 4, 0),
  'ml-infinity-q': atInf((x) => (6 * x * x + x) / (3 * x * x - 2)),
  'ml-optimize-q': argmaxOn((x) => x * (20 - x), 0, 20).v,
}
// app-c3: local min of x^3 - 12x where f' goes - to +
{
  const fp = (x) => 3 * x * x - 12
  if (!(fp(1.9) < 0 && fp(2.1) > 0)) fail('app-c3 sign change check failed')
}

const units = [functions, rates, limits, applications]
const ids = new Set()
const addId = (id, where) => { if (ids.has(id)) fail(`duplicate id ${id} (${where})`); ids.add(id) }

function checkQuestion(q, where) {
  addId(q.id, where)
  if (q.type === 'mc') {
    const n = q.choices.filter((c) => c.correct).length
    if (n !== 1) fail(`${q.id}: expected exactly 1 correct choice, found ${n}`)
    q.choices.forEach((c, i) => { if (!c.why) fail(`${q.id}: choice ${i} missing explanation`) })
  } else if (q.type === 'numeric') {
    if (!Number.isFinite(q.answer)) fail(`${q.id}: answer not finite`)
    if (!(q.tolerance > 0)) fail(`${q.id}: tolerance missing`)
    if (!q.display) fail(`${q.id}: display missing`)
    const exp = expected[q.id]
    if (exp === undefined) fail(`${q.id}: no independent recomputation registered`)
    else if (!near(exp, q.answer, Math.max(1e-4, q.tolerance))) fail(`${q.id}: key ${q.answer} ≠ recomputed ${exp}`)
    // Display text should parse to the answer when it is a plain expression
    for (const t of q.traps || []) {
      if (near(t.value, q.answer, q.tolerance)) fail(`${q.id}: trap ${t.value} is within tolerance of the answer`)
      if (!t.why) fail(`${q.id}: trap missing explanation`)
    }
    // Rounded answer at the stated precision must be accepted
    if (q.rounding) {
      const dp = { 'two decimal places': 2, 'three decimal places': 3, 'four decimal places': 4, 'nearest cent': 2 }[q.rounding]
      if (dp === undefined) fail(`${q.id}: unknown rounding note "${q.rounding}"`)
      else {
        const rounded = Number(q.answer.toFixed(dp))
        if (!near(rounded, q.answer, q.tolerance)) fail(`${q.id}: correctly rounded value ${rounded} would be rejected (tol ${q.tolerance})`)
        const off = rounded + 2 * 10 ** -dp
        if (near(off, q.answer, q.tolerance)) fail(`${q.id}: tolerance too loose; ${off} would be accepted`)
      }
    } else if (!Number.isInteger(q.answer * 1e6) && q.tolerance < 1e-6 && !/\//.test(q.display)) {
      fail(`${q.id}: non-terminating answer without rounding instructions`)
    }
  } else fail(`${q.id}: unknown type ${q.type}`)
}

for (const u of units) {
  addId(u.id, 'unit')
  const conceptIds = new Set(u.concepts.map((c) => c.id))
  u.concepts.forEach((c) => addId(c.id, u.id))
  u.examples.forEach((e) => {
    addId(e.id, u.id)
    if (!conceptIds.has(e.conceptId)) fail(`${e.id}: unknown conceptId ${e.conceptId}`)
    if (e.similar && !u.practice.some((q) => q.id === e.similar)) fail(`${e.id}: similar question ${e.similar} not in unit practice`)
    if (!e.steps.every((s) => s.do && s.why)) fail(`${e.id}: every step needs do + why`)
  })
  u.practice.forEach((q) => { checkQuestion(q, u.id); if (!q.hints?.length) fail(`${q.id}: practice question needs hints`); if (!q.solution?.length) fail(`${q.id}: practice question needs solution`) })
  u.check.forEach((q) => checkQuestion(q, u.id))
  const levels = new Set(u.practice.map((q) => q.level))
  for (const l of ['intro', 'core', 'challenge']) if (!levels.has(l)) fail(`${u.id}: no ${l} practice question`)
  // plot functions must evaluate
  const plots = [...u.concepts, ...u.practice].filter((x) => x.plot).map((x) => x.plot)
  plots.forEach((p) => p.fns?.forEach((fn) => { if (!Number.isFinite(fn.f((p.x[0] + p.x[1]) / 2 + 0.013))) fail(`${u.id}: plot fn not finite mid-domain`) }))
}
mathLessons.forEach((l) => { addId(l.id, 'math lesson'); checkQuestion(l.question, l.id); if (!units.some((u) => u.id === l.unitId)) fail(`${l.id}: unknown unit`) })

const catIds = new Set(lsCategories.map((c) => c.id))
lsCategories.forEach((c) => addId(`ls-${c.id}`, 'ls category'))
lsCards.forEach((c) => { addId(c.id, 'card'); if (!catIds.has(c.category)) fail(`${c.id}: unknown category`) })
lsPractice.forEach((q) => { checkQuestion(q, 'ls'); if (!catIds.has(q.category)) fail(`${q.id}: unknown category`) })
lsLessons.forEach((l) => { addId(l.id, 'ls lesson'); checkQuestion(l.question, l.id); if (!catIds.has(l.category)) fail(`${l.id}: unknown category`) })
for (const list of Object.values(resources)) list.forEach((r) => { addId(r.id, 'resource'); if (!/^https:\/\//.test(r.url)) fail(`${r.id}: url must be https`) })

// ---- Spot checks of numbers quoted in text ----
const checks = [
  ['fn table g(3)', 200 * 1.2 ** 3, 345.6],
  ['doubling time', Math.log(2) / Math.log(1.04), 17.67, 0.005],
  ['drug C(3)', 80 * 0.85 ** 3, 49.13, 0.005],
  ['0.85^3', 0.85 ** 3, 0.614125],
  ['poly f(1)', -1 * (1 - 2) * (1 + 3), 4],
  ['avg [2,2.1]', (2.1 ** 2 - 4) / 0.1, 4.1, 1e-9],
  ['avg [2,2.01]', (2.01 ** 2 - 4) / 0.01, 4.01, 1e-9],
  ['avg [2,2.001]', (2.001 ** 2 - 4) / 0.001, 4.001, 1e-9],
  ['rules (a) at x=1', deriv((x) => 4 * x ** 3 - 5 / x + 2 * Math.sqrt(x), 1), 12 + 5 + 1, 1e-4],
  ['rules (b) at t=1', deriv((t) => t * t * Math.exp(3 * t), 1), Math.exp(3) * 5, 1e-3],
  ['limit table 2.99', (2.99 ** 2 - 9) / (2.99 - 3), 5.99, 1e-9],
  ['asymptote crossing x=-0.1', (3 * 0.01 + 0.5) / (6 * 0.01 + 1), 0.5, 1e-12],
  ['e^4', Math.exp(4), 54.6, 0.01],
  ['ln 5', Math.log(5), 1.61, 0.005], ['ln 10', Math.log(10), 2.3, 0.005], ['ln 20', Math.log(20), 3.0, 0.005],
  ['sqrt(4.1) true', Math.sqrt(4.1), 2.02485, 1e-5],
  ['closed interval f(1)', 2 - 9 + 12, 5], ['closed interval f(2)', 16 - 36 + 24, 4], ['closed interval f(3)', 54 - 81 + 36, 9],
  ['ln(1.05) true', Math.log(1.05), 0.04879, 1e-5],
  ['fence area', 30 * 60, 1800],
  ['plant 4(1.1)^3', 4 * 1.1 ** 3, 5.324, 1e-9],
  ['x^3-3x local max', (-1) ** 3 + 3, 2], ['x^3-3x local min', 1 - 3, -2],
  ['profit at 40', 40 * 40 - 0.5 * 1600 - 200, 600],
  ['MR=MC at 40', 50 - 40, 10],
  ['0.5^2.5', 0.5 ** 2.5, 1 / (4 * Math.SQRT2), 1e-12],
  ['ln 2 / ln 1.04 parts', Math.log(1.04), 0.039221, 1e-6],
  ['app-p5 endpoints', -25 + 30 - 4, 1],
  ['V(2)=128', 2 * 8 ** 2, 128],
  ['fn-p6 rounded', Number((50 * 0.5 ** 2.5).toFixed(2)), 8.84],
  ['savings', Number((500 * 1.03 ** 10).toFixed(2)), 671.96],
  // LS inhibition table: v = 100 S/(Km + S), Km 1 vs 3
  ...[1, 5, 20, 100].map((S, i) => [`MM no X S=${S}`, (100 * S) / (1 + S), [50, 83, 95, 99][i], 0.51]),
  ...[1, 5, 20, 100].map((S, i) => [`MM with X S=${S}`, (100 * S) / (3 + S), [25, 63, 87, 97][i], 0.51]),
]
for (const [name, got, want, tol = 1e-9] of checks) if (!near(got, want, tol)) fail(`spot check "${name}": ${got} vs ${want}`)

// Parser sanity for formats the UI suggests
for (const [s, v] of [['3/4', 0.75], ['5ln2', 5 * Math.LN2], ['1/6', 1 / 6], ['sqrt(2)', Math.SQRT2], ['-3', -3], ['$671.96', 671.96], ['12%', 12]]) {
  if (!near(parseNumber(s), v, 1e-12)) fail(`parser: ${s} → ${parseNumber(s)}`)
}

const nQ = units.reduce((a, u) => a + u.practice.length + u.check.length, 0) + mathLessons.length + lsPractice.length + lsLessons.length
console.log(failures ? `\n${failures} problem(s) found.` : `✓ All content checks passed (${nQ} questions, ${lsCards.length} flashcards, ${ids.size} ids).`)
process.exit(failures ? 1 : 0)
