import microImg from '@/assets/images/article-1/micro.svg'
import bannerImg from '@/assets/images/article-1/banner.png'
import Title from './Title'
import { jump2App } from '@/utils/util'

function Signup() {
  return (
    <button
      className="cursor-pointer rounded-8px h-48px px-24px block border-none outline-none text-#020008E0 font-600 text-base bg-#fff m-auto my-8"
      onClick={jump2App}
    >
      Sign Up For The Great Mission
    </button>
  )
}

function Banner() {
  return (
    <div className="h-396px mt-30px">
      <img src={bannerImg} className="w-970px h-auto m-auto block" />
    </div>
  )
}

function Bg() {
  return (
    <div
      className="w-full h-850px absolute left-0 top-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(174.95% 169.46% at 27.93% -66.74%, rgba(0, 124, 141, 0.20) 8.97%, rgba(11, 11, 11, 0.20) 71.61%)',
      }}
    ></div>
  )
}

const Article = () => {
  return (
    <>
      <Bg />
      <Banner />
      <Title />
      <Signup />
      <div className="flex items-center justify-center text-#FFFFFF73 gap-3 mb-67px opacity-30">
        <span className="text-sm">Powered by↘︎</span>
        <a
          href="https://microscopeprotocol.xyz"
          target="_blank"
          className="block"
        >
          <img src={microImg} className="h-16px" />
        </a>
        <span className="text-sm">with shared technologies</span>
      </div>
    </>
  )
}

export default Article
