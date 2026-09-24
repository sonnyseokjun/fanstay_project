// 화면 문구의 구조. 문구는 ko.ts에만 쓰고 컴포넌트에는 쓰지 않는다.
// 선택지 value 코드는 backend/signups/models.py의 choices와 같아야 한다.

export type Option<T extends string = string> = { value: T; label: string }

export type CountryCode = 'korea' | 'japan' | 'thailand' | 'vietnam'
export type Content = {
  meta: { title: string; description: string; ogTitle: string; ogDescription: string } // index.html에 빌드 때 채워진다
  header: { home: string; cta: string; skipToForm: string }
  hero: { title: string; lead: string; photoAlt: string; characterAlt: string }
  problems: {
    title: string
    intro: string
    items: { topic: string; title: string; body: string; evidence: string; source: string }[]
  }
  features: {
    title: string
    intro: string
    items: { key: 'stay' | 'escrow' | 'ai' | 'life'; title: string; body: string }[]
    lifePhotoAlt: string
    escrowSteps: string[]
    escrowCaption: string
    cities: { title: string; intro: string; list: { name: string; country: string; note: string }[] }
  }
  flow: {
    title: string
    intro: string
    steps: { when: string; title: string; body: string }[]
  }
  pricing: {
    title: string
    intro: string
    note: string
    labels: { stay: string; living: string; total: string; perMonth: string }
    cities: {
      code: CountryCode
      city: string
      country: string
      stay: string
      living: string
      total: string
      basis: string
      pick: string // "이 도시로 사전가입"을 누르면 폼의 '가 보고 싶은 곳'에 채울 값
      photoAlt: string
    }[]
    cta: string
  }
  signup: {
    title: string
    intro: string
    benefitsTitle: string
    benefits: string[]
    required: string
    optional: string
    email: { label: string; placeholder: string }
    gender: { label: string; placeholder: string; options: Option[] }
    age: { label: string; placeholder: string; options: Option[] }
    countries: { label: string; placeholder: string; hint: string }
    consent: { label: string; notice: string[] }
    submit: string
    submitting: string
    errors: {
      emailRequired: string
      invalidEmail: string
      consentRequired: string
      throttled: string
      network: string
    }
  }
  faq: { title: string; items: { q: string; a: string }[] }
  footer: { tagline: string; notice: string; photoCredit: string; copyright: string }
  thanks: {
    title: string
    position: (n: number) => string
    already: (n: number) => string
    body: string
    share: string
    shareTitle: string
    shareText: string
    copied: string
    copyFailed: string
    back: string
  }
}
