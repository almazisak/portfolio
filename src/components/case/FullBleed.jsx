import './blocks.css'

export function FullBleed({ children, className = '' }) {
  return (
    <div className={`cs-full-bleed ${className}`.trim()}>
      {children}
    </div>
  )
}
