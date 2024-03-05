import img from '../assets/images/infra.svg'

import './Infra.scss'

export default function Infra() {
  return (
    <div className="mt-104px infra flex justify-between">
      <div className="w-440px">
        <div className="font-semibold color-white">Public Infrastructure</div>
        <div className="text-3xl color-#33B3AE text-3xl mt-24px">
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
