import ApprovedIcon from '@/assets/frontier/crypto/pc-approved-icon.svg?react'
import PendingIcon from '@/assets/frontier/crypto/pc-pending-icon.svg?react'
import RejectIcon from '@/assets/frontier/crypto/pc-reject-icon.svg?react'
import resultbg from '@/assets/frontier/fashion-gensmo/result-bg.png'

import { ResultType } from './types'
import { Button, Modal } from 'antd'

interface IconProps {
  className?: string
}

interface ResultMap {
  Icon: React.ComponentType<IconProps>
  title: JSX.Element
  description: JSX.Element
}

const ResultMap: Record<ResultType, ResultMap> = {
  ADOPT: {
    Icon: ApprovedIcon,
    title: <div>Submission Successful</div>,
    description: (
      <>
        The <span className="font-bold text-[#FFA800]">💎5 USDT</span> will be distributed
        <br /> within 3 business days after approval.
      </>
    )
  },
  PENDING: {
    Icon: PendingIcon,
    title: <div className="text-[#FFA800]">Under Review</div>,
    description: (
      <>
        Your submission is being reviewed. <br />
        Please wait patiently for the results.
      </>
    )
  },
  REJECT: {
    Icon: RejectIcon,
    title: <div className="text-[#D92B2B]">Audit Failed</div>,
    description: (
      <>
        Unfortunately, your submission did not pass our audit.
        <br /> Please review the requirements and resubmit.
      </>
    )
  }
}

export default function ResultModel({
  type,
  onSubmitAgain,
  onGotIt
}: {
  type: ResultType
  onSubmitAgain: () => void
  onGotIt: () => void
}) {
  const result = ResultMap[type]

  return (
    <Modal
      open={true}
      footer={null}
      centered
      closeIcon={false}
      className="relative !w-[400px] [&_.ant-modal-content]:rounded-3xl [&_.ant-modal-content]:bg-[#252532]"
    >
      <img src={resultbg} alt="" className="absolute left-0 top-0 w-full" />
      <div className="relative z-10 text-center text-sm leading-[22px]">
        <result.Icon className="mx-auto block size-[72px]" />
        <h2 className="mt-2 text-xl font-bold">{result.title}</h2>
        <p className="mt-2 text-[#BBBBBE]">{result.description}</p>
        {type === 'REJECT' ? (
          <Button className="mt-12 h-[42px] min-w-[120px] rounded-full !px-6" onClick={onSubmitAgain} type="primary">
            Submit Again
          </Button>
        ) : (
          <Button className="mt-12 h-[42px] min-w-[120px] rounded-full !px-6" onClick={onGotIt} type="primary">
            Got It
          </Button>
        )}
      </div>
    </Modal>
  )
}
