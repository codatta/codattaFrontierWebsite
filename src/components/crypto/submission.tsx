import AngleRight from '@/assets/crypto/angle-right.svg'
import { useNavigate } from 'react-router-dom'

import personalData from '@/assets/crypto/personal-data.png'
import thirdPartyPata from '@/assets/crypto/third-party-data.png'
import typprofessionalSubmission from '@/assets/crypto/professional-submission.png'

const Index = () => {
  const navigate = useNavigate()

  return (
    <div>
      <div className="mb-3 flex flex-1 items-center justify-between">
        <div className="flex">
          <div className="text-lg font-bold text-white/80">Submission</div>
        </div>
        <div onClick={() => navigate(`/app/crypto/submission/history`)} className="flex cursor-pointer items-center">
          <div className="text-xs font-normal text-white/80">History</div>
          <AngleRight size={14} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div onClick={() => navigate(`/app/crypto/submission/submit?category=personal-data`)} className="h-full">
          <div className="flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-transparent bg-[#252532] transition-all hover:border-primary hover:shadow-primary">
            <div className="p-4 pb-3">
              <div className="w-full overflow-hidden rounded-xl">
                <div className="top-0 flex size-full items-center justify-center overflow-hidden bg-[#1A1A24]">
                  <img className="max-h-full max-w-full object-contain" src={personalData} alt="" />
                </div>
              </div>

              <div className="mt-3">
                <div className="font-semibold">Personal Data</div>
                <div className="mt-3 inline-block h-[26px] flex-none rounded-2xl bg-primary/20 px-2 py-[2px] text-primary">
                  <span>&gt;50 Points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div onClick={() => navigate(`/app/crypto/submission/submit?category=third-party-data`)} className="h-full">
          <div className="flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-transparent bg-[#252532] transition-all hover:border-primary hover:shadow-primary">
            <div className="p-4 pb-3">
              <div className="w-full overflow-hidden rounded-xl">
                <div className="top-0 flex size-full items-center justify-center overflow-hidden bg-[#1A1A24]">
                  <img className="max-h-full max-w-full object-contain" src={thirdPartyPata} alt="" />
                </div>
              </div>
              <div className="mt-3">
                <div className="font-semibold">Third Party Data</div>
                <div className="mt-3 inline-block h-[26px] flex-none rounded-2xl bg-primary/20 px-2 py-[2px] text-primary">
                  <span>&gt;50 Points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div onClick={() => navigate(`/app/crypto/bounty`)} className="h-full">
          <div className="flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-transparent bg-[#252532] transition-all hover:border-primary hover:shadow-primary">
            <div className="p-4 pb-3">
              <div className="w-full overflow-hidden rounded-xl">
                <div className="top-0 flex size-full items-center justify-center overflow-hidden bg-[#1A1A24]">
                  <img className="max-h-full max-w-full object-contain" src={typprofessionalSubmission} alt="" />
                </div>
              </div>
              <div className="mt-3">
                <div className="font-semibold">Professional Submission</div>
                <div className="mt-3 inline-block h-[26px] flex-none rounded-2xl bg-primary/20 px-2 py-[2px] text-primary">
                  <span>&gt;3500 Points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
