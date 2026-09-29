import './blocks.css'

export function TLDR({ intro, owned, stat }) {
  const { headline, beforeLabel, afterLabel, beforeValue, afterValue } = stat
  const total = beforeValue + afterValue
  const afterDeg = Math.round((afterValue / total) * 360)

  return (
    <div className="cs-tldr">
      <div className="cs-tldr__label">TL;DR</div>
      <div className="cs-tldr__intro">{intro}</div>

      <div className="cs-tldr__owned">
        <div className="cs-tldr__owned-label">What I owned:</div>
        <div className="cs-tldr__owned-grid">
          {owned.map((o, i) => (
            <div className="cs-tldr__owned-item" key={i}>
              <div className="cs-tldr__owned-title">{o.title}</div>
              <div className="cs-tldr__owned-body">{o.body}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="cs-tldr__stat">
        <div className="cs-tldr__stat-headline">{headline}</div>
        <div className="cs-tldr__dial-wrap">
          <div
            className="cs-tldr__dial"
            style={{ background: `conic-gradient(var(--cs-accent) 0deg ${afterDeg}deg, rgb(249 247 243 / 14%) ${afterDeg}deg 360deg)` }}
          >
            <div className="cs-tldr__dial-hole" />
          </div>
          <div className="cs-tldr__legend">
            <span className="cs-tldr__legend-item">
              <i className="cs-tldr__dot cs-tldr__dot--muted" />{beforeLabel}
            </span>
            <span className="cs-tldr__legend-item cs-tldr__legend-item--accent">
              <i className="cs-tldr__dot cs-tldr__dot--accent" />{afterLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
