import { Buildings, Compass, MapTrifold, ShieldCheck, type Icon } from '@phosphor-icons/react'
import remotePhoto from '../assets/photos/remote.webp'
import { ko as t } from '../content/ko'
import { SectionHead } from './SectionHead'

type Key = (typeof t.features.items)[number]['key']
const ICON: Record<Key, Icon> = { stay: Buildings, escrow: ShieldCheck, ai: Compass, life: MapTrifold }

export function Features() {
  const f = t.features
  return (
    <section className="section features" aria-labelledby="features-title">
      <SectionHead id="features-title" title={f.title} intro={f.intro} />
      <ul className="bento">
        {f.items.map((item) => {
          const Glyph = ICON[item.key]
          return (
            <li key={item.key} className={`bento__cell bento__cell--${item.key}`}>
              <div className="bento__text">
                <Glyph className="bento__icon" size={28} aria-hidden="true" />
                <h3 className="bento__title">{item.title}</h3>
                <p>{item.body}</p>
                {item.key === 'escrow' && (
                  <ol className="escrow" aria-label={f.escrowCaption}>
                    {f.escrowSteps.map((step) => (
                      <li key={step} className="escrow__step">
                        {step}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
              {item.key === 'life' && (
                <img className="bento__photo" src={remotePhoto} alt={f.lifePhotoAlt} width={1000} height={756} loading="lazy" />
              )}
            </li>
          )
        })}
      </ul>

      <div className="cities">
        <h3 className="cities__title">{f.cities.title}</h3>
        <p className="cities__intro">{f.cities.intro}</p>
        <ul className="cities__list">
          {f.cities.list.map((city) => (
            <li key={city.name} className="city">
              <p className="city__name">
                {city.name} <span className="city__country">{city.country}</span>
              </p>
              <p className="city__note">{city.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
