import { useEffect, useState } from 'react'
import { BookOpen, Bookmark, CircleHelp, Info, Library, Lightbulb, ListChecks, PenLine, Sigma, TriangleAlert, Layers, ArrowRight } from 'lucide-react'
import { mathCourse, mathUnits } from '../content/math'
import { mathLessons } from '../content/math/lessons'
import { resources } from '../content/resources'
import { Paras, Rich, DataTable, Plot } from '../components/Rich'
import Question, { SolutionSteps } from '../components/Question'
import ResourceList from '../components/ResourceList'
import { LessonPicker, PracticeSet, SavedList } from '../components/Study'
import { SaveButton, Tabs } from '../components/ui'
import { navigate } from '../lib/router'
import { useBloom } from '../state/BloomStore'

const SECTIONS = [
  { id: 'units', label: 'Study units', icon: Layers },
  { id: 'help', label: 'Help me understand', icon: CircleHelp },
  { id: 'saved', label: 'Saved for review', icon: Bookmark },
  { id: 'resources', label: 'Resources', icon: Library },
]
const UNIT_TABS = [
  { id: 'guide', label: 'Concept guide', icon: BookOpen },
  { id: 'examples', label: 'Worked examples', icon: PenLine },
  { id: 'practice', label: 'Practice', icon: Sigma },
  { id: 'check', label: 'Knowledge check', icon: ListChecks },
]

// Routes: #/math, #/math/<unitId>/<tab>/<itemId>, #/math/help/<lessonId>, #/math/saved, #/math/resources
export default function MathPage({ parts }) {
  const [, a, b, c] = parts
  const section = ['help', 'saved', 'resources'].includes(a) ? a : 'units'
  const unit = mathUnits.find((u) => u.id === a) || mathUnits[0]
  const tab = UNIT_TABS.some((t) => t.id === b) ? b : 'guide'

  const goSection = (id) => navigate(id === 'units' ? `math/${unit.id}` : `math/${id}`)

  return (
    <div className="stack-lg">
      <header className="page-head">
        <div>
          <span className="eyebrow"><Sigma size={14} aria-hidden="true" /> Math MA</span>
          <h1>Math MA study space</h1>
          <p className="sub">{mathCourse.subtitle}</p>
        </div>
      </header>
      <div className="callout callout-info small"><Info /><div>{mathCourse.scopeNote}</div></div>

      <Tabs label="Math MA sections" tabs={SECTIONS} value={section} onChange={goSection} />

      {section === 'units' && (
        <>
          <div className="unit-grid" role="group" aria-label="Units">
            {mathUnits.map((u) => (
              <button key={u.id} className="unit-card" aria-pressed={u.id === unit.id} onClick={() => navigate(`math/${u.id}/${tab}`)}>
                <span className="unit-num">Unit {u.number}</span>
                <h3>{u.title}</h3>
                <p>{u.blurb}</p>
              </button>
            ))}
          </div>
          <UnitView unit={unit} tab={tab} itemId={c} />
        </>
      )}

      {section === 'help' && (
        <LessonPicker
          lessons={mathLessons}
          selectedId={b}
          onSelect={(id) => navigate(`math/help/${id}`, { replace: true })}
          course="math"
          groupLabel={(l) => mathUnits.find((u) => u.id === l.unitId)?.title}
        />
      )}

      {section === 'saved' && <div className="card"><SavedList course="math" /></div>}
      {section === 'resources' && <ResourceList items={resources.math} />}
    </div>
  )
}

function UnitView({ unit, tab, itemId }) {
  const setTab = (t) => navigate(`math/${unit.id}/${t}`, { replace: true })
  return (
    <section className="card stack-lg" aria-labelledby="unit-title">
      <div className="row between" style={{ alignItems: 'flex-start' }}>
        <div>
          <h2 id="unit-title">Unit {unit.number}: {unit.title}</h2>
          <ul className="small muted" style={{ margin: '6px 0 0', paddingLeft: 18 }}>
            {unit.scope.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      </div>
      <Tabs label={`${unit.title} views`} tabs={UNIT_TABS} value={tab} onChange={setTab} />
      {tab === 'guide' && <ConceptGuide unit={unit} conceptId={itemId} />}
      {tab === 'examples' && <Examples unit={unit} exampleId={itemId} />}
      {tab === 'practice' && (
        <PracticeSet
          questions={unit.practice}
          selectedId={itemId}
          onSelect={(id) => navigate(`math/${unit.id}/practice/${id}`, { replace: true })}
          course="math"
          saveTitle={(q) => `${unit.title}: practice ${unit.practice.indexOf(q) + 1}`}
          routeFor={(q) => `math/${unit.id}/practice/${q.id}`}
          intro={<p className="small muted" style={{ margin: 0 }}>Questions go from <span className="tag tag-level-intro">Intro</span> to <span className="tag tag-level-challenge">Challenge</span>. Numeric answers accept fractions and expressions like <span className="math">3/4</span> or <span className="math">5ln2</span>. Rounding instructions are given in each question.</p>}
        />
      )}
      {tab === 'check' && <KnowledgeCheck unit={unit} />}
    </section>
  )
}

function ConceptGuide({ unit, conceptId }) {
  const concept = unit.concepts.find((c) => c.id === conceptId) || unit.concepts[0]
  const select = (id) => navigate(`math/${unit.id}/guide/${id}`, { replace: true })
  const examples = unit.examples.filter((e) => e.conceptId === concept.id)
  return (
    <div className="split">
      <nav className="concept-nav" aria-label="Concepts">
        {unit.concepts.map((c) => (
          <button key={c.id} className="concept-link" aria-current={c.id === concept.id} onClick={() => select(c.id)}>
            <Lightbulb aria-hidden="true" /> {c.title}
          </button>
        ))}
      </nav>
      <article className="stack fade-in" key={concept.id} aria-labelledby="concept-title">
        <div className="row between">
          <h3 id="concept-title" style={{ fontSize: '1.2rem' }}>{concept.title}</h3>
          <SaveButton item={{ id: concept.id, course: 'math', kind: 'concept', title: `${unit.title}: ${concept.title}`, route: `math/${unit.id}/guide/${concept.id}` }} />
        </div>
        <div className="callout callout-tip"><Lightbulb /><div><strong>Key idea.</strong> <Rich text={concept.summary} /></div></div>
        <div className="prose"><Paras items={concept.body} /></div>
        {concept.table && <DataTable table={concept.table} />}
        {concept.reps && (
          <div className="rep-grid">
            {['verbal', 'numerical', 'algebraic', 'graphical'].filter((k) => concept.reps[k]).map((k) => (
              <div key={k} className="rep"><h4>{k}</h4><Rich text={concept.reps[k]} /></div>
            ))}
          </div>
        )}
        {concept.plot && <Plot spec={concept.plot} caption={concept.plotCaption} />}
        {concept.body2 && <div className="prose"><Paras items={concept.body2} /></div>}
        {concept.mistakes?.length > 0 && (
          <div className="callout callout-warn"><TriangleAlert /><div><strong>Common mistakes</strong><ul>{concept.mistakes.map((m, i) => <li key={i}><Rich text={m} /></li>)}</ul></div></div>
        )}
        {examples.length > 0 && (
          <div className="row">
            {examples.map((e) => (
              <button key={e.id} className="btn btn-soft btn-sm" onClick={() => navigate(`math/${unit.id}/examples/${e.id}`)}>
                Worked example: {e.title} <ArrowRight aria-hidden="true" />
              </button>
            ))}
          </div>
        )}
      </article>
    </div>
  )
}

function Examples({ unit, exampleId }) {
  const ex = unit.examples.find((e) => e.id === exampleId) || unit.examples[0]
  const [shown, setShown] = useState(1)
  useEffect(() => setShown(1), [ex.id])
  const all = shown >= ex.steps.length
  return (
    <div className="stack-lg">
      <div className="chips" role="group" aria-label="Worked examples">
        {unit.examples.map((e) => (
          <button key={e.id} className="chip" aria-pressed={e.id === ex.id} onClick={() => navigate(`math/${unit.id}/examples/${e.id}`, { replace: true })}>{e.title}</button>
        ))}
      </div>
      <article className="stack fade-in" key={ex.id} aria-labelledby="ex-title">
        <div className="row between">
          <h3 id="ex-title" style={{ fontSize: '1.15rem' }}>{ex.title}</h3>
          <SaveButton item={{ id: ex.id, course: 'math', kind: 'example', title: `${unit.title}: ${ex.title}`, route: `math/${unit.id}/examples/${ex.id}` }} />
        </div>
        <div className="callout callout-info"><PenLine /><div><strong>Problem.</strong> <Rich text={ex.problem} /></div></div>
        {ex.table && <DataTable table={ex.table} />}
        {ex.plot && <Plot spec={ex.plot} />}
        <SolutionSteps steps={ex.steps.slice(0, shown)} />
        <div className="row">
          {!all && <button className="btn btn-soft btn-sm" onClick={() => setShown((s) => s + 1)}>Show next step ({shown + 1}/{ex.steps.length})</button>}
          {!all && <button className="btn btn-ghost btn-sm" onClick={() => setShown(ex.steps.length)}>Show all steps</button>}
        </div>
        {all && (
          <div className="stack fade-in">
            <div className="callout callout-good"><Lightbulb /><div><strong>Answer.</strong> <Rich text={ex.answer} /></div></div>
            {ex.mistakes?.length > 0 && (
              <div className="callout callout-warn"><TriangleAlert /><div><strong>Watch out for</strong><ul>{ex.mistakes.map((m, i) => <li key={i}><Rich text={m} /></li>)}</ul></div></div>
            )}
            {ex.similar && (
              <div>
                <button className="btn btn-primary btn-sm" onClick={() => navigate(`math/${unit.id}/practice/${ex.similar}`)}>
                  Try a similar practice question <ArrowRight aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        )}
      </article>
    </div>
  )
}

function KnowledgeCheck({ unit }) {
  const { attempts } = useBloom()
  const correct = unit.check.filter((q) => attempts[q.id]?.correct).length
  const tried = unit.check.filter((q) => attempts[q.id]).length
  return (
    <div className="stack-lg">
      <p className="small muted" style={{ margin: 0 }}>
        Three quick questions to see what has stuck. {tried > 0 && <strong className="num" style={{ color: 'var(--ink)' }}>Latest: {correct} of {unit.check.length} correct.</strong>} This is a snapshot for you, not a grade.
      </p>
      {unit.check.map((q, i) => (
        <div key={q.id} className="card flat">
          <h3 className="small" style={{ marginBottom: 10, color: 'var(--rose-600)' }}>Check {i + 1}</h3>
          <Question q={q} label={`${unit.title}: check ${i + 1}`} />
        </div>
      ))}
    </div>
  )
}
