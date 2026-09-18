import { useEffect, useId, useState, type FormEvent } from 'react'
import type { AreaCode, Option, ServiceCode } from '../content/types'
import { useLanguage } from '../i18n/LanguageContext'
import { submitSignup, type SignupError, type SignupResult } from '../lib/api'
import { getVisitorId } from '../lib/track'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WECHAT_PATTERN = /^[A-Za-z0-9_-]{5,40}$/

type Errors = Partial<Record<'contact' | 'stay' | 'consent' | 'form', string>>

export type Preselect = { area: AreaCode; nonce: number } | null

export function SignupForm({ preselect, onDone }: { preselect: Preselect; onDone: (result: SignupResult) => void }) {
  const { t, lang } = useLanguage()
  const s = t.signup
  const uid = useId()

  const [contactType, setContactType] = useState<'email' | 'wechat'>(lang === 'zh' ? 'wechat' : 'email')
  const [contact, setContact] = useState('')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [city, setCity] = useState('')
  const [visit, setVisit] = useState('')
  const [stay, setStay] = useState('')
  const [areas, setAreas] = useState<AreaCode[]>([])
  const [services, setServices] = useState<ServiceCode[]>([])
  const [budget, setBudget] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  // 리빙팩의 "이 리빙팩으로 사전가입" 버튼을 누르면 해당 동네를 미리 체크한다.
  useEffect(() => {
    if (!preselect) return
    setAreas((prev) => (prev.includes(preselect.area) ? prev : [...prev, preselect.area]))
  }, [preselect])

  // 사용자가 값을 고치면 해당 항목의 에러와 전체 에러를 지운다.
  const clearError = (key: keyof Errors) =>
    setErrors((prev) => (prev[key] || prev.form ? { ...prev, [key]: undefined, form: undefined } : prev))

  const validate = (): Errors => {
    const next: Errors = {}
    const value = contact.trim()
    if (!value) next.contact = s.errors.contactRequired
    else if (contactType === 'email' && !EMAIL_PATTERN.test(value)) next.contact = s.errors.invalidEmail
    else if (contactType === 'wechat' && !WECHAT_PATTERN.test(value)) next.contact = s.errors.invalidWechat
    if (stay) {
      const days = Number(stay)
      if (!Number.isInteger(days) || days < 1 || days > 365) next.stay = s.errors.stayDays
    }
    if (!consent) next.consent = s.errors.consentRequired
    return next
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) {
      const firstKey = (['contact', 'stay', 'consent'] as const).find((key) => found[key])
      document.getElementById(`${uid}-${firstKey}`)?.focus()
      return
    }

    setSubmitting(true)
    try {
      const result = await submitSignup({
        contact_type: contactType,
        contact: contact.trim(),
        name: name.trim(),
        age_range: age,
        city: city.trim(),
        visit_timing: visit,
        stay_days: stay ? Number(stay) : null,
        interest_areas: areas,
        interest_services: services,
        budget_range: budget,
        consent,
        language: lang,
        visitor_id: getVisitorId(),
      })
      onDone(result)
    } catch (error) {
      const code = error as SignupError
      if (code === 'invalid_email') setErrors({ contact: s.errors.invalidEmail })
      else if (code === 'invalid_wechat') setErrors({ contact: s.errors.invalidWechat })
      else if (code === 'consent_required') setErrors({ consent: s.errors.consentRequired })
      else if (code === 'throttled') setErrors({ form: s.errors.throttled })
      else setErrors({ form: s.errors.network })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="section signup" id="signup" aria-labelledby="signup-title">
      <div className="signup__head">
        <h2 id="signup-title" className="section__title">
          {s.title}
        </h2>
        <p className="section__intro">{s.intro}</p>
        {s.benefits.length > 0 && (
          <ul className="signup__benefits">
            {s.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        )}
      </div>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <fieldset className="form__group">
          <legend className="form__legend">
            {s.contactLegend} <span className="form__badge form__badge--required">{s.required}</span>
          </legend>

          <div className="segmented" role="radiogroup" aria-label={s.contactLegend}>
            {s.contactTypes.map((option) => (
              <label key={option.value} className="segmented__option">
                <input
                  type="radio"
                  name="contact_type"
                  value={option.value}
                  checked={contactType === option.value}
                  onChange={() => {
                    setContactType(option.value)
                    clearError('contact')
                  }}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>

          <div className="field">
            <label className="visually-hidden" htmlFor={`${uid}-contact`}>
              {s.contactTypes.find((o) => o.value === contactType)?.label}
            </label>
            <input
              id={`${uid}-contact`}
              className="input"
              type={contactType === 'email' ? 'email' : 'text'}
              inputMode={contactType === 'email' ? 'email' : 'text'}
              autoComplete={contactType === 'email' ? 'email' : 'off'}
              autoCapitalize="off"
              spellCheck={false}
              placeholder={s.contactPlaceholder[contactType]}
              value={contact}
              onChange={(e) => {
                setContact(e.target.value)
                clearError('contact')
              }}
              aria-invalid={Boolean(errors.contact)}
              aria-describedby={errors.contact ? `${uid}-contact-error` : undefined}
            />
            {errors.contact && (
              <p className="field__error" id={`${uid}-contact-error`}>
                {errors.contact}
              </p>
            )}
          </div>

          <div className="form__row">
            <TextField id={`${uid}-name`} label={s.name.label} optional={s.optional} placeholder={s.name.placeholder} value={name} onChange={setName} autoComplete="nickname" />
            <SelectField id={`${uid}-age`} label={s.age.label} optional={s.optional} placeholder={s.age.placeholder} options={s.age.options} value={age} onChange={setAge} />
          </div>
          <TextField id={`${uid}-city`} label={s.city.label} optional={s.optional} placeholder={s.city.placeholder} value={city} onChange={setCity} autoComplete="address-level2" />
        </fieldset>

        <fieldset className="form__group">
          <legend className="form__legend">
            {s.surveyLegend} <span className="form__badge">{s.optional}</span>
          </legend>
          <p className="form__hint">{s.surveyIntro}</p>

          <SelectField id={`${uid}-visit`} label={s.visit.label} placeholder={s.visit.placeholder} options={s.visit.options} value={visit} onChange={setVisit} />

          <div className="field">
            <label className="field__label" htmlFor={`${uid}-stay`}>
              {s.stay.label}
            </label>
            <div className="stay">
              <div className="stay__input">
                <input
                  id={`${uid}-stay`}
                  className="input"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={365}
                  value={stay}
                  onChange={(e) => {
                    setStay(e.target.value)
                    clearError('stay')
                  }}
                  aria-invalid={Boolean(errors.stay)}
                  aria-describedby={`${uid}-stay-hint${errors.stay ? ` ${uid}-stay-error` : ''}`}
                />
                <span className="stay__unit">{s.stay.unit}</span>
              </div>
              <div className="stay__quick">
                {s.stay.quick.map((days) => (
                  <button
                    key={days}
                    type="button"
                    className="chip"
                    aria-pressed={stay === String(days)}
                    onClick={() => {
                      setStay(String(days))
                      clearError('stay')
                    }}
                  >
                    {days}
                    {s.stay.unit}
                  </button>
                ))}
              </div>
            </div>
            <p className="form__hint" id={`${uid}-stay-hint`}>
              {s.stay.hint}
            </p>
            {errors.stay && (
              <p className="field__error" id={`${uid}-stay-error`}>
                {errors.stay}
              </p>
            )}
          </div>

          <ChipGroup label={s.areas.label} options={s.areas.options} selected={areas} onChange={setAreas} />
          <ChipGroup label={s.services.label} options={s.services.options} selected={services} onChange={setServices} />

          <SelectField id={`${uid}-budget`} label={s.budget.label} placeholder={s.budget.placeholder} options={s.budget.options} value={budget} onChange={setBudget} />
        </fieldset>

        <div className="consent">
          <label className="consent__label">
            <input
              id={`${uid}-consent`}
              type="checkbox"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked)
                clearError('consent')
              }}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={`${uid}-consent-notice${errors.consent ? ` ${uid}-consent-error` : ''}`}
            />
            <span>
              {s.consent.label} <span className="form__badge form__badge--required">{s.required}</span>
            </span>
          </label>
          <p className="consent__notice" id={`${uid}-consent-notice`}>
            {s.consent.notice}
          </p>
          {errors.consent && (
            <p className="field__error" id={`${uid}-consent-error`}>
              {errors.consent}
            </p>
          )}
        </div>

        {errors.form && (
          <p className="form__error" role="alert">
            {errors.form}
          </p>
        )}

        <button type="submit" className="button button--block" disabled={submitting}>
          {submitting ? s.submitting : s.submit}
        </button>
      </form>
    </section>
  )
}

function OptionalTag({ text }: { text?: string }) {
  return text ? <span className="field__optional">{text}</span> : null
}

function TextField(props: {
  id: string
  label: string
  optional?: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  autoComplete?: string
}) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={props.id}>
        {props.label} <OptionalTag text={props.optional} />
      </label>
      <input
        id={props.id}
        className="input"
        type="text"
        maxLength={50}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  )
}

function SelectField(props: {
  id: string
  label: string
  optional?: string
  placeholder: string
  options: Option[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={props.id}>
        {props.label} <OptionalTag text={props.optional} />
      </label>
      <select id={props.id} className="input select" value={props.value} onChange={(e) => props.onChange(e.target.value)}>
        <option value="">{props.placeholder}</option>
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function ChipGroup<T extends string>(props: {
  label: string
  options: Option<T>[]
  selected: T[]
  onChange: (next: T[]) => void
}) {
  const toggle = (value: T) =>
    props.onChange(props.selected.includes(value) ? props.selected.filter((v) => v !== value) : [...props.selected, value])

  return (
    <fieldset className="field chips">
      <legend className="field__label">{props.label}</legend>
      <div className="chips__list">
        {props.options.map((option) => (
          <label key={option.value} className="chip chip--check">
            <input type="checkbox" checked={props.selected.includes(option.value)} onChange={() => toggle(option.value)} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
