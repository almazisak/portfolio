import './blocks.css'

export function Metric({ value, label, delta }) {
  return (
    <div className="cs-metric">
      <span className="cs-metric__value">{value}</span>
      {delta && <span className="cs-metric__delta">{delta}</span>}
      <span className="cs-metric__label">{label}</span>
    </div>
  )
}
