import { useLanguage } from '../i18n/LanguageContext'
import { HeroMap } from '../illustrations/HeroMap'

export function Hero({ onCta }: { onCta: (label: string) => void }) {
  const { t } = useLanguage()
  return (
    <section className="hero" id="top">
      <div className="hero__text">
        <h1 className="hero__headline">
          {t.hero.headline.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p className="hero__body">{t.hero.body}</p>
        <div className="hero__cta">
          <button type="button" className="button" onClick={() => onCta('hero')}>
            {t.hero.cta}
          </button>
          <p className="hero__note">{t.hero.note}</p>
        </div>
      </div>
      <div className="hero__visual">
        <HeroMap labels={t.hero.map} />
      </div>
    </section>
  )
}
