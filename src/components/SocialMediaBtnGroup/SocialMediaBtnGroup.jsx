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
        <svg width="24" height="24" aria-hidden="true">
          <use href="/icons.svg#icon-linkedin" />
        </svg>
      </a>

      <div className="social-btn-group__divider" aria-hidden="true" />

      <a
        href="https://t.me/jonelealmaz"
        target="_blank"
        rel="noopener noreferrer"
        className="social-btn-group__btn"
        aria-label="Telegram"
      >
        <svg width="24" height="24" aria-hidden="true">
          <use href="/icons.svg#icon-telegram" />
        </svg>
      </a>

      <div className="social-btn-group__divider" aria-hidden="true" />

      <a
        href="mailto:almazisakoff@gmail.com"
        className="social-btn-group__btn"
        aria-label="Email"
      >
        <svg width="24" height="24" aria-hidden="true">
          <use href="/icons.svg#icon-mail" />
        </svg>
      </a>
    </div>
  )
}
