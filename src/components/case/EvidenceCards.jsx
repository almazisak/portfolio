import './blocks.css'

export function EvidenceCards({ items }) {
  return (
    <div className="cs-evidence-cards">
      {items.map((item, i) => (
        <div className="cs-evidence-cards__item" key={i}>
          <div className="cs-evidence-cards__placeholder" aria-hidden="true" />
          <div className="cs-evidence-cards__caption">
            <div className="cs-evidence-cards__title">{item.title}</div>
            <div className="cs-evidence-cards__body">{item.body}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
