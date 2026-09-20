import './blocks.css'

export function Figure({ src, alt, caption, placeholder }) {
  return (
    <figure className="cs-figure">
      {src ? (
        <img src={src} alt={alt || ''} />
      ) : (
        <div
          className="cs-figure__placeholder"
          role="img"
          aria-label={placeholder || 'Illustration placeholder'}
        >
          <span className="cs-figure__placeholder-label">{placeholder || 'Illustration'}</span>
        </div>
      )}
      {caption && <figcaption className="cs-figure__caption">{caption}</figcaption>}
    </figure>
  )
}
