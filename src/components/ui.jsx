import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Bookmark, BookmarkCheck, X } from 'lucide-react'
import { useBloom } from '../state/BloomStore'
import { EmptyArt } from './Decor'

export function Modal({ title, onClose, children, footer, labelId = 'modal-title' }) {
  const ref = useRef(null)
  useEffect(() => {
    const prev = document.activeElement
    const el = ref.current
    const first = el?.querySelector('input, textarea, select, button:not([data-close])')
    first?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && el) {
        const f = el.querySelectorAll('button, input, select, textarea, a[href]')
        if (!f.length) return
        const a = f[0]
        const z = f[f.length - 1]
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus() }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus?.()
    }
  }, [onClose])
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={labelId} ref={ref}>
        <div className="modal-head">
          <h2 id={labelId}>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close" data-close><X /></button>
        </div>
        {children}
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  )
}

const ToastContext = createContext(() => {})

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timer = useRef(null)
  const show = useCallback((message, action) => {
    clearTimeout(timer.current)
    setToast({ message, action, id: Date.now() })
    timer.current = setTimeout(() => setToast(null), 5000)
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])
  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite" className="sr-only-live">
        {toast && (
          <div className="toast" key={toast.id} role="status">
            {toast.message}
            {toast.action && (
              <button onClick={() => { toast.action.run(); setToast(null) }}>{toast.action.label}</button>
            )}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

export function Empty({ title, children, action }) {
  return (
    <div className="empty">
      <EmptyArt />
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  )
}

export function Tabs({ tabs, value, onChange, label }) {
  const onKey = (e, i) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
    onChange(tabs[next].id)
    e.currentTarget.parentElement.children[next]?.focus()
  }
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map((t, i) => {
        const Icon = t.icon
        return (
          <button key={t.id} role="tab" className="tab" aria-selected={value === t.id} tabIndex={value === t.id ? 0 : -1} onClick={() => onChange(t.id)} onKeyDown={(e) => onKey(e, i)}>
            {Icon && <Icon aria-hidden="true" />} {t.label}
          </button>
        )
      })}
    </div>
  )
}

// Bookmark toggle for "save for later review".
export function SaveButton({ item, compact }) {
  const { isSaved, toggleSaved } = useBloom()
  const saved = isSaved(item.id)
  const Icon = saved ? BookmarkCheck : Bookmark
  if (compact) {
    return (
      <button className={`icon-btn ${saved ? 'active' : ''}`} onClick={() => toggleSaved(item)} aria-pressed={saved} aria-label={saved ? `Remove “${item.title}” from review list` : `Save “${item.title}” for review`} title={saved ? 'Saved for review' : 'Save for review'}>
        <Icon />
      </button>
    )
  }
  return (
    <button className={`btn btn-sm ${saved ? 'btn-soft' : 'btn-outline'}`} onClick={() => toggleSaved(item)} aria-pressed={saved}>
      <Icon aria-hidden="true" /> {saved ? 'Saved for review' : 'Save for review'}
    </button>
  )
}

export function CourseTag({ course }) {
  const label = { math: 'Math MA', ls1a: 'LS 1A', other: 'Other' }[course] || 'Other'
  return <span className={`tag tag-${course}`}>{label}</span>
}
