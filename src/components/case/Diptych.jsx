import './blocks.css'

export function Diptych({ children, caption }) {
  return (
    <figure className="cs-diptych">
      <div className="cs-diptych__panels">
        {children}
      </div>
      {caption && <figcaption className="cs-diptych__caption">{caption}</figcaption>}
    </figure>
  )
}
