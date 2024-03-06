import Header from '../components/Header'
import Banner from '../components/Banner'
import Signup from '../components/Signup'
// import VotingCurve from '../components/VotingCurve'
import partnershipSVG from '../assets/images/partnership.svg'
import Usage from '../components/Usage'
import Infra from '../components/Infra'
import Diversity from '../components/Diversity'
import Trust from '../components/Trust'
import Privacy from '../components/Privacy'
import Footer from '../components/Footer'

import { TracingBeamDemo } from '../components/TracingBeam'

import './Home.scss'

export default function HomePage() {
  return (
    <div className="pl-120px pr-120px pb-46px home-page min-h-screen">
      <Header />
      {/* <TracingBeamDemo /> */}
      <Banner />
      <Signup />
      <div className="mt-64px">
        <img src={partnershipSVG} className="w-340px" />
      </div>
      {/* <VotingCurve /> */}
      <Usage />
      <Infra />
      <Diversity />
      <Trust />
      <Privacy />
      <Footer />
    </div>
  )
}
