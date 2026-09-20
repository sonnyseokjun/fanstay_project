import { ko as t } from '../content/ko'
import { SectionHead } from './SectionHead'

export function Flow() {
  const f = t.flow
  return (
    <section className="section flow" aria-labelledby="flow-title">
      <SectionHead id="flow-title" title={f.title} intro={f.intro} />
      <ol className="flow__list">
        {f.steps.map((step, i) => (
          <li key={step.title} className="step">
            <span className="step__no" aria-hidden="true">
              {i + 1}
            </span>
            <p className="step__when">{step.when}</p>
            <h3 className="step__title">{step.title}</h3>
            <p className="step__body">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
