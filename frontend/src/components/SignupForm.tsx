import { CaretDown } from '@phosphor-icons/react'
import { useEffect, useId, useState, type FormEvent } from 'react'
import { ko as t } from '../content/ko'
import type { Option } from '../content/types'
import { submitSignup, type SignupError, type SignupResult } from '../lib/api'
import { getVisitorId } from '../lib/track'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Errors = Partial<Record<'email' | 'consent' | 'form', string>>

export type Preselect = { country: string; nonce: number } | null

export function SignupForm({ preselect, onDone }: { preselect: Preselect; onDone: (result: SignupResult) => void }) {
  const s = t.signup
  const uid = useId()

  const [email, setEmail] = useState('')
  const [gender, setGender] = useState('')
  const [age, setAge] = useState('')
  const [countries, setCountries] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  // 가격 예시의 "이 도시로 사전가입" 버튼을 누르면 그곳(제주·일본 등)을 입력란에 채워 둔다.
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
        gender,
        age_range: age,
        countries: countries.trim(),
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
    <section className="signup" id="signup" aria-labelledby="signup-title">
      <div className="signup__head">
        <h2 id="signup-title" className="signup__title">
          {s.title}
        </h2>
        <p className="signup__intro">{s.intro}</p>
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
          <SelectField id={`${uid}-gender`} label={s.gender.label} tag={s.optional} placeholder={s.gender.placeholder} options={s.gender.options} value={gender} onChange={setGender} />
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

        <button type="submit" className="button button--block button--large" disabled={submitting}>
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
      <div className="select-wrap">
        <select id={props.id} className="input select" value={props.value} onChange={(e) => props.onChange(e.target.value)}>
          <option value="">{props.placeholder}</option>
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <CaretDown className="select-wrap__caret" size={18} aria-hidden="true" />
      </div>
    </div>
  )
}
