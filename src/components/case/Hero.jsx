import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import HeroBar from '../HeroBar/HeroBar'
import './blocks.css'

// Sticky nav height (padding included); the title counts as gone once it slides under it
const NAV_BAR_HEIGHT = 76

export function Hero({ title, navTitle, subtitle, role, year, tags, cover, coverAlt }) {
  const navigate = useNavigate()
  const location = useLocation()
  const titleRef = useRef(null)
  const [titleGone, setTitleGone] = useState(false)

  // Show the case title in the nav bar once the page's own title scrolls out of view
  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setTitleGone(!entry.isIntersecting),
      { rootMargin: `-${NAV_BAR_HEIGHT}px 0px 0px 0px` },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Direct visits have no in-app history to go back to
  const goBack = () => (location.key === 'default' ? navigate('/') : navigate(-1))

  // The nav bar is a top-level sibling of the cover/content (not nested inside
  // either), so its sticky containing block is the whole article — it needs to
  // stay stuck for the rest of the page, not just while the hero block scrolls by.
  return (
    <>
      <div className="cs-hero__cover">
        {cover ? (
          <img src={cover} alt={coverAlt || ''} />
        ) : (
          <div className="cs-hero__cover-placeholder" role="img" aria-label="Cover illustration placeholder">
            <span className="cs-hero__cover-label">Cover</span>
          </div>
        )}
      </div>

      <HeroBar onBack={goBack} title={navTitle || title} showTitle={titleGone} />

      <div className="cs-hero__content">
        {tags?.length > 0 && (
          <ul className="cs-hero__tags" aria-label="Tags">
            {tags.map(t => (
              <li key={t} className="cs-hero__tag">{t}</li>
            ))}
          </ul>
        )}
        <h1 ref={titleRef} className="cs-hero__title">{title}</h1>
        {subtitle && <p className="cs-hero__subtitle">{subtitle}</p>}
        {(role || year) && (
          <dl className="cs-hero__meta">
            {role && <><dt>Role</dt><dd>{role}</dd></>}
            {year && <><dt>Year</dt><dd>{year}</dd></>}
          </dl>
        )}
      </div>
    </>
  )
}
