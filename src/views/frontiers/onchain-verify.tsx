import { useEffect, useState } from 'react'
import { message, Spin } from 'antd'
import { useParams } from 'react-router-dom'

import AuthChecker from '@/components/app/auth-checker'
import ValidationForm from '@/components/frontier/onchain-verify/validation-form'
import TaskSelect from '@/components/frontier/onchain-verify/task-select'
import TaskDataVerify from '@/components/frontier/onchain-verify/task-data-verify'
import NoSubmit from '@/components/frontier/onchain-verify/no-submit'
import TaskComplete from '@/components/frontier/onchain-verify/task-complete'

import frontiterApi, { TaskDetail } from '@/apis/frontiter.api'
import boosterApi from '@/apis/booster.api'

type TStep = 'task-select' | 'data-submit' | 'data-verify' | 'no-submit' | 'task-complete'

// 0 Not started, 1 In progress, 2 Completed, 3 Failed, 4 Cancelled
// type TOnChainStatus = 0 | 1 | 2 | 3 | 4

export interface ValidationFormData {
  jsonData: string
  quality: 'S' | 'A' | 'B' | 'C' | 'D'
  address: string
  submissionId: string
}

export default function (_props: { templateId: string }) {
  const [step, setStep] = useState<TStep>()
  const [loading, setLoading] = useState(false)
  const { taskId, questId } = useParams()
  const [taskData, setTaskData] = useState<TaskDetail>()
  const [verifyData, setVerifyData] = useState<ValidationFormData>()

  async function getTaskData(taskId: string) {
    setLoading(true)
    try {
      const [submissionData, taskInfo] = await Promise.all([
        frontiterApi.getSubmissionList({
          task_ids: taskId,
          page_num: 1,
          page_size: 5
        }),
        boosterApi.getTaskInfo(questId!)
      ])

      if (taskInfo.data?.status === 2) {
        setStep('task-complete')
      } else {
        const onChainedTask = submissionData.data.find((item) => item.chain_status == 2)
        if (!onChainedTask) {
          setStep('no-submit')
        } else {
          setTaskData(onChainedTask)
          setStep('task-select')
        }
      }
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!taskId) return
    getTaskData(taskId)
  }, [taskId])

  return (
    <AuthChecker>
      <Spin spinning={loading}>
        <div className="min-h-screen">
          {step === 'task-select' && <TaskSelect taskData={taskData!} onSelect={() => setStep('data-submit')} />}
          {step === 'data-submit' && (
            <ValidationForm
              submissionId={taskData!.submission_id}
              onVerify={(data) => {
                setVerifyData(data)
                setStep('data-verify')
              }}
              onBack={() => setStep('task-select')}
            />
          )}
          {step === 'data-verify' && (
            <TaskDataVerify verifyData={verifyData!} taskKey={questId!} onBack={() => setStep('data-submit')} />
          )}
          {step === 'no-submit' && <NoSubmit />}
          {step === 'task-complete' && <TaskComplete title="On-chain Verify" />}
        </div>
      </Spin>
    </AuthChecker>
  )
}
