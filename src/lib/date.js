const pad = (n) => String(n).padStart(2, '0')

export function dateKey(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const todayKey = () => dateKey(new Date())

// Parse 'YYYY-MM-DD' as a local date (not UTC).
export function parseKey(key) {
  if (typeof key !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return null
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return Number.isNaN(date.getTime()) ? null : date
}

export function daysUntil(key) {
  const d = parseKey(key)
  if (!d) return null
  const t = parseKey(todayKey())
  return Math.round((d - t) / 86400000)
}

export function dueLabel(key) {
  const n = daysUntil(key)
  if (n === null) return ''
  if (n < -1) return `${-n} days overdue`
  if (n === -1) return 'Yesterday'
  if (n === 0) return 'Today'
  if (n === 1) return 'Tomorrow'
  if (n < 7) return parseKey(key).toLocaleDateString(undefined, { weekday: 'long' })
  return parseKey(key).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function greeting(d = new Date()) {
  const h = d.getHours()
  if (h < 5) return 'Still up? Be gentle with yourself'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Winding down'
}

export function timeAgo(ts) {
  const s = Math.round((Date.now() - ts) / 1000)
  if (s < 60) return 'just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} hr ago`
  const days = Math.round(h / 24)
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function formatClock(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${pad(m)}:${pad(s)}`
}

export const uid = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`)
