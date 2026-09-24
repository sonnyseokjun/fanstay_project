// 프론트와 API는 같은 출처를 쓴다 (개발: Vite 프록시, 운영: Firebase Hosting이 /api를 Cloud Run으로 전달).
// 다른 주소의 API를 써야 할 때만 빌드 시 VITE_API_BASE를 지정한다.
export const API_BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/$/, '')

export type SignupPayload = {
  email: string
  gender: string
  age_range: string
  countries: string
  consent: boolean
  visitor_id: string
}

export type SignupResult = { position: number; created: boolean }

export type SignupError = 'invalid_email' | 'consent_required' | 'throttled' | 'network'

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
  if (flat.includes('consent_required')) throw 'consent_required' satisfies SignupError
  throw 'network' satisfies SignupError
}
