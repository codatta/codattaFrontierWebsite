import microImg from '../assets/images/micoroscope.svg'
import tracingImg from '../assets/images/tracing-1.svg'

import Signup from './Signup'

const Title = () => {
  return (
    <div className="mt-94px text-left h-224px flex flex-col justify-between">
      <h1 className="font-semibold leading-88px text-80px color-white">
        Let's annotate crypto <br />
        addresses from here
      </h1>
      <p>
        The world's leading AI-powered collaboration protocol for blockchain
        metadata.
      </p>
    </div>
  )
}

const Part = () => {
  return (
    <div className="h-584px relative">
      <Title />
      <Signup />
      <p className="mt-64px">
        Parallel products within a shared technological framework of↘︎
      </p>
      <img src={microImg} className="h-32px mt-32px" />
      <img
        src={tracingImg}
        className="absolute left--68px top-0 h-full w-48px object-contain"
      />
    </div>
  )
}

export default Part
