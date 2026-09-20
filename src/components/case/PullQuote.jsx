import './blocks.css'

export function PullQuote({ children }) {
  return (
    <blockquote className="cs-pull-quote">
      <p>{children}</p>
    </blockquote>
  )
}
