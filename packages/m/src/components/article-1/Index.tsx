import microImg from '@/assets/images/article-1/micro.svg'
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
    <div className="text-sm ">
      <button
        className="rounded-lg color-#020008E0 font-semibold h-38px w-full bg-#fff border-none"
        onClick={jump2App}
      >
        Sign up for THE Great Mission
      </button>
    </div>
  )
}

const Article = () => {
  return (
    <div className="relative">
      <Head className="px-24px" />
      <div className="w-300px m-auto mb-72px">
        <Title />
        <Signup />
        <div className="text-#FFFFFF73 text-sm mt-40px">
          <span>Powered by↘︎</span>
          <a
            href="https://microscopeprotocol.xyz"
            target="_blank"
            className="block"
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
