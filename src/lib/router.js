import { useEffect, useState } from 'react'

// Minimal hash router: "#/math/limits/practice" → ['math', 'limits', 'practice'].
// Hash routing works on any static host (including Vercel) without rewrites.

const parse = () => window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent)

export function useRoute() {
  const [parts, setParts] = useState(parse)
  useEffect(() => {
    const on = () => setParts(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return parts
}

export function navigate(path, { replace = false } = {}) {
  const hash = `#/${path.replace(/^\/+/, '')}`
  if (replace) window.history.replaceState(null, '', hash)
  else window.location.hash = hash
  if (replace) window.dispatchEvent(new HashChangeEvent('hashchange'))
}

export const href = (path) => `#/${path.replace(/^\/+/, '')}`
