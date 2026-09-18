import type { Content } from '../content/types'

// 솔루션 도식: 집(HOME) → 도보 15분 생활권(DAILY) → 동네(K-LIFE)로 넓어지는 세 겹의 원.

export function RingDiagram({ layers, alt }: { layers: Content['solution']['layers']; alt: string }) {
  const [home, daily, klife] = layers
  return (
    <svg className="ring-diagram" viewBox="0 0 320 320" role="img" aria-label={alt}>
      <circle cx="160" cy="160" r="152" fill="var(--white)" stroke="var(--ink)" strokeWidth="2" />
      <circle
        cx="160"
        cy="160"
        r="104"
        fill="var(--line2-soft)"
        stroke="var(--line2)"
        strokeWidth="2.5"
        strokeDasharray="2 7"
        strokeLinecap="round"
      />
      <circle cx="160" cy="160" r="48" fill="var(--sticker)" stroke="var(--ink)" strokeWidth="2.5" />

      {/* 동네에 흩어진 경험 지점 */}
      {[
        [48, 110],
        [268, 96],
        [286, 214],
        [70, 238],
        [196, 292],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="var(--ink)" />
      ))}
      {/* 생활권 안의 거점 */}
      {[
        [110, 118],
        [216, 122],
        [222, 208],
        [104, 206],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4.5" fill="var(--white)" stroke="var(--line2)" strokeWidth="2.5" />
      ))}

      <text x="160" y="36" textAnchor="middle" className="ring-diagram__label">
        {klife.ringLabel}
      </text>
      <text x="160" y="84" textAnchor="middle" className="ring-diagram__label ring-diagram__label--daily">
        {daily.ringLabel}
      </text>
      <text x="160" y="166" textAnchor="middle" className="ring-diagram__label ring-diagram__label--home">
        {home.ringLabel}
      </text>
    </svg>
  )
}
