import { Modal } from 'antd'
import { useNavigate } from 'react-router-dom'

import ApprovedIcon from '@/assets/frontier/crypto/approved-icon.svg?react'
import PendingIcon from '@/assets/frontier/crypto/pending-icon.svg?react'
import RejectIcon from '@/assets/frontier/crypto/reject-icon.svg?react'
import ApprovedIconPc from '@/assets/frontier/crypto/pc-approved-icon.svg?react'
import PendingIconPc from '@/assets/frontier/crypto/pc-pending-icon.svg?react'
import RejectIconPc from '@/assets/frontier/crypto/pc-reject-icon.svg?react'

import { useIsMobile } from '@/hooks/use-is-mobile'
import { ResultType } from './types'

import { Button } from '@/components/booster/button'

interface IconProps {
  className?: string
}

interface ResultMap {
  Icon: React.ComponentType<IconProps>
  title: JSX.Element
  description: JSX.Element
}

const mobileResultMap: Record<ResultType, ResultMap> = {
  ADOPT: {
    Icon: ApprovedIcon,
    title: <div>Submission Successful!</div>,
    description: (
      <>
        Your data has been successfully verified and added to our platform. Thank you for contributing to the Codatta
        ecosystem!
        <a href="https://app.codatta.io/app" target="_blank" rel="noopener noreferrer" className="block text-[#875DFF]">
          app.codatta.io/app
        </a>
      </>
    )
  },
  PENDING: {
    Icon: PendingIcon,
    title: <div className="text-[#FFA800]">Under Review</div>,
    description: (
      <>
        We’ve received your submission — it’s currently under review by the Codatta system. We’re verifying the details
        you provided. This usually takes 10 to 30 minutes. Please check back later to see your review status.
      </>
    )
  },
  REJECT: {
    Icon: RejectIcon,
    title: <div className="text-[#D92B2B]">Audit Failed</div>,
    description: (
      <>Unfortunately, your submission didn’t pass the review. Please double-check your information and try again.</>
    )
  }
}

const desktopResultMap: Record<ResultType, ResultMap> = {
  ADOPT: {
    Icon: ApprovedIconPc,
    title: <div>Submission successful</div>,
    description: (
      <>
        Your data has been successfully verified and added to our platform. Thank you for contributing to the Codatta
        ecosystem!
        <a href="https://app.codatta.io/app" target="_blank" rel="noopener noreferrer">
          app.codatta.io/app
        </a>
      </>
    )
  },
  PENDING: {
    Icon: PendingIconPc,
    title: <div className="text-[#FFA800]">Under Review</div>,
    description: (
      <>
        We’ve received your submission — it’s currently under review by the Codatta system. We’re verifying the details
        you provided. This usually takes 10 to 30 minutes. Please check back later to see your review status.
      </>
    )
  },
  REJECT: {
    Icon: RejectIconPc,
    title: <div className="text-[#D92B2B]">Audit Failed</div>,
    description: (
      <>Unfortunately, your submission didn’t pass the review. Please double-check your information and try again.</>
    )
  }
}

export default function Result({ type = 'ADOPT', onSubmitAgain }: { type: ResultType; onSubmitAgain: () => void }) {
  const isMobile = useIsMobile()

  return isMobile ? (
    <MobileView type={type} onSubmitAgain={onSubmitAgain} />
  ) : (
    <DesktopView type={type} onSubmitAgain={onSubmitAgain} />
  )
}

function MobileView({ type, onSubmitAgain }: { type: ResultType; onSubmitAgain: () => void }) {
  const result = mobileResultMap[type]
  return (
    <div className="text-center">
      <result.Icon className="mx-auto mt-[80px] block" />
      <h2 className="mt-8 text-2xl font-bold">{result.title}</h2>
      <p className="mt-6 text-base text-[#BBBBBE]">{result.description}</p>
      {type === 'REJECT' ? (
        <Button className="mt-6 min-w-[120px] bg-white !px-6 text-black" onClick={onSubmitAgain} text="Submit Again" />
      ) : null}
    </div>
  )
}

function DesktopView({ type, onSubmitAgain }: { type: ResultType; onSubmitAgain: () => void }) {
  const navigate = useNavigate()
  const result = desktopResultMap[type]

  const onClick = () => {
    if (type === 'REJECT') {
      onSubmitAgain()
    } else {
      navigate(-1)
    }
  }

  return (
    <Modal open={true} footer={null} centered closeIcon={false} className="!w-[400px] !p-6">
      <div className="flex flex-col items-center justify-center py-1 text-center">
        <result.Icon />
        <h2 className="mt-2 text-xl font-bold">{result.title}</h2>
        <p className="mt-2 max-w-lg text-sm text-[#BBBBBE]">{result.description}</p>
        <Button
          className="mt-6 min-w-[120px] !px-6"
          onClick={onClick}
          text={type === 'REJECT' ? 'Submit Again' : 'Got it'}
        />
      </div>
    </Modal>
  )
}
