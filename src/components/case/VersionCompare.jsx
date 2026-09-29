import './blocks.css'

export function VersionCompare({ items, image }) {
  return (
    <div className={`cs-versions${image ? ' cs-versions--with-image' : ''}`}>
      <div className="cs-versions__list">
        {items.map((v, i) => (
          <div className={`cs-versions__item${v.shipped ? ' cs-versions__item--shipped' : ''}`} key={i}>
            <div className="cs-versions__title">{v.title}</div>
            <div className="cs-versions__body">{v.body}</div>
          </div>
        ))}
      </div>
      {image && <div className="cs-versions__image" role="img" aria-label="Screen reference placeholder" />}
    </div>
  )
}
