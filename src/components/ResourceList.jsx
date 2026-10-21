import { BookOpen, ExternalLink, FileText, GraduationCap, PenLine, Video } from 'lucide-react'

const TYPE = {
  notes: { label: 'Notes', icon: FileText },
  practice: { label: 'Practice', icon: PenLine },
  video: { label: 'Video', icon: Video },
  reference: { label: 'Reference', icon: BookOpen },
}

export default function ResourceList({ items }) {
  return (
    <div className="stack">
      <div className="callout callout-info small">
        <GraduationCap />
        <div>
          These are <strong>external</strong> links, kept separate from Bloom’s own practice material. Pages marked “Official” are Harvard course pages; every other site is independent, and listing it doesn’t imply that Harvard or the course staff endorse it. Links open in a new tab.
        </div>
      </div>
      <div className="grid grid-2">
        {items.map((r) => {
          const t = TYPE[r.type] || TYPE.reference
          const Icon = t.icon
          return (
            <article key={r.id} className="resource">
              <div className="resource-icon"><Icon aria-hidden="true" /></div>
              <div className="stack" style={{ gap: 6, minWidth: 0 }}>
                <h3>{r.title}</h3>
                <p className="small muted" style={{ margin: 0 }}>{r.description}</p>
                <div className="row" style={{ gap: 6 }}>
                  <span className="tag">{t.label}</span>
                  <span className="tag">{r.topic}</span>
                  {r.official && <span className="tag tag-ls1a">Official</span>}
                </div>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="small" style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  Open <ExternalLink size={13} aria-hidden="true" /><span className="sr-only"> {r.title} (opens in a new tab)</span>
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
