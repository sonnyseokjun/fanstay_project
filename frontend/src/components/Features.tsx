import { ko as t } from '../content/ko'
import { Icon } from '../illustrations/icons'
import { SectionHead } from './SectionHead'

export function Features() {
  const f = t.features
  return (
    <section className="section features" aria-labelledby="features-title">
      <SectionHead id="features-title" title={f.title} intro={f.intro} />
      <ul className="features__list">
        {f.items.map((item) => (
          <li key={item.key} className={`feature feature--${item.key}`}>
            <Icon name={item.key} className="feature__icon" size={28} />
            <h3 className="feature__title">{item.title}</h3>
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
          </li>
        ))}
      </ul>

      <div className="cities">
        <h3 className="cities__title">{f.cities.title}</h3>
        <p className="cities__intro">{f.cities.intro}</p>
        <ul className="cities__list">
          {f.cities.list.map((city) => (
            <li key={city.name} className="city">
              <span className="city__name">{city.name}</span>
              <span className="city__country">{city.country}</span>
              <span className="city__note">{city.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
