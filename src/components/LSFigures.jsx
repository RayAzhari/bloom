import FunctionPlot from './FunctionPlot'

// Figures referenced by name from LS 1A content (`visual` / `figure` fields).

function Protonation() {
  const frac = (pKa) => (pH) => 1 / (1 + Math.pow(10, pKa - pH))
  return (
    <FunctionPlot
      spec={{
        x: [0, 14], y: [0, 1],
        ticks: { x: [0, 2, 4, 6, 7.4, 9, 12, 14], y: [0, 0.5, 1] },
        fns: [
          { f: frac(4), color: 'rose', label: 'carboxyl (pKa ≈ 4)', labelAt: [13.8, 0.9] },
          { f: frac(9), color: 'sage', label: 'amino (pKa ≈ 9)', labelAt: [13.8, 0.72] },
        ],
        vlines: [{ x: 7.4 }],
        hlines: [{ y: 0.5 }],
        xLabel: 'pH', yLabel: 'fraction deprotonated',
      }}
      caption="Each group is 50% deprotonated at pH = pKa. At pH 7.4 (dashed), carboxyls are almost fully deprotonated (–COO⁻) and amino groups are mostly still protonated (–NH₃⁺). pKa values are typical approximations."
    />
  )
}

function Inhibition() {
  return (
    <FunctionPlot
      spec={{
        x: [0, 30], y: [0, 100],
        fns: [
          { f: (s) => (100 * s) / (1 + s), color: 'ink', label: 'no inhibitor', labelAt: [29, 92] },
          { f: (s) => (100 * s) / (3 + s), color: 'rose', dashed: true, label: 'with competitive inhibitor', labelAt: [29, 78] },
        ],
        xLabel: '[substrate]', yLabel: 'rate',
      }}
      caption="Illustrative curves, not real measurements. A competitive inhibitor lowers the rate most at low substrate; at high substrate both curves approach the same maximum."
    />
  )
}

function Bilayer() {
  const heads = Array.from({ length: 8 }, (_, i) => 24 + i * 32)
  const tail = (x, y, dir) => `M${x - 4} ${y} q 3 ${dir * 9} 0 ${dir * 18} q -3 ${dir * 9} 0 ${dir * 18} M${x + 4} ${y} q 3 ${dir * 9} 0 ${dir * 18} q -3 ${dir * 9} 0 ${dir * 18}`
  return (
    <figure className="figure" style={{ margin: 0 }}>
      <svg className="plot" viewBox="0 0 360 190" role="img" aria-label="Diagram of a phospholipid bilayer: polar heads face water on both sides, nonpolar tails point inward.">
        <rect x="0" y="0" width="360" height="40" fill="#eef4fb" rx="8" />
        <rect x="0" y="150" width="360" height="40" fill="#eef4fb" rx="8" />
        <text x="10" y="24" fontSize="11" fill="#6a7f96" fontStyle="italic">water (polar)</text>
        <text x="10" y="176" fontSize="11" fill="#6a7f96" fontStyle="italic">water (polar)</text>
        <rect x="0" y="62" width="360" height="66" fill="#fbf3e3" />
        <text x="350" y="100" fontSize="10.5" fill="#8a6a1f" textAnchor="end" fontStyle="italic">nonpolar interior</text>
        {heads.map((x) => (
          <g key={x}>
            <path d={tail(x, 58, 1)} stroke="#c9a253" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx={x} cy="50" r="9" fill="#e8acb7" />
            <path d={tail(x, 132, -1)} stroke="#c9a253" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx={x} cy="140" r="9" fill="#e8acb7" />
          </g>
        ))}
      </svg>
      <figcaption>Phospholipids are amphipathic. Polar heads (pink) face water and nonpolar tails (gold) hide inside, which is the hydrophobic effect at work.</figcaption>
    </figure>
  )
}

const FIGURES = { protonation: Protonation, inhibition: Inhibition, bilayer: Bilayer }

export default function LSFigure({ name }) {
  const C = FIGURES[name]
  return C ? <C /> : null
}
