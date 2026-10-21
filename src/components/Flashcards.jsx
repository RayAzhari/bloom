import { useEffect, useMemo, useState } from 'react'
import { Check, RefreshCw, RotateCcw, Shuffle, Undo2 } from 'lucide-react'
import { useBloom } from '../state/BloomStore'
import { Empty } from './ui'

const MODES = [
  { id: 'queue', label: 'Review queue', note: 'Cards you haven’t marked “Know it” yet, with ones marked “Need to review” first.' },
  { id: 'revisit', label: 'Revisit', note: 'Only cards you marked “Need to review.”' },
  { id: 'all', label: 'All cards', note: 'Every card in the selected topics.' },
]

function shuffle(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Flashcards({ cards, categories }) {
  const { cards: status, setCardStatus, resetCards, log } = useBloom()
  const [mode, setMode] = useState('queue')
  const [cat, setCat] = useState('all')
  const [deck, setDeck] = useState([])
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [history, setHistory] = useState([]) // for undo within a session

  const pool = useMemo(() => cards.filter((c) => cat === 'all' || c.category === cat), [cards, cat])

  function build(shuffled = false) {
    let list
    if (mode === 'queue') {
      const review = pool.filter((c) => status[c.id]?.status === 'review')
      const fresh = pool.filter((c) => !status[c.id])
      list = [...review, ...fresh]
    } else if (mode === 'revisit') {
      list = pool.filter((c) => status[c.id]?.status === 'review')
    } else {
      list = pool
    }
    setDeck((shuffled ? shuffle(list) : list).map((c) => c.id))
    setI(0)
    setFlipped(false)
    setHistory([])
  }

  // Rebuild the session deck when the mode or topic changes (not on every rating).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => build(false), [mode, cat])

  const current = deck[i] ? cards.find((c) => c.id === deck[i]) : null
  const counts = useMemo(() => {
    const k = pool.filter((c) => status[c.id]?.status === 'know').length
    const r = pool.filter((c) => status[c.id]?.status === 'review').length
    return { know: k, review: r, fresh: pool.length - k - r }
  }, [pool, status])

  function rate(value) {
    if (!current) return
    setHistory((h) => [...h, { id: current.id, prev: status[current.id]?.status || null }])
    setCardStatus(current.id, value)
    if (value === 'review') log('flashcard', `Marked “${current.front}” to review`)
    setFlipped(false)
    setI((n) => n + 1)
  }

  function undo() {
    const last = history[history.length - 1]
    if (!last) return
    if (last.prev) setCardStatus(last.id, last.prev)
    else resetCards([last.id])
    setHistory((h) => h.slice(0, -1))
    setI((n) => Math.max(0, n - 1))
    setFlipped(false)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (!current || e.target.closest('input, textarea, select')) return
      if (e.key === ' ' || e.key === 'Enter') {
        // Focused buttons/links already handle Space/Enter natively.
        if (e.target.closest('button, a')) return
        e.preventDefault()
        setFlipped((f) => !f)
      } else if (flipped && e.key === '1') rate('review')
      else if (flipped && e.key === '2') rate('know')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const catLabel = (id) => categories.find((c) => c.id === id)?.short || id

  return (
    <div className="stack-lg">
      <div className="row between">
        <div className="tabs" role="tablist" aria-label="Flashcard mode">
          {MODES.map((m) => (
            <button key={m.id} role="tab" className="tab" aria-selected={mode === m.id} onClick={() => setMode(m.id)}>{m.label}</button>
          ))}
        </div>
        <div className="row small muted num" aria-label="Card status counts">
          <span className="tag tag-ls1a">{counts.know} know it</span>
          <span className="tag tag-math">{counts.review} to review</span>
          <span className="tag">{counts.fresh} new</span>
        </div>
      </div>

      <div className="chips" role="group" aria-label="Filter by topic">
        <button className="chip" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>All topics</button>
        {categories.map((c) => (
          <button key={c.id} className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>{c.short}</button>
        ))}
      </div>

      <p className="small muted" style={{ margin: 0 }}>{MODES.find((m) => m.id === mode).note}</p>

      {current ? (
        <div className="stack" style={{ maxWidth: 640, width: '100%', margin: '0 auto' }}>
          <div className="row between small muted">
            <span>Card {i + 1} of {deck.length} · <span className="tag tag-ls1a">{catLabel(current.category)}</span></span>
            <span className="row" style={{ gap: 2 }}>
              <button className="btn btn-ghost btn-sm" onClick={undo} disabled={!history.length}><Undo2 aria-hidden="true" /> Undo</button>
              <button className="btn btn-ghost btn-sm" onClick={() => build(true)}><Shuffle aria-hidden="true" /> Shuffle</button>
            </span>
          </div>
          <div className="flash-stage">
            <button
              className={`flashcard ${flipped ? 'flipped' : ''}`}
              onClick={() => setFlipped((f) => !f)}
              aria-label={flipped ? `Answer: ${current.back}. Activate to show the question.` : `Question: ${current.front}. Activate to reveal the answer.`}
            >
              <div className="flash-face flash-front" aria-hidden={flipped}>
                <span className="flash-hint">Question</span>
                <div className="flash-q">{current.front}</div>
                <span className="tiny faint">Tap or press Space to reveal</span>
              </div>
              <div className="flash-face flash-back" aria-hidden={!flipped}>
                <span className="flash-hint">Answer</span>
                <div className="flash-a">{current.back}</div>
              </div>
            </button>
          </div>
          <div className="row" style={{ justifyContent: 'center' }}>
            {!flipped ? (
              <button className="btn btn-sage btn-lg" onClick={() => setFlipped(true)}>Reveal answer</button>
            ) : (
              <>
                <button className="btn btn-soft btn-lg" onClick={() => rate('review')}><RotateCcw aria-hidden="true" /> Need to review <kbd className="tiny faint">1</kbd></button>
                <button className="btn btn-sage btn-lg" onClick={() => rate('know')}><Check aria-hidden="true" /> Know it <kbd className="tiny" style={{ opacity: 0.7 }}>2</kbd></button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="card flat">
          <Empty
            title={deck.length ? 'Session complete' : mode === 'revisit' ? 'Nothing to revisit' : mode === 'queue' ? 'All caught up' : 'No cards here'}
            action={
              <div className="row" style={{ justifyContent: 'center' }}>
                <button className="btn btn-sage" onClick={() => build(true)}><RefreshCw aria-hidden="true" /> Go again</button>
                {mode !== 'all' && <button className="btn btn-outline" onClick={() => setMode('all')}>Study all cards</button>}
                {counts.know > 0 && (
                  <button className="btn btn-ghost" onClick={() => { resetCards(pool.filter((c) => status[c.id]?.status === 'know').map((c) => c.id)); setMode('queue') }}>
                    Put “Know it” cards back in the queue
                  </button>
                )}
              </div>
            }
          >
            {deck.length
              ? `You went through ${deck.length} card${deck.length === 1 ? '' : 's'}. Cards marked “Need to review” stay in your queue and in Revisit.`
              : mode === 'revisit'
                ? 'You haven’t marked any cards in these topics as “Need to review.”'
                : 'Every card in these topics is marked “Know it.”'}
          </Empty>
        </div>
      )}
    </div>
  )
}
