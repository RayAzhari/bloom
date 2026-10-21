import { useMemo } from 'react'
import { ArrowRight, ChevronRight, CircleCheck, FlaskConical, ListChecks, Sigma, Sprout, Timer as TimerIcon } from 'lucide-react'
import { isOnTodayList, useBloom } from '../state/BloomStore'
import { greeting, todayKey } from '../lib/date'
import { dailyMessages, pickDaily } from '../content/messages'
import { Flower, Sprig } from '../components/Decor'
import { TaskItem, QuickAdd } from '../components/Tasks'
import { Celebration, CoursePicker, TimerControls, TimerRing } from '../components/Timer'
import BloomFlower from '../components/BloomFlower'
import { Empty } from '../components/ui'
import { href } from '../lib/router'

export default function Dashboard() {
  const { tasks, sessions } = useBloom()
  const today = todayKey()
  const todays = useMemo(() => tasks.filter((t) => isOnTodayList(t, today)), [tasks, today])
  const ordered = useMemo(() => [...todays].sort((a, b) => Number(a.done) - Number(b.done) || (a.done ? b.completedAt - a.completedAt : 0)), [todays])
  const doneToday = todays.filter((t) => t.done).length
  const remaining = tasks.filter((t) => !t.done).length
  const completedToday = tasks.filter((t) => t.done && t.completedAt && new Date(t.completedAt).toDateString() === new Date().toDateString()).length
  const sessionsToday = sessions.filter((s) => new Date(s.completedAt).toDateString() === new Date().toDateString()).length
  const next = todays.find((t) => !t.done)

  return (
    <div className="stack-lg">
      <section className="card tint-blush hello" aria-labelledby="hello-title">
        <div>
          <h1 id="hello-title">{greeting()}.</h1>
          <p className="muted" style={{ marginTop: 4 }}>
            {next ? <>Next up: <strong style={{ color: 'var(--ink)' }}>{next.title}</strong></> : todays.length ? 'Everything on today’s list is done. Lovely work.' : 'Add one small task to get started.'}
          </p>
          <div className="stat-row">
            <div className="stat"><div className="stat-icon"><ListChecks aria-hidden="true" /></div><div><b>{remaining}</b><span>tasks remaining</span></div></div>
            <div className="stat"><div className="stat-icon sage"><CircleCheck aria-hidden="true" /></div><div><b>{completedToday}</b><span>completed today</span></div></div>
            <div className="stat"><div className="stat-icon butter"><TimerIcon aria-hidden="true" /></div><div><b>{sessionsToday}</b><span>focus sessions today</span></div></div>
          </div>
        </div>
        <Sprig className="hello-art" />
      </section>

      <div className="dash">
        <div className="stack-lg">
          <section className="card" aria-labelledby="today-title">
            <div className="card-head">
              <h2 id="today-title"><Sprout aria-hidden="true" /> Today’s list</h2>
              <a href={href('tasks')} className="btn btn-ghost btn-sm">All tasks <ChevronRight aria-hidden="true" /></a>
            </div>
            <div className="bloom-progress" style={{ marginBottom: 16 }}>
              <BloomFlower done={doneToday} total={todays.length} size={84} />
              <div style={{ flex: 1 }}>
                <div className="row between small" style={{ marginBottom: 6 }}>
                  <strong>{todays.length ? `${doneToday} of ${todays.length} done` : 'Nothing planned yet'}</strong>
                  {todays.length > 0 && doneToday === todays.length && <span className="tag tag-ls1a">In full bloom</span>}
                </div>
                <div className="progress-bar" role="progressbar" aria-label="Today’s list progress" aria-valuemin={0} aria-valuemax={todays.length || 1} aria-valuenow={doneToday}>
                  <span style={{ width: `${todays.length ? (doneToday / todays.length) * 100 : 0}%` }} />
                </div>
                <p className="tiny faint" style={{ marginTop: 6 }}>A petal opens for each task you finish. Tasks due today, overdue, or added with the sun icon appear here.</p>
              </div>
            </div>
            <QuickAdd />
            <div style={{ marginTop: 12 }}>
              {ordered.length ? (
                <ul className="task-list">{ordered.map((t) => <TaskItem key={t.id} task={t} showDesc={false} />)}</ul>
              ) : (
                <Empty title="A fresh page">Add a task above, or use the sun icon on the Tasks page to bring something onto today’s list.</Empty>
              )}
            </div>
          </section>

          <section aria-labelledby="courses-title" className="stack">
            <h2 id="courses-title" className="sr-only">Courses</h2>
            <div className="grid grid-2">
              <a href={href('math')} className="course-tile ct-math">
                <div className="ct-icon"><Sigma aria-hidden="true" /></div>
                <div><h3>Math MA</h3><p>Functions · Rates of change · Limits · Applications</p></div>
                <ArrowRight className="ct-go" aria-hidden="true" />
              </a>
              <a href={href('ls1a')} className="course-tile ct-ls1a">
                <div className="ct-icon"><FlaskConical aria-hidden="true" /></div>
                <div><h3>LS 1A</h3><p>Concepts · Flashcards · Reasoning practice</p></div>
                <ArrowRight className="ct-go" aria-hidden="true" />
              </a>
            </div>
          </section>
        </div>

        <div className="stack-lg">
          <section className="card" aria-labelledby="timer-title">
            <div className="card-head">
              <h2 id="timer-title"><TimerIcon aria-hidden="true" /> Focus timer</h2>
              <a href={href('focus')} className="btn btn-ghost btn-sm">Open <ChevronRight aria-hidden="true" /></a>
            </div>
            <div className="timer-wrap">
              <TimerRing size={200} stroke={9} />
              <TimerControls />
              <CoursePicker id="dash-course" />
              <Celebration />
            </div>
          </section>

          <section className="card tint-sage" aria-label="Today’s encouragement">
            <div className="encourage">
              <Flower size={22} petal="#c4d5b9" />
              <p style={{ margin: 0 }}>{pickDaily(dailyMessages, today)}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
