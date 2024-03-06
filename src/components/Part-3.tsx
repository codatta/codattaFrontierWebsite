import img from '../assets/images/infra.svg'
import img1 from '../assets/images/diversity-1.svg'
import img2 from '../assets/images/diversity-2.svg'
import img3 from '../assets/images/diversity-3.svg'

import styled from 'styled-components'
import tracingIcon from '../assets/images/tracing-icon-2.svg'
import asideLine from '../assets/images/tracing-aside-1.svg'

import EffectCard from './effects/EffectCard'

const Head = () => {
  return (
    <div className="flex justify-between text-2xl">
      <div className="w-440px">
        <div className="title-1 mt-12px">Public Infrastructure</div>
        <div className="title-2 color-cyan mt-24px">
          Decentralized Intelligence Data Layer
        </div>
        <div className="mt-24px">
          The in-house solution to gathering high-quality, labeled data can be
          costly and inefficient. We have created a bespoke protocol designed to
          develop accessible public goods for the collaborative global community
          sourcing superior metadata.
        </div>
      </div>
      <EffectCard color="#33B3AE">
        <img src={img} className="w-700px" />
      </EffectCard>
    </div>
  )
}

const Section1 = () => {
  return (
    <div className="ml-50px mt--195px">
      <div className="rounded-3xl inline-block py-10px px-16px border-1 border-solid border-#33B3AE color-#33B3AE">
        Labeled addresses
      </div>
      <div className="ml-16px mt-25px">
        <div className="title-1">Diversity</div>
        <div className="mt-16px bold text-5xl color-#33B3AE">
          Gini index, top10 xx%
        </div>
        <div className="mt-16px">#Supported networks</div>
      </div>
    </div>
  )
}

const Section2 = () => {
  return (
    <div className="mt-125px flex justify-around">
      <EffectCard color="#33B3AE">
        <img src={img1} className="w-396px" />
      </EffectCard>
      <div className="mt-60px w-630px">
        <div className="font-semibold color-white">Permissionless</div>
        <div className="mt-16px ">
          Web3 users are welcome to volunteer non-private label data from their
          transaction histories. Businesses of all sizes are also welcomed to
          contribute. We will sort all contributions based on quality and in
          return, contributors will gain broader scope of data access, which can
          significantly enhance the application of their data.
        </div>
      </div>
    </div>
  )
}

const Section3 = () => {
  return (
    <div className="mt-60px flex justify-around items-center">
      <div className="w-643px">
        <div className="title-1">Ubiquitous Access</div>
        <div>
          We offer both on-chain and off-chain access, as well as batch or
          single-item-query options to meet varied requirements and usage
          scenarios.、
        </div>
      </div>
      <EffectCard color="#33B3AE">
        <img src={img2} className="w-400px" />
      </EffectCard>
    </div>
  )
}

const Section4 = () => {
  return (
    <div className="mt-40px flex justify-between">
      <EffectCard color="#33B3AE">
        <img src={img3} className="w-600px" />
      </EffectCard>
      <div className="w-500px mt-23px">
        <div className="title-1">Open-source</div>
        <div>
          Our protocol and pipeline, essential for capturing this high-quality
          metadata, have been made entirely open source. We believe this allows
          for wider community involvement and enhanced contributions to achieve
          our goals。
        </div>
      </div>
    </div>
  )
}

const Line = styled.div`
  background: linear-gradient(to bottom, #33b3ae, #33b3ae 38%, #f838ab);
`

const GuideLine = () => {
  return (
    <div className="flex flex-col justify-between items-center guide-line mt-6px relative">
      <img src={tracingIcon} className="w-24px h-24px" />
      <img
        src={asideLine}
        className="w-84px h-364px absolute top-425px left-21px"
      />
      <Line className="w-4px h-2290px" />
    </div>
  )
}

const Part = () => {
  return (
    <div className="h-2332px relative mt-12px flex">
      <GuideLine />
      <div className="main">
        <Head />
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
      </div>
    </div>
  )
}

export default Part
