import { ko as t } from '../content/ko'
import type { CountryCode } from '../content/types'
import { SectionHead } from './SectionHead'

export function Pricing({ onChoose }: { onChoose: (code: CountryCode, country: string) => void }) {
  const p = t.pricing
  return (
    <section className="section pricing" aria-labelledby="pricing-title">
      <SectionHead id="pricing-title" title={p.title} intro={p.intro} />
      <ul className="pricing__list">
        {p.cities.map((c) => (
          <li key={c.code} className="bill">
            <h3 className="bill__city">
              {c.city} <span className="bill__country">{c.country}</span>
            </h3>
            <dl className="bill__rows">
              <div className="bill__row">
                <dt>{p.labels.stay}</dt>
                <dd>{c.stay}</dd>
              </div>
              <div className="bill__row">
                <dt>{p.labels.living}</dt>
                <dd>{c.living}</dd>
              </div>
              <div className="bill__row bill__row--total">
                <dt>
                  {p.labels.total} <span className="bill__per">{p.labels.perMonth}</span>
                </dt>
                <dd>{c.total}</dd>
              </div>
            </dl>
            <p className="bill__basis">{c.basis}</p>
            <button type="button" className="button button--ghost button--block" onClick={() => onChoose(c.code, c.country)}>
              {p.cta}
            </button>
          </li>
        ))}
      </ul>
      <p className="pricing__note">{p.note}</p>
    </section>
  )
}
