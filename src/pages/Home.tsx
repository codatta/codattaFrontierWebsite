import Header from '../components/Header'
import Banner from '../components/Banner'
import Signup from '../components/Signup'
import VotingCurve from '../components/VotingCurve'
import partnershipSVG from '../assets/images/partnership.svg'
import Footer from '../components/Footer'

import './Home.scss'

export default function HomePage() {
  return (
    <div className="pl-120px pr-126px pb-46px home-page min-h-screen">
      <Header />
      <Banner />
      <Signup />
      <div className="mt-64px">
        <img src={partnershipSVG} className="w-340px" />
      </div>
      {/* <VotingCurve /> */}
      <Footer />
    </div>
  )
}
