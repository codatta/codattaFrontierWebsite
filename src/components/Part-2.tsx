import img1 from '../assets/images/usage-1.svg'
import img2 from '../assets/images/usage-2.svg'
import img3 from '../assets/images/usage-3.svg'
// import tracingImg from '../assets/images/tracing-2.svg'
import tracingIcon from '../assets/images/tracing-icon-1.svg'
// import tracingLine from '../assets/images/tracing-line.svg'

import Tracing from './Tracing'

import styled from 'styled-components'

const Section1 = () => {
  return (
    <div className="card w-full h-490px mt-32px flex justify-evenly content-center items-center bg-blur">
      <img src={img1} className="h-full" />
      <div className="w-362px">
        <div className="title-1">Compliance & Risk Management</div>
        <div>
          Annotated data equips us to delve deeper into the complexities of
          account and transaction risk profiles, facilitating meticulous
          evaluation and analysis. This comprehensive approach fortifies the
          integrity and security within the Web3 community, fostering a
          trustworthy environment for decentralized transactions and
          interactions.
        </div>
      </div>
    </div>
  )
}

const Card1 = styled.div`
  background: url(${img2}) no-repeat right center;
  background-size: contain;
`
const Card2 = styled.div`
  background: url(${img3}) no-repeat right center;
  background-size: contain;
`

const Section2 = () => {
  return (
    <div className="mt-58px flex justify-between">
      <Card1 className="card small-card w-584px h-316px">
        <div className="title-1">
          User-controlled
          <br />
          On-chain Profile
        </div>
        <div className="w-290px mt-16px">
          We facilitate nuanced insights into user behavior and transaction
          history by integrating diverse data points within ecosystems.
        </div>
      </Card1>
      <Card2 className="card small-card w-584px h-316px">
        <div className="title-1">Reputation</div>
        <div className="w-344px mt-16px">
          Users shape their reputation through product interactions, with
          potential extensions across diverse use cases, amplifying impact
          within the community.
        </div>
      </Card2>
    </div>
  )
}

const Part = () => {
  return (
    <div className="h-1084px relative text-xl ">
      <div className="title-1 mt-12px relative">
        <img
          src={tracingIcon}
          className="w-48px absolute top--10px left--68px"
        />
        Usage Examples
      </div>
      <Tracing>
        <div className="title-2 color-green">
          Countless data and AI applications for blockchain industry
        </div>
        <Section1 />
        <Section2 />
      </Tracing>
    </div>
  )
}

export default Part
