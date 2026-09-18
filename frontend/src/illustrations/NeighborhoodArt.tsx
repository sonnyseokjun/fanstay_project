import type { AreaCode } from '../content/types'

// 생활권 표지판 카드에 들어가는 동네별 선 일러스트 (160×72).

const common = {
  fill: 'none',
  stroke: 'var(--ink)',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function NeighborhoodArt({ code }: { code: AreaCode }) {
  return (
    <svg className="hood-art" viewBox="0 0 160 72" aria-hidden="true">
      <path d="M4 68H156" {...common} />
      {code === 'seongsu' && <Seongsu />}
      {code === 'hongdae' && <Hongdae />}
      {code === 'gangnam' && <Gangnam />}
    </svg>
  )
}

// 톱니 지붕 붉은 벽돌 공장 + 굴뚝 + 카페 차양
function Seongsu() {
  return (
    <g>
      <path d="M14 68V36L34 24V36L54 24V36L74 24V68" {...common} />
      <path d="M86 68V10H96V68" {...common} />
      <path d="M22 50H34M22 58H34M46 50H58M46 58H58" {...common} />
      <path d="M104 68V40H150V68" {...common} />
      <path d="M100 40L108 30H146L154 40Z" fill="var(--sticker)" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M114 68V52H128V68M136 50H144" {...common} />
    </g>
  )
}

// 버스킹: 앰프, 마이크 스탠드, 음표, 독립서점
function Hongdae() {
  return (
    <g>
      <rect x="10" y="36" width="30" height="32" rx="3" {...common} />
      <circle cx="25" cy="55" r="7" fill="var(--sticker)" stroke="var(--ink)" strokeWidth="2" />
      <path d="M25 44h.01" {...common} />
      <path d="M62 68V32M52 68l10-9 10 9M62 32l10-8" {...common} />
      <circle cx="76" cy="21" r="5" fill="var(--sticker)" stroke="var(--ink)" strokeWidth="2" />
      <path d="M90 42V24l16-5v18" {...common} />
      <circle cx="87" cy="42" r="3.5" fill="var(--ink)" />
      <circle cx="103" cy="37" r="3.5" fill="var(--ink)" />
      <path d="M118 68V34H152V68M118 44H152M126 68V54H144V68M130 54V68M135 54V68" {...common} />
    </g>
  )
}

// 고층 빌딩과 피부과 간판
function Gangnam() {
  return (
    <g>
      <path d="M12 68V20H38V68M50 68V8H72V68M84 68V30H108V68" {...common} />
      <path d="M20 30H30M20 40H30M20 50H30M58 20H64M58 32H64M58 44H64M58 56H64M92 42H100M92 54H100" {...common} />
      <path d="M122 68V44H152V68" {...common} />
      <rect x="126" y="24" width="22" height="14" rx="3" fill="var(--sticker)" stroke="var(--ink)" strokeWidth="2" />
      <path d="M137 27.5V34.5M133.5 31H140.5" {...common} />
      <path d="M137 38V44" {...common} />
    </g>
  )
}
