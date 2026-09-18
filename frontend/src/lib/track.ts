import { API_BASE } from './api'

// 반응 측정: 방문(page_view)과 사전가입 버튼 클릭(cta_click)을 자체 백엔드에 기록한다.
// 중국 본토에서 막히는 외부 분석 도구(구글 등)를 쓰지 않기 위해 직접 수집한다.

const VISITOR_KEY = 'fanstay.visitor'
let memoryVisitorId = ''

function randomId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
}

export function getVisitorId() {
  try {
    let id = window.localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id = randomId()
      window.localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    memoryVisitorId ||= randomId()
    return memoryVisitorId
  }
}

type EventType = 'page_view' | 'cta_click'

export function track(eventType: EventType, options: { label?: string; lang?: string } = {}) {
  const body = JSON.stringify({
    event_type: eventType,
    visitor_id: getVisitorId(),
    label: options.label ?? '',
    language: options.lang ?? '',
    path: window.location.pathname,
    referrer: document.referrer.slice(0, 500),
  })
  const url = `${API_BASE}/api/events/`

  try {
    // 페이지를 떠나는 순간에도 유실되지 않도록 sendBeacon을 우선 사용
    if (navigator.sendBeacon?.(url, body)) return
  } catch {
    // 아래 fetch로 대체
  }
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {})
}
