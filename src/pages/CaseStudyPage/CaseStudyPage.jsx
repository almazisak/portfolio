import { useParams, useNavigate } from 'react-router-dom'
import './CaseStudyPage.css'

export default function CaseStudyPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const title = id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <div className="case-study-page">
      <header className="case-study-page__header">
        <button
          className="case-study-page__back"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#3D3D3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="case-study-page__title">{title}</span>
      </header>

      <div className="case-study-page__body">
        <div className="case-study-page__placeholder">
          <p>Case study content coming soon.</p>
        </div>
      </div>
    </div>
  )
}
