import { useEffect, useId, useRef } from 'react'
import IcClose from '../../assets/icons/ic-close-circle.svg?react'
import IcArrow from '../../assets/icons/ic-arrow-up-right-sm.svg?react'
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

      <button type="button" className="contact-dialog__close" onClick={onClose} aria-label="Close">
        <IcClose aria-hidden="true" />
      </button>

      <ul className="contact-dialog__list">
        <li className="contact-dialog__item">
          <a
            href="https://t.me/jonelealmaz"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-dialog__link"
          >
            <IcArrow aria-hidden="true" />
            <span className="contact-dialog__label">Telegram</span>
            <span className="contact-dialog__tag">fastest</span>
          </a>
        </li>
        <li className="contact-dialog__item">
          <a
            href="https://www.linkedin.com/in/almazisakov/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-dialog__link"
          >
            <IcArrow aria-hidden="true" />
            <span className="contact-dialog__label">LinkedIn</span>
          </a>
        </li>
        <li className="contact-dialog__item">
          <a href="mailto:almazisakoff@gmail.com" className="contact-dialog__link">
            <IcArrow aria-hidden="true" />
            <span className="contact-dialog__label">almazisakoff@gmail.com</span>
          </a>
        </li>
      </ul>
    </dialog>
  )
}
