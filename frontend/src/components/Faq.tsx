import { useLanguage } from '../i18n/LanguageContext'

export function Faq() {
  const { t } = useLanguage()
  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="section__head">
        <h2 id="faq-title" className="section__title">
          {t.faq.title}
        </h2>
      </div>
      <div className="faq">
        {t.faq.items.map((item) => (
          <details key={item.q} className="faq__item">
            <summary className="faq__q">{item.q}</summary>
            <p className="faq__a">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
