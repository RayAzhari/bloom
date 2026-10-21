import { useState } from 'react'
import { ArrowRight, ChevronLeft, CircleCheck, Info, Lightbulb, TriangleAlert } from 'lucide-react'
import { Paras, Rich, DataTable, Plot } from './Rich'
import LSFigure from './LSFigures'
import Question, { SolutionSteps, formatTrap } from './Question'

const STEPS = ['Explain', 'Example', 'Reasoning', 'Hint', 'Your turn', 'Solution']

/** Six-step guided lesson. Uses prepared content only (no AI). */
export default function HelperLesson({ lesson, course }) {
  const [step, setStep] = useState(0)
  const [attempt, setAttempt] = useState(null) // { correct, detail }
  const q = lesson.question
  const ex = lesson.example

  const go = (n) => {
    setStep(n)
    // Keep focus/scroll near the lesson on small screens.
    document.getElementById(`lesson-${lesson.id}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }

  return (
    <section className="card stack-lg" id={`lesson-${lesson.id}`} aria-labelledby={`lesson-title-${lesson.id}`}>
      <div className="stack" style={{ gap: 10 }}>
        <div className="row between">
          <h2 id={`lesson-title-${lesson.id}`}>{lesson.title}</h2>
          <span className="tag">Step {step + 1} of 6 · {STEPS[step]}</span>
        </div>
        <div className="helper-steps" aria-hidden="true">{STEPS.map((s, i) => <span key={s} className={i <= step ? 'on' : ''} />)}</div>
        <nav className="chips" aria-label="Lesson steps">
          {STEPS.map((s, i) => (
            <button key={s} className="chip" aria-pressed={i === step} onClick={() => go(i)} aria-label={`Step ${i + 1}: ${s}`}>
              {i + 1}. {s}
            </button>
          ))}
        </nav>
      </div>

      <div className="fade-in" key={step}>
        {step === 0 && <div className="prose"><Paras items={lesson.explain} /></div>}

        {step === 1 && (
          <div className="stack">
            <div className="callout callout-info"><Info /><div><strong>Example.</strong> <Rich text={ex.problem} /></div></div>
            {ex.table && <DataTable table={ex.table} />}
            {ex.plot && <Plot spec={ex.plot} />}
            {ex.figure && <LSFigure name={ex.figure} />}
            <p><strong>Result:</strong> <Rich text={ex.answer} /></p>
          </div>
        )}

        {step === 2 && (
          <div className="stack">
            <p className="muted">Here is how the example works, one step at a time:</p>
            <SolutionSteps steps={lesson.steps} />
          </div>
        )}

        {step === 3 && (
          <div className="stack">
            <p className="muted">Your turn is next. Here is the question you will try, with one hint to get started:</p>
            <div className="callout callout-info"><Rich text={q.prompt} /></div>
            <div className="callout callout-tip"><Lightbulb /><div><strong>Hint.</strong> <Rich text={lesson.hint} /></div></div>
          </div>
        )}

        {step === 4 && (
          <Question
            q={q}
            lesson
            label={`${lesson.title} (lesson)`}
            onResult={(correct, detail) => setAttempt({ correct, detail })}
          />
        )}

        {step === 5 && (
          <div className="stack">
            {attempt ? (
              <div className={`callout ${attempt.correct ? 'callout-good' : 'callout-bad'}`}>
                {attempt.correct ? <CircleCheck /> : <TriangleAlert />}
                <div>
                  {attempt.correct ? 'You got it. Here is the full reasoning to compare with yours.' : (
                    <>
                      Your last answer wasn’t right, and that’s fine. Here is what likely happened:{' '}
                      {q.type === 'mc'
                        ? 'the note next to each option below explains why it is or isn’t right.'
                        : attempt.detail?.trap ? <Rich text={attempt.detail.trap.why} /> : 'compare your steps with the solution below.'}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="callout callout-info"><Info /><div>You haven’t tried the question yet. You can go back to step 5 first, or just read the solution.</div></div>
            )}

            <div className="q-prompt"><Rich text={q.prompt} /></div>

            {q.type === 'mc' ? (
              <ul className="choices" role="list">
                {q.choices.map((c, i) => (
                  <li key={i} className={`choice ${c.correct ? 'correct' : ''}`} style={{ cursor: 'default' }}>
                    <span className="letter" aria-hidden="true">{'ABCD'[i]}</span>
                    <span><Rich text={c.text} />{c.correct && <strong className="sr-only"> (correct)</strong>}<div className="choice-why"><Rich text={c.why} /></div></span>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <div className="callout callout-good"><CircleCheck /><div>Answer: <Rich text={q.display} /></div></div>
                <SolutionSteps steps={q.solution} />
                {q.traps?.length > 0 && (
                  <div className="callout callout-warn"><TriangleAlert /><div><strong>Common mistakes</strong>
                    <ul>{q.traps.map((t, i) => <li key={i}><span className="num">{formatTrap(t.value)}</span>: <Rich text={t.why} /></li>)}</ul>
                  </div></div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="row between">
        <button className="btn btn-ghost" onClick={() => go(Math.max(0, step - 1))} disabled={step === 0}><ChevronLeft aria-hidden="true" /> Back</button>
        {step < 5 ? (
          <button className={`btn ${course === 'ls1a' ? 'btn-sage' : 'btn-primary'}`} onClick={() => go(step + 1)}>
            {step === 4 && !attempt ? 'Skip to solution' : `Next: ${STEPS[step + 1]}`} <ArrowRight aria-hidden="true" />
          </button>
        ) : (
          <button className="btn btn-outline" onClick={() => { setAttempt(null); go(0) }}>Start over</button>
        )}
      </div>
    </section>
  )
}
