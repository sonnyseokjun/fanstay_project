import { useEffect, useId, useState, type FormEvent } from 'react'
import { ko as t } from '../content/ko'
import type { FeatureCode, Option } from '../content/types'
import { submitSignup, type SignupError, type SignupResult } from '../lib/api'
import { getVisitorId } from '../lib/track'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Errors = Partial<Record<'email' | 'consent' | 'form', string>>

export type Preselect = { country: string; nonce: number } | null

export function SignupForm({ preselect, onDone }: { preselect: Preselect; onDone: (result: SignupResult) => void }) {
  const s = t.signup
  const uid = useId()

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [countries, setCountries] = useState('')
  const [stayType, setStayType] = useState('')
  const [timing, setTiming] = useState('')
  const [features, setFeatures] = useState<FeatureCode[]>([])
  const [budget, setBudget] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  // 가격 예시의 "이 도시로 사전가입" 버튼을 누르면 그 나라를 입력란에 채워 둔다.
  useEffect(() => {
    if (!preselect) return
    setCountries((prev) => {
      const parts = prev.split(',').map((v) => v.trim()).filter(Boolean)
      return parts.includes(preselect.country) ? prev : [...parts, preselect.country].join(', ')
    })
  }, [preselect])

  // 값을 고치면 해당 항목과 전체 에러를 지운다.
  const clearError = (key: keyof Errors) =>
    setErrors((prev) => (prev[key] || prev.form ? { ...prev, [key]: undefined, form: undefined } : prev))

  const validate = (): Errors => {
    const next: Errors = {}
    const value = email.trim()
    if (!value) next.email = s.errors.emailRequired
    else if (!EMAIL_PATTERN.test(value)) next.email = s.errors.invalidEmail
    if (!consent) next.consent = s.errors.consentRequired
    return next
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    if (found.email || found.consent) {
      document.getElementById(`${uid}-${found.email ? 'email' : 'consent'}`)?.focus()
      return
    }

    setSubmitting(true)
    try {
      const result = await submitSignup({
        email: email.trim(),
        name: name.trim(),
        age_range: age,
        countries: countries.trim(),
        stay_type: stayType,
        timing,
        features,
        budget_range: budget,
        consent,
        visitor_id: getVisitorId(),
      })
      onDone(result)
    } catch (error) {
      const code = error as SignupError
      if (code === 'invalid_email') setErrors({ email: s.errors.invalidEmail })
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
          <div className="signup__benefits">
            <h3>{s.benefitsTitle}</h3>
            <ul>
              {s.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field__label" htmlFor={`${uid}-email`}>
            {s.email.label} <span className="tag tag--required">{s.required}</span>
          </label>
          <input
            id={`${uid}-email`}
            className="input"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="off"
            spellCheck={false}
            placeholder={s.email.placeholder}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              clearError('email')
            }}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${uid}-email-error` : undefined}
          />
          {errors.email && (
            <p className="field__error" id={`${uid}-email-error`}>
              {errors.email}
            </p>
          )}
        </div>

        <div className="form__row">
          <div className="field">
            <label className="field__label" htmlFor={`${uid}-name`}>
              {s.name.label} <span className="tag">{s.optional}</span>
            </label>
            <input
              id={`${uid}-name`}
              className="input"
              type="text"
              maxLength={50}
              autoComplete="nickname"
              placeholder={s.name.placeholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <SelectField id={`${uid}-age`} label={s.age.label} tag={s.optional} placeholder={s.age.placeholder} options={s.age.options} value={age} onChange={setAge} />
        </div>

        <div className="field">
          <label className="field__label" htmlFor={`${uid}-countries`}>
            {s.countries.label} <span className="tag">{s.optional}</span>
          </label>
          <input
            id={`${uid}-countries`}
            className="input"
            type="text"
            maxLength={100}
            placeholder={s.countries.placeholder}
            value={countries}
            onChange={(e) => setCountries(e.target.value)}
            aria-describedby={`${uid}-countries-hint`}
          />
          <p className="form__hint" id={`${uid}-countries-hint`}>
            {s.countries.hint}
          </p>
        </div>

        <fieldset className="form__survey">
          <legend className="form__legend">{s.surveyLegend}</legend>
          <p className="form__hint">{s.surveyIntro}</p>
          <SelectField id={`${uid}-stay`} label={s.stayType.label} placeholder={s.stayType.placeholder} options={s.stayType.options} value={stayType} onChange={setStayType} />
          <SelectField id={`${uid}-timing`} label={s.timing.label} placeholder={s.timing.placeholder} options={s.timing.options} value={timing} onChange={setTiming} />
          <ChipGroup label={s.features.label} options={s.features.options} selected={features} onChange={setFeatures} />
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
              {s.consent.label} <span className="tag tag--required">{s.required}</span>
            </span>
          </label>
          <ul className="consent__notice" id={`${uid}-consent-notice`}>
            {s.consent.notice.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
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

function SelectField(props: {
  id: string
  label: string
  tag?: string
  placeholder: string
  options: Option[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={props.id}>
        {props.label} {props.tag && <span className="tag">{props.tag}</span>}
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
  tag?: string
  options: Option<T>[]
  selected: T[]
  onChange: (next: T[]) => void
}) {
  const toggle = (value: T) =>
    props.onChange(props.selected.includes(value) ? props.selected.filter((v) => v !== value) : [...props.selected, value])

  return (
    <fieldset className="field chips">
      <legend className="field__label">
        {props.label} {props.tag && <span className="tag">{props.tag}</span>}
      </legend>
      <div className="chips__list">
        {props.options.map((option) => (
          <label key={option.value} className="chip">
            <input type="checkbox" checked={props.selected.includes(option.value)} onChange={() => toggle(option.value)} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
