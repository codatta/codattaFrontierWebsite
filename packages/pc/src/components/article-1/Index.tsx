import microImg from '@/assets/images/article-1/micro.svg'
import bannerImg from '@/assets/images/article-1/banner.png'
import Title from './Title'
import { jump2App } from '@/utils/util'

function Signup() {
  return (
    <button
      className="cursor-pointer rounded-8px h-48px px-24px block border-none outline-none text-#020008E0 font-600 text-base bg-white m-auto my-8"
      onClick={jump2App}
    > Sign Up
    </button>
  )
}

const Article = () => {
  return (
    <div className="">
      <img src={bannerImg} className="max-w-970px w-100% h-auto m-auto block" />
      <div className='-mt-20 text-center px-5'>
        <div className='w-100% max-w-1080px m-auto'>
          <Title />
          <p className="mt-32px text-xl text-#FFFFFF73 w-4/5 m-auto">
            The first decentralized data protocol building foundational
            infrastructure for developers, protocols, and AI, with mechanisms
            generating scientific confidence levels.
          </p>
        </div>
        <Signup />
        <div className="flex flex-wrap items-center justify-center text-#FFFFFF73 gap-3 mb-67px opacity-30">
          <span className="text-sm">Powered by↘︎</span>
          <a href="https://microscopeprotocol.xyz" target="_blank">
            <img src={microImg} className="h-16px block" />
          </a>
          <span className="text-sm">with shared technologies</span>
        </div>
      </div>
    </div>
  )
}

export default Article
