import microImg from '@/assets/images/article-1/micro.svg'
import bannerImg from '@/assets/images/article-1/banner.svg'

import Title from './Title'

import Head from '../Head'

function Signup() {
  function jump2App() {
    const href = /test/.test(location.pathname)
      ? 'https://app.test.codatta.io/account/signin'
      : 'https://app.codatta.io/account/signin'

    location.href = href
  }

  return (
    <button
      className="rounded-lg color-#020008E0 font-semibold h-38px w-full bg-#fff border-none text-sm block mt-24px"
      onClick={jump2App}
    >
      Sign up for THE Great Mission
    </button>
  )
}

function Banner() {
  return (
    <div className="h-220px">
      <img src={bannerImg} className="w-375px h-auto m-auto block -ml-47px" />
    </div>
  )
}

const Article = () => {
  return (
    <div className="relative">
      <Head className="px-24px" />
      <div className="w-300px m-auto mb-72px">
        <Banner />
        <Title />
        <Signup />
        <div className="text-#FFFFFF73 text-sm mt-40px flex flex-col gap-1">
          <span>Powered by↘︎</span>
          <a
            href="https://microscopeprotocol.xyz"
            target="_blank"
            className="block h-16px"
          >
            <img src={microImg} className="h-16px" />
          </a>
          <span>with shared technologies</span>
        </div>
      </div>
    </div>
  )
}

export default Article
