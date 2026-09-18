// 사이트에 보이는 모든 문구의 구조. zh.ts / ko.ts가 이 타입을 똑같이 채운다.
// 선택지 code 값은 백엔드(signups/models.py)의 choices와 반드시 같아야 한다.

export type Lang = 'zh' | 'ko'

export type AreaCode = 'seongsu' | 'hongdae' | 'gangnam' | 'hannam'

export type ServiceCode =
  | 'k_beauty'
  | 'hair_salon'
  | 'fitness'
  | 'spa_wellness'
  | 'cooking_class'
  | 'local_community'
  | 'airport_transfer'
  | 'sim_data'
  | 'cleaning_laundry'
  | 'medical_support'

export type Option<T extends string = string> = { value: T; label: string }

export type Content = {
  meta: { title: string; description: string; htmlLang: string }
  header: { cta: string; switchTo: string; switchLabel: string; home: string; skipToForm: string }
  hero: {
    headline: string[]
    body: string
    cta: string
    note: string
    map: {
      home: string
      radius: string
      mart: string
      laundry: string
      pharmacy: string
      gym: string
      cafe: string
      clinic: string
      line: string
      alt: string
    }
  }
  problems: {
    title: string
    intro: string
    items: { query: string; title: string; body: string }[]
  }
  solution: {
    title: string
    intro: string
    ringAlt: string
    layers: { key: 'home' | 'daily' | 'klife'; name: string; ringLabel: string; title: string; points: string[] }[]
  }
  neighborhoods: {
    title: string
    intro: string
    lineName: string
    items: {
      code: Exclude<AreaCode, 'hannam'>
      stationNo: string
      nameKo: string
      nameLocal: string
      nameEn: string
      theme: string
      body: string
      tags: string[]
    }[]
  }
  journey: {
    title: string
    intro: string
    steps: { title: string; body: string }[]
  }
  packs: {
    title: string
    intro: string
    perPeriod: string
    includesLabel: string
    cta: string
    items: {
      area: Exclude<AreaCode, 'hannam'>
      name: string
      forWhom: string
      pricePrimary: string
      priceSecondary: string
      includes: string[]
    }[]
  }
  signup: {
    title: string
    intro: string
    /** 사전가입 혜택. 미정이라 비워 둠 — 채우면 폼 위에 표시된다. */
    benefits: string[]
    required: string
    optional: string
    contactLegend: string
    contactTypes: Option<'email' | 'wechat'>[]
    contactPlaceholder: { email: string; wechat: string }
    name: { label: string; placeholder: string }
    age: { label: string; placeholder: string; options: Option[] }
    city: { label: string; placeholder: string }
    surveyLegend: string
    surveyIntro: string
    visit: { label: string; placeholder: string; options: Option[] }
    stay: { label: string; unit: string; quick: number[]; hint: string }
    areas: { label: string; options: Option<AreaCode>[] }
    services: { label: string; options: Option<ServiceCode>[] }
    budget: { label: string; placeholder: string; options: Option[] }
    consent: { label: string; notice: string }
    submit: string
    submitting: string
    errors: {
      contactRequired: string
      invalidEmail: string
      invalidWechat: string
      stayDays: string
      consentRequired: string
      throttled: string
      network: string
    }
  }
  thanks: {
    title: string
    position: (n: number) => string
    already: (n: number) => string
    body: string
    shareTitle: string
    shareButton: string
    shareText: string
    copied: string
    copyFailed: string
    back: string
  }
  faq: { title: string; items: { q: string; a: string }[] }
  footer: { tagline: string; note: string; copyright: string }
}
