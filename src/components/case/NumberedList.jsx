import './blocks.css'

export function NumberedList({ items }) {
  return (
    <div className="cs-numbered-list">
      {items.map((item, i) => (
        <div className="cs-numbered-list__item" key={i}>
          <span className="cs-numbered-list__marker">{item.marker ?? String(i + 1).padStart(2, '0')}</span>
          <div className="cs-numbered-list__content">
            <div className="cs-numbered-list__title">{item.title}</div>
            <div className="cs-numbered-list__body">{item.body}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
