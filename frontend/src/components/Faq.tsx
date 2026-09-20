import { ko as t } from '../content/ko'
import { Icon } from '../illustrations/icons'
import { SectionHead } from './SectionHead'

export function Faq() {
  return (
    <section className="section faq" aria-labelledby="faq-title">
      <SectionHead id="faq-title" title={t.faq.title} />
      <div className="faq__list">
        {t.faq.items.map((item) => (
          <details key={item.q} className="faq__item">
            <summary>
              <span>{item.q}</span>
              <Icon name="plus" size={20} className="faq__icon" />
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
