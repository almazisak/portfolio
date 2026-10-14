import { useState } from 'react'
import ContactDialog from '../../components/ContactDialog/ContactDialog'
import avatarCard from '../../assets/avatar-card.jpg'
import './HomePage.css'

export default function HomePage() {
  const [contactDialogOpen, setContactDialogOpen] = useState(false)

  return (
    <div className="home-page">
      <div className="intro-card">
        <img className="intro-card__avatar" src={avatarCard} alt="Almaz Isakov" />

        <p className="intro-card__headline">
          <span className="intro-card__light">{`I'm Almaz, `}<br />{`I create with `}</span>
          <span className="intro-card__serif">love</span>
          <span className="intro-card__light"> for </span>
          <span className="intro-card__serif">craft</span>
          <span className="intro-card__light"> and </span>
          <span className="intro-card__serif">people</span>
        </p>

        <div className="intro-card__actions">
          <a
            href="/cv.pdf"
            download="Almaz_Isakov_CV.pdf"
            className="intro-card__btn intro-card__btn--secondary"
          >
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
