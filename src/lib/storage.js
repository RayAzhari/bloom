// Safe, versioned localStorage helpers.
// Every value is stored as { v, data }. Anything missing, malformed, from an
// older schema version, or rejected by the validator falls back to defaults.

const PREFIX = 'bloom:'
export const SCHEMA_VERSION = 1

function storageAvailable() {
  try {
    const k = '__bloom_test__'
    window.localStorage.setItem(k, '1')
    window.localStorage.removeItem(k)
    return true
  } catch {
    return false
  }
}

const canStore = typeof window !== 'undefined' && storageAvailable()

export function loadJSON(key, fallback, sanitize) {
  if (!canStore) return fallback
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (raw == null) return fallback
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || parsed.v !== SCHEMA_VERSION) return fallback
    if (!sanitize) return parsed.data ?? fallback
    const clean = sanitize(parsed.data)
    return clean === undefined ? fallback : clean
  } catch {
    return fallback
  }
}

export function saveJSON(key, data) {
  if (!canStore) return false
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify({ v: SCHEMA_VERSION, data }))
    return true
  } catch {
    // Quota exceeded or storage disabled — the app keeps working in memory.
    return false
  }
}

export function clearAll() {
  if (!canStore) return
  Object.keys(window.localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => window.localStorage.removeItem(k))
}

// Small sanitizing helpers shared by the stores.
export const isObj = (x) => x !== null && typeof x === 'object' && !Array.isArray(x)
export const str = (x, max = 500) => (typeof x === 'string' ? x.slice(0, max) : '')
export const num = (x, min, max, dflt) =>
  typeof x === 'number' && Number.isFinite(x) ? Math.min(max, Math.max(min, x)) : dflt
export const oneOf = (x, options, dflt) => (options.includes(x) ? x : dflt)
export const arr = (x) => (Array.isArray(x) ? x : [])
