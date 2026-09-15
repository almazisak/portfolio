import { useEffect, useState } from 'react'
import IcArrow from '../../assets/icons/ic-arrow.svg?react'
import './HeroBar.css'

export default function HeroBar({ onContactClick }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 8) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`hero-bar${scrolled ? ' hero-bar--scrolled' : ''}`}>
      <div className="hero-bar__inner">
        <div className="hero-bar__profile">
          <img className="hero-bar__avatar" src="/avatar.jpg" alt="Almaz Isakov" />
          <span className="hero-bar__name">Almaz Isakov</span>
        </div>
        <div className="hero-bar__actions">
          <a
            href="/cv.pdf"
            download="Almaz_Isakov_CV.pdf"
            className="hero-bar__btn hero-bar__btn--cv"
          >
            <IcArrow className="hero-bar__btn-icon" aria-hidden="true" />
            <span>Get CV</span>
          </a>
          <button
            className="hero-bar__btn hero-bar__btn--contact"
            onClick={onContactClick}
          >
            Contact me
          </button>
        </div>
      </div>
    </header>
  )
}
