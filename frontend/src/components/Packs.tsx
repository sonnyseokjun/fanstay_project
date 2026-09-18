import type { AreaCode } from '../content/types'
import { useLanguage } from '../i18n/LanguageContext'
import { Icon } from '../illustrations/icons'

export function Packs({ onChoose }: { onChoose: (area: AreaCode) => void }) {
  const { t } = useLanguage()
  return (
    <section className="section" aria-labelledby="packs-title">
      <div className="section__head">
        <h2 id="packs-title" className="section__title">
          {t.packs.title}
        </h2>
        <p className="section__intro section__intro--small">{t.packs.intro}</p>
      </div>
      <ul className="packs">
        {t.packs.items.map((pack) => (
          <li key={pack.area} className="pack">
            <div className="pack__head">
              <h3 className="pack__name">{pack.name}</h3>
              <p className="pack__for">{pack.forWhom}</p>
            </div>
            <p className="pack__price">
              <span className="pack__price-main">{pack.pricePrimary}</span>
              <span className="pack__period">{t.packs.perPeriod}</span>
              <span className="pack__price-sub">{pack.priceSecondary}</span>
            </p>
            <div className="pack__includes">
              <p className="pack__includes-label">{t.packs.includesLabel}</p>
              <ul>
                {pack.includes.map((item) => (
                  <li key={item}>
                    <Icon name="check" size={14} className="pack__check" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <button type="button" className="button button--outline" onClick={() => onChoose(pack.area)}>
              {t.packs.cta}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
