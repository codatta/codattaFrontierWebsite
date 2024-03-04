import Header from '../components/Header'
import Banner from '../components/Banner'
import Signup from '../components/Signup'

import './Home.scss'

export default function HomePage() {
    return <div className='pl-120px pr-126px home-page min-h-100vh'>
        <Header />
        <Banner />
        <Signup />
    </div>
}