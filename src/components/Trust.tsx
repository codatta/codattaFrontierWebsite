import img1 from '../assets/images/trust-1.svg'
import img2 from '../assets/images/trust-2.svg'
import img3 from '../assets/images/trust-3.svg'
import img4 from '../assets/images/trust-4.svg'

import './Trust.scss'

export default function Trust() {
  return (
    <div className="trust mt-115p text-2xl">
      <div className="font-semibold color-white">Trustworthy</div>
      <div className="color-#F838AB text-3xl mt-24px">Data Trust Algorithm</div>
      <div className="mt-16px">
        Leading blockchain providers operate within a secretive framework with
        no publicly accessible information on their data collection methods, nor
        third-party validation. Because of this obscurity, end-users often
        hesitate to consume the data, as they are unsure about its quality.
      </div>
      <img src={img1} className="w-full mt-32px" />
      <div className="mt-48px flex justify-between">
        <img src={img2} className="w-700px mr-60px" />
        <div>
          <div className="font-semibold color-white">Transparency</div>
          <div className="mt-16px pr-23px">
            We clearly communicate the data derived from ground-truth, heuristic
            methods, machine learning, and external sources to convey the
            inherent confidence in the data
          </div>
        </div>
      </div>
      <div className="mt-100px flex justify-between">
        <div className="w-510px">
          <div className="font-semibold color-white">
            Multi-staged validation
          </div>
          <div className="mt-16px">
            Each individual contribution undergoes a stringent validation
            process, which involves an AI-powered automated review, followed by
            a peer-review, and continually informed by community feedback.
          </div>
        </div>
        <img src={img3} className="w-600px" />
      </div>
      <img src={img4} className="w-1140px mt-173px ml-60px" />
    </div>
  )
}
