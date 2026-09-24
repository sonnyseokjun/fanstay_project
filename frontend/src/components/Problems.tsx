import { ko as t } from '../content/ko'
import { SectionHead } from './SectionHead'

export function Problems() {
  const p = t.problems
  return (
    <section className="section problems" aria-labelledby="problems-title">
      <SectionHead id="problems-title" title={p.title} intro={p.intro} />
      <ul className="problems__list">
        {p.items.map((item) => (
          <li key={item.topic} className="problem">
            <p className="problem__topic" aria-hidden="true">
              {item.topic}
            </p>
            <div className="problem__body">
              <h3 className="problem__title">{item.title}</h3>
              <p className="problem__text">{item.body}</p>
            </div>
            <blockquote className="problem__evidence">
              <p>{item.evidence}</p>
              <cite>{item.source}</cite>
            </blockquote>
          </li>
        ))}
      </ul>
    </section>
  )
}
