import { useState } from 'react'
import { Check, CircleCheck, Eye, Lightbulb, RotateCcw, TriangleAlert, X } from 'lucide-react'
import { Rich, DataTable, Plot } from './Rich'
import LSFigure from './LSFigures'
import { matchesAnswer, parseNumber } from '../lib/parseNumber'
import { useBloom } from '../state/BloomStore'
import { SaveButton } from './ui'

const LETTERS = 'ABCDEFG'

export function QuestionMedia({ q }) {
  return (
    <>
      {q.table && <DataTable table={q.table} />}
      {q.plot && <Plot spec={q.plot} caption={q.plotCaption} />}
      {q.figure && <LSFigure name={q.figure} />}
    </>
  )
}

export function SolutionSteps({ steps }) {
  if (!steps?.length) return null
  return (
    <ol className="steps">
      {steps.map((s, i) => (
        <li key={i}>
          <Rich text={s.do} />
          {s.why && <div className="step-why"><strong>Why:</strong> <span><Rich text={s.why} /></span></div>}
        </li>
      ))}
    </ol>
  )
}

/**
 * Interactive question (multiple choice or numeric).
 * Props:
 *  q          question object (see content conventions)
 *  label      short label for the activity log
 *  saveItem   optional { id, course, kind, title, route } for "save for review"
 *  lesson     true inside "Help me understand": hints/solution handled by the lesson
 *  onResult   callback(correct, detail)
 */
export default function Question({ q, label, saveItem, lesson = false, onResult }) {
  const { recordAttempt } = useBloom()
  const [selected, setSelected] = useState(null)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null) // { correct, trap?, value? }
  const [error, setError] = useState('')
  const [hints, setHints] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [tries, setTries] = useState(0)

  const isMC = q.type === 'mc'
  const correctIndex = isMC ? q.choices.findIndex((c) => c.correct) : -1
  const locked = !!result || showSolution

  function check(e) {
    e?.preventDefault()
    setError('')
    let res
    if (isMC) {
      if (selected === null) { setError('Choose an answer first.'); return }
      res = { correct: selected === correctIndex }
    } else {
      const m = matchesAnswer(input, q.answer, q.tolerance)
      if (!m.valid) { setError('I couldn’t read that as a number. Try forms like 3/4, 2.5, -3, sqrt(2), or 5ln2.'); return }
      const trap = !m.correct ? (q.traps || []).find((t) => Math.abs(m.value - t.value) <= Math.max(q.tolerance || 0, 1e-6, Math.abs(t.value) * 0.001)) : null
      res = { correct: m.correct, trap, value: m.value }
    }
    setResult(res)
    setTries((t) => t + 1)
    recordAttempt(q.id, res.correct, label)
    onResult?.(res.correct, res)
  }

  function retry() {
    setResult(null)
    setError('')
    setShowSolution(false)
    if (isMC) setSelected(null)
  }

  const allHints = q.hints || []

  return (
    <div className="question">
      <div className="q-prompt"><Rich text={q.prompt} /></div>
      <QuestionMedia q={q} />

      <form onSubmit={check} className="stack">
        {isMC ? (
          <ul className="choices" role="list">
            {q.choices.map((c, i) => {
              const reveal = (result && (i === selected || (result.correct && i === correctIndex))) || showSolution
              const cls = reveal ? (i === correctIndex ? 'correct' : i === selected || showSolution ? 'wrong' : '') : ''
              return (
                <li key={i}>
                  <button
                    type="button"
                    className={`choice ${cls}`}
                    aria-pressed={selected === i}
                    disabled={locked}
                    onClick={() => { setSelected(i); setError('') }}
                  >
                    <span className="letter" aria-hidden="true">{reveal && i === correctIndex ? <Check size={13} /> : reveal && cls === 'wrong' ? <X size={13} /> : LETTERS[i]}</span>
                    <span>
                      <Rich text={c.text} />
                      {reveal && (i === selected || showSolution) && c.why && <div className="choice-why"><Rich text={c.why} /></div>}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="field" style={{ maxWidth: 340 }}>
            <label htmlFor={`ans-${q.id}`}>Your answer{q.rounding ? ` (round to ${q.rounding})` : ''}</label>
            <input
              id={`ans-${q.id}`}
              className="input"
              inputMode="text"
              autoComplete="off"
              value={input}
              disabled={locked}
              aria-invalid={!!error}
              aria-describedby={error ? `err-${q.id}` : undefined}
              onChange={(e) => { setInput(e.target.value); setError('') }}
              placeholder="e.g. 3/4 or 2.5"
            />
            {input && !locked && parseNumber(input) !== null && /[a-z/^(]/i.test(input) && (
              <span className="tiny faint">Reads as ≈ {Number(parseNumber(input).toPrecision(6))}</span>
            )}
          </div>
        )}

        {error && <div className="field-error" id={`err-${q.id}`} role="alert">{error}</div>}

        {result && (
          <div className={`callout ${result.correct ? 'callout-good' : 'callout-bad'} fade-in`} role="status">
            {result.correct ? <CircleCheck /> : <TriangleAlert />}
            <div>
              {result.correct ? (
                <><strong>Correct!</strong>{!isMC && q.display && <> The answer is <Rich text={q.display} />.</>}{tries > 1 && ' Nice persistence.'}</>
              ) : (
                <>
                  <strong>Not quite.</strong>{' '}
                  {isMC ? 'Read the note under your choice, then try again or reveal the solution.' : result.trap ? <Rich text={result.trap.why} /> : 'Check each step. A hint might help, or try again.'}
                </>
              )}
            </div>
          </div>
        )}

        <div className="row">
          {!result && !showSolution && <button type="submit" className="btn btn-primary"><Check aria-hidden="true" /> Check answer</button>}
          {result && !result.correct && !showSolution && <button type="button" className="btn btn-soft" onClick={retry}><RotateCcw aria-hidden="true" /> Try again</button>}
          {(result?.correct || showSolution) && <button type="button" className="btn btn-outline" onClick={() => { retry(); setInput(''); setHints(0) }}><RotateCcw aria-hidden="true" /> Reset question</button>}
          {!lesson && allHints.length > 0 && hints < allHints.length && !showSolution && (
            <button type="button" className="btn btn-ghost" onClick={() => setHints((h) => h + 1)}>
              <Lightbulb aria-hidden="true" /> {hints === 0 ? 'Show a hint' : 'Next hint'} <span className="faint">({hints + 1}/{allHints.length})</span>
            </button>
          )}
          {!lesson && !showSolution && (
            <button type="button" className="btn btn-ghost" onClick={() => setShowSolution(true)}><Eye aria-hidden="true" /> Show solution</button>
          )}
          {saveItem && <span style={{ marginLeft: 'auto' }}><SaveButton item={saveItem} /></span>}
        </div>
      </form>

      {!lesson && hints > 0 && (
        <div className="hint-list" aria-live="polite">
          {allHints.slice(0, hints).map((h, i) => (
            <div key={i} className="callout callout-info fade-in"><Lightbulb /><div><strong>Hint {i + 1}.</strong> <Rich text={h} /></div></div>
          ))}
        </div>
      )}

      {!lesson && showSolution && (
        <div className="stack fade-in">
          <h4>Solution</h4>
          {!isMC && q.display && <div className="callout callout-good"><CircleCheck /><div>Answer: <Rich text={q.display} />{q.rounding && <span className="muted"> (rounded to {q.rounding})</span>}</div></div>}
          <SolutionSteps steps={q.solution} />
          {!isMC && q.traps?.length > 0 && (
            <div className="callout callout-warn"><TriangleAlert /><div><strong>Common wrong answers</strong>
              <ul>{q.traps.map((t, i) => <li key={i}><span className="num">{formatTrap(t.value)}</span>: <Rich text={t.why} /></li>)}</ul>
            </div></div>
          )}
        </div>
      )}
    </div>
  )
}

export function formatTrap(v) {
  return Number.isInteger(v) ? String(v) : String(Number(v.toPrecision(5)))
}
