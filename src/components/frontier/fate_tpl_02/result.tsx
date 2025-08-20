import { Button, Modal } from 'antd'

import InfoIcon from '@/assets/frontier/fate/info-icon.svg?react'
import TimeIcon from '@/assets/frontier/fate/time-icon.svg?react'
import SuccessIcon from '@/assets/frontier/fate/success-icon.svg?react'

import { usePositiveTimer } from '@/hooks/usePositiveTimer'
import { useEffect } from 'react'

export default function SubmissionSuccessModal(props: { open: boolean; onClose: () => void }) {
  const { open, onClose } = props

  return (
    <Modal open={open} onCancel={onClose} footer={null} centered className="max-w-[600px]">
      <div className="text-white">
        {/* <GetReport onClose={onClose} /> */}
        <WaitReport onClose={onClose} />
      </div>
    </Modal>
  )
}

function GetReport({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-white">
      <InfoIcon className="mx-auto size-[120px]" />
      <h3 className="mt-4 text-center text-2xl font-bold leading-7">Get Your AI Investment Analysis Report</h3>
      <div className="mt-4 space-y-2 overflow-hidden rounded-xl bg-[#00000052] px-4 py-3 text-base text-[#BBBBBE]">
        <h4 className="font-bold text-white">The report will cover</h4>
        <p>📃 Financial Personality Profile</p>
        <p>💰 Optimal Money-Making Strategies</p>
      </div>
      <div className="mt-4 rounded-xl border border-[#00000052] bg-[#875DFF1F] px-4 py-3">
        <h4 className="mb-2 flex items-center justify-between border-b border-[#FFFFFF1F] pb-2 text-lg font-bold">
          <span>💎️ Redeem points</span>
          <span className="text-[#FFA800]">50</span>
        </h4>
        <p className="flex items-center justify-between text-base">
          <span>Current points</span>
          <span>240</span>
        </p>
        <p className="flex items-center justify-between text-base">
          <span>Remaining</span>
          <span>190</span>
        </p>
      </div>
      <div className="mt-12 flex items-center justify-center gap-4">
        <Button type="text" shape="round" size="large" onClick={onClose} className="w-[120px]">
          Later
        </Button>
        <Button type="primary" shape="round" size="large" onClick={onClose} className="w-[120px]">
          Confirm
        </Button>
      </div>
    </div>
  )
}

function WaitReport({ onClose }: { onClose: () => void }) {
  const { start, seconds } = usePositiveTimer({ timeoutLimit: 6 * 60 })

  useEffect(() => {
    start()
  }, [start])

  useEffect(() => {
    console.log(seconds, seconds)
  }, [seconds])

  return (
    <div className="text-center text-white">
      <TimeIcon className="mx-auto size-[120px]" />
      <h3 className="mt-4 text-center text-2xl font-bold leading-7">Analyzing Your Bazi Chart</h3>
      <p className="mt-4 text-base text-[#BBBBBE]">
        Generating your comprehensive life blueprint analysis... This may take up to a few minutes for complex charts.
      </p>
      <p className="mt-4 text-base text-[#875DFF]">Time elapsed: {seconds}s</p>
      <div className="mt-4 overflow-hidden rounded-xl bg-[#00000052] px-4 py-3 text-center text-sm leading-[22px] text-[#BBBBBE]">
        <p>Our Al is analyzing multiple aspects of your personality including:</p>
        <ul className="flex list-disc flex-col items-center text-[#BBBBBE]">
          <li>Core personality traits and behavioral patterns</li>
          <li>Career strengths and professional development areas</li>
          <li>Personal growth opportunities and life timing</li>
          <li>Relationship style and wellness recommendations</li>
        </ul>
      </div>
      <div className="mt-12 flex items-center justify-center gap-4">
        <Button type="text" shape="round" size="large" onClick={onClose} className="w-[120px]">
          Later
        </Button>
        <Button type="primary" shape="round" size="large" onClick={onClose} className="w-[120px]">
          Confirm
        </Button>
      </div>
    </div>
  )
}
