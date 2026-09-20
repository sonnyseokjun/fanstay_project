// 24×24 선 아이콘. 기능 소개, 비교표, 공유 버튼에서 쓴다.

export type IconName = 'stay' | 'escrow' | 'ai' | 'life' | 'check' | 'dash' | 'share' | 'plus'

const PATHS: Record<IconName, string> = {
  // 침대
  stay: 'M3 18V7M3 13h18v5M21 18v-3M7 13v-2.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 13 10.5V13',
  // 자물쇠가 그려진 방패
  escrow: 'M12 3l7 3v5c0 4.4-3 8.3-7 10-4-1.7-7-5.6-7-10V6Z M9.5 12.5h5v3.5h-5Z M10.5 12.5v-1.5a1.5 1.5 0 0 1 3 0v1.5',
  // 나침반
  ai: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M15.5 8.5l-2 5-5 2 2-5Z',
  // 지도 핀
  life: 'M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.4-6.5 11-6.5 11Z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  dash: 'M7 12h10',
  share: 'M12 3v12M7.5 7.5 12 3l4.5 4.5M5 13v6a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-6',
  plus: 'M12 5v14M5 12h14',
}

export function Icon({ name, size = 24, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
