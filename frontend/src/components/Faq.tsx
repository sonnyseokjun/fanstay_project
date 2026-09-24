import { Plus } from '@phosphor-icons/react'
import { ko as t } from '../content/ko'

export function Faq() {
  return (
    <section className="section faq" aria-labelledby="faq-title">
      <h2 id="faq-title" className="section__title faq__title">
        {t.faq.title}
      </h2>
      <div className="faq__list">
        {t.faq.items.map((item) => (
          <details key={item.q} className="faq__item">
            <summary>
              <span>{item.q}</span>
              <Plus className="faq__icon" size={20} aria-hidden="true" />
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
