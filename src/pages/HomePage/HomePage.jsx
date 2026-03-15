import CardStack from '../../components/CardStack/CardStack'
import MeWidget from '../../components/MeWidget/MeWidget'
import './HomePage.css'

export default function HomePage() {
  return (
    <div className="home-page">
      <CardStack />
      <div className="home-page__widget-wrap">
        <MeWidget />
      </div>
    </div>
  )
}
