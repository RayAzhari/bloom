import { useEffect, useRef } from 'react'
import { FlaskConical, House, ListChecks, Sigma, Sprout, Timer as TimerIcon } from 'lucide-react'
import { Analytics } from '@vercel/analytics/react'
import { useRoute, href } from './lib/router'
import { useBloom } from './state/BloomStore'
import { useTimer } from './state/TimerStore'
import { formatClock } from './lib/date'
import { Logo, Flower } from './components/Decor'
import Dashboard from './pages/Dashboard'
import TasksPage from './pages/TasksPage'
import FocusPage from './pages/FocusPage'
import MathPage from './pages/MathPage'
import LSPage from './pages/LSPage'
import ProgressPage from './pages/ProgressPage'
import StudyBuddy from './components/StudyBuddy'

const NAV = [
  { id: '', label: 'Home', short: 'Home', icon: House },
  { id: 'tasks', label: 'Tasks', short: 'Tasks', icon: ListChecks },
  { id: 'focus', label: 'Focus timer', short: 'Focus', icon: TimerIcon },
  { id: 'math', label: 'Math MA', short: 'Math', icon: Sigma, group: 'Courses' },
  { id: 'ls1a', label: 'LS 1A', short: 'LS 1A', icon: FlaskConical },
  { id: 'progress', label: 'Progress', short: 'Progress', icon: Sprout, group: 'You' },
]

const TITLES = { '': 'Home', tasks: 'Tasks', focus: 'Focus timer', math: 'Math MA', ls1a: 'LS 1A', progress: 'Progress' }

function Brand() {
  return (
    <a href={href('')} className="brand" aria-label="Bloom home">
      <Logo />
      <span className="brand-name">Bl<em>oo</em>m</span>
    </a>
  )
}

export default function App() {
  const parts = useRoute()
  const page = NAV.some((n) => n.id === parts[0]) ? parts[0] : ''
  const { tasks } = useBloom()
  const { status, remaining, mode } = useTimer()
  const open = tasks.filter((t) => !t.done).length
  const mainRef = useRef(null)
  const firstRender = useRef(true)

  // On page change: scroll to top and move focus to main content for screen readers.
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    window.scrollTo({ top: 0 })
    mainRef.current?.focus({ preventScroll: true })
  }, [page])

  let content
  if (page === 'tasks') content = <TasksPage />
  else if (page === 'focus') content = <FocusPage />
  else if (page === 'math') content = <MathPage parts={parts} />
  else if (page === 'ls1a') content = <LSPage parts={parts} />
  else if (page === 'progress') content = <ProgressPage />
  else content = <Dashboard />

  return (
    <div className="shell">
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); mainRef.current?.focus() }}>Skip to content</a>

      <aside className="sidebar" aria-label="Sidebar">
        <Brand />
        <nav className="nav" aria-label="Main">
          {NAV.map((n) => {
            const Icon = n.icon
            return (
              <div key={n.id}>
                {n.group && <div className="nav-label">{n.group}</div>}
                <a href={href(n.id)} className="nav-link" aria-current={page === n.id ? 'page' : undefined}>
                  <Icon aria-hidden="true" /> {n.label}
                  {n.id === 'tasks' && open > 0 && <span className="nav-dot">{open}</span>}
                </a>
              </div>
            )
          })}
        </nav>
        <div className="sidebar-foot">
          {status === 'idle' ? (
            <div className="row" style={{ gap: 8 }}><Flower size={20} /> <span>Small steps, every day.</span></div>
          ) : (
            <a href={href('focus')} className="mini-timer">
              <TimerIcon size={16} aria-hidden="true" />
              {mode === 'focus' ? 'Focusing' : 'On a break'} · <span className="time">{formatClock(remaining)}</span>
              {status === 'paused' && <span className="tag">paused</span>}
            </a>
          )}
        </div>
      </aside>

      <header className="topbar">
        <Brand />
        {status !== 'idle' && (
          <a href={href('focus')} className="tag tag-math num" style={{ textDecoration: 'none', fontSize: '0.8rem' }}>
            <TimerIcon aria-hidden="true" /> {formatClock(remaining)}{status === 'paused' ? ' · paused' : ''}
          </a>
        )}
      </header>

      <main id="main" className="main" ref={mainRef} tabIndex={-1} aria-label={TITLES[page]} style={{ outline: 'none' }}>
        {content}
      </main>

      <StudyBuddy page={page} />

      <nav className="bottom-nav" aria-label="Main">
        {NAV.map((n) => {
          const Icon = n.icon
          return (
            <a key={n.id} href={href(n.id)} aria-current={page === n.id ? 'page' : undefined}>
              <Icon aria-hidden="true" /> {n.short}
            </a>
          )
        })}
      </nav>

      <Analytics />
    </div>
  )
}
