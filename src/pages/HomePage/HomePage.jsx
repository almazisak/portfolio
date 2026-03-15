import CardStack from '../../components/CardStack/CardStack'
import MeWidget from '../../components/MeWidget/MeWidget'
import './HomePage.css'

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="home-page__hero">
        <CardStack />
      </div>
      <div className="home-page__about">
        <MeWidget />
      </div>
    </div>
  )
}
