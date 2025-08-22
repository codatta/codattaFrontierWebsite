import { Button, message, Modal } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { Copy, Info } from 'lucide-react'

import InfoIcon from '@/assets/frontier/fate/info-icon.svg?react'
import TimeIcon from '@/assets/frontier/fate/time-icon.svg?react'
import SuccessIcon from '@/assets/frontier/fate/success-icon.svg?react'

import Markdown from '@/components/common/markdown'

import { usePositiveTimer } from '@/hooks/usePositiveTimer'
import frontiterApi from '@/apis/frontiter.api'
import { userStoreActions, useUserStore } from '@/stores/user.store'

export default function SubmissionSuccessModal(props: {
  open: boolean
  onClose: () => void
  submission_id: string
  historyReport: string
}) {
  const { open, onClose, submission_id, historyReport } = props
  // check the status of the report
  const [status, setStatus] = useState<'get' | 'wait' | 'view'>('get')
  const [report, setReport] = useState<string>('')

  const onCreateReport = async () => {
    setStatus('wait')
    const res = await frontiterApi.getSubmissionLifeLogReport(submission_id!)
    const report = res.data?.content
    if (report) {
      setReport(report)
      setStatus('view')
    }
  }

  useEffect(() => {
    if (historyReport) {
      setReport(historyReport)
      setStatus('view')
    }
  }, [historyReport])

  return (
    <Modal open={open} onCancel={onClose} footer={null} centered className="max-w-[600px]">
      <div className="text-white">
        {status === 'get' ? <GetReport onClose={onClose} onCreateReport={onCreateReport} /> : null}
        {status === 'wait' ? <WaitReport onClose={onClose} /> : null}
        {status === 'view' ? <ViewReport onClose={onClose} report={report ?? ''} /> : null}
      </div>
    </Modal>
  )
}

function GetReport({ onClose, onCreateReport }: { onClose: () => void; onCreateReport: () => Promise<void> }) {
  const { points } = useUserStore()
  const remainingPoints = useMemo(() => (parseInt(points, 10) || 0) - 50, [points])
  const isPointsEnough = useMemo(() => remainingPoints >= 0, [remainingPoints])
  const [loading, setLoading] = useState(false)

  const getUserInfo = async () => {
    setLoading(true)
    try {
      await userStoreActions.getUserInfo()
    } catch (error) {
      message.error(error.message ? error.message : 'Failed to get user info')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateReport = async () => {
    if ((parseInt(points, 10) || 0) < 50) {
      message.error('You do not have enough points to redeem')
      return
    }
    await onCreateReport()
  }

  useEffect(() => {
    if (points === '' || parseInt(points, 10) < 50) {
      getUserInfo()
    }
  }, [points])

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
          <span className={!isPointsEnough ? 'text-[#D92B2B]' : ''}>{parseInt(points, 10) || 0}</span>
        </p>
        <p className="flex items-center justify-between text-base">
          <span>Remaining</span>
          {!isPointsEnough ? (
            <span className="flex items-center text-[#D92B2B]">
              <Info className="mr-2 size-6 rotate-180" />
              Insufficient points
            </span>
          ) : (
            <span>{remainingPoints}</span>
          )}
        </p>
      </div>
      <div className="mt-12 flex items-center justify-center gap-4">
        <Button type="text" shape="round" size="large" onClick={onClose} className="w-[120px]">
          Later
        </Button>
        <Button
          type="primary"
          shape="round"
          size="large"
          onClick={handleCreateReport}
          className={isPointsEnough ? 'w-[120px]' : 'w-[120px] opacity-50'}
          disabled={loading}
          loading={loading}
        >
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
        <Button type="primary" shape="round" size="large" className="w-[120px]" disabled={true}>
          Confirm
        </Button>
      </div>
    </div>
  )
}

function ViewReport({ onClose, report }: { onClose: () => void; report: string }) {
  const [showReport, setShowReport] = useState(false)

  const handleCopy = () => {
    navigator.clipboard
      .writeText(report)
      .then(() => {
        message.success('Report copied to clipboard!')
      })
      .catch((err) => {
        message.error('Failed to copy report.')
        console.error('Failed to copy: ', err)
      })
  }

  return showReport ? (
    <div className="flex min-h-[calc(100vh-200px)] flex-col">
      <div className="mt-4 flex items-center justify-center gap-2">
        <h3 className="text-2xl font-bold leading-7">Report</h3>
        <Button type="text" icon={<Copy className="size-4 text-gray-400" />} onClick={handleCopy} />
      </div>

      <div className="mt-4 flex-1 rounded-xl bg-[#00000052] px-4 py-3">
        <div className="max-h-[calc(100vh-300px)] overflow-y-scroll">
          <Markdown>{report}</Markdown>
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center text-white">
      <SuccessIcon className="mx-auto size-[120px]" />
      <h3 className="mt-4 text-center text-2xl font-bold leading-7">Report Generated Successfully!</h3>
      <p className="mt-4 text-base text-[#BBBBBE]">
        This AI-generated report is for entertainment purposes only and does not constitute investment advice.
      </p>

      <div className="mt-12 flex items-center justify-center gap-4">
        <Button type="text" shape="round" size="large" onClick={onClose} className="w-[120px]">
          Later
        </Button>
        <Button type="primary" shape="round" size="large" onClick={() => setShowReport(true)} className="w-[120px]">
          View Now
        </Button>
      </div>
    </div>
  )
}
