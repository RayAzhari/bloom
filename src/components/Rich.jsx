import FunctionPlot from './FunctionPlot'
import { Fragment } from 'react'

// Lightweight markup for content strings:
//   `x^{2} + 1`  → math span (supports ^{...} superscripts and _{...} subscripts)
//   **bold**     → strong
//   *italic*     → em
// Keeps content files readable without pulling in a math typesetting library.

function renderMath(src, key) {
  const parts = []
  const re = /([\^_])\{([^}]*)\}/g
  let last = 0
  let m
  let i = 0
  while ((m = re.exec(src))) {
    if (m.index > last) parts.push(src.slice(last, m.index))
    parts.push(m[1] === '^' ? <sup key={i++}>{m[2]}</sup> : <sub key={i++}>{m[2]}</sub>)
    last = re.lastIndex
  }
  if (last < src.length) parts.push(src.slice(last))
  return <span className="math" key={key}>{parts}</span>
}

export function Rich({ text }) {
  if (text == null) return null
  if (typeof text !== 'string') return text
  const out = []
  const re = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*\s][^*]*?)\*/g
  let last = 0
  let m
  let k = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(<Fragment key={k++}>{text.slice(last, m.index)}</Fragment>)
    if (m[1] !== undefined) out.push(renderMath(m[1], k++))
    else if (m[2] !== undefined) out.push(<strong key={k++}>{m[2]}</strong>)
    else out.push(<em key={k++}>{m[3]}</em>)
    last = re.lastIndex
  }
  if (last < text.length) out.push(<Fragment key={k++}>{text.slice(last)}</Fragment>)
  return <>{out}</>
}

// Display-style math on its own line: "$$ ... $$" strings in content arrays.
export function MathBlock({ text }) {
  return <span className="math-block">{renderMath(text, 'b').props.children}</span>
}

export function Paras({ items }) {
  if (!items) return null
  const list = Array.isArray(items) ? items : [items]
  return list.map((p, i) =>
    typeof p === 'string' && p.startsWith('$$') ? (
      <MathBlock key={i} text={p.replace(/^\$\$\s*|\s*\$\$$/g, '')} />
    ) : (
      <p key={i}><Rich text={p} /></p>
    ),
  )
}

export function DataTable({ table, caption }) {
  if (!table) return null
  return (
    <div className="table-wrap">
      <table className="data-table">
        {caption && <caption className="sr-only">{caption}</caption>}
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri}>
              <th scope="row"><Rich text={row[0]} /></th>
              {row.slice(1).map((c, ci) => <td key={ci}><Rich text={String(c)} /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Plain-text version of a content string (for aria-labels).
export const plain = (text = '') => text.replace(/`|\*/g, '').replace(/\^\{([^}]*)\}/g, '^$1').replace(/_\{([^}]*)\}/g, '$1')

export function Plot({ spec, caption }) {
  return <FunctionPlot spec={spec} caption={caption ? <Rich text={caption} /> : undefined} ariaLabel={caption ? plain(caption) : 'Graph'} />
}
