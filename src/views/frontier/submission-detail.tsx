import frontiterApi, { SubmissionRecord } from '@/apis/frontiter.api'
import TransitionEffect from '@/components/common/transition-effect'
import { cn } from '@udecode/cn'
import { message, Spin } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import LogoWhiteSvgImage from '@/assets/common/logo-white.svg'

const resultColorMap = new Map<string, string>([
  ['S', 'bg-[#E7B231]'],
  ['A', 'bg-[#54F0B7]'],
  ['B', 'bg-[#5CB0FF]'],
  ['C', 'bg-[#F0A254]'],
  ['D', 'bg-[#F07354]']
])

function PageHeader() {
  return (
    <div className="flex h-[84px] items-center justify-between border-b border-white/10 px-6 py-4">
      <div className="flex w-[80px] cursor-pointer items-center gap-2 text-white"></div>
      <object data={LogoWhiteSvgImage} type="image/svg+xml" className="h-8"></object>
      <div className="flex w-[80px] items-center justify-end"></div>
    </div>
  )
}

function SubmissionPropItem(props: { label: string; value: string | React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-[140px] text-sm text-white/50">{props.label}</span>
      <span className="flex-1 text-sm">{props.value}</span>
    </div>
  )
}

function SubmissionQuality(props: { submission: SubmissionRecord | undefined }) {
  const { submission } = props
  const bgcolor = useMemo(() => {
    if (!submission) return ''
    return resultColorMap.get(submission.rating_name)
  }, [submission])

  return (
    <div className={cn('flex size-8 items-center justify-center rounded-full font-bold text-black', bgcolor)}>
      {submission?.rating_name}
    </div>
  )
}

function SubmissionReward(props: { submission: SubmissionRecord | undefined }) {
  const { submission } = props
  const reward = submission?.rewards || []
  return (
    <div className="flex items-center gap-4">
      {reward.map((item) => {
        return (
          <span key={item.reward_type}>
            {item.reward_amount} {item.reward_type}
          </span>
        )
      })}
    </div>
  )
}

function SubmissionBasicInfo(props: { submission: SubmissionRecord | undefined }) {
  const { submission } = props
  const submissionDate = submission?.submission_time
    ? dayjs(submission.submission_time * 1000).format('YYYY-MM-DD HH:mm:ss')
    : ''

  return (
    <div>
      <h2 className="mb-3 text-base font-bold">Basic Information</h2>
      <div className="flex flex-col gap-4 rounded-xl bg-[#252532] p-6">
        <SubmissionPropItem label="Submission ID:" value={submission?.submission_id || ''} />
        <SubmissionPropItem label="Frontier:" value={submission?.frontier_name ?? ''} />
        <SubmissionPropItem label="Task:" value={submission?.task_name ?? ''} />
        <SubmissionPropItem label="Status:" value={submission?.status ?? ''} />
        <SubmissionPropItem label="Quality:" value={<SubmissionQuality submission={submission} />} />
        <SubmissionPropItem label="Reward:" value={<SubmissionReward submission={submission} />} />
        <SubmissionPropItem label="Date:" value={submissionDate} />
      </div>
    </div>
  )
}

function SubmissionData(props: { submission: SubmissionRecord | undefined }) {
  const { submission } = props
  return (
    <div>
      <h2 className="mb-3 text-base font-bold">Submission Data (JSON)</h2>
      <div className="flex flex-col gap-4 rounded-xl bg-[#252532] p-6">
        {submission?.data_submission ? (
          <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-[#1a1a24] p-4 text-white">
            {JSON.stringify(submission.data_submission, null, 2)}
          </pre>
        ) : (
          <span className="text-white/60">No submission data available.</span>
        )}
      </div>
    </div>
  )
}

export default function SubmissionDetail() {
  const [submissionDetail, setSubmissionDetail] = useState<SubmissionRecord>()
  const [loading, setLoading] = useState(false)

  const { submission_id } = useParams()

  async function getSubmissionDetail(submission_id: string) {
    try {
      setLoading(true)
      const res = await frontiterApi.getSubmissionDetail(submission_id)
      setSubmissionDetail(res.data)
    } catch (err) {
      message.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSubmissionDetail(submission_id as string)
  }, [submission_id])

  return (
    <TransitionEffect className="mx-auto flex min-h-screen flex-col">
      <PageHeader></PageHeader>
      <div className="mx-auto mt-4 w-full max-w-[1232px] p-6">
        <h1 className="mb-6 text-2xl font-bold">Submission Detail</h1>
        <Spin spinning={loading}>
          <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2">
            <SubmissionBasicInfo submission={submissionDetail} />
            <SubmissionData submission={submissionDetail} />
          </div>
        </Spin>
      </div>
    </TransitionEffect>
  )
}
