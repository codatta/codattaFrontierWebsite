import img1 from '../assets/images/diversity-1.svg'
import img2 from '../assets/images/diversity-2.svg'
import img3 from '../assets/images/diversity-3.svg'

import './Diversity.scss'

export default function Diversity() {
  return (
    <div className="diversity ml-50px mt--195px text-2xl">
      <div className="rounded-3xl inline-block py-10px px-16px border-1 border-solid border-#33B3AE color-#33B3AE">
        Labeled addresses
      </div>
      <div className="ml-16px mt-25px">
        <div className="font-semibold color-white">Diversity</div>
        <div className="mt-16px bold text-5xl color-#33B3AE">
          Gini index, top10 xx%
        </div>
        <div className="text-2xl mt-16px">#Supported networks</div>
      </div>
      <div className="mt-125px flex justify-around">
        <img src={img1} className="w-396px" />
        <div className="mt-60px w-630px">
          <div className="font-semibold color-white">Permissionless</div>
          <div className="mt-16px ">
            Web3 users are welcome to volunteer non-private label data from
            their transaction histories. Businesses of all sizes are also
            welcomed to contribute. We will sort all contributions based on
            quality and in return, contributors will gain broader scope of data
            access, which can significantly enhance the application of their
            data.
          </div>
        </div>
      </div>
      <div className="mt-60px flex justify-between items-center">
        <div className="w-643px">
          <div className="font-semibold color-white">Ubiquitous Access</div>
          <div className="mt-16px">
            We offer both on-chain and off-chain access, as well as batch or
            single-item-query options to meet varied requirements and usage
            scenarios.、
          </div>
        </div>
        <img src={img2} className="w-400px" />
      </div>
      <div className="mt-40px flex justify-between">
        <img src={img3} className="w-600px" />
        <div className="w-500px mt-23px">
          <div className="font-semibold color-white">Open-source</div>
          <div className="mt-16px">
            Our protocol and pipeline, essential for capturing this high-quality
            metadata, have been made entirely open source. We believe this
            allows for wider community involvement and enhanced contributions to
            achieve our goals。
          </div>
        </div>
      </div>
    </div>
  )
}
