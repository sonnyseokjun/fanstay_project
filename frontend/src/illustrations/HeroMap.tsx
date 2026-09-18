import type { CSSProperties } from 'react'
import type { Content } from '../content/types'
import { IconAt, type IconName } from './icons'

// 히어로 일러스트: 집을 중심으로 도보 15분 반경 안의 생활 거점을 보여주는 동네 지도.
// 페이지에서 유일한 자동 애니메이션(반경 원이 퍼지고 핀이 차례로 나타남)이 여기에 있다.

const CENTER = { x: 210, y: 205 }

type PoiKey = Extract<IconName, keyof Content['hero']['map']>

const POIS: { key: PoiKey; x: number; y: number }[] = [
  { key: 'mart', x: 112, y: 150 },
  { key: 'clinic', x: 196, y: 98 },
  { key: 'laundry', x: 300, y: 124 },
  { key: 'pharmacy', x: 334, y: 238 },
  { key: 'cafe', x: 248, y: 318 },
  { key: 'gym', x: 104, y: 272 },
]

export function HeroMap({ labels }: { labels: Content['hero']['map'] }) {
  return (
    <svg className="hero-map" viewBox="0 0 420 420" role="img" aria-label={labels.alt}>
      <defs>
        <clipPath id="map-clip">
          <rect width="420" height="420" rx="32" />
        </clipPath>
      </defs>

      <g clipPath="url(#map-clip)">
        {/* 동네 블록 */}
        <rect width="420" height="420" fill="var(--block)" />
        <path d="M0 0h78v98H0z" fill="var(--park)" />

        {/* 도로 */}
        <g stroke="var(--road)" strokeLinecap="round" fill="none">
          <path d="M-10 108H430M-10 232H430M-10 342H430" strokeWidth="14" />
          <path d="M84 -10V430M226 -10V430M352 -10V430" strokeWidth="14" />
          <path d="M-10 40L430 196" strokeWidth="9" />
          <path d="M156 108V232M290 232V342M18 176H84M226 170H352" strokeWidth="6" />
        </g>

        {/* 한강 */}
        <path d="M-10 396C90 384 190 404 280 392S400 372 430 376V430H-10Z" fill="var(--river)" />

        {/* 지하철 2호선 */}
        <path
          d="M-10 364H270Q318 364 342 330L430 206"
          stroke="var(--line2)"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="160" cy="364" r="8" fill="var(--white)" stroke="var(--line2)" strokeWidth="4" />
        <g transform="translate(176 346)">
          <rect width="46" height="20" rx="10" fill="var(--line2)" />
          <text x="23" y="14" textAnchor="middle" className="hero-map__line-label">
            {labels.line}
          </text>
        </g>

        {/* 도보 15분 반경 */}
        <g className="hero-map__radius">
          <circle cx={CENTER.x} cy={CENTER.y} r="150" fill="var(--brand)" fillOpacity="0.08" />
          <circle
            cx={CENTER.x}
            cy={CENTER.y}
            r="150"
            fill="none"
            stroke="var(--brand)"
            strokeWidth="2.5"
            strokeDasharray="2 7"
            strokeLinecap="round"
          />
        </g>
        <g className="hero-map__radius-label" transform={`translate(${CENTER.x} 46)`}>
          <rect x="-50" y="-15" width="100" height="30" rx="15" fill="var(--white)" stroke="var(--brand)" strokeWidth="2" />
          <text y="5" textAnchor="middle" className="hero-map__radius-text">
            {labels.radius}
          </text>
        </g>

        {/* 생활 거점 */}
        {POIS.map((poi, i) => (
          <g key={poi.key} className="hero-map__poi" style={{ '--i': i } as CSSProperties}>
            <circle cx={poi.x} cy={poi.y} r="17" fill="var(--white)" stroke="var(--ink)" strokeWidth="2" />
            <g color="var(--ink)">
              <IconAt name={poi.key} x={poi.x} y={poi.y} size={17} />
            </g>
            <text x={poi.x} y={poi.y + 34} textAnchor="middle" className="hero-map__poi-label">
              {labels[poi.key]}
            </text>
          </g>
        ))}

        {/* 집 */}
        <g className="hero-map__home">
          <circle cx={CENTER.x} cy={CENTER.y} r="28" fill="var(--sticker)" stroke="var(--ink)" strokeWidth="2.5" />
          <path
            d={`M${CENTER.x - 11} ${CENTER.y + 1}L${CENTER.x} ${CENTER.y - 10}L${CENTER.x + 11} ${CENTER.y + 1}V${CENTER.y + 12}H${CENTER.x - 11}Z`}
            fill="var(--white)"
            stroke="var(--ink)"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d={`M${CENTER.x - 3} ${CENTER.y + 12}V${CENTER.y + 5}H${CENTER.x + 3}V${CENTER.y + 12}`} fill="none" stroke="var(--ink)" strokeWidth="2" />
          <g transform={`translate(${CENTER.x} ${CENTER.y + 50})`}>
            <rect x="-38" y="-14" width="76" height="28" rx="14" fill="var(--ink)" />
            <text y="5" textAnchor="middle" className="hero-map__home-label">
              {labels.home}
            </text>
          </g>
        </g>
      </g>
    </svg>
  )
}
