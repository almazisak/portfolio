import { useState } from 'react'
import Button from '../Button/Button'
import SocialMediaBtnGroup from '../SocialMediaBtnGroup/SocialMediaBtnGroup'
import './AboutMeWidget.css'

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

export default function AboutMeWidget() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`about-widget${expanded ? ' about-widget--active' : ''}`}>

      <button
        className="about-widget__toggle"
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? 'Collapse' : 'Expand'}
      >
        {expanded ? <IconCollapse /> : <IconExpand />}
      </button>

      <div className="about-widget__heading">
        <div className="about-widget__avatar">
          <img src="/avatar.jpg" alt="Almaz Isakov" />
        </div>
        <div className="about-widget__text">
          <p className="about-widget__name">Almaz Isakov</p>
          <p className="about-widget__role">Design leader with 10+ years of experience</p>
        </div>
      </div>

      {expanded && (
        <div className="about-widget__bio">
          <p>
            My design expertise and experience building creative teams and design
            practices enable me to drive impact at every level — from hands-on
            execution and mentoring designers to shaping product direction and
            scaling design operations.
          </p>
        </div>
      )}

      <div className="about-widget__footer">
        <Button className="about-widget__cv-btn" />
        <SocialMediaBtnGroup />
      </div>
    </div>
  )
}
