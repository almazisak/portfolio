import CardStack from '../../components/CardStack/CardStack'
import AboutMeWidget from '../../components/AboutMeWidget/AboutMeWidget'
import './HomePage.css'

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="home-page__hero">
        <CardStack />
      </div>
      <div className="home-page__about">
        <AboutMeWidget />
      </div>
    </div>
  )
}
