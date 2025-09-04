import frontiterApi, { SubmissionRecord, TaskDetail } from '@/apis/frontiter.api'
import { Button, message, Spin } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import PageHeader from './page-header'

export default function TaskSelect(props: { taskData: TaskDetail; onSelect: () => void }) {
  const { taskData } = props
  const [submission, setSubmission] = useState<SubmissionRecord>()
  const [loading, setLoading] = useState(false)

  const JSONData = useMemo(() => {
    const jsonData = submission?.data_submission?.data as { images: { url?: string; hash: string }[] }
    jsonData?.images.forEach((item) => {
      delete item.url
    })
    return JSON.stringify(jsonData, null, 2)
  }, [submission])

  async function getSubmissionDetail(submissionId: string) {
    setLoading(true)
    try {
      const res = await frontiterApi.getSubmissionDetail(submissionId)
      setSubmission(res.data)
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!taskData?.submission_id) return
    getSubmissionDetail(taskData.submission_id)
  }, [taskData])

  function handleCopyAndVerify() {
    navigator.clipboard.writeText(JSONData)
    message.success('Copied JSON to clipboard')
    props.onSelect()
  }

  return (
    <>
      <PageHeader title="Submission Data to be Verified" />

      <div className="px-4 pb-10">
        <div className="mb-4 flex flex-col gap-2 rounded-xl bg-[#252532] p-4">
          <h2 className="hidden text-sm font-bold text-white">Submission info</h2>
          <div>
            <h3 className="mb-1 font-bold">Submission ID</h3>
            <p className="text-[#BBBBBE]">{taskData.submission_id}</p>
          </div>

          <div>
            <h3 className="mb-1 font-bold">Time</h3>
            <p className="text-[#BBBBBE]">{dayjs(taskData.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</p>
          </div>

          <div>
            <h3 className="mb-1 font-bold">Frontier</h3>
            <p className="text-[#BBBBBE]">Food Science</p>
          </div>
          <div>
            <h3 className="mb-1 font-bold">Quality</h3>
            <p className="text-[#BBBBBE]">{taskData.result}</p>
          </div>
        </div>
        <div className="mb-4 flex flex-col gap-2 rounded-xl bg-[#252532] p-4">
          <h2 className="text-base font-bold">JSON</h2>
          <Spin spinning={loading}>
            <pre className="overflow-x-auto whitespace-pre rounded-lg bg-[#1C1C26] p-4 text-xs text-white">
              {JSONData}
            </pre>
          </Spin>
          <p className="text-sm leading-6 text-[#BBBBBE]">
            This is the standardized raw payload generated from your submission data. You’ll use it to compute your
            local fingerprint and match it against the on-chain fingerprint record. Please copy and use the payload JSON
            exactly as it is — do not modify it.
          </p>
        </div>
        <Button
          type="primary"
          block
          shape="round"
          size="large"
          className="font-bold"
          disabled={loading}
          onClick={handleCopyAndVerify}
        >
          Copy JSON and Verify
        </Button>
      </div>
    </>
  )
}
