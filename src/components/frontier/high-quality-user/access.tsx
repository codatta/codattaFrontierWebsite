import DeniedIcon from '@/assets/frontier/high-quality-user/denied-icon.svg?react'
import GrantedIcon from '@/assets/frontier/high-quality-user/granted-icon.svg?react'
import grantedBg from '@/assets/frontier/high-quality-user/granted-bg.png'

import { Button } from 'antd'

export default function Access({ isGranted, onNext }: { isGranted: boolean; onNext: () => void }) {
  return isGranted ? <AccessGranted onStart={onNext} /> : <AccessDenied />
}

function AccessDenied() {
  return (
    <>
      <DeniedIcon className="mx-auto mt-[60px] block size-[120px] md:mt-0" />
      <h2 className="mt-8 text-center text-2xl font-bold">We appreciate your interest!</h2>
      <p className="mt-3 text-center text-base text-[#BBBBBE]">
        Access to this task is by invitation only, based on special contribution criteria.
      </p>
      <div className="mt-3 rounded-xl bg-[#252532] p-4 pt-3 md:border md:border-[#FFFFFF1F]">
        <div className="mx-auto w-[65px] rounded-full bg-[#FFFFFF29] px-2 text-center">Reason</div>
        <p className="mt-2 text-[#BBBBBE] md:mt-4">
          Your background information and skill assessment from the previous two weeks currently do not meet our
          criteria, or you have not participated in the Annotator Information Survey or the Annotator Knowledge Test
          during previous Codatta booster campaigns.
        </p>
      </div>
    </>
  )
}

function AccessGranted({ onStart }: { onStart: () => void }) {
  const reasons = [
    'Your performance in the background check and skill assessment over the past two weeks has shown great potential to become a High-Quality User.',
    'We encourage you to value this opportunity and please provide your answers carefully.'
  ]
  return (
    <>
      <div className="absolute left-0 top-0 h-0 w-full">
        <img src={grantedBg} className="h-auto w-full" />
      </div>
      <div className="relative">
        <GrantedIcon className="mx-auto mt-[60px] block size-[120px] md:mt-0" />
        <h2 className="mt-8 text-center text-2xl font-bold">🎊 Congratulations!</h2>
        <p className="mt-3 text-center text-base text-[#BBBBBE]">
          You have been granted exclusive access to our high-value tasks.
        </p>
        <div className="mt-3 rounded-xl bg-[#252532] p-4 pt-3 text-[#BBBBBE] md:border md:border-[#FFFFFF1F]">
          <div className="mx-auto w-[65px] rounded-full bg-[#875DFF3D] px-2 text-center text-[#875DFF]">Reason</div>
          <ul className="mt-2 list-outside list-disc pl-4 md:mt-4">
            {reasons.map((reason, index) => (
              <li key={'reason-' + index}>{reason}</li>
            ))}
          </ul>
        </div>
        <Button
          type="primary"
          className="mt-8 block h-[44px] w-full rounded-full text-base font-bold md:mx-auto md:mt-12 md:h-[40px] md:w-[240px] md:text-sm md:font-normal"
          onClick={onStart}
        >
          Start
        </Button>
      </div>
    </>
  )
}
