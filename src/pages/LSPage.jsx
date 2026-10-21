import { useMemo } from 'react'
import { ArrowRight, Bookmark, CircleHelp, FlaskConical, Info, Layers, Library, Link as LinkIcon, PenLine, Sparkles } from 'lucide-react'
import { lsCategories, lsCards, lsPractice, lsLessons, SKILL_LABEL, lsCourse } from '../content/ls1a'
import { resources } from '../content/resources'
import { Paras, Rich } from '../components/Rich'
import LSFigure from '../components/LSFigures'
import Flashcards from '../components/Flashcards'
import ResourceList from '../components/ResourceList'
import { LessonPicker, PracticeSet, SavedList } from '../components/Study'
import { SaveButton, Tabs } from '../components/ui'
import { navigate } from '../lib/router'

const SECTIONS = [
  { id: 'concepts', label: 'Concepts', icon: Layers },
  { id: 'flashcards', label: 'Flashcards', icon: Sparkles },
  { id: 'practice', label: 'Practice', icon: PenLine },
  { id: 'help', label: 'Help me understand', icon: CircleHelp },
  { id: 'saved', label: 'Saved', icon: Bookmark },
  { id: 'resources', label: 'Resources', icon: Library },
]

// Routes: #/ls1a/<section>/<sub>/<sub2>
//   concepts/<categoryId> · practice/<categoryId|all>/<questionId> · help/<lessonId>
export default function LSPage({ parts }) {
  const [, a, b, c] = parts
  const section = SECTIONS.some((s) => s.id === a) ? a : 'concepts'

  return (
    <div className="stack-lg">
      <header className="page-head">
        <div>
          <span className="eyebrow" style={{ color: 'var(--sage-500)' }}><FlaskConical size={14} aria-hidden="true" /> LS 1A</span>
          <h1>LS 1A study space</h1>
          <p className="sub">{lsCourse.subtitle}</p>
        </div>
      </header>
      <div className="callout callout-tip small"><Info /><div>{lsCourse.scopeNote}</div></div>

      <Tabs label="LS 1A sections" tabs={SECTIONS} value={section} onChange={(id) => navigate(`ls1a/${id}`)} />

      {section === 'concepts' && <Concepts categoryId={b} />}
      {section === 'flashcards' && <Flashcards cards={lsCards} categories={lsCategories} />}
      {section === 'practice' && <Practice categoryId={b} questionId={c} />}
      {section === 'help' && (
        <LessonPicker
          lessons={lsLessons}
          selectedId={b}
          onSelect={(id) => navigate(`ls1a/help/${id}`, { replace: true })}
          course="ls1a"
          groupLabel={(l) => lsCategories.find((x) => x.id === l.category)?.short}
        />
      )}
      {section === 'saved' && <div className="card"><SavedList course="ls1a" /></div>}
      {section === 'resources' && <ResourceList items={resources.ls1a} />}
    </div>
  )
}

function Concepts({ categoryId }) {
  const cat = lsCategories.find((x) => x.id === categoryId) || lsCategories[0]
  const nQ = lsPractice.filter((q) => q.category === cat.id).length
  const nC = lsCards.filter((x) => x.category === cat.id).length
  return (
    <>
      <div className="unit-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }} role="group" aria-label="Topic categories">
        {lsCategories.map((x) => (
          <button key={x.id} className="unit-card sage" aria-pressed={x.id === cat.id} onClick={() => navigate(`ls1a/concepts/${x.id}`, { replace: true })}>
            <span className="unit-num">{x.short}</span>
            <p>{x.blurb}</p>
          </button>
        ))}
      </div>

      <article className="card stack-lg fade-in" key={cat.id} aria-labelledby="cat-title">
        <div className="row between" style={{ alignItems: 'flex-start' }}>
          <h2 id="cat-title">{cat.title}</h2>
          <SaveButton item={{ id: `ls-${cat.id}`, course: 'ls1a', kind: 'concept', title: `LS 1A: ${cat.title}`, route: `ls1a/concepts/${cat.id}` }} />
        </div>

        <div className={cat.visual ? 'grid grid-2' : ''} style={{ alignItems: 'start' }}>
          <div className="prose"><Paras items={cat.summary} /></div>
          {cat.visual && <LSFigure name={cat.visual} />}
        </div>

        <div className="stack">
          <h3>Key vocabulary</h3>
          <dl className="vocab">
            {cat.vocab.map((v) => <div key={v.term}><dt>{v.term}</dt><dd>{v.def}</dd></div>)}
          </dl>
        </div>

        <div className="grid grid-2">
          <div className="callout callout-info">
            <LinkIcon />
            <div><strong>Connections</strong><ul>{cat.connections.map((x, i) => <li key={i}><Rich text={x} /></li>)}</ul></div>
          </div>
          <div className="callout callout-tip">
            <Sparkles />
            <div><strong>Why it matters</strong><ul>{cat.why.map((x, i) => <li key={i}><Rich text={x} /></li>)}</ul></div>
          </div>
        </div>

        <div className="row">
          {nQ > 0 && <button className="btn btn-sage btn-sm" onClick={() => navigate(`ls1a/practice/${cat.id}`)}>Practice this topic ({nQ}) <ArrowRight aria-hidden="true" /></button>}
          {nC > 0 && <button className="btn btn-outline btn-sm" onClick={() => navigate('ls1a/flashcards')}>Flashcards ({nC} in this topic)</button>}
        </div>
      </article>
    </>
  )
}

function Practice({ categoryId, questionId }) {
  const cat = lsCategories.some((x) => x.id === categoryId) ? categoryId : 'all'
  const questions = useMemo(
    () => lsPractice.filter((q) => cat === 'all' || q.category === cat).map((q) => ({ ...q, skillLabel: SKILL_LABEL[q.skill] })),
    [cat],
  )
  return (
    <div className="stack-lg">
      <div className="chips" role="group" aria-label="Filter by topic">
        <button className="chip" aria-pressed={cat === 'all'} onClick={() => navigate('ls1a/practice/all', { replace: true })}>All topics ({lsPractice.length})</button>
        {lsCategories.map((x) => {
          const n = lsPractice.filter((q) => q.category === x.id).length
          return n ? <button key={x.id} className="chip" aria-pressed={cat === x.id} onClick={() => navigate(`ls1a/practice/${x.id}`, { replace: true })}>{x.short} ({n})</button> : null
        })}
      </div>
      <PracticeSet
        questions={questions}
        selectedId={questionId}
        onSelect={(id) => navigate(`ls1a/practice/${cat}/${id}`, { replace: true })}
        course="ls1a"
        saveTitle={(q) => `LS 1A practice: ${q.prompt.replace(/\*\*|`/g, '').slice(0, 60)}${q.prompt.length > 60 ? '…' : ''}`}
        routeFor={(q) => `ls1a/practice/all/${q.id}`}
        intro={<p className="small muted" style={{ margin: 0 }}>Reasoning questions: after you answer, each option explains why it is right or wrong. Data in experiment questions is illustrative, not real measurements.</p>}
      />
    </div>
  )
}
