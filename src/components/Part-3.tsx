import img from '../assets/images/infra.svg'
import img1 from '../assets/images/diversity-1.svg'
import img2 from '../assets/images/diversity-2.svg'
import img3 from '../assets/images/diversity-3.svg'

// import tracingImg from '../assets/images/tracing-3.svg'
import tracingIcon from '../assets/images/tracing-icon-2.svg'
// import tracingLine from '../assets/images/tracing-line.svg'

const Head = () => {
  return (
    <div className="flex justify-between text-2xl">
      <div className="w-440px">
        <div className="title-1 mt-12px relative">
          <img
            src={tracingIcon}
            className="w-48px absolute top--10px left--68px"
          />
          Public Infrastructure
        </div>
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
      <img src={img} className="w-700px" />
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
      <img src={img1} className="w-396px" />
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
      <img src={img2} className="w-400px" />
    </div>
  )
}

const Section5 = () => {
  return (
    <div className="mt-40px flex justify-between">
      <img src={img3} className="w-600px" />
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

const Part = () => {
  return (
    <div className="h-2332px relative mt-12px">
      <Head />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section5 />
      {/* <div className="absolute left--68px top--12px w-48px flex flex-col">
        <img src={tracingIcon} className="w-48px" />
        <img src={tracingLine} className="w-48px h-2200px" />
      </div> */}
      {/* <img
        src={tracingImg}
        className="absolute left--90px top--12px h-full w-152px object-contain"
      /> */}
    </div>
  )
}

export default Part
