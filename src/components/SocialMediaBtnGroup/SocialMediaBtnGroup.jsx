import IcLinkedIn from '../../assets/icons/ic-linkedin.svg?react'
import IcTelegram from '../../assets/icons/ic-telegram.svg?react'
import IcMail from '../../assets/icons/ic-mail.svg?react'
import './SocialMediaBtnGroup.css'

export default function SocialMediaBtnGroup() {
  return (
    <div className="social-btn-group">
      <a
        href="https://www.linkedin.com/in/almazisakov/"
        target="_blank"
        rel="noopener noreferrer"
        className="social-btn-group__btn"
        aria-label="LinkedIn"
      >
        <IcLinkedIn aria-hidden="true" />
      </a>

      <div className="social-btn-group__divider" aria-hidden="true" />

      <a
        href="https://t.me/jonelealmaz"
        target="_blank"
        rel="noopener noreferrer"
        className="social-btn-group__btn"
        aria-label="Telegram"
      >
        <IcTelegram aria-hidden="true" />
      </a>

      <div className="social-btn-group__divider" aria-hidden="true" />

      <a
        href="mailto:almazisakoff@gmail.com"
        className="social-btn-group__btn"
        aria-label="Email"
      >
        <IcMail aria-hidden="true" />
      </a>
    </div>
  )
}
