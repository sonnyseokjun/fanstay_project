// 화면 문구의 구조. 문구는 ko.ts에만 쓰고 컴포넌트에는 쓰지 않는다.
// 선택지 value 코드는 backend/signups/models.py의 choices와 같아야 한다.

export type Option<T extends string = string> = { value: T; label: string }

export type CountryCode = 'thailand' | 'vietnam' | 'indonesia' | 'japan' | 'malaysia' | 'taiwan' | 'europe' | 'other'
export type FeatureCode =
  | 'monthly_stay'
  | 'escrow'
  | 'city_match'
  | 'cost_estimate'
  | 'checklist'
  | 'infra_map'
  | 'community'
  | 'stay_review'

export type CalendarNote = { day: number; label: string; short: string } // short: 좁은 화면용

export type Content = {
  meta: { title: string; description: string }
  header: { home: string; cta: string; skipToForm: string }
  hero: {
    title: string
    lead: string
    cta: string
    calendar: {
      alt: string
      city: string
      year: number
      month: number // 1~12
      weekdays: string[]
      notes: CalendarNote[]
      legend: string
    }
  }
  problems: {
    title: string
    intro: string
    items: { topic: string; title: string; body: string; evidence: string; source: string }[]
  }
  solution: {
    title: string
    intro: string
    matrix: {
      caption: string
      conditions: [string, string, string]
      yes: string
      no: string
      rows: { name: string; marks: [boolean, boolean, boolean]; note: string; ours?: boolean }[]
    }
  }
  features: {
    title: string
    intro: string
    items: { key: 'stay' | 'escrow' | 'ai' | 'life'; title: string; body: string }[]
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
    cities: { code: CountryCode; city: string; country: string; stay: string; living: string; total: string; basis: string }[]
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
    name: { label: string; placeholder: string }
    age: { label: string; placeholder: string; options: Option[] }
    countries: { label: string; placeholder: string; hint: string }
    surveyLegend: string
    surveyIntro: string
    stayType: { label: string; placeholder: string; options: Option[] }
    timing: { label: string; placeholder: string; options: Option[] }
    features: { label: string; options: Option<FeatureCode>[] }
    budget: { label: string; placeholder: string; options: Option[] }
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
  footer: { tagline: string; notice: string; copyright: string }
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
