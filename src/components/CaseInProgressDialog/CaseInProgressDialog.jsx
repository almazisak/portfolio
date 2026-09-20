import { useEffect, useRef } from 'react'
import IcClose from '../../assets/icons/ic-close-circle.svg?react'
import IcTelegram from '../../assets/icons/ic-telegram-inverse.svg?react'
import IcLinkedIn from '../../assets/icons/ic-linkedin-inverse.svg?react'
import IcMail from '../../assets/icons/ic-mail-accent.svg?react'
import './CaseInProgressDialog.css'

// Shown when a case that isn't written up yet is opened. Built on the native
// <dialog>, which provides focus trapping, Esc-to-close and focus restore.
export default function CaseInProgressDialog({ open, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  // Clicks on the ::backdrop are reported with the dialog itself as the target.
  function onBackdropClick(e) {
    if (e.target === ref.current) onClose()
  }

  return (
    <dialog
      ref={ref}
      className="case-dialog"
      aria-labelledby="case-dialog-title"
      onClose={onClose}
      onClick={onBackdropClick}
    >
      <div className="case-dialog__text">
        <h2 id="case-dialog-title" className="case-dialog__title">Still writing this one</h2>
        <p className="case-dialog__desc">
          I'm shaping the story right now. If it caught your eye, I'm happy to walk you through it directly
        </p>
      </div>

      <div className="case-dialog__actions">
        <div className="case-dialog__row">
          <a
            href="https://t.me/jonelealmaz"
            target="_blank"
            rel="noopener noreferrer"
            className="case-dialog__btn case-dialog__btn--blue"
          >
            <IcTelegram aria-hidden="true" />
            <span>Telegram</span>
          </a>
          <a
            href="https://www.linkedin.com/in/almazisakov/"
            target="_blank"
            rel="noopener noreferrer"
            className="case-dialog__btn case-dialog__btn--blue"
          >
            <IcLinkedIn aria-hidden="true" />
            <span>LinkedIn</span>
          </a>
        </div>
        <a href="mailto:almazisakoff@gmail.com" className="case-dialog__btn case-dialog__btn--accent">
          <IcMail aria-hidden="true" />
          <span>almazisakoff@gmail.com</span>
        </a>
      </div>

      <button type="button" className="case-dialog__close" onClick={onClose} aria-label="Close">
        <IcClose aria-hidden="true" />
      </button>
    </dialog>
  )
}
