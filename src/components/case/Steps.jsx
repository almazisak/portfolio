import './blocks.css'

export function Steps({ items = [] }) {
  return (
    <ol className="cs-steps">
      {items.map((item, i) => (
        <li key={i} className="cs-steps__item">
          <span className="cs-steps__num" aria-hidden="true">{i + 1}</span>
          <div className="cs-steps__content">
            {item.title && <strong className="cs-steps__title">{item.title}</strong>}
            {item.body && <p className="cs-steps__body">{item.body}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}
