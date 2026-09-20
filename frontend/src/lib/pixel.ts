// 메타 픽셀: 메타 광고 관리자에서 광고별 방문·가입 전환을 보기 위한 스크립트.
// 빌드 환경변수 VITE_META_PIXEL_ID가 있을 때만 불러온다(로컬 개발과 미설정 배포에서는 아무것도 하지 않음).

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[]; loaded: boolean; version: string; push: Fbq }

declare global {
  interface Window {
    fbq?: Fbq
    _fbq?: Fbq
  }
}

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined

export function initPixel() {
  if (!PIXEL_ID || window.fbq) return
  // 메타가 안내하는 기본 설치 코드를 옮긴 것
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args)
    else fbq.queue.push(args)
  } as Fbq
  fbq.push = fbq
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.queue = []
  window.fbq = fbq
  window._fbq = fbq

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)

  fbq('init', PIXEL_ID)
  fbq('track', 'PageView')
}

/** 사전가입 완료: 메타 표준 이벤트 Lead */
export function trackLead() {
  window.fbq?.('track', 'Lead')
}
