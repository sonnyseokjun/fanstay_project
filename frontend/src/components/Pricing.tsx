import bali from '../assets/photos/bali.webp'
import chiangmai from '../assets/photos/chiangmai.webp'
import danang from '../assets/photos/danang.webp'
import fukuoka from '../assets/photos/fukuoka.webp'
import { ko as t } from '../content/ko'
import type { CountryCode } from '../content/types'
import { SectionHead } from './SectionHead'

const PHOTO: Partial<Record<CountryCode, string>> = { thailand: chiangmai, vietnam: danang, indonesia: bali, japan: fukuoka }

export function Pricing({ onChoose }: { onChoose: (code: CountryCode, country: string) => void }) {
  const p = t.pricing
  return (
    <section className="section pricing" aria-labelledby="pricing-title">
      <SectionHead id="pricing-title" title={p.title} intro={p.intro} />
      <ul className="pricing__list">
        {p.cities.map((c) => (
          <li key={c.code} className="bill">
            <img className="bill__photo" src={PHOTO[c.code]} alt={c.photoAlt} width={900} height={600} loading="lazy" />
            <div className="bill__body">
              <h3 className="bill__city">
                {c.city} <span className="bill__country">{c.country}</span>
              </h3>
              <p className="bill__total">
                <span className="bill__per">
                  {p.labels.perMonth} {p.labels.total}
                </span>
                <strong>{c.total}</strong>
              </p>
              <dl className="bill__rows">
                <div className="bill__row">
                  <dt>{p.labels.stay}</dt>
                  <dd>{c.stay}</dd>
                </div>
                <div className="bill__row">
                  <dt>{p.labels.living}</dt>
                  <dd>{c.living}</dd>
                </div>
              </dl>
              <p className="bill__basis">{c.basis}</p>
              <button type="button" className="button button--ghost button--block" onClick={() => onChoose(c.code, c.country)}>
                {p.cta}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p className="pricing__note">{p.note}</p>
    </section>
  )
}
