// Tiny, safe expression evaluator for numeric answers.
// Supports: numbers, + - * / ^, parentheses, implicit multiplication (5ln2, 2pi),
// constants pi and e, and functions sqrt, ln, log (base 10), exp.
// Returns a finite number or null. Never uses eval.

const FUNCS = { sqrt: Math.sqrt, ln: Math.log, log: Math.log10, exp: Math.exp }
const CONSTS = { pi: Math.PI, π: Math.PI, e: Math.E }

function tokenize(src) {
  const s = src.toLowerCase().replace(/\s+/g, '').replace(/−/g, '-').replace(/×|·/g, '*').replace(/÷/g, '/').replace(/√/g, 'sqrt').replace(/[,$%]/g, '')
  const tokens = []
  let i = 0
  while (i < s.length) {
    const c = s[i]
    if (/[0-9.]/.test(c)) {
      let j = i
      while (j < s.length && /[0-9.]/.test(s[j])) j++
      const text = s.slice(i, j)
      if ((text.match(/\./g) || []).length > 1) return null
      tokens.push({ t: 'num', v: parseFloat(text) })
      i = j
    } else if (/[a-zπ]/.test(c)) {
      const word = Object.keys(FUNCS).concat(Object.keys(CONSTS)).sort((a, b) => b.length - a.length).find((w) => s.startsWith(w, i))
      if (!word) return null
      tokens.push(FUNCS[word] ? { t: 'fn', v: word } : { t: 'num', v: CONSTS[word] })
      i += word.length
    } else if ('+-*/^()'.includes(c)) {
      tokens.push({ t: c })
      i++
    } else {
      return null
    }
  }
  // Insert implicit multiplication: 2pi, 5ln2, 2(3), )(.
  const out = []
  for (const tok of tokens) {
    const prev = out[out.length - 1]
    const prevEnds = prev && (prev.t === 'num' || prev.t === ')')
    const curStarts = tok.t === 'num' || tok.t === 'fn' || tok.t === '('
    if (prevEnds && curStarts) out.push({ t: '*' })
    out.push(tok)
  }
  return out
}

export function parseNumber(input) {
  if (typeof input !== 'string' || !input.trim() || input.length > 60) return null
  const tokens = tokenize(input)
  if (!tokens || !tokens.length) return null
  let pos = 0
  const peek = () => tokens[pos]
  const take = () => tokens[pos++]

  function expr() {
    let v = term()
    while (peek() && (peek().t === '+' || peek().t === '-')) {
      const op = take().t
      const r = term()
      v = op === '+' ? v + r : v - r
    }
    return v
  }
  function term() {
    let v = unary()
    while (peek() && (peek().t === '*' || peek().t === '/')) {
      const op = take().t
      const r = unary()
      v = op === '*' ? v * r : v / r
    }
    return v
  }
  function unary() {
    if (peek() && peek().t === '-') { take(); return -unary() }
    if (peek() && peek().t === '+') { take(); return unary() }
    return power()
  }
  function power() {
    const base = atom()
    if (peek() && peek().t === '^') { take(); return Math.pow(base, unary()) }
    return base
  }
  function atom() {
    const tok = take()
    if (!tok) throw new Error('end')
    if (tok.t === 'num') return tok.v
    if (tok.t === 'fn') {
      // allow ln2 as well as ln(2)
      return FUNCS[tok.v](power())
    }
    if (tok.t === '(') {
      const v = expr()
      if (!peek() || take().t !== ')') throw new Error('paren')
      return v
    }
    throw new Error('unexpected')
  }

  try {
    const v = expr()
    if (pos !== tokens.length) return null
    return Number.isFinite(v) ? v : null
  } catch {
    return null
  }
}

export function matchesAnswer(input, answer, tolerance = 1e-9) {
  const v = parseNumber(input)
  if (v === null) return { valid: false, correct: false }
  const tol = Math.max(tolerance, 1e-9)
  return { valid: true, correct: Math.abs(v - answer) <= tol, value: v }
}
