export function SectionHead({ id, title, intro }: { id: string; title: string; intro?: string }) {
  return (
    <div className="section__head">
      <h2 id={id} className="section__title">
        {title}
      </h2>
      {intro && <p className="section__intro">{intro}</p>}
    </div>
  )
}
