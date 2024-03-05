import img1 from '../assets/images/usage-1.svg'

import './Usage.scss'

export default function Usage() {
  return (
    <div className="usage mt-82px text-xl">
      <div className="font-semibold color-white text-2xl">Usage Examples</div>
      <div className="color-#00AA51 text-3xl mt-24px">
        Countless data and AI applications for blockchain industry
      </div>
      <div className="card h-490px mt-32px flex justify-evenly content-center items-center">
        <img src={img1} className="h-full" />
        <div className="w-362px">
          <div className="font-bold color-white text-22px">
            Compliance & Risk Management
          </div>
          <div className="mt-16px ">
            Annotated data equips us to delve deeper into the complexities of
            account and transaction risk profiles, facilitating meticulous
            evaluation and analysis. This comprehensive approach fortifies the
            integrity and security within the Web3 community, fostering a
            trustworthy environment for decentralized transactions and
            interactions.
          </div>
        </div>
      </div>
      <div className="mt-58px flex justify-between text-2xl">
        <div className="card small-card-1">
          <div className="font-semibold color-white">
            User-controlled
            <br />
            On-chain Profile
          </div>
          <div className="mt-16px w-290px">
            We facilitate nuanced insights into user behavior and transaction
            history by integrating diverse data points within ecosystems.
          </div>
        </div>
        <div className="card small-card-2">
          <div className="font-semibold color-white">Reputation</div>
          <div className="mt-16px w-344px">
            Users shape their reputation through product interactions, with
            potential extensions across diverse use cases, amplifying impact
            within the community.
          </div>
        </div>
      </div>
    </div>
  )
}
