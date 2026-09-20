import { useEffect, useId, useRef } from 'react'
import IcClose from '../../assets/icons/ic-close-circle.svg?react'
import IcTelegram from '../../assets/icons/ic-telegram-inverse.svg?react'
import icLinkedIn from '../../assets/icons/ic-linkedin-inverted.png'
import IcMail from '../../assets/icons/ic-mail-accent.svg?react'
import './ContactDialog.css'

// Dialog with the ways to reach me. Built on the native <dialog>, which
// provides focus trapping, Esc-to-close and focus restore.
export default function ContactDialog({ open, onClose, title, description }) {
  const ref = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) {
      dialog.showModal()
      dialog.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // Clicks on the ::backdrop are reported with the dialog itself as the target.
  function onBackdropClick(e) {
    if (e.target === ref.current) onClose()
  }

  return (
    <dialog
      ref={ref}
      className="contact-dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      onClose={onClose}
      onClick={onBackdropClick}
    >
      <div className="contact-dialog__text">
        <h2 id={titleId} className="contact-dialog__title">{title}</h2>
        <p className="contact-dialog__desc">{description}</p>
      </div>

      <div className="contact-dialog__actions">
        <div className="contact-dialog__row">
          <a
            href="https://t.me/jonelealmaz"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-dialog__btn contact-dialog__btn--blue"
          >
            <IcTelegram aria-hidden="true" />
            <span>Telegram</span>
          </a>
          <a
            href="https://www.linkedin.com/in/almazisakov/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-dialog__btn contact-dialog__btn--blue"
          >
            <img src={icLinkedIn} alt="" width="24" height="24" />
            <span>LinkedIn</span>
          </a>
        </div>
        <a href="mailto:almazisakoff@gmail.com" className="contact-dialog__btn contact-dialog__btn--accent">
          <IcMail aria-hidden="true" />
          <span>almazisakoff@gmail.com</span>
        </a>
      </div>

      <button type="button" className="contact-dialog__close" onClick={onClose} aria-label="Close">
        <IcClose aria-hidden="true" />
      </button>
    </dialog>
  )
}
