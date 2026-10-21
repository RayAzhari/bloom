import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { usePersistentState } from './usePersistentState'
import { isObj, num, oneOf } from '../lib/storage'
import { COURSES, COURSE_LABEL, useBloom } from './BloomStore'
import { formatClock } from '../lib/date'
import { breakDoneMessages, focusDoneMessages, pickRandom } from '../content/messages'

const sanitizePrefs = (x) =>
  isObj(x)
    ? {
        focusMin: Math.round(num(x.focusMin, 1, 120, 25)),
        breakMin: Math.round(num(x.breakMin, 1, 60, 5)),
        course: oneOf(x.course, COURSES, 'math'),
      }
    : undefined

const sanitizeRun = (x) => {
  if (!isObj(x)) return undefined
  const status = oneOf(x.status, ['idle', 'running', 'paused'], 'idle')
  const total = num(x.total, 1000, 120 * 60000, 0)
  const run = {
    mode: oneOf(x.mode, ['focus', 'break'], 'focus'),
    status,
    endAt: num(x.endAt, 0, 9e15, 0),
    remaining: num(x.remaining, 0, 120 * 60000, 0),
    total,
  }
  // Inconsistent saved state → start fresh rather than show nonsense.
  if (status !== 'idle' && !total) return { ...run, status: 'idle' }
  if (status === 'running' && !run.endAt) return { ...run, status: 'idle' }
  return run
}

function chime() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    ;[659.25, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const t0 = ctx.currentTime + i * 0.22
      gain.gain.setValueAtTime(0.0001, t0)
      gain.gain.exponentialRampToValueAtTime(0.12, t0 + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t0)
      osc.stop(t0 + 1)
    })
    setTimeout(() => ctx.close(), 1600)
  } catch {
    /* audio is optional */
  }
}

const TimerContext = createContext(null)

export function TimerProvider({ children }) {
  const { addSession, settings } = useBloom()
  const [prefs, setPrefs] = usePersistentState('timerPrefs', { focusMin: 25, breakMin: 5, course: 'math' }, sanitizePrefs)
  const [run, setRun] = usePersistentState('timerRun', { mode: 'focus', status: 'idle', endAt: 0, remaining: 0, total: 0 }, sanitizeRun)
  const [now, setNow] = useState(() => Date.now())
  const [celebration, setCelebration] = useState(null)
  const handledEnd = useRef(0) // endAt values already completed (guards StrictMode / double ticks)

  const durationFor = useCallback((mode) => (mode === 'focus' ? prefs.focusMin : prefs.breakMin) * 60000, [prefs])

  const complete = useCallback((finishedRun, whileAway) => {
    if (handledEnd.current === finishedRun.endAt) return
    handledEnd.current = finishedRun.endAt
    if (finishedRun.mode === 'focus') {
      addSession(prefs.course, Math.max(1, Math.round(finishedRun.total / 60000)), Math.min(finishedRun.endAt, Date.now()))
      setCelebration({ kind: 'focus', message: pickRandom(focusDoneMessages), whileAway, id: finishedRun.endAt })
      setRun({ mode: 'break', status: 'idle', endAt: 0, remaining: 0, total: 0 })
    } else {
      setCelebration({ kind: 'break', message: pickRandom(breakDoneMessages), whileAway, id: finishedRun.endAt })
      setRun({ mode: 'focus', status: 'idle', endAt: 0, remaining: 0, total: 0 })
    }
    if (settings.sound && !whileAway) chime()
  }, [addSession, prefs.course, setRun, settings.sound])

  // On load: a session that was running when the page closed may have ended meanwhile.
  useEffect(() => {
    if (run.status === 'running' && run.endAt <= Date.now()) complete(run, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Single interval, only while running. Time is always derived from endAt, so a
  // throttled background tab still shows the correct time when it wakes up.
  useEffect(() => {
    if (run.status !== 'running') return undefined
    const tick = () => {
      const t = Date.now()
      setNow(t)
      if (t >= run.endAt) complete(run, document.hidden)
    }
    tick()
    const id = setInterval(tick, 250)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [run, complete])

  const remaining = run.status === 'running' ? Math.max(0, run.endAt - now) : run.status === 'paused' ? run.remaining : durationFor(run.mode)
  const total = run.status === 'idle' ? durationFor(run.mode) : run.total
  const progress = total ? 1 - remaining / total : 0

  useEffect(() => {
    if (run.status === 'idle') {
      document.title = 'Bloom'
    } else {
      document.title = `${formatClock(remaining)} · ${run.mode === 'focus' ? 'Focus' : 'Break'}${run.status === 'paused' ? ' (paused)' : ''} — Bloom`
    }
  }, [remaining, run.status, run.mode])

  const start = useCallback(() => {
    const d = durationFor(run.mode)
    const t = Date.now()
    setNow(t)
    setCelebration(null)
    setRun({ ...run, status: 'running', endAt: t + d, total: d, remaining: 0 })
  }, [durationFor, run, setRun])

  const pause = useCallback(() => {
    if (run.status !== 'running') return
    setRun({ ...run, status: 'paused', remaining: Math.max(0, run.endAt - Date.now()) })
  }, [run, setRun])

  const resume = useCallback(() => {
    if (run.status !== 'paused') return
    const t = Date.now()
    setNow(t)
    setRun({ ...run, status: 'running', endAt: t + run.remaining })
  }, [run, setRun])

  const reset = useCallback(() => {
    setRun({ mode: run.mode, status: 'idle', endAt: 0, remaining: 0, total: 0 })
  }, [run.mode, setRun])

  const setMode = useCallback((mode) => {
    setCelebration(null)
    setRun({ mode, status: 'idle', endAt: 0, remaining: 0, total: 0 })
  }, [setRun])

  const updatePrefs = useCallback((patch) => setPrefs((p) => sanitizePrefs({ ...p, ...patch }) || p), [setPrefs])

  const value = useMemo(() => ({
    prefs, updatePrefs, mode: run.mode, status: run.status, remaining, total, progress,
    start, pause, resume, reset, setMode, celebration, dismissCelebration: () => setCelebration(null),
    courseLabel: COURSE_LABEL[prefs.course],
  }), [prefs, updatePrefs, run.mode, run.status, remaining, total, progress, start, pause, resume, reset, setMode, celebration])

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
}

export function useTimer() {
  const ctx = useContext(TimerContext)
  if (!ctx) throw new Error('useTimer must be used inside TimerProvider')
  return ctx
}
