import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import HeroBar from '../../components/HeroBar/HeroBar'
import IconTelegram from '../../assets/icons/ic-telegram-circle.svg?react'
import { HONEYCOMB, stickers } from './stickers'
import './BalatyPage.css'

const TELEGRAM_URL = 'https://t.me/addstickers/balaty'

const TITLE = 'Balaty – Kyrgyz national sticker pack for Telegram'
const SHORT_TITLE = 'Balaty'

// Sticky hero bar height (padding included); the title counts as gone once it slides under it
const HERO_BAR_HEIGHT = 76

// The CTA shows while the sticker grid is in view, but only once the grid has
// travelled this far up from the bottom edge (share of the viewport height)
const CTA_REVEAL_TRAVEL = 25

function ExtLink({ href, children }) {
  return (
    <a className="balaty__link" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

const PARAGRAPHS = [
  <>Balaty means "small fir tree" in Kyrgyz – a name chosen for children who, like young trees, need support to grow tall and strong, but don't all get an equal chance to. I conceived the project at Mozgami studio: a set of Kyrgyz characters, a boy and a girl in national dress, designed to carry warmth, humor, and cultural identity into everyday digital conversation – and to raise support for children from vulnerable backgrounds.</>,
  <>Each character was tied to a familiar emotion – laughing, dancing, daydreaming, in love – so the right sticker would surface the moment someone typed that feeling.</>,
  <>Illustrations by <ExtLink href="https://www.instagram.com/asyatalip/">Asya Talip</ExtLink>, whose linework gave the characters their warmth and made them instantly lovable.</>,
  <>The set launched as free Telegram stickers and extended into a small line of physical goods, with a share of proceeds supporting children's medical care.</>,
  <>🏆 Balaty won Gold in Craft: Illustration & 3D at the <ExtLink href="https://jolbors.com/en/">Jolbors International Festival of Creativity</ExtLink> – Mozgami's first win there after a long stretch without one, and the project that brought the studio back to the podium.</>,
]

export default function BalatyPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const titleRef = useRef(null)
  const honeycombRef = useRef(null)
  const [titleGone, setTitleGone] = useState(false)
  const [ctaVisible, setCtaVisible] = useState(false)

  // Client-side navigation keeps the previous page's scroll position, and the browser
  // restores the old offset on back/forward (mobile swipe gestures) and reload after
  // our scrollTo runs. Opt this entry out of restoration so the page always opens on top.
  useLayoutEffect(() => {
    const prev = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    return () => { window.history.scrollRestoration = prev }
  }, [])

  // Show the title in the hero bar once the page's own title scrolls out of view
  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setTitleGone(!entry.isIntersecting),
      { rootMargin: `-${HERO_BAR_HEIGHT}px 0px 0px 0px` },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // On mobile the grid is wider than the screen and pans horizontally; start on its centre
  useLayoutEffect(() => {
    const el = honeycombRef.current
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2
  }, [])

  // Show the CTA only while the sticker grid is in the viewport
  useEffect(() => {
    const el = honeycombRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setCtaVisible(entry.isIntersecting),
      { rootMargin: `-${HERO_BAR_HEIGHT}px 0px -${CTA_REVEAL_TRAVEL}% 0px` },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Direct visits have no in-app history to go back to
  const goBack = () => (location.key === 'default' ? navigate('/') : navigate(-1))

  return (
    <div className="balaty">
      <HeroBar onBack={goBack} title={SHORT_TITLE} showTitle={titleGone} />

      <main className="balaty__main">
        <header className="balaty__intro">
          <h1 ref={titleRef} className="balaty__title">{TITLE}</h1>
          <p className="balaty__meta">2016 · <ExtLink href="https://www.instagram.com/mozgamistudio/">Mozgami studio</ExtLink> · Concept, visual direction, production</p>
          <div className="balaty__body">
            {PARAGRAPHS.map((text, i) => <p key={i}>{text}</p>)}
          </div>
        </header>

        <div
          ref={honeycombRef}
          className="balaty__honeycomb"
          role="img"
          aria-label="Collage of Balaty stickers: Kyrgyz children in national dress laughing, dancing, daydreaming and playing"
        >
          <div
            className="balaty__honeycomb-canvas"
            style={{ aspectRatio: `${HONEYCOMB.width} / ${HONEYCOMB.height}` }}
          >
            {stickers.map(({ src, left, top, size }) => (
              <img
                key={src}
                className="balaty__sticker"
                src={src}
                alt=""
                loading="lazy"
                draggable={false}
                style={{
                  left: `${(left / HONEYCOMB.width) * 100}%`,
                  top: `${(top / HONEYCOMB.height) * 100}%`,
                  width: `${(size / HONEYCOMB.width) * 100}%`,
                }}
              />
            ))}
          </div>
        </div>
      </main>

      <div className={`balaty__cta-bar${ctaVisible ? ' balaty__cta-bar--visible' : ''}`}>
        <a
          className="hero-bar__btn hero-bar__btn--contact"
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconTelegram className="hero-bar__btn-icon" aria-hidden="true" />
          <span>Add to Telegram</span>
        </a>
      </div>
    </div>
  )
}
