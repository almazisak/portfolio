import ContactDialog from '../ContactDialog/ContactDialog'

// Shown when a case that isn't written up yet is opened.
export default function CaseInProgressDialog({ open, onClose }) {
  return (
    <ContactDialog
      open={open}
      onClose={onClose}
      title="Still writing this one"
      description="I'm shaping the story right now. If it caught your eye, I'm happy to walk you through it directly"
    />
  )
}
