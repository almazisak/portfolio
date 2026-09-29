import './blocks.css'

export function Facts({ items }) {
  return (
    <dl className="cs-facts">
      {items.map(({ label, value }) => (
        <div className="cs-facts__row" key={label}>
          <dt className="cs-facts__label">{label}</dt>
          <dd className="cs-facts__value">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
