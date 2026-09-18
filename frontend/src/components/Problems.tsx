import { useLanguage } from '../i18n/LanguageContext'
import { Icon } from '../illustrations/icons'

// 문제 4가지를 타깃이 실제로 샤오홍슈에 검색했을 법한 검색어로 보여준다.
export function Problems() {
  const { t } = useLanguage()
  return (
    <section className="section" aria-labelledby="problems-title">
      <div className="section__head">
        <h2 id="problems-title" className="section__title">
          {t.problems.title}
        </h2>
        <p className="section__intro">{t.problems.intro}</p>
      </div>
      <ul className="problems">
        {t.problems.items.map((item) => (
          <li key={item.query} className="problem">
            <p className="problem__query">
              <Icon name="search" size={15} />
              <span>{item.query}</span>
            </p>
            <h3 className="problem__title">{item.title}</h3>
            <p className="problem__body">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
