import { useState } from 'react'
import IcDownload from '../../assets/icons/ic-download.svg?react'
import IcMail from '../../assets/icons/ic-mail.svg?react'
import './MeWidget.css'

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function IconLinkedIn() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="20" height="20" rx="4" fill="#0A66C2"/>
      <path d="M5.5 8.25H7.5V14.5H5.5V8.25ZM6.5 7.5C5.84 7.5 5.25 6.94 5.25 6.25C5.25 5.56 5.84 5 6.5 5C7.16 5 7.75 5.56 7.75 6.25C7.75 6.94 7.16 7.5 6.5 7.5Z" fill="white"/>
      <path d="M9 8.25H10.9V9.1H10.93C11.18 8.62 11.82 8.1 12.77 8.1C14.79 8.1 15.17 9.42 15.17 11.15V14.5H13.17V11.55C13.17 10.82 13.15 9.88 12.13 9.88C11.09 9.88 10.93 10.67 10.93 11.5V14.5H9V8.25Z" fill="white"/>
    </svg>
  )
}

function IconTelegram() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="20" height="20" rx="10" fill="#2AABEE"/>
      <path d="M14.93 5.47L12.97 14.83C12.83 15.47 12.44 15.63 11.89 15.32L9.14 13.28L7.82 14.55C7.67 14.7 7.54 14.83 7.24 14.83L7.44 12.03L12.64 7.36C12.87 7.16 12.59 7.04 12.29 7.24L5.83 11.24L3.12 10.38C2.49 10.18 2.48 9.75 3.26 9.44L14.17 5.14C14.69 4.95 15.14 5.26 14.93 5.47Z" fill="white"/>
    </svg>
  )
}

function IconEmail() {
  return <IcMail aria-hidden="true" />
}

function IconDownload() {
  return <IcDownload aria-hidden="true" />
}

/* Expand — bracket at outer corners, diagonal arrow pointing inward (Figma node 263-3052) */
function IconExpand() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M15 4H20V9"  stroke="#3D3D3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 20H4V15"  stroke="#3D3D3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 4L13 11" stroke="#3D3D3A" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 20L11 13" stroke="#3D3D3A" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

/* Collapse — bracket near center, diagonal arrow pointing outward (Figma node 263-3051) */
function IconCollapse() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 13H9V18"  stroke="#3D3D3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 11H15V6" stroke="#3D3D3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 13L3 19"  stroke="#3D3D3A" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 11L21 5" stroke="#3D3D3A" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// ── MeWidget ──────────────────────────────────────────────────────────────────

export default function MeWidget() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`me-widget${expanded ? ' me-widget--active' : ''}`}>

      <button
        className="me-widget__toggle"
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? 'Collapse' : 'Expand'}
      >
        {expanded ? <IconCollapse /> : <IconExpand />}
      </button>

      {/* Heading row */}
      <div className="me-widget__heading">
        <div className="me-widget__avatar">
          <img src="/avatar.jpg" alt="Almaz Isakov" />
        </div>

        <div className="me-widget__text">
          <p className="me-widget__name">Almaz Isakov</p>
          <p className="me-widget__role">Design leader with 10+ years of experience</p>
        </div>
      </div>

      {/* Bio — only in active state */}
      {expanded && (
        <div className="me-widget__bio">
          <p>
            My design expertise and experience building creative teams and design
            practices enable me to drive impact at every level — from hands-on
            execution and mentoring designers to shaping product direction and
            scaling design operations.
          </p>
        </div>
      )}

      {/* Footer actions */}
      <div className="me-widget__footer">
        <a
          href="/cv.pdf"
          download="Almaz_Isakov_CV.pdf"
          className="me-widget__btn me-widget__btn--cv"
        >
          <IconDownload />
          <span>CV</span>
        </a>

        <div className="me-widget__btn-group">
          <a
            href="https://www.linkedin.com/in/almazisakov/"
            target="_blank"
            rel="noopener noreferrer"
            className="me-widget__btn me-widget__btn--icon me-widget__btn--left"
            aria-label="LinkedIn"
          >
            <IconLinkedIn />
          </a>
          <a
            href="https://t.me/jonelealmaz"
            target="_blank"
            rel="noopener noreferrer"
            className="me-widget__btn me-widget__btn--icon me-widget__btn--right"
            aria-label="Telegram"
          >
            <IconTelegram />
          </a>
        </div>

        <a
          href="mailto:almazisakoff@gmail.com"
          className="me-widget__btn me-widget__btn--icon"
          aria-label="Email"
        >
          <IconEmail />
        </a>
      </div>
    </div>
  )
}
