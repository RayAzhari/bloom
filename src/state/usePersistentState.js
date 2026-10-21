import { useEffect, useRef, useState } from 'react'
import { loadJSON, saveJSON } from '../lib/storage'

export function usePersistentState(key, fallback, sanitize) {
  const [value, setValue] = useState(() => loadJSON(key, typeof fallback === 'function' ? fallback() : fallback, sanitize))
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    saveJSON(key, value)
  }, [key, value])
  return [value, setValue]
}
