import { useState } from 'react'
import IcExpand from '../../assets/icons/ic-expand.svg?react'
import IcCollapse from '../../assets/icons/ic-collapse.svg?react'
import Button from '../Button/Button'
import SocialMediaBtnGroup from '../SocialMediaBtnGroup/SocialMediaBtnGroup'
import './AboutMeWidget.css'

export default function AboutMeWidget() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`about-widget${expanded ? ' about-widget--active' : ''}`}>

      <button
        className="about-widget__heading"
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? 'Collapse' : 'Expand'}
      >
        <div className="about-widget__avatar">
          <img src="/avatar.jpg" alt="Almaz Isakov" />
        </div>
        <div className="about-widget__text">
          <p className="about-widget__name">Almaz Isakov</p>
          <p className="about-widget__role">Design leader with 10+ years of experience</p>
        </div>
        {expanded
          ? <IcCollapse className="about-widget__toggle-icon" aria-hidden="true" />
          : <IcExpand className="about-widget__toggle-icon" aria-hidden="true" />
        }
      </button>

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
