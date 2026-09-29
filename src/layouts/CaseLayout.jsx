import { Link, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { getAdjacentCases, getCaseBySlug } from '../lib/cases'
import * as CaseBlocks from '../components/case'
import './CaseLayout.css'

const contentModules = import.meta.glob('/src/cases/*/index.mdx')

export default function CaseLayout() {
  const { slug } = useParams()
  const [Content, setContent] = useState(null)
  const [progress, setProgress] = useState(0)
  const articleRef = useRef(null)

  const meta = getCaseBySlug(slug)
  const { prev, next } = getAdjacentCases(slug ?? '')

  // Dynamically load the case MDX module
  useEffect(() => {
    setContent(null)
    const key = `/src/cases/${slug}/index.mdx`
    const load = contentModules[key]
    if (load) load().then(mod => setContent(() => mod.default))
  }, [slug])

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      const el = articleRef.current
      if (!el) return
      const scrolled = window.scrollY - el.offsetTop
      const total = el.offsetHeight - window.innerHeight
      const pct = total <= 0 ? 100 : (scrolled / total) * 100
      setProgress(Math.min(Math.max(pct, 0), 100))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="case-layout">
      {/* Reading progress bar */}
      <div
        className="case-layout__progress"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
        style={{ transform: `scaleX(${progress / 100})` }}
      />

      {/* Article — CSS Grid reading column */}
      <article ref={articleRef} className="case-layout__article">
        {Content ? (
          <Content components={CaseBlocks} />
        ) : (
          <div className="case-layout__skeleton" aria-busy="true" aria-label="Loading" />
        )}
      </article>

      {/* Prev / next case navigation */}
      {(prev || next) && (
        <nav className="case-layout__adjacent" aria-label="More case studies">
          <div className="case-layout__adjacent-inner">
            {prev && (
              <Link to={`/work/${prev.slug}`} className="case-layout__adj-link case-layout__adj-link--prev">
                <span className="case-layout__adj-label">← Previous</span>
                <span className="case-layout__adj-title">{prev.title}</span>
              </Link>
            )}
            {next && (
              <Link to={`/work/${next.slug}`} className="case-layout__adj-link case-layout__adj-link--next">
                <span className="case-layout__adj-label">Next →</span>
                <span className="case-layout__adj-title">{next.title}</span>
              </Link>
            )}
          </div>
        </nav>
      )}

      {/* Footer */}
      <footer className="case-layout__footer">
        <div className="case-layout__footer-inner">
          <span>Almaz Isakov</span>
          <Link to="/" className="case-layout__footer-home">All work</Link>
        </div>
      </footer>
    </div>
  )
}
