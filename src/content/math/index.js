import functions from './functions'
import rates from './rates'
import limits from './limits'
import applications from './applications'

// Order here is the order shown in the app. To add or reorder units, edit this list.
export const mathUnits = [functions, rates, limits, applications]

export const mathCourse = {
  id: 'math',
  title: 'Math MA',
  subtitle: 'Introduction to Functions and Calculus I',
  scopeNote:
    'Organized around the course overview you provided: Functions, Rates of change, and Limits, plus an Applications unit that combines them. All explanations and questions are original practice material written for Bloom. They are not taken from Harvard lectures, problem sets, or exams.',
}

export function findMathItem(id) {
  for (const unit of mathUnits) {
    for (const kind of ['concepts', 'examples', 'practice', 'check']) {
      const item = unit[kind].find((x) => x.id === id)
      if (item) return { unit, kind, item }
    }
  }
  return null
}
