// 개발 중에는 Vite 프록시를 쓰므로 비워 둔다.
// 배포 시 프론트와 API 도메인이 다르면 VITE_API_BASE=https://api.example.com 으로 지정한다.
export const API_BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/$/, '')

export type SignupPayload = {
  contact_type: 'email' | 'wechat'
  contact: string
  name: string
  age_range: string
  city: string
  visit_timing: string
  stay_days: number | null
  interest_areas: string[]
  interest_services: string[]
  budget_range: string
  consent: boolean
  language: 'zh' | 'ko'
  visitor_id: string
}

export type SignupResult = { position: number; created: boolean }

export type SignupError = 'invalid_email' | 'invalid_wechat' | 'consent_required' | 'throttled' | 'network'

export async function submitSignup(payload: SignupPayload): Promise<SignupResult> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}/api/signups/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw 'network' satisfies SignupError
  }

  if (res.ok) return (await res.json()) as SignupResult
  if (res.status === 429) throw 'throttled' satisfies SignupError

  const body = await res.json().catch(() => ({}))
  const flat = JSON.stringify(body)
  if (flat.includes('invalid_email')) throw 'invalid_email' satisfies SignupError
  if (flat.includes('invalid_wechat')) throw 'invalid_wechat' satisfies SignupError
  if (flat.includes('consent_required')) throw 'consent_required' satisfies SignupError
  throw 'network' satisfies SignupError
}
