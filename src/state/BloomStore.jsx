import { createContext, useCallback, useContext, useMemo } from 'react'
import { usePersistentState } from './usePersistentState'
import { arr, isObj, num, oneOf, str } from '../lib/storage'
import { todayKey, uid } from '../lib/date'

export const COURSES = ['math', 'ls1a', 'other']
export const COURSE_LABEL = { math: 'Math MA', ls1a: 'LS 1A', other: 'Other' }
export const PRIORITIES = ['low', 'medium', 'high']

const isDateKey = (x) => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x)

function sanitizeTask(t) {
  if (!isObj(t) || !str(t.title).trim()) return null
  return {
    id: str(t.id, 80) || uid(),
    title: str(t.title, 140).trim(),
    description: str(t.description, 1000),
    course: oneOf(t.course, COURSES, 'other'),
    due: isDateKey(t.due) ? t.due : '',
    priority: oneOf(t.priority, PRIORITIES, 'medium'),
    done: t.done === true,
    today: isDateKey(t.today) ? t.today : '',
    createdAt: num(t.createdAt, 0, 9e15, Date.now()),
    completedAt: t.done === true ? num(t.completedAt, 0, 9e15, Date.now()) : null,
  }
}

const sanitizeTasks = (x) => (Array.isArray(x) ? x.map(sanitizeTask).filter(Boolean) : undefined)

const sanitizeSessions = (x) =>
  Array.isArray(x)
    ? x
        .filter((s) => isObj(s) && typeof s.completedAt === 'number')
        .map((s) => ({
          id: str(s.id, 80) || uid(),
          course: oneOf(s.course, COURSES, 'other'),
          minutes: num(s.minutes, 1, 180, 25),
          completedAt: s.completedAt,
        }))
        .slice(-500)
    : undefined

const sanitizeReview = (x) =>
  Array.isArray(x)
    ? x
        .filter((r) => isObj(r) && str(r.id) && str(r.title))
        .map((r) => ({
          id: str(r.id, 120),
          course: oneOf(r.course, COURSES, 'other'),
          kind: str(r.kind, 30) || 'concept',
          title: str(r.title, 200),
          route: str(r.route, 200),
          addedAt: num(r.addedAt, 0, 9e15, Date.now()),
        }))
    : undefined

const sanitizeMap = (allowed) => (x) => {
  if (!isObj(x)) return undefined
  const out = {}
  for (const [k, v] of Object.entries(x)) if (isObj(v) && allowed(v)) out[k.slice(0, 120)] = v
  return out
}

const sanitizeActivity = (x) =>
  Array.isArray(x)
    ? x.filter((a) => isObj(a) && str(a.label) && typeof a.at === 'number').map((a) => ({ type: str(a.type, 30), label: str(a.label, 200), at: a.at })).slice(0, 40)
    : undefined

const sanitizeSettings = (x) => (isObj(x) ? { sound: x.sound !== false, buddy: x.buddy !== false } : undefined)

function starterTasks() {
  const t = todayKey()
  const now = Date.now()
  return [
    { id: uid(), title: 'Skim the Functions concept guide in Math MA', description: 'Start with the four representations: tables, graphs, formulas, and words.', course: 'math', due: '', priority: 'medium', done: false, today: t, createdAt: now, completedAt: null },
    { id: uid(), title: 'Try a round of LS 1A flashcards', description: 'Mark anything fuzzy as "Need to review" so it comes back.', course: 'ls1a', due: '', priority: 'low', done: false, today: t, createdAt: now + 1, completedAt: null },
    { id: uid(), title: 'Add this week’s real deadlines', description: 'Replace these starter tasks with your own — edit or delete them anytime.', course: 'other', due: '', priority: 'medium', done: false, today: t, createdAt: now + 2, completedAt: null },
  ]
}

const BloomContext = createContext(null)

export function BloomProvider({ children }) {
  const [tasks, setTasks] = usePersistentState('tasks', starterTasks, sanitizeTasks)
  const [sessions, setSessions] = usePersistentState('sessions', [], sanitizeSessions)
  const [review, setReview] = usePersistentState('review', [], sanitizeReview)
  const [cards, setCards] = usePersistentState('flashcards', {}, sanitizeMap((v) => v.status === 'know' || v.status === 'review'))
  const [attempts, setAttempts] = usePersistentState('attempts', {}, sanitizeMap((v) => typeof v.correct === 'boolean'))
  const [activity, setActivity] = usePersistentState('activity', [], sanitizeActivity)
  const [settings, setSettings] = usePersistentState('settings', { sound: true, buddy: true }, sanitizeSettings)

  const log = useCallback((type, label) => {
    setActivity((a) => [{ type, label, at: Date.now() }, ...a].slice(0, 40))
  }, [setActivity])

  // ---- tasks
  const addTask = useCallback((data) => {
    const task = sanitizeTask({ ...data, id: uid(), createdAt: Date.now(), done: false })
    if (!task) return null
    setTasks((ts) => [task, ...ts])
    return task
  }, [setTasks])

  const updateTask = useCallback((id, patch) => {
    setTasks((ts) => ts.map((t) => (t.id === id ? sanitizeTask({ ...t, ...patch }) || t : t)))
  }, [setTasks])

  const deleteTask = useCallback((id) => setTasks((ts) => ts.filter((t) => t.id !== id)), [setTasks])

  // Undo for deletion: put the exact task back (same id, status, and dates).
  const restoreTask = useCallback((task) => {
    const t = sanitizeTask(task)
    if (t) setTasks((ts) => (ts.some((x) => x.id === t.id) ? ts : [t, ...ts]))
  }, [setTasks])

  const toggleTask = useCallback((id) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    const done = !task.done
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done, completedAt: done ? Date.now() : null } : t)))
    if (done) log('task', `Completed “${task.title}”`)
  }, [tasks, setTasks, log])

  const togglePinToday = useCallback((id) => {
    const t = todayKey()
    setTasks((ts) => ts.map((x) => (x.id === id ? { ...x, today: x.today === t ? '' : t } : x)))
  }, [setTasks])

  // ---- sessions
  const addSession = useCallback((course, minutes, completedAt = Date.now()) => {
    setSessions((s) => [...s, { id: uid(), course, minutes, completedAt }].slice(-500))
    log('focus', `${minutes}-minute focus session · ${COURSE_LABEL[course]}`)
  }, [setSessions, log])

  // ---- review list
  const isSaved = useCallback((id) => review.some((r) => r.id === id), [review])
  const toggleSaved = useCallback((item) => {
    const exists = review.some((r) => r.id === item.id)
    setReview((rs) => (exists ? rs.filter((r) => r.id !== item.id) : [{ ...item, addedAt: Date.now() }, ...rs]))
    if (!exists) log('review', `Saved “${item.title}” for review`)
  }, [review, setReview, log])
  const removeSaved = useCallback((id) => setReview((rs) => rs.filter((r) => r.id !== id)), [setReview])

  // ---- flashcards
  const setCardStatus = useCallback((id, status) => {
    setCards((c) => ({ ...c, [id]: { status, at: Date.now() } }))
  }, [setCards])
  const resetCards = useCallback((ids) => {
    setCards((c) => {
      const next = { ...c }
      ids.forEach((id) => delete next[id])
      return next
    })
  }, [setCards])

  // ---- practice attempts (first-try honesty: we keep the latest result and the number of tries)
  const recordAttempt = useCallback((qid, correct, label) => {
    setAttempts((a) => {
      const prev = a[qid]
      return { ...a, [qid]: { correct, tries: (prev?.tries || 0) + 1, at: Date.now() } }
    })
    if (label) log('practice', `${correct ? 'Solved' : 'Attempted'} “${label}”`)
  }, [setAttempts, log])

  const value = useMemo(() => ({
    tasks, addTask, updateTask, deleteTask, restoreTask, toggleTask, togglePinToday,
    sessions, addSession,
    review, isSaved, toggleSaved, removeSaved,
    cards, setCardStatus, resetCards,
    attempts, recordAttempt,
    activity, log,
    settings, setSettings,
  }), [tasks, addTask, updateTask, deleteTask, restoreTask, toggleTask, togglePinToday, sessions, addSession, review, isSaved, toggleSaved, removeSaved, cards, setCardStatus, resetCards, attempts, recordAttempt, activity, log, settings, setSettings])

  return <BloomContext.Provider value={value}>{children}</BloomContext.Provider>
}

export function useBloom() {
  const ctx = useContext(BloomContext)
  if (!ctx) throw new Error('useBloom must be used inside BloomProvider')
  return ctx
}

// Today's list: pinned today, due today, or unfinished tasks carried over from an
// earlier pin / due date. Carried-over tasks finished today stay visible until tomorrow.
export function isOnTodayList(t, today = todayKey()) {
  if (t.today === today || t.due === today) return true
  const earlier = (t.today && t.today < today) || (t.due && t.due < today)
  if (!earlier) return false
  if (!t.done) return true
  return !!t.completedAt && new Date(t.completedAt).toDateString() === new Date().toDateString()
}
