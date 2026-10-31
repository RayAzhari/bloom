import { useMemo, useState } from 'react'
import { CalendarDays, ChevronDown, ListChecks, Plus } from 'lucide-react'
import { COURSE_LABEL, useBloom } from '../state/BloomStore'
import { daysUntil } from '../lib/date'
import { TaskForm, TaskItem } from '../components/Tasks'
import { Empty, Tabs } from '../components/ui'

const PRI = { high: 0, medium: 1, low: 2 }

function sortActive(a, b) {
  const da = a.due ? daysUntil(a.due) : Infinity
  const db = b.due ? daysUntil(b.due) : Infinity
  return da - db || PRI[a.priority] - PRI[b.priority] || b.createdAt - a.createdAt
}

export default function TasksPage() {
  const { tasks } = useBloom()
  const [course, setCourse] = useState('all')
  const [status, setStatus] = useState('active')
  const [creating, setCreating] = useState(false)
  const [showDone, setShowDone] = useState(true)

  const byCourse = useMemo(() => tasks.filter((t) => course === 'all' || t.course === course), [tasks, course])
  const active = useMemo(() => byCourse.filter((t) => !t.done).sort(sortActive), [byCourse])
  const done = useMemo(() => byCourse.filter((t) => t.done).sort((a, b) => b.completedAt - a.completedAt), [byCourse])
  const upcoming = useMemo(
    () => tasks.filter((t) => !t.done && t.due && daysUntil(t.due) <= 14).sort(sortActive).slice(0, 6),
    [tasks],
  )

  return (
    <div className="stack-lg">
      <header className="page-head">
        <div>
          <span className="eyebrow"><ListChecks size={14} aria-hidden="true" /> Tasks</span>
          <h1>Assignments & to-dos</h1>
          <p className="sub">Quick to add, easy to finish. The sun icon puts a task on today’s list.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}><Plus aria-hidden="true" /> New task</button>
      </header>

      <div className="dash">
        <div className="stack-lg">
          <div className="card stack">
            <div className="row between">
              <Tabs label="Task status" value={status} onChange={setStatus} tabs={[
                { id: 'active', label: `To do · ${active.length}` },
                { id: 'done', label: `Completed · ${done.length}` },
                { id: 'all', label: 'All' },
              ]} />
            </div>
            <div className="chips" role="group" aria-label="Filter by course">
              <button className="chip" aria-pressed={course === 'all'} onClick={() => setCourse('all')}>All courses</button>
              {Object.entries(COURSE_LABEL).map(([k, v]) => (
                <button key={k} className="chip" aria-pressed={course === k} onClick={() => setCourse(k)}>{v}</button>
              ))}
            </div>

            {(status === 'active' || status === 'all') && (
              active.length ? (
                <ul className="task-list">{active.map((t) => <TaskItem key={t.id} task={t} boxed />)}</ul>
              ) : (
                <Empty title={tasks.length ? 'Nothing left to do here' : 'No tasks yet'} action={<button className="btn btn-soft btn-sm" onClick={() => setCreating(true)}><Plus aria-hidden="true" /> Add a task</button>}>
                  {course !== 'all' ? `No open ${COURSE_LABEL[course]} tasks.` : tasks.length ? 'Every task is complete. Enjoy the quiet.' : 'Add your first assignment or reading.'}
                </Empty>
              )
            )}

            {status === 'done' && (
              done.length ? <ul className="task-list">{done.map((t) => <TaskItem key={t.id} task={t} boxed />)}</ul>
                : <Empty title="No completed tasks yet">Finished tasks will collect here.</Empty>
            )}

            {status === 'all' && done.length > 0 && (
              <div className="stack" style={{ marginTop: 6 }}>
                <button className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => setShowDone((s) => !s)} aria-expanded={showDone}>
                  <ChevronDown aria-hidden="true" style={{ transform: showDone ? 'none' : 'rotate(-90deg)', transition: 'transform .2s' }} /> Completed ({done.length})
                </button>
                {showDone && <ul className="task-list">{done.map((t) => <TaskItem key={t.id} task={t} boxed />)}</ul>}
              </div>
            )}
          </div>
        </div>

        <aside className="stack-lg">
          <section className="card" aria-labelledby="upcoming-title">
            <div className="card-head"><h2 id="upcoming-title"><CalendarDays aria-hidden="true" /> Upcoming deadlines</h2></div>
            {upcoming.length ? (
              <ul className="task-list">{upcoming.map((t) => <TaskItem key={t.id} task={t} showDesc={false} />)}</ul>
            ) : (
              <p className="small muted">Nothing due in the next two weeks. Tasks with a due date will show up here.</p>
            )}
          </section>
          <section className="card flat small muted">
            <strong style={{ color: 'var(--ink)' }}>Tips</strong>
            <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
              <li>Overdue and due-today tasks join today’s list automatically.</li>
              <li>Deleted something by accident? Use “Undo” in the message at the bottom.</li>
              <li>Your tasks are saved in this browser only.</li>
            </ul>
          </section>
        </aside>
      </div>

      {creating && <TaskForm onClose={() => setCreating(false)} defaults={course !== 'all' ? { course } : undefined} />}
    </div>
  )
}
