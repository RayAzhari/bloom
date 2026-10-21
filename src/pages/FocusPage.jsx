import { Timer as TimerIcon } from 'lucide-react'
import { useBloom, COURSE_LABEL } from '../state/BloomStore'
import { useTimer } from '../state/TimerStore'
import { Celebration, CoursePicker, DurationSettings, ModeSwitch, TimerControls, TimerRing } from '../components/Timer'
import { Flower } from '../components/Decor'
import { timeAgo } from '../lib/date'

export default function FocusPage() {
  const { sessions } = useBloom()
  const { mode } = useTimer()
  const todayStr = new Date().toDateString()
  const today = sessions.filter((s) => new Date(s.completedAt).toDateString() === todayStr)
  const minutes = today.reduce((a, s) => a + s.minutes, 0)
  const byCourse = Object.keys(COURSE_LABEL).map((k) => [k, today.filter((s) => s.course === k).length]).filter(([, n]) => n)

  return (
    <div className="stack-lg">
      <header className="page-head">
        <div>
          <span className="eyebrow"><TimerIcon size={14} aria-hidden="true" /> Focus</span>
          <h1>Focus timer</h1>
          <p className="sub">Work in focused blocks with short rests in between. The timer keeps accurate time even when this tab is in the background.</p>
        </div>
      </header>

      <div className="dash">
        <section className={`card ${mode === 'break' ? 'tint-sage' : 'tint-blush'}`} aria-label="Timer" style={{ padding: '28px 20px' }}>
          <div className="timer-wrap">
            <ModeSwitch />
            <TimerRing size={280} stroke={12} />
            <TimerControls size="lg" />
            <CoursePicker />
            <DurationSettings />
            <Celebration />
          </div>
        </section>

        <aside className="stack-lg">
          <section className="card" aria-labelledby="today-sessions">
            <div className="card-head"><h2 id="today-sessions"><Flower size={18} /> Today</h2></div>
            {today.length ? (
              <div className="stack">
                <div className="dots" aria-hidden="true" style={{ justifyContent: 'flex-start' }}>
                  {today.map((s) => <span key={s.id} title={COURSE_LABEL[s.course]} style={{ background: s.course === 'ls1a' ? 'var(--sage-300)' : s.course === 'math' ? 'var(--blush-300)' : '#d7cbe2' }} />)}
                </div>
                <p style={{ margin: 0 }}><strong>{today.length}</strong> focus session{today.length === 1 ? '' : 's'} · <strong>{minutes}</strong> minute{minutes === 1 ? '' : 's'}</p>
                <div className="row">{byCourse.map(([k, n]) => <span key={k} className={`tag tag-${k}`}>{COURSE_LABEL[k]} · {n}</span>)}</div>
                <ul className="plain-list small">
                  {[...today].reverse().slice(0, 6).map((s) => (
                    <li key={s.id}><span className={`tag tag-${s.course}`}>{COURSE_LABEL[s.course]}</span> {s.minutes} min <span className="faint" style={{ marginLeft: 'auto' }}>{timeAgo(s.completedAt)}</span></li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="small muted">No completed focus sessions yet today. Finished sessions are counted here; paused or reset ones aren’t.</p>
            )}
          </section>
          <section className="card flat small muted">
            <strong style={{ color: 'var(--ink)' }}>How it works</strong>
            <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
              <li>When a focus block ends, Bloom switches to a break, ready for you to start.</li>
              <li>If you refresh or close the tab, the timer picks up where it should be.</li>
              <li>A soft chime plays at the end (you can turn it off).</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
