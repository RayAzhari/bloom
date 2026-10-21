import { Sparkle } from './Decor'

// Progress flower: eight petals open as today's tasks are completed.
export default function BloomFlower({ done, total, size = 96 }) {
  const petals = 8
  const open = total > 0 ? Math.round((done / total) * petals) : 0
  const complete = total > 0 && done === total
  return (
    <div style={{ position: 'relative', width: size, height: size, flex: 'none' }}>
      <svg width={size} height={size} viewBox="-50 -50 100 100" role="img" aria-label={total ? `${done} of ${total} of today’s tasks done` : 'No tasks for today yet'}>
        <circle r="46" fill={complete ? '#f2f6ef' : '#fdf3f3'} style={{ transition: 'fill 0.6s' }} />
        {Array.from({ length: petals }, (_, i) => {
          const on = i < open
          return (
            <g key={i} transform={`rotate(${(360 / petals) * i})`}>
              <ellipse
                className="petal"
                cx="0" cy="-22" rx="9.5" ry="17"
                fill={on ? '#eba9b6' : '#f5dfe2'}
                style={{ transform: on ? 'scale(1)' : 'scale(0.55)', transitionDelay: `${i * 60}ms` }}
              />
            </g>
          )
        })}
        <circle r="10" fill={complete ? '#f4d58d' : '#f7e6bd'} style={{ transition: 'fill 0.5s' }} />
      </svg>
      {complete && (
        <>
          <span style={{ position: 'absolute', top: 2, right: 4 }}><Sparkle size={14} /></span>
          <span style={{ position: 'absolute', bottom: 8, left: 0 }}><Sparkle size={10} color="#b5c9aa" /></span>
        </>
      )}
    </div>
  )
}
