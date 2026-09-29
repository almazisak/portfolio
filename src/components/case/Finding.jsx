import './blocks.css'

export function Finding({ headline, body, children }) {
  return (
    <div className="cs-finding">
      {headline && <div className="cs-finding__headline">{headline}</div>}
      {(body || children) && <div className="cs-finding__body">{body || children}</div>}
    </div>
  )
}
