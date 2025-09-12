import ApprovedIcon from '@/assets/frontier/crypto/approved-icon.svg?react'
import PendingIcon from '@/assets/frontier/crypto/pending-icon.svg?react'
import RejectIcon from '@/assets/frontier/crypto/reject-icon.svg?react'

import { ResultType } from './types'

import { Button } from '@/components/booster/button'

interface IconProps {
  className?: string
}

interface ResultMap {
  Icon: React.ComponentType<IconProps>
  title: JSX.Element
  description: JSX.Element
  extra?: JSX.Element
}

const ResultMap: Record<ResultType, ResultMap> = {
  ADOPT: {
    Icon: ApprovedIcon,
    title: <div>🎉 Submission Successful!</div>,
    description: <>To receive your reward, please verify the task on the Binance Wallet campaign page.</>,
    extra: (
      <div className="mt-6 rounded-xl bg-[#252532] p-4 text-base font-bold">
        Earn more $XNY tokens by joining exclusive campaigns on our desktop site:{' '}
        <a target="_blank" href="https://app.codatta.io" rel="noreferrer" className="font-normal text-[#875DFF]">
          https://app.codatta.io
        </a>
      </div>
    )
  },
  PENDING: {
    Icon: PendingIcon,
    title: <div className="text-[#FFA800]">Under Review</div>,
    description: <>Your submission is being reviewed. Please wait patiently for the results.</>
  },
  REJECT: {
    Icon: RejectIcon,
    title: <div className="text-[#D92B2B]">Audit Failed</div>,
    description: (
      <>Unfortunately, your submission did not pass our audit. Please review the requirements and resubmit.</>
    )
  }
}

export default function Result({ type = 'ADOPT', onSubmitAgain }: { type: ResultType; onSubmitAgain: () => void }) {
  return <MobileView type={type} onSubmitAgain={onSubmitAgain} />
}

function MobileView({ type, onSubmitAgain }: { type: ResultType; onSubmitAgain: () => void }) {
  const result = ResultMap[type]
  return (
    <div className="text-center">
      <result.Icon className="mx-auto mt-[80px] block" />
      <h2 className="mt-8 text-2xl font-bold">{result.title}</h2>
      <p className="mt-6 text-base text-[#BBBBBE]">{result.description}</p>
      {result.extra}
      {type === 'REJECT' ? (
        <Button className="mt-6 min-w-[120px] bg-white !px-6 text-black" onClick={onSubmitAgain} text="Submit Again" />
      ) : null}
    </div>
  )
}
