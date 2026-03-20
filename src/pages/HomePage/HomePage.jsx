import { useState } from 'react'
import CardStack from '../../components/CardStack/CardStack'
import AboutMeWidget from '../../components/AboutMeWidget/AboutMeWidget'
import './HomePage.css'

export default function HomePage() {
  const [widgetExpanded, setWidgetExpanded] = useState(false)

  return (
    <div className="home-page">
      <CardStack />
      <div
        className={`home-page__backdrop${widgetExpanded ? ' home-page__backdrop--visible' : ''}`}
        aria-hidden="true"
      />
      <div className="home-page__widget-wrap">
        <AboutMeWidget expanded={widgetExpanded} onToggle={() => setWidgetExpanded(v => !v)} />
      </div>
    </div>
  )
}
