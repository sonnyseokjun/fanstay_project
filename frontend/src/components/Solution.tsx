import { ko as t } from '../content/ko'
import { Icon } from '../illustrations/icons'
import { SectionHead } from './SectionHead'

export function Solution() {
  const s = t.solution
  const m = s.matrix
  return (
    <section className="section solution" aria-labelledby="solution-title">
      <SectionHead id="solution-title" title={s.title} intro={s.intro} />
      <table className="matrix">
        <caption className="matrix__caption">{m.caption}</caption>
        <thead>
          <tr>
            <td />
            {m.conditions.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {m.rows.map((row) => (
            <tr key={row.name} className={row.ours ? 'matrix__ours' : undefined}>
              <th scope="row">
                <span className="matrix__name">{row.name}</span>
                <span className="matrix__note">{row.note}</span>
              </th>
              {row.marks.map((ok, i) => (
                <td key={m.conditions[i]} className={ok ? 'is-yes' : 'is-no'}>
                  <Icon name={ok ? 'check' : 'dash'} size={20} />
                  <span className="visually-hidden">{ok ? m.yes : m.no}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
