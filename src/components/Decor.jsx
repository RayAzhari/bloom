// Hand-built SVG decorations. All are aria-hidden; they carry no information.

export function Flower({ size = 28, petal = '#eeb4bf', center = '#f4d58d', petals = 5, className = '', style }) {
  const items = Array.from({ length: petals }, (_, i) => (360 / petals) * i)
  return (
    <svg width={size} height={size} viewBox="-20 -20 40 40" aria-hidden="true" className={className} style={style}>
      {items.map((r) => (
        <ellipse key={r} cx="0" cy="-9" rx="6" ry="9.5" fill={petal} transform={`rotate(${r})`} opacity="0.95" />
      ))}
      <circle r="5" fill={center} />
      <circle r="5" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1" />
    </svg>
  )
}

export function Sparkle({ size = 12, color = '#e8acb7', className = 'twinkle', style }) {
  return (
    <svg width={size} height={size} viewBox="-10 -10 20 20" aria-hidden="true" style={style}>
      <path className={className} d="M0 -9 C1 -2 2 -1 9 0 C2 1 1 2 0 9 C-1 2 -2 1 -9 0 C-2 -1 -1 -2 0 -9Z" fill={color} />
    </svg>
  )
}

export function Logo({ size = 30 }) {
  return <Flower size={size} petal="#e9a5b3" center="#f6d78b" />
}

// A small sprig used on the greeting card.
export function Sprig({ className }) {
  return (
    <svg viewBox="0 0 120 90" className={className} aria-hidden="true">
      <g className="sway">
        <path d="M60 90 C58 70 62 52 60 30" stroke="#9fb594" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M60 64 C48 60 42 52 40 44 C50 46 58 52 60 64Z" fill="#c4d5b9" />
        <path d="M60 54 C70 50 76 42 78 34 C68 36 61 44 60 54Z" fill="#b5c9aa" />
        <g transform="translate(60 26)">
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="0" cy="-8" rx="5.6" ry="8.5" fill="#efb6c1" transform={`rotate(${r})`} />
          ))}
          <circle r="4.6" fill="#f4d58d" />
        </g>
      </g>
      <g transform="translate(30 70)">
        {[0, 90, 180, 270].map((r) => (
          <ellipse key={r} cx="0" cy="-4.5" rx="3" ry="4.5" fill="#f6d2d8" transform={`rotate(${r + 45})`} />
        ))}
        <circle r="2.4" fill="#f4d58d" />
      </g>
      <path className="twinkle" d="M96 22 C96.6 26 97 26.4 101 27 C97 27.6 96.6 28 96 32 C95.4 28 95 27.6 91 27 C95 26.4 95.4 26 96 22Z" fill="#e8acb7" />
      <path className="twinkle" style={{ animationDelay: '1.2s' }} d="M22 18 C22.4 21 22.7 21.3 25.5 21.7 C22.7 22.1 22.4 22.4 22 25.4 C21.6 22.4 21.3 22.1 18.5 21.7 C21.3 21.3 21.6 21 22 18Z" fill="#b5c9aa" />
    </svg>
  )
}

export function EmptyArt() {
  return (
    <svg className="empty-art" viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="32" cy="56" rx="18" ry="3.5" fill="#f2e6e1" />
      <path d="M32 55 C31 46 33 40 32 30" stroke="#a9bf9f" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M32 46 C24 44 21 38 20 33 C27 34 31 39 32 46Z" fill="#c9d9be" />
      <path d="M32 40 C39 37 42 32 43 27 C36 28 33 33 32 40Z" fill="#b5c9aa" />
      <circle cx="32" cy="24" r="6" fill="#f6d2d8" />
    </svg>
  )
}

// Burst of tiny petals for completion moments.
export function BloomBurst({ tone = 'rose' }) {
  const petal = tone === 'sage' ? '#b5c9aa' : '#efb6c1'
  return (
    <svg className="bloom-burst" viewBox="-24 -24 48 48" aria-hidden="true">
      <g className="bloom-in">
        {[0, 60, 120, 180, 240, 300].map((r) => (
          <ellipse key={r} cx="0" cy="-10" rx="6" ry="10" fill={petal} transform={`rotate(${r})`} />
        ))}
        <circle r="5.5" fill="#f4d58d" />
      </g>
      <path className="twinkle" d="M17 -18 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2z" fill="#e8acb7" />
      <path className="twinkle" style={{ animationDelay: '0.8s' }} d="M-18 14 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1z" fill="#b5c9aa" />
    </svg>
  )
}
