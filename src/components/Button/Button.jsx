import IcArrow from '../../assets/icons/ic-arrow.svg?react'
import './Button.css'

export default function Button({ href = '/cv.pdf', label = 'Download CV', download = 'Almaz_Isakov_CV.pdf', className = '' }) {
  return (
    <a
      href={href}
      download={download}
      className={`btn${className ? ' ' + className : ''}`}
    >
      <IcArrow className="btn__icon" aria-hidden="true" />
      <span className="btn__label">{label}</span>
    </a>
  )
}
