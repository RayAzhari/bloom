import { useId } from 'react'

// Small, dependency-free SVG plotter for content diagrams.
// spec: { x:[min,max], y:[min,max], fns:[{ f, color, dashed, label, domain:[a,b] }],
//         lines:[{ x1,y1,x2,y2,color,dashed,label }], points:[{ x,y,label,open,color }],
//         vlines:[{ x, label }], hlines:[{ y, label }], xLabel, yLabel, ticks:{x:[], y:[]} }

const COLORS = { rose: '#c46e80', sage: '#6f8c66', ink: '#5b4750', butter: '#c79a2e', blush: '#e8acb7', lilac: '#8a73a3' }

export default function FunctionPlot({ spec, caption, ariaLabel, width = 420, height = 260 }) {
  const clip = useId().replace(/:/g, '')
  const pad = { l: 34, r: 14, t: 14, b: 28 }
  const [x0, x1] = spec.x
  const [y0, y1] = spec.y
  const W = width - pad.l - pad.r
  const H = height - pad.t - pad.b
  const sx = (x) => pad.l + ((x - x0) / (x1 - x0)) * W
  const sy = (y) => pad.t + (1 - (y - y0) / (y1 - y0)) * H

  const ticksX = spec.ticks?.x ?? niceTicks(x0, x1)
  const ticksY = spec.ticks?.y ?? niceTicks(y0, y1)

  const paths = (spec.fns || []).map((fn) => {
    const [a, b] = fn.domain || [x0, x1]
    const n = 240
    let d = ''
    let pen = false
    for (let i = 0; i <= n; i++) {
      const x = a + ((b - a) * i) / n
      const y = fn.f(x)
      if (!Number.isFinite(y) || y > y1 + (y1 - y0) || y < y0 - (y1 - y0)) {
        pen = false
        continue
      }
      d += `${pen ? 'L' : 'M'}${sx(x).toFixed(2)},${sy(y).toFixed(2)}`
      pen = true
    }
    return { d, ...fn }
  })

  const axisY = x0 <= 0 && x1 >= 0 ? sx(0) : pad.l
  const axisX = y0 <= 0 && y1 >= 0 ? sy(0) : pad.t + H

  return (
    <figure className="figure" style={{ margin: 0 }}>
      <svg className="plot" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel || (typeof caption === 'string' ? caption : 'Graph')}>
        <defs>
          <clipPath id={clip}><rect x={pad.l} y={pad.t} width={W} height={H} /></clipPath>
        </defs>
        <rect x={pad.l} y={pad.t} width={W} height={H} fill="#fffaf7" rx="6" />
        {ticksX.map((t) => (
          <g key={`x${t}`}>
            <line x1={sx(t)} x2={sx(t)} y1={pad.t} y2={pad.t + H} stroke="#f1e4e0" />
            <text x={sx(t)} y={pad.t + H + 16} fontSize="10" textAnchor="middle" fill="#9a8990">{fmt(t)}</text>
          </g>
        ))}
        {ticksY.map((t) => (
          <g key={`y${t}`}>
            <line x1={pad.l} x2={pad.l + W} y1={sy(t)} y2={sy(t)} stroke="#f1e4e0" />
            <text x={pad.l - 6} y={sy(t) + 3.5} fontSize="10" textAnchor="end" fill="#9a8990">{fmt(t)}</text>
          </g>
        ))}
        <line x1={pad.l} x2={pad.l + W} y1={axisX} y2={axisX} stroke="#bfa9ae" strokeWidth="1.2" />
        <line x1={axisY} x2={axisY} y1={pad.t} y2={pad.t + H} stroke="#bfa9ae" strokeWidth="1.2" />
        <g clipPath={`url(#${clip})`}>
          {(spec.vlines || []).map((v, i) => (
            <line key={`v${i}`} x1={sx(v.x)} x2={sx(v.x)} y1={pad.t} y2={pad.t + H} stroke="#b9a3a9" strokeDasharray="4 4" />
          ))}
          {(spec.hlines || []).map((h, i) => (
            <line key={`h${i}`} x1={pad.l} x2={pad.l + W} y1={sy(h.y)} y2={sy(h.y)} stroke="#b9a3a9" strokeDasharray="4 4" />
          ))}
          {paths.map((p, i) => (
            <path key={i} d={p.d} fill="none" stroke={COLORS[p.color] || COLORS.rose} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={p.dashed ? '6 5' : undefined} />
          ))}
          {(spec.lines || []).map((l, i) => (
            <line key={`l${i}`} x1={sx(l.x1)} y1={sy(l.y1)} x2={sx(l.x2)} y2={sy(l.y2)} stroke={COLORS[l.color] || COLORS.ink} strokeWidth="1.8" strokeDasharray={l.dashed ? '5 4' : undefined} />
          ))}
        </g>
        {(spec.points || []).map((p, i) => (
          <g key={`p${i}`}>
            <circle cx={sx(p.x)} cy={sy(p.y)} r="4" fill={p.open ? '#fff' : COLORS[p.color] || COLORS.ink} stroke={COLORS[p.color] || COLORS.ink} strokeWidth="1.8" />
            {p.label && <text x={sx(p.x) + (p.dx ?? 7)} y={sy(p.y) + (p.dy ?? -7)} fontSize="11" fill="#5b4750" fontWeight="700">{p.label}</text>}
          </g>
        ))}
        {paths.filter((p) => p.label).map((p, i) => (
          <text key={`lab${i}`} x={sx(p.labelAt?.[0] ?? x1) - 4} y={sy(p.labelAt?.[1] ?? p.f(x1)) - 6} fontSize="11" textAnchor="end" fill={COLORS[p.color] || COLORS.rose} fontWeight="700" fontStyle="italic">{p.label}</text>
        ))}
        {spec.xLabel && <text x={pad.l + W} y={pad.t + H - 5} fontSize="10.5" textAnchor="end" fill="#6e5a61" fontStyle="italic">{spec.xLabel}</text>}
        {spec.yLabel && <text x={axisY + 5} y={pad.t + 11} fontSize="10.5" fill="#6e5a61" fontStyle="italic">{spec.yLabel}</text>}
      </svg>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

function niceTicks(a, b) {
  const span = b - a
  const raw = span / 6
  const mag = Math.pow(10, Math.floor(Math.log10(raw)))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= 7) || mag * 10
  const out = []
  for (let t = Math.ceil(a / step) * step; t <= b + 1e-9; t += step) out.push(Math.round(t * 1e6) / 1e6)
  return out
}

const fmt = (t) => (Math.abs(t) >= 1000 ? `${t / 1000}k` : String(t))
