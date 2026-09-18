import { useLanguage } from '../i18n/LanguageContext'

// 사용자 여정 5단계를 지하철 노선도로 표현. 4단계(리빙팩 예약)는 환승역처럼 강조한다.
const TRANSFER_STEP = 3

export function Journey() {
  const { t } = useLanguage()
  return (
    <section className="section section--band" aria-labelledby="journey-title">
      <div className="section__inner">
        <div className="section__head">
          <h2 id="journey-title" className="section__title">
            {t.journey.title}
          </h2>
          <p className="section__intro">{t.journey.intro}</p>
        </div>
        <ol className="route">
          {t.journey.steps.map((step, i) => (
            <li key={step.title} className={`stop${i === TRANSFER_STEP ? ' stop--transfer' : ''}`}>
              <span className="stop__dot" aria-hidden="true">
                {i + 1}
              </span>
              <div className="stop__text">
                <h3 className="stop__title">{step.title}</h3>
                <p className="stop__body">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
