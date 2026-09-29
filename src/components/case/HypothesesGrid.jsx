import './blocks.css'

export function HypothesesGrid({ items }) {
  return (
    <div className="cs-hypotheses">
      {items.map((text, i) => (
        <div className="cs-hypotheses__item" key={i}>
          <span className="cs-hypotheses__num">{String(i + 1).padStart(2, '0')}</span>
          <div className="cs-hypotheses__text">{text}</div>
        </div>
      ))}
    </div>
  )
}
