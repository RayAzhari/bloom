import { useState } from 'react'
import { CalendarDays, Flag, Pencil, Plus, Sun, Trash2 } from 'lucide-react'
import { COURSE_LABEL, PRIORITIES, useBloom } from '../state/BloomStore'
import { dueLabel, daysUntil, todayKey } from '../lib/date'
import { CourseTag, Modal, useToast } from './ui'

export function TaskItem({ task, boxed = false, showDesc = true }) {
  const { toggleTask, deleteTask, restoreTask, togglePinToday } = useBloom()
  const toast = useToast()
  const [editing, setEditing] = useState(false)
  const [justDone, setJustDone] = useState(false)
  const d = task.due ? daysUntil(task.due) : null
  const overdue = !task.done && d !== null && d < 0
  const pinned = task.today === todayKey()

  function onToggle() {
    if (!task.done) {
      setJustDone(true)
      setTimeout(() => setJustDone(false), 900)
    }
    toggleTask(task.id)
  }

  function onDelete() {
    const copy = { ...task }
    deleteTask(task.id)
    toast(`Deleted “${copy.title.length > 32 ? copy.title.slice(0, 32) + '…' : copy.title}”`, {
      label: 'Undo',
      run: () => restoreTask(copy),
    })
  }

  return (
    <li className={`task ${boxed ? 'boxed' : ''} ${task.done ? 'done' : ''} ${justDone ? 'just-done' : ''}`}>
      <input type="checkbox" className="check" checked={task.done} onChange={onToggle} aria-label={`Mark “${task.title}” ${task.done ? 'not done' : 'done'}`} />
      <div className="task-body">
        <div className="task-title">{task.title}</div>
        {showDesc && task.description && <div className="task-desc">{task.description}</div>}
        <div className="task-meta">
          <CourseTag course={task.course} />
          {task.due && (
            <span className={`tag ${overdue ? 'tag-overdue' : d === 0 && !task.done ? 'tag-today' : ''}`}>
              <CalendarDays aria-hidden="true" /> {dueLabel(task.due)}
            </span>
          )}
          {task.priority !== 'medium' && <span className={`tag tag-${task.priority}`}><Flag aria-hidden="true" /> {task.priority === 'high' ? 'High' : 'Low'}</span>}
        </div>
      </div>
      <div className="task-actions">
        {!task.done && (
          <button className={`icon-btn ${pinned ? 'active' : ''}`} onClick={() => togglePinToday(task.id)} aria-pressed={pinned} aria-label={pinned ? 'Remove from today’s list' : 'Add to today’s list'} title={pinned ? 'On today’s list' : 'Add to today'}>
            <Sun />
          </button>
        )}
        <button className="icon-btn" onClick={() => setEditing(true)} aria-label={`Edit “${task.title}”`} title="Edit"><Pencil /></button>
        <button className="icon-btn danger" onClick={onDelete} aria-label={`Delete “${task.title}”`} title="Delete"><Trash2 /></button>
      </div>
      {editing && <TaskForm task={task} onClose={() => setEditing(false)} />}
    </li>
  )
}

const empty = { title: '', description: '', course: 'math', due: '', priority: 'medium', today: '' }

export function TaskForm({ task, onClose, defaults }) {
  const { addTask, updateTask } = useBloom()
  const [form, setForm] = useState(() => (task ? { ...task } : { ...empty, ...defaults }))
  const [errors, setErrors] = useState({})
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  function submit(e) {
    e.preventDefault()
    const errs = {}
    const title = form.title.trim()
    if (!title) errs.title = 'Give the task a short title.'
    else if (title.length > 140) errs.title = 'Keep the title under 140 characters.'
    if (form.description.length > 1000) errs.description = 'Description is limited to 1000 characters.'
    if (form.due && !/^\d{4}-\d{2}-\d{2}$/.test(form.due)) errs.due = 'Pick a valid date.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    const data = { title, description: form.description.trim(), course: form.course, due: form.due, priority: form.priority, today: form.today }
    if (task) updateTask(task.id, data)
    else addTask(data)
    onClose()
  }

  return (
    <Modal title={task ? 'Edit task' : 'New task'} onClose={onClose} labelId={task ? `edit-${task.id}` : 'new-task'}>
      <form onSubmit={submit} className="stack" noValidate>
        <div className="field">
          <label htmlFor="t-title">Title</label>
          <input id="t-title" className="input" value={form.title} onChange={set('title')} maxLength={160} aria-invalid={!!errors.title} aria-describedby={errors.title ? 't-title-err' : undefined} placeholder="e.g. Problem set 3, questions 1–5" />
          {errors.title && <span className="field-error" id="t-title-err">{errors.title}</span>}
        </div>
        <div className="field">
          <label htmlFor="t-desc">Notes <span className="faint">(optional)</span></label>
          <textarea id="t-desc" className="textarea" value={form.description} onChange={set('description')} rows={3} aria-invalid={!!errors.description} />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="t-course">Course</label>
            <select id="t-course" className="select" value={form.course} onChange={set('course')}>
              {Object.entries(COURSE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="t-priority">Priority</label>
            <select id="t-priority" className="select" value={form.priority} onChange={set('priority')}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p[0].toUpperCase() + p.slice(1)}</option>)}
            </select>
          </div>
          <div className="field span-all">
            <label htmlFor="t-due">Due date <span className="faint">(optional)</span></label>
            <input id="t-due" className="input" type="date" value={form.due} onChange={set('due')} aria-invalid={!!errors.due} />
            {errors.due && <span className="field-error">{errors.due}</span>}
          </div>
        </div>
        <label className="row small" style={{ gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" className="check" checked={form.today === todayKey()} onChange={(e) => setForm((f) => ({ ...f, today: e.target.checked ? todayKey() : '' }))} />
          Put on today’s list
        </label>
        <div className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">{task ? 'Save changes' : <><Plus aria-hidden="true" /> Add task</>}</button>
        </div>
      </form>
    </Modal>
  )
}

export function QuickAdd({ course = 'other', today = true, placeholder = 'Add a task for today…' }) {
  const { addTask } = useBloom()
  const [title, setTitle] = useState('')
  const [err, setErr] = useState('')
  const [c, setC] = useState(course)
  function submit(e) {
    e.preventDefault()
    const t = title.trim()
    if (!t) { setErr('Type a task first.'); return }
    if (t.length > 140) { setErr('Keep it under 140 characters.'); return }
    addTask({ title: t, course: c, today: today ? todayKey() : '', priority: 'medium' })
    setTitle('')
    setErr('')
  }
  return (
    <form onSubmit={submit} className="stack" style={{ gap: 6 }}>
      <div className="quick-add">
        <label htmlFor="quick-add" className="sr-only">New task title</label>
        <input id="quick-add" className="input" value={title} onChange={(e) => { setTitle(e.target.value); setErr('') }} placeholder={placeholder} maxLength={160} aria-invalid={!!err} />
        <label htmlFor="quick-course" className="sr-only">Course</label>
        <select id="quick-course" className="select" value={c} onChange={(e) => setC(e.target.value)} style={{ width: 'auto', borderRadius: 999 }}>
          {Object.entries(COURSE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button type="submit" className="btn btn-primary" aria-label="Add task"><Plus aria-hidden="true" /></button>
      </div>
      {err && <span className="field-error" role="alert">{err}</span>}
    </form>
  )
}
