import { useLanguage } from '../i18n/LanguageContext'
import { NeighborhoodArt } from '../illustrations/NeighborhoodArt'

// 생활권 카드는 서울 지하철 역명판 형태: 역 번호, 한글 역명, 현지어·영문 표기.
export function Neighborhoods() {
  const { t } = useLanguage()
  return (
    <section className="section" aria-labelledby="hoods-title">
      <div className="section__head">
        <h2 id="hoods-title" className="section__title">
          {t.neighborhoods.title}
        </h2>
        <p className="section__intro">{t.neighborhoods.intro}</p>
      </div>
      <ul className="hoods">
        {t.neighborhoods.items.map((hood) => (
          <li key={hood.code} className="hood">
            <div className="hood__sign">
              <span className="hood__no" aria-label={`${t.neighborhoods.lineName} ${hood.stationNo}`}>
                {hood.stationNo}
              </span>
              <div className="hood__names">
                <p className="hood__name-ko" lang="ko">
                  {hood.nameKo}
                </p>
                <p className="hood__name-sub">
                  <span lang="zh-CN">{hood.nameLocal}</span>
                  <span lang="en">{hood.nameEn}</span>
                </p>
              </div>
            </div>
            <NeighborhoodArt code={hood.code} />
            <h3 className="hood__theme">{hood.theme}</h3>
            <p className="hood__body">{hood.body}</p>
            <ul className="hood__tags">
              {hood.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  )
}
