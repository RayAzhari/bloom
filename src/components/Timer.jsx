import { useState } from 'react'
import { Coffee, Pause, Play, RotateCcw, Settings2, Sprout, Volume2, VolumeX, X } from 'lucide-react'
import { useTimer } from '../state/TimerStore'
import { COURSE_LABEL, useBloom } from '../state/BloomStore'
import { formatClock } from '../lib/date'
import { BloomBurst } from './Decor'

export function TimerRing({ size = 240, stroke = 10 }) {
  const { remaining, progress, mode, status } = useTimer()
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const Icon = mode === 'focus' ? Sprout : Coffee
  return (
    <div className={`ring ${mode === 'break' ? 'break' : ''}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden="true">
        <circle className="ring-track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
        <circle className="ring-bar" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - progress)} />
      </svg>
      <div className="ring-center">
        <span className="ring-mode"><Icon aria-hidden="true" /> {mode === 'focus' ? 'Focus' : 'Break'}</span>
        <span className="ring-time" style={{ fontSize: size * 0.22 }} role="timer" aria-live="off" aria-label={`${formatClock(remaining)} remaining`}>{formatClock(remaining)}</span>
        <span className="tiny faint" style={{ fontWeight: 700 }}>{status === 'paused' ? 'Paused' : status === 'running' ? 'In progress' : 'Ready'}</span>
      </div>
    </div>
  )
}

export function TimerControls({ size }) {
  const { status, mode, start, pause, resume, reset } = useTimer()
  const big = size === 'lg' ? 'btn-lg' : ''
  const primary = mode === 'break' ? 'btn-sage' : 'btn-primary'
  return (
    <div className="timer-controls">
      {status === 'idle' && <button className={`btn ${primary} ${big}`} onClick={start}><Play aria-hidden="true" /> Start {mode === 'focus' ? 'focus' : 'break'}</button>}
      {status === 'running' && <button className={`btn ${primary} ${big}`} onClick={pause}><Pause aria-hidden="true" /> Pause</button>}
      {status === 'paused' && <button className={`btn ${primary} ${big}`} onClick={resume}><Play aria-hidden="true" /> Resume</button>}
      {status !== 'idle' && <button className={`btn btn-outline ${big}`} onClick={reset}><RotateCcw aria-hidden="true" /> Reset</button>}
    </div>
  )
}

export function Celebration() {
  const { celebration, dismissCelebration } = useTimer()
  if (!celebration) return null
  return (
    <div className={`celebrate ${celebration.kind === 'break' ? 'break' : ''}`} role="status">
      <BloomBurst tone={celebration.kind === 'focus' ? 'sage' : 'rose'} />
      <div style={{ flex: 1 }}>
        <strong>{celebration.kind === 'focus' ? 'Focus session complete' : 'Break finished'}</strong>
        <div className="small muted">{celebration.message}{celebration.whileAway && ' (It finished while you were away.)'}</div>
      </div>
      <button className="icon-btn" onClick={dismissCelebration} aria-label="Dismiss"><X /></button>
    </div>
  )
}

export function ModeSwitch() {
  const { mode, setMode, status } = useTimer()
  const change = (m) => {
    if (m === mode) return
    if (status !== 'idle' && !window.confirm('Switching modes will reset the current timer. Continue?')) return
    setMode(m)
  }
  return (
    <div className="tabs" role="tablist" aria-label="Timer mode">
      <button role="tab" className="tab" aria-selected={mode === 'focus'} onClick={() => change('focus')}><Sprout aria-hidden="true" /> Focus</button>
      <button role="tab" className="tab" aria-selected={mode === 'break'} onClick={() => change('break')}><Coffee aria-hidden="true" /> Break</button>
    </div>
  )
}

export function CoursePicker({ id = 'timer-course' }) {
  const { prefs, updatePrefs, status, mode } = useTimer()
  return (
    <div className="field" style={{ minWidth: 170 }}>
      <label htmlFor={id}>Studying</label>
      <select id={id} className="select" value={prefs.course} onChange={(e) => updatePrefs({ course: e.target.value })} disabled={status !== 'idle' && mode === 'focus'}>
        {Object.entries(COURSE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
    </div>
  )
}

export function DurationSettings() {
  const { prefs, updatePrefs, status } = useTimer()
  const { settings, setSettings } = useBloom()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({ focusMin: String(prefs.focusMin), breakMin: String(prefs.breakMin) })
  const [err, setErr] = useState('')

  function save(e) {
    e.preventDefault()
    const f = Number(draft.focusMin)
    const b = Number(draft.breakMin)
    if (!Number.isInteger(f) || f < 1 || f > 120) return setErr('Focus length should be a whole number from 1 to 120 minutes.')
    if (!Number.isInteger(b) || b < 1 || b > 60) return setErr('Break length should be a whole number from 1 to 60 minutes.')
    updatePrefs({ focusMin: f, breakMin: b })
    setErr('')
    setOpen(false)
  }

  if (!open) {
    return (
      <div className="row" style={{ justifyContent: 'center' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => { setDraft({ focusMin: String(prefs.focusMin), breakMin: String(prefs.breakMin) }); setOpen(true) }}>
          <Settings2 aria-hidden="true" /> {prefs.focusMin} min focus · {prefs.breakMin} min break
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => setSettings((s) => ({ ...s, sound: !s.sound }))} aria-pressed={settings.sound}>
          {settings.sound ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />} Chime {settings.sound ? 'on' : 'off'}
        </button>
      </div>
    )
  }
  return (
    <form onSubmit={save} className="card flat stack" style={{ width: "100%", padding: 16 }} noValidate>
      <div className="row" style={{ alignItems: 'flex-end' }}>
        <div className="field" style={{ width: 120 }}>
          <label htmlFor="focus-min">Focus (min)</label>
          <input id="focus-min" className="input" type="number" min="1" max="120" step="1" value={draft.focusMin} onChange={(e) => setDraft({ ...draft, focusMin: e.target.value })} />
        </div>
        <div className="field" style={{ width: 120 }}>
          <label htmlFor="break-min">Break (min)</label>
          <input id="break-min" className="input" type="number" min="1" max="60" step="1" value={draft.breakMin} onChange={(e) => setDraft({ ...draft, breakMin: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">Save</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setOpen(false); setErr('') }}>Cancel</button>
      </div>
      {err && <div className="field-error" role="alert">{err}</div>}
      {status !== 'idle' && !err && <div className="tiny muted">New lengths apply from the next session; the current one keeps its length.</div>}
      <div className="row tiny">
        <span className="faint">Presets:</span>
        {[[25, 5], [50, 10], [15, 3]].map(([f, b]) => (
          <button key={f} type="button" className="chip" onClick={() => setDraft({ focusMin: String(f), breakMin: String(b) })}>{f} / {b}</button>
        ))}
      </div>
    </form>
  )
}
