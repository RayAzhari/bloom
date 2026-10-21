import { ArrowRight, BookmarkCheck, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { useBloom } from '../state/BloomStore'
import Question from './Question'
import HelperLesson from './HelperLesson'
import { Empty } from './ui'
import { href, navigate } from '../lib/router'
import { timeAgo } from '../lib/date'
import { Rich } from './Rich'

const LEVEL = { intro: 'Intro', core: 'Core', challenge: 'Challenge' }

/** A navigable set of practice questions with per-question attempt status. */
export function PracticeSet({ questions, selectedId, onSelect, course, saveTitle, routeFor, intro }) {
  const { attempts } = useBloom()
  const idx = Math.max(0, questions.findIndex((q) => q.id === selectedId))
  const q = questions[idx]
  if (!q) return <Empty title="No questions match">Try a different filter.</Empty>

  const solvedCount = questions.filter((x) => attempts[x.id]?.correct).length

  return (
    <div className="stack-lg">
      <div className="row between">
        <nav className="q-nav" aria-label="Questions">
          {questions.map((x, i) => {
            const a = attempts[x.id]
            return (
              <button key={x.id} className={`q-dot ${a?.correct ? 'solved' : a ? 'tried' : ''}`} aria-current={i === idx} onClick={() => onSelect(x.id)}
                aria-label={`Question ${i + 1}${a?.correct ? ', solved' : a ? ', attempted' : ''}`}>
                {i + 1}
              </button>
            )
          })}
        </nav>
        <span className="small muted num">{solvedCount} of {questions.length} solved on latest try</span>
      </div>
      {intro}
      <article className="card" aria-labelledby={`q-title-${q.id}`}>
        <div className="card-head">
          <h3 id={`q-title-${q.id}`} className="row" style={{ gap: 8 }}>
            Question {idx + 1}
            {q.level && <span className={`tag tag-level-${q.level}`}>{LEVEL[q.level]}</span>}
            {q.skillLabel && <span className="tag">{q.skillLabel}</span>}
          </h3>
          <div className="row" style={{ gap: 2 }}>
            <button className="icon-btn" onClick={() => onSelect(questions[idx - 1].id)} disabled={idx === 0} aria-label="Previous question"><ChevronLeft /></button>
            <button className="icon-btn" onClick={() => onSelect(questions[idx + 1].id)} disabled={idx === questions.length - 1} aria-label="Next question"><ChevronRight /></button>
          </div>
        </div>
        <Question
          key={q.id}
          q={q}
          label={`${saveTitle(q)}`}
          saveItem={{ id: q.id, course, kind: 'question', title: saveTitle(q), route: routeFor(q) }}
        />
        {idx < questions.length - 1 && (
          <div className="row" style={{ justifyContent: 'flex-end', marginTop: 14 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => onSelect(questions[idx + 1].id)}>Next question <ArrowRight aria-hidden="true" /></button>
          </div>
        )}
      </article>
    </div>
  )
}

/** Chooser + six-step lesson. */
export function LessonPicker({ lessons, selectedId, onSelect, course, groupLabel }) {
  const lesson = lessons.find((l) => l.id === selectedId) || lessons[0]
  return (
    <div className="stack-lg">
      <div className="callout callout-info small">
        <BookmarkCheck />
        <div>
          <strong>Prepared lessons, not an AI tutor.</strong> Each lesson uses explanations and questions written in advance and stored in the app. It walks through the same six steps: explain → example → reasoning → hint → your attempt → solution.
        </div>
      </div>
      <div className="chips" role="group" aria-label="Choose a lesson">
        {lessons.map((l) => (
          <button key={l.id} className="chip" aria-pressed={l.id === lesson.id} onClick={() => onSelect(l.id)}>
            {l.title}{groupLabel && <span className="faint" style={{ fontWeight: 600 }}> · {groupLabel(l)}</span>}
          </button>
        ))}
      </div>
      <HelperLesson key={lesson.id} lesson={lesson} course={course} />
    </div>
  )
}

/** Items the student saved for later review. */
export function SavedList({ course, compact }) {
  const { review, removeSaved } = useBloom()
  const items = review.filter((r) => !course || r.course === course)
  if (!items.length) {
    return (
      <Empty title="Nothing saved yet">
        Use “Save for review” on a concept, example, or question to collect things you want to come back to.
      </Empty>
    )
  }
  return (
    <ul className="plain-list">
      {items.map((r) => (
        <li key={r.id}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700 }}><Rich text={r.title} /></div>
            <div className="tiny faint">
              {!course && <span className={`tag tag-${r.course}`} style={{ marginRight: 6 }}>{r.course === 'math' ? 'Math MA' : 'LS 1A'}</span>}
              {r.kind} · saved {timeAgo(r.addedAt)}
            </div>
          </div>
          {r.route && (
            <a className="btn btn-outline btn-sm" href={href(r.route)}>{compact ? 'Open' : 'Go to it'}</a>
          )}
          <button className="icon-btn danger" onClick={() => removeSaved(r.id)} aria-label={`Remove “${r.title}” from review list`}><Trash2 /></button>
        </li>
      ))}
    </ul>
  )
}

export const go = (path) => navigate(path)
