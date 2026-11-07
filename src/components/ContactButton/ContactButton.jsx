import { useState } from 'react'
import ContactDialog from '../ContactDialog/ContactDialog'

// Island: the "Contact me" button plus the dialog it opens. The rest of the intro card is static HTML.
export default function ContactButton({ className, title, description, children }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      <ContactDialog
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        description={description}
      />
    </>
  )
}
