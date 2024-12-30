import TransitionEffect from '@/components/common/transition-effect'

import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Rewards from '@/components/crypto/rewards'
import Validation from '@/components/crypto/validation'
import Submission from '@/components/crypto/submission'

export default function CryptoHome() {
  const navigate = useNavigate()

  return (
    <TransitionEffect>
      <div className="">
        {/* back */}
        <div className="mb-6 flex items-center gap-2">
          <ArrowLeft size={14} onClick={() => navigate(-1)} className="cursor-pointer" />
          <h1>Back</h1>
        </div>
        {/* title */}
        <div className="mb-12">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xl font-bold">Crypto</div>
            {/* <div>
              <div className="flex gap-2">
                <img src={goldCoin} alt="" className="h-10 w-10" />
                <div>
                  <div className="font-bold -mb-1 text-base">{balance}</div>
                  <div className="text-gray-5 text-xs">Your Reward</div>
                </div>
              </div>
            </div> */}
          </div>
          <div className="text-white/60">
            Collecting data on wallet addresses and transaction flows enhances transparency in the crypto ecosystem.
            This transparency enables AI models to detect fraud, improve compliance, and promote a safer environment for
            all participants, fostering trust in decentralized finance.
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <Rewards />
          <Validation />
          <Submission />
        </div>
      </div>
    </TransitionEffect>
  )
}
