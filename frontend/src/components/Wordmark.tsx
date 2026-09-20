// 로고: 형광펜이 그어진 작은 달력 + FANSTAY
export function Wordmark() {
  return (
    <span className="wordmark">
      <svg className="wordmark__mark" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="3" y="5" width="26" height="24" rx="4" fill="var(--sheet)" stroke="currentColor" strokeWidth="2.5" />
        <path d="M3 11h26" stroke="currentColor" strokeWidth="2.5" />
        <rect x="7" y="17" width="18" height="6" rx="1" fill="var(--marker)" />
      </svg>
      <span className="wordmark__text">FANSTAY</span>
    </span>
  )
}
