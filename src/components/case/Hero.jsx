import './blocks.css'

export function Hero({ title, subtitle, role, year, tags, cover, coverAlt }) {
  return (
    <div className="cs-hero">
      <div className="cs-hero__cover">
        {cover ? (
          <img src={cover} alt={coverAlt || ''} />
        ) : (
          <div className="cs-hero__cover-placeholder" role="img" aria-label="Cover illustration placeholder">
            <span className="cs-hero__cover-label">Cover</span>
          </div>
        )}
      </div>

      <div className="cs-hero__content">
        {tags?.length > 0 && (
          <ul className="cs-hero__tags" aria-label="Tags">
            {tags.map(t => (
              <li key={t} className="cs-hero__tag">{t}</li>
            ))}
          </ul>
        )}
        <h1 className="cs-hero__title">{title}</h1>
        {subtitle && <p className="cs-hero__subtitle">{subtitle}</p>}
        <dl className="cs-hero__meta">
          {role && <><dt>Role</dt><dd>{role}</dd></>}
          {year && <><dt>Year</dt><dd>{year}</dd></>}
        </dl>
      </div>
    </div>
  )
}
