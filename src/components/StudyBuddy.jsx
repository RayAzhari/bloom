import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import { useBloom } from '../state/BloomStore'
import { useTimer } from '../state/TimerStore'
import { buddyLines, buddyName } from '../content/buddy'
import { daysUntil } from '../lib/date'
import { useToast } from './ui'

// Petal: a small study buddy that strolls along the bottom of the screen.
// - Click for a tip that fits the current page (plus the odd cheer-up line).
// - Offers a tip on her own every minute or so (and sometimes when you change pages),
//   but never during a focus session: she naps quietly so she isn't a distraction.
// - Between strolls she sometimes takes a little nap or does a little dance.
// - Respects prefers-reduced-motion (stays put, no bobbing).
// - Can be hidden; the choice is saved in settings.

const SPEED = 34 // px per second, an unhurried stroll
const SIDEBAR = 236

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mq) return undefined
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

function bounds() {
  const w = window.innerWidth
  const size = w <= 860 ? 52 : 60
  const min = (w > 860 ? SIDEBAR : 0) + 14
  const max = Math.max(min, w - size - 14)
  return { min, max }
}

const rand = (a, b) => a + Math.random() * (b - a)

export default function StudyBuddy({ page }) {
  const { settings, setSettings, tasks, cards } = useBloom()
  const { status, mode } = useTimer()
  const toast = useToast()
  const reduced = useReducedMotion()

  const [x, setX] = useState(() => bounds().max - 30)
  const [duration, setDuration] = useState(0)
  const [facing, setFacing] = useState(-1)
  const [walking, setWalking] = useState(false)
  const [hop, setHop] = useState(false)
  const [mood, setMood] = useState(null) // null | 'nap' | 'dance'
  const [bubble, setBubble] = useState(null) // { text, live }
  const used = useRef(new Set())
  const bubbleTimer = useRef(null)

  const focusing = status === 'running' && mode === 'focus'
  const resting = status === 'running' && mode === 'break'
  const enabled = settings.buddy !== false

  // Lines that use your actual data: never invented, only counted.
  const dataLines = useMemo(() => {
    const out = []
    const overdue = tasks.filter((t) => !t.done && t.due && daysUntil(t.due) < 0).length
    const dueToday = tasks.filter((t) => !t.done && t.due && daysUntil(t.due) === 0).length
    const review = Object.values(cards).filter((c) => c.status === 'review').length
    if ((page === 'tasks' || page === '') && overdue) out.push(`You have ${overdue} overdue task${overdue === 1 ? '' : 's'}. Start with the smallest one, or give it a new date. Both are okay.`)
    if ((page === 'tasks' || page === '') && dueToday) out.push(`${dueToday} task${dueToday === 1 ? ' is' : 's are'} due today. Want to start a focus session for ${dueToday === 1 ? 'it' : 'one of them'}?`)
    if (page === 'ls1a' && review) out.push(`${review} flashcard${review === 1 ? ' is' : 's are'} waiting in Revisit. A quick round could help!`)
    return out
  }, [tasks, cards, page])

  const pickLine = useCallback(() => {
    if (focusing) return buddyLines.focusing[Math.floor(Math.random() * buddyLines.focusing.length)]
    if (resting) return buddyLines.resting[Math.floor(Math.random() * buddyLines.resting.length)]
    const pageLines = buddyLines[page || 'home'] || buddyLines.home
    // Roughly: data-aware first, then page tips, with a cheer-up line every third tap.
    const pool = [...dataLines, ...pageLines, ...buddyLines.study]
    const useCheer = used.current.size % 3 === 2
    const source = useCheer ? buddyLines.cheer : pool
    let options = source.filter((l) => !used.current.has(l))
    if (!options.length) {
      source.forEach((l) => used.current.delete(l))
      options = source
    }
    const line = options[Math.floor(Math.random() * options.length)]
    used.current.add(line)
    return line
  }, [focusing, resting, page, dataLines])

  const say = useCallback((text, { live = false, ms = 9000 } = {}) => {
    clearTimeout(bubbleTimer.current)
    setBubble({ text, live, id: Date.now() })
    if (ms) bubbleTimer.current = setTimeout(() => setBubble(null), ms)
  }, [])

  // Keep her on screen when the window resizes.
  useEffect(() => {
    const onResize = () => {
      const { min, max } = bounds()
      setDuration(0)
      setX((v) => Math.min(max, Math.max(min, v)))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Wandering: pick a new spot every so often. Paused while talking, napping, or reduced motion.
  useEffect(() => {
    if (!enabled || focusing || bubble || walking || mood) return undefined
    const t = setTimeout(() => {
      const roll = Math.random()
      if (roll < 0.14) { setMood('nap'); return }
      if (roll < 0.3) { setMood('dance'); return }
      if (reduced) return
      const { min, max } = bounds()
      if (max - min < 60) return
      let target = rand(min, max)
      if (Math.abs(target - x) < 90) target = x > (min + max) / 2 ? Math.max(min, x - rand(90, 260)) : Math.min(max, x + rand(90, 260))
      const secs = Math.min(12, Math.abs(target - x) / SPEED)
      setFacing(target > x ? 1 : -1)
      setDuration(secs)
      setWalking(true)
      setX(target)
    }, rand(5000, 12000))
    return () => clearTimeout(t)
  }, [enabled, reduced, focusing, bubble, walking, mood, x])

  // Naps and dances end on their own.
  useEffect(() => {
    if (!mood) return undefined
    if (mood === 'dance' && Math.random() < 0.35) setBubble((b) => b || { text: buddyLines.dance[Math.floor(Math.random() * buddyLines.dance.length)], live: false, id: Date.now(), auto: true })
    const t = setTimeout(() => {
      setMood(null)
      setBubble((b) => (b?.auto ? null : b))
    }, mood === 'nap' ? rand(12000, 22000) : 3600)
    return () => clearTimeout(t)
  }, [mood])

  // Stop the walk cycle when the stroll ends.
  useEffect(() => {
    if (!walking) return undefined
    const t = setTimeout(() => setWalking(false), duration * 1000 + 50)
    return () => clearTimeout(t)
  }, [walking, duration])

  // Say hello once per browser session.
  useEffect(() => {
    if (!enabled) return undefined
    let greeted = false
    try { greeted = sessionStorage.getItem('bloom:buddy-greeted') === '1' } catch { /* storage blocked */ }
    if (greeted) return undefined
    const t = setTimeout(() => {
      say(buddyLines.greet[0], { ms: 7000 })
      try { sessionStorage.setItem('bloom:buddy-greeted', '1') } catch { /* storage blocked */ }
    }, 2500)
    return () => clearTimeout(t)
  }, [enabled, say])

  // Regular unprompted tips (about once a minute). Never during focus or while napping.
  useEffect(() => {
    if (!enabled || focusing || bubble || mood === 'nap') return undefined
    const t = setTimeout(() => say(pickLine()), rand(40000, 75000))
    return () => clearTimeout(t)
  }, [enabled, focusing, bubble, mood, say, pickLine])

  // Sometimes chime in with a tip for the page you just opened.
  const lastPage = useRef(page)
  useEffect(() => {
    if (lastPage.current === page) return undefined
    lastPage.current = page
    if (!enabled || focusing || Math.random() > 0.5) return undefined
    const t = setTimeout(() => { setMood((m) => (m === 'nap' ? null : m)); say(pickLine()) }, 2500)
    return () => clearTimeout(t)
    // Only react to page changes, not to every new line pool.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  // Little celebration when a task gets checked off.
  const doneCount = tasks.filter((t) => t.done).length
  const prevDone = useRef(doneCount)
  useEffect(() => {
    if (doneCount > prevDone.current && enabled && !focusing) {
      setMood('dance')
      say(['Yay, one more done!', 'Look at you go!', 'Another petal for today!', 'Checked off. Nice work!'][Math.floor(Math.random() * 4)], { ms: 4000 })
    }
    prevDone.current = doneCount
  }, [doneCount, enabled, focusing, say])

  // Quiet down as soon as a focus session starts.
  useEffect(() => {
    if (focusing) { setBubble(null); setMood(null) }
  }, [focusing])

  useEffect(() => {
    if (!bubble) return undefined
    const onKey = (e) => e.key === 'Escape' && setBubble(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [bubble])

  useEffect(() => () => clearTimeout(bubbleTimer.current), [])

  if (!enabled) return null

  function onPetalClick() {
    if (mood === 'nap' && !focusing) {
      setMood(null)
      setHop(true)
      setTimeout(() => setHop(false), 600)
      say(`${buddyLines.wake[Math.floor(Math.random() * buddyLines.wake.length)]} ${pickLine()}`, { live: true, ms: 14000 })
      return
    }
    if (bubble?.live) { setBubble(null); return }
    setHop(true)
    setTimeout(() => setHop(false), 600)
    say(pickLine(), { live: true, ms: focusing ? 4000 : 14000 })
  }

  function hide() {
    setBubble(null)
    setSettings((s) => ({ ...s, buddy: false }))
    toast(`${buddyName} is taking a nap. You can bring her back from the Progress page.`, {
      label: 'Undo',
      run: () => setSettings((s) => ({ ...s, buddy: true })),
    })
  }

  const rightSide = x > window.innerWidth / 2
  const sleeping = (focusing || mood === 'nap') && !bubble
  const dancing = mood === 'dance' && !focusing

  return (
    <div
      className={`buddy ${walking && !reduced ? 'walking' : ''} ${hop && !reduced ? 'hop' : ''} ${sleeping ? 'sleeping' : ''} ${dancing && !reduced ? 'dancing' : ''}`}
      style={{ transform: `translateX(${x}px)`, transitionDuration: `${reduced ? 0 : duration}s` }}
    >
      {bubble && (
        <div className={`buddy-bubble ${rightSide ? 'right' : 'left'}`} role={bubble.live ? 'status' : undefined} aria-live={bubble.live ? 'polite' : 'off'} key={bubble.id}>
          <div className="buddy-bubble-head">
            <span className="buddy-name"><Sparkles size={12} aria-hidden="true" /> {buddyName}</span>
            <button className="icon-btn" onClick={() => setBubble(null)} aria-label="Close tip"><X /></button>
          </div>
          <p>{bubble.text}</p>
          <div className="buddy-actions">
            {!focusing && <button className="btn btn-soft btn-sm" onClick={() => say(pickLine(), { live: true, ms: 14000 })}>Another one</button>}
            <button className="btn btn-ghost btn-sm" onClick={hide}>Hide {buddyName}</button>
          </div>
        </div>
      )}
      <button
        className="buddy-body"
        onClick={onPetalClick}
        aria-label={`${buddyName}, your study buddy. ${focusing ? 'Napping during your focus session. ' : sleeping ? 'Taking a little nap. ' : ''}Activate for a tip.`}
        title={focusing ? `${buddyName} is napping while you focus` : sleeping ? `${buddyName} is napping. Tap to wake her` : `Tap ${buddyName} for a tip`}
      >
        <BuddyArt facing={facing} sleeping={sleeping} />
        {sleeping && <span className="buddy-z" aria-hidden="true">z<span>z</span></span>}
        {dancing && <span className="buddy-notes" aria-hidden="true"><span>♪</span><span>♫</span></span>}
      </button>
    </div>
  )
}

function BuddyArt({ facing, sleeping }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" style={{ transform: `scaleX(${facing})` }}>
      {/* shadow */}
      <ellipse cx="32" cy="60" rx="15" ry="2.6" fill="#3f2f35" opacity="0.12" />
      <g className="buddy-bob">
        {/* feet */}
        <ellipse className="foot foot-l" cx="25" cy="56" rx="5" ry="3" fill="#e48fa3" />
        <ellipse className="foot foot-r" cx="39" cy="56" rx="5" ry="3" fill="#e48fa3" />
        {/* body */}
        <path d="M32 18 C46 18 53 29 53 40 C53 51 44 57 32 57 C20 57 11 51 11 40 C11 29 18 18 32 18Z" fill="#f4b3c2" />
        <path d="M32 18 C46 18 53 29 53 40 C53 51 44 57 32 57" fill="none" stroke="#e898aa" strokeWidth="1.2" opacity="0.6" />
        <ellipse cx="32" cy="45" rx="13" ry="9" fill="#f9d3dc" opacity="0.8" />
        {/* little arms */}
        <path className="arm arm-l" d="M13 41 C9 42 8 45 10 46" stroke="#e898aa" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path className="arm arm-r" d="M51 41 C55 42 56 45 54 46" stroke="#e898aa" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* sprout + flower */}
        <g className="buddy-sprout">
          <path d="M32 19 C32 14 33 11 34 8" stroke="#8fae84" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M33 14 C29 13 27 10 27 8 C30 8 32 10 33 14Z" fill="#b5c9aa" />
          <g transform="translate(35 7)">
            {[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cx="0" cy="-3" rx="2.3" ry="3.3" fill="#fff4f6" transform={`rotate(${r})`} />)}
            <circle r="1.9" fill="#f4d58d" />
          </g>
        </g>
        {/* face */}
        {sleeping ? (
          <g stroke="#3f2f35" strokeWidth="1.8" fill="none" strokeLinecap="round">
            <path d="M23 36 Q25.5 38 28 36" />
            <path d="M36 36 Q38.5 38 41 36" />
          </g>
        ) : (
          <g className="buddy-eyes" fill="#3f2f35">
            <ellipse cx="25.5" cy="35" rx="2.4" ry="3" />
            <ellipse cx="38.5" cy="35" rx="2.4" ry="3" />
            <circle cx="26.3" cy="33.9" r="0.8" fill="#fff" />
            <circle cx="39.3" cy="33.9" r="0.8" fill="#fff" />
          </g>
        )}
        <ellipse cx="20.5" cy="40.5" rx="3.2" ry="2" fill="#ee8fa5" opacity="0.55" />
        <ellipse cx="43.5" cy="40.5" rx="3.2" ry="2" fill="#ee8fa5" opacity="0.55" />
        <path d={sleeping ? 'M30.5 41.5 Q32 42.3 33.5 41.5' : 'M29.5 40.5 Q32 43.2 34.5 40.5'} stroke="#3f2f35" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  )
}
