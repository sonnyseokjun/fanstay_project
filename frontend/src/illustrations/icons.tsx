// 16×16 기준 선 아이콘. 지도 핀과 폼 등에서 공용으로 쓴다.

export type IconName = 'mart' | 'laundry' | 'pharmacy' | 'gym' | 'cafe' | 'clinic' | 'search' | 'check' | 'share'

const PATHS: Record<IconName, string> = {
  mart: 'M1 2.5h2l1.8 7.5h7.7L14.5 4.5H3.6M6 13.5h.01M11.5 13.5h.01',
  laundry: 'M3 1.5h10a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5ZM4.5 4h1.5M8 12a3.3 3.3 0 1 0 0-6.6A3.3 3.3 0 0 0 8 12Z',
  pharmacy: 'M6 1.5h4v4.5h4.5v4H10v4.5H6V10H1.5V6H6Z',
  gym: 'M1 8h14M3.5 4.5v7M12.5 4.5v7M1.5 6.5v3M14.5 6.5v3',
  cafe: 'M2 6h9v3.5A4.5 4.5 0 0 1 6.5 14A4.5 4.5 0 0 1 2 9.5ZM11 7h1.3a2 2 0 0 1 0 4H11M5 1.5v2M8 1.5v2',
  clinic: 'M8 1.5l1.5 5 5 1.5-5 1.5L8 14.5l-1.5-5-5-1.5 5-1.5Z',
  search: 'M7 12.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11ZM11 11l3.5 3.5',
  check: 'M2.5 8.5l3.5 3.5 7.5-8',
  share: 'M8 1.5v9M4.5 5 8 1.5 11.5 5M2.5 9v4.5a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9',
}

export function Icon({ name, size = 16, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}

/** SVG 안에 좌표로 배치할 때 쓰는 버전 */
export function IconAt({ name, x, y, size = 16 }: { name: IconName; x: number; y: number; size?: number }) {
  const scale = size / 16
  return (
    <g
      transform={`translate(${x - size / 2} ${y - size / 2}) scale(${scale})`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6 / scale}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[name]} />
    </g>
  )
}
