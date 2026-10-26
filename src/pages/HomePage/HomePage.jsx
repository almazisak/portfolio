import { useState } from 'react'
import ContactDialog from '../../components/ContactDialog/ContactDialog'
import IconArrowCircleDown from '../../assets/icons/ic-arrow-circle-down.svg?react'
import avatarCard from '../../assets/avatar-card.jpg'
import './HomePage.css'

export default function HomePage() {
  const [contactDialogOpen, setContactDialogOpen] = useState(false)

  return (
    <div className="home-page">
      <div className="intro-card">
        <div className="intro-card__intro">
          <div className="intro-card__header">
            <img className="intro-card__avatar" src={avatarCard} alt="" />
            <h1 className="intro-card__name">{`Hi, I'm Almaz`}</h1>
          </div>

          <p className="intro-card__headline">
            {`I create with `}
            <span className="intro-card__serif">love</span>
            {` `}
            <span aria-hidden="true">❤️</span>
            {` for `}
            <span className="intro-card__serif">craft</span>
            {` and `}
            <span className="intro-card__serif">people</span>
          </p>
        </div>

        <div className="intro-card__actions">
          <a
            href="/cv.pdf"
            download="Almaz_Isakov_CV.pdf"
            className="intro-card__btn intro-card__btn--secondary"
          >
            <IconArrowCircleDown className="intro-card__btn-icon" aria-hidden="true" />
            Get CV
          </a>
          <button
            type="button"
            className="intro-card__btn intro-card__btn--primary"
            onClick={() => setContactDialogOpen(true)}
          >
            Contact me
          </button>
        </div>
      </div>

      <ContactDialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        title="Let's talk"
        description="Whether it's work, a collaboration, or a quick question – I'm one message away"
      />
    </div>
  )
}
