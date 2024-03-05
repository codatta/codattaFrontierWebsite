import Header from '../components/Header'
import Banner from '../components/Banner'
import Signup from '../components/Signup'
import VotingCurve from '../components/VotingCurve'

import './Home.scss'

export default function HomePage() {
  return (
    <div className="pl-120px pr-126px home-page min-h-screen">
      <Header />
      <Banner />
      <Signup />
      <VotingCurve />
    </div>
  )
}
