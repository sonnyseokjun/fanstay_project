import { ko as t } from '../content/ko'
import { StayCalendar } from '../illustrations/StayCalendar'

export function Hero({ onCta }: { onCta: () => void }) {
  const h = t.hero
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__copy">
        <h1 id="hero-title" className="hero__title">
          {h.title}
        </h1>
        <p className="hero__lead">{h.lead}</p>
        <div className="hero__actions">
          <button type="button" className="button" onClick={onCta}>
            {h.cta}
          </button>
        </div>
      </div>
      <StayCalendar calendar={h.calendar} />
    </section>
  )
}
