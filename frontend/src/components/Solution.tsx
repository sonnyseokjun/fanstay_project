import { useLanguage } from '../i18n/LanguageContext'
import { RingDiagram } from '../illustrations/RingDiagram'

export function Solution() {
  const { t } = useLanguage()
  return (
    <section className="section section--band" aria-labelledby="solution-title">
      <div className="section__inner">
        <div className="section__head">
          <h2 id="solution-title" className="section__title">
            {t.solution.title}
          </h2>
          <p className="section__intro">{t.solution.intro}</p>
        </div>
        <div className="solution">
          <RingDiagram layers={t.solution.layers} alt={t.solution.ringAlt} />
          <ol className="layers">
            {t.solution.layers.map((layer) => (
              <li key={layer.key} className={`layer layer--${layer.key}`}>
                <p className="layer__name">
                  <span className="layer__swatch" aria-hidden="true" />
                  {layer.name}
                </p>
                <h3 className="layer__title">{layer.title}</h3>
                <ul className="layer__points">
                  {layer.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
