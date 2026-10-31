import { useMemo, useState } from 'react'
import { Bookmark, CircleCheck, History, Layers, PenLine, Sprout, Timer as TimerIcon, Trash2 } from 'lucide-react'
import { COURSE_LABEL, useBloom } from '../state/BloomStore'
import { lsCards, lsCategories } from '../content/ls1a'
import { mathUnits } from '../content/math'
import { lsPractice } from '../content/ls1a'
import { SavedList } from '../components/Study'
import { Empty, Modal } from '../components/ui'
import { timeAgo } from '../lib/date'
import { clearAll } from '../lib/storage'
import { href } from '../lib/router'

const ICON = { task: CircleCheck, focus: TimerIcon, review: Bookmark, practice: PenLine, flashcard: Layers }

function weekStart() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - 6)
  return d.getTime()
}

export default function ProgressPage() {
  const { tasks, sessions, cards, attempts, activity, settings, setSettings } = useBloom()
  const [confirm, setConfirm] = useState(false)
  const since = weekStart()
  const todayStr = new Date().toDateString()

  const stats = useMemo(() => {
    const done = tasks.filter((t) => t.done)
    const sessionsWeek = sessions.filter((s) => s.completedAt >= since)
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(since + i * 86400000)
      return { label: d.toLocaleDateString(undefined, { weekday: 'short' }), key: d.toDateString(), n: 0, tasks: 0 }
    })
    sessionsWeek.forEach((s) => { const day = days.find((d) => d.key === new Date(s.completedAt).toDateString()); if (day) day.n++ })
    done.forEach((t) => { const day = days.find((d) => d.key === new Date(t.completedAt).toDateString()); if (day) day.tasks++ })
    const allMathQ = mathUnits.flatMap((u) => [...u.practice, ...u.check])
    return {
      doneTotal: done.length,
      doneToday: done.filter((t) => new Date(t.completedAt).toDateString() === todayStr).length,
      sessionsToday: sessions.filter((s) => new Date(s.completedAt).toDateString() === todayStr).length,
      sessionsWeek: sessionsWeek.length,
      minutesWeek: sessionsWeek.reduce((a, s) => a + s.minutes, 0),
      days,
      mathTried: allMathQ.filter((q) => attempts[q.id]).length,
      mathSolved: allMathQ.filter((q) => attempts[q.id]?.correct).length,
      mathTotal: allMathQ.length,
      lsTried: lsPractice.filter((q) => attempts[q.id]).length,
      lsSolved: lsPractice.filter((q) => attempts[q.id]?.correct).length,
      lsTotal: lsPractice.length,
    }
  }, [tasks, sessions, attempts, since, todayStr])

  const revisit = lsCards.filter((c) => cards[c.id]?.status === 'review')
  const known = lsCards.filter((c) => cards[c.id]?.status === 'know').length
  const maxDay = Math.max(1, ...stats.days.map((d) => d.n + d.tasks))

  return (
    <div className="stack-lg">
      <header className="page-head">
        <div>
          <span className="eyebrow"><Sprout size={14} aria-hidden="true" /> Progress</span>
          <h1>Review & progress</h1>
          <p className="sub">A plain record of what you’ve done. Time spent and questions answered show effort, not mastery, so use them to plan rather than to judge yourself.</p>
        </div>
      </header>

      <div className="grid grid-3">
        <div className="card stat-card">
          <div className="stat" style={{ border: 0, padding: 0, background: 'none' }}>
            <div className="stat-icon sage"><CircleCheck aria-hidden="true" /></div>
            <div><b>{stats.doneTotal}</b><span>tasks completed · {stats.doneToday} today</span></div>
          </div>
        </div>
        <div className="card">
          <div className="stat" style={{ border: 0, padding: 0, background: 'none' }}>
            <div className="stat-icon butter"><TimerIcon aria-hidden="true" /></div>
            <div><b>{stats.sessionsWeek}</b><span>focus sessions in 7 days · {stats.minutesWeek} min · {stats.sessionsToday} today</span></div>
          </div>
        </div>
        <div className="card">
          <div className="stat" style={{ border: 0, padding: 0, background: 'none' }}>
            <div className="stat-icon"><Layers aria-hidden="true" /></div>
            <div><b>{revisit.length}</b><span>flashcards to revisit · {known} marked “know it”</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <section className="card" aria-labelledby="week-title">
          <div className="card-head"><h2 id="week-title"><History aria-hidden="true" /> Last 7 days</h2></div>
          <div role="img" aria-label={`Completed tasks and focus sessions per day: ${stats.days.map((d) => `${d.label} ${d.tasks} tasks, ${d.n} sessions`).join('; ')}`}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, alignItems: 'end', height: 130 }}>
            {stats.days.map((d) => (
              <div key={d.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '70%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                  <div style={{ height: `${(d.n / maxDay) * 100}%`, background: 'var(--butter-300)', borderRadius: '6px 6px 0 0', minHeight: d.n ? 4 : 0 }} />
                  <div style={{ height: `${(d.tasks / maxDay) * 100}%`, background: 'var(--sage-300)', borderRadius: d.n ? 0 : '6px 6px 0 0', minHeight: d.tasks ? 4 : 0 }} />
                  {!d.n && !d.tasks && <div style={{ height: 3, background: 'var(--line)', borderRadius: 3 }} />}
                </div>
                <span className="tiny faint" style={{ fontWeight: d.key === todayStr ? 800 : 600, color: d.key === todayStr ? 'var(--rose-600)' : undefined }}>{d.label}</span>
              </div>
            ))}
          </div>
          <div className="row tiny muted" style={{ marginTop: 10 }}>
            <span className="row" style={{ gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--sage-300)' }} /> tasks completed</span>
            <span className="row" style={{ gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--butter-300)' }} /> focus sessions</span>
          </div>
        </section>

        <section className="card" aria-labelledby="practice-title">
          <div className="card-head"><h2 id="practice-title"><PenLine aria-hidden="true" /> Practice attempted</h2></div>
          <div className="stack">
            {[['Math MA', stats.mathTried, stats.mathSolved, stats.mathTotal, ''], ['LS 1A', stats.lsTried, stats.lsSolved, stats.lsTotal, 'sage']].map(([name, tried, solved, total, tone]) => (
              <div key={name} className="stack" style={{ gap: 6 }}>
                <div className="row between small"><strong>{name}</strong><span className="muted num">{tried} of {total} tried · {solved} correct on latest try</span></div>
                <div className={`progress-bar ${tone}`} aria-hidden="true"><span style={{ width: `${(tried / total) * 100}%` }} /></div>
              </div>
            ))}
            <p className="tiny faint" style={{ margin: 0 }}>“Correct on latest try” counts retries, so it shows practice, not a test score.</p>
          </div>
        </section>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <section className="card" aria-labelledby="saved-title">
          <div className="card-head"><h2 id="saved-title"><Bookmark aria-hidden="true" /> Saved for review</h2></div>
          <SavedList compact />
        </section>

        <section className="card" aria-labelledby="revisit-title">
          <div className="card-head">
            <h2 id="revisit-title"><Layers aria-hidden="true" /> Flashcards to revisit</h2>
            {revisit.length > 0 && <a className="btn btn-ghost btn-sm" href={href('ls1a/flashcards')}>Study them</a>}
          </div>
          {revisit.length ? (
            <ul className="plain-list small">
              {revisit.map((c) => (
                <li key={c.id}><span className="tag tag-ls1a">{lsCategories.find((x) => x.id === c.category)?.short}</span> {c.front}</li>
              ))}
            </ul>
          ) : (
            <Empty title="No cards to revisit">Cards you mark “Need to review” in LS 1A flashcards will show up here.</Empty>
          )}
        </section>
      </div>

      <section className="card" aria-labelledby="activity-title">
        <div className="card-head"><h2 id="activity-title"><History aria-hidden="true" /> Recent activity</h2></div>
        {activity.length ? (
          <ul className="plain-list small">
            {activity.slice(0, 15).map((a, i) => {
              const Icon = ICON[a.type] || Sprout
              return (
                <li key={i}>
                  <Icon size={16} aria-hidden="true" style={{ color: 'var(--rose-400)', flex: 'none' }} />
                  <span style={{ flex: 1, minWidth: 0 }}>{a.label}</span>
                  <span className="faint" style={{ whiteSpace: 'nowrap' }}>{timeAgo(a.at)}</span>
                </li>
              )
            })}
          </ul>
        ) : (
          <Empty title="Nothing here yet">Completed tasks, focus sessions, and practice will appear here as you go.</Empty>
        )}
      </section>

      <section className="card flat small row between">
        <span className="muted"><strong style={{ color: 'var(--ink)' }}>Petal, your study buddy</strong>: strolls around, shares tips when tapped, and naps during focus sessions.</span>
        <button className="btn btn-outline btn-sm" onClick={() => setSettings((s) => ({ ...s, buddy: s.buddy === false }))} aria-pressed={settings.buddy !== false}>
          {settings.buddy !== false ? 'Hide Petal' : 'Bring Petal back'}
        </button>
      </section>

      <section className="card flat small muted row between">
        <span>Your tasks, answers, flashcards, and settings are stored only in this browser (localStorage) and are never uploaded. The site does count anonymous page visits with Vercel Web Analytics, which uses no cookies. Clearing your browser data also clears Bloom.</span>
        <button className="btn btn-ghost btn-sm" onClick={() => setConfirm(true)}><Trash2 aria-hidden="true" /> Reset all data</button>
      </section>

      {confirm && (
        <Modal title="Reset Bloom?" onClose={() => setConfirm(false)} labelId="reset-title"
          footer={<>
            <button className="btn btn-ghost" onClick={() => setConfirm(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={() => { clearAll(); window.location.hash = '#/'; window.location.reload() }}>Yes, erase everything</button>
          </>}>
          <p>This permanently deletes your tasks, focus history, saved items, flashcard progress, and settings from this browser. It can’t be undone.</p>
          <p className="small muted">Sessions by course so far: {Object.entries(COURSE_LABEL).map(([k, v]) => `${v} ${sessions.filter((s) => s.course === k).length}`).join(' · ')}</p>
        </Modal>
      )}
    </div>
  )
}
