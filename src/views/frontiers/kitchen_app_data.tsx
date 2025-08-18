import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Spin, message, Modal } from 'antd'
import { ArrowLeft } from 'lucide-react'

import AuthChecker from '@/components/app/auth-checker'
import Result from '@/components/frontier/kitchen/result'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'
import Form from '@/components/frontier/kitchen/form'

import { useIsMobile } from '@/hooks/use-is-mobile'
import frontiterApi from '@/apis/frontiter.api'

import { FormData, ResultType } from '@/components/frontier/kitchen/types'

async function getLastSubmission(frontierId: string, taskIds: string) {
  const res = await frontiterApi.getSubmissionList({
    page_num: 1,
    page_size: 1,
    frontier_id: frontierId,
    task_ids: taskIds
  })
  const lastSubmission = res.data[0]
  return lastSubmission
}

export default function KitchenAppData({ templateId }: { templateId: string }) {
  const { taskId, questId = '' } = useParams()
  const isMobile = useIsMobile()
  const isBnb = questId.toLocaleUpperCase().includes('TASK')

  const [rewardPoints, setRewardPoints] = useState(0)
  const [pageLoading, setPageLoading] = useState(false)
  const [resultType, setResultType] = useState<'ADOPT' | 'PENDING' | 'REJECT' | null>(null)

  const handleResultStatus = (status: string = '') => {
    status = status.toLocaleUpperCase()
    if (['PENDING', 'SUBMITTED'].includes(status)) {
      setResultType('PENDING')
    } else if (status === 'REFUSED') {
      setResultType('REJECT')
    } else if (status === 'ADOPT') {
      setResultType('ADOPT')
    }
  }

  useEffect(() => {
    console.log('questId', questId)
  }, [questId])

  const onSubmit = async (formData: FormData): Promise<boolean> => {
    try {
      const res = await frontiterApi.submitTask(taskId!, {
        templateId: templateId,
        taskId: taskId,
        data: Object.assign({ source: isBnb ? 'binance' : 'codatta' }, formData)
      })

      const resultData = res.data as unknown as {
        status: ResultType
      }

      message.success('Submitted successfully!').then(() => {
        handleResultStatus(resultData?.status)
      })
    } catch (error) {
      message.error(error.message ? error.message : 'Failed to submit!')
      return false
    }
    return true
  }

  const onSubmitAgain = () => {
    setResultType(null)
  }

  const checkTaskStatus = useCallback(async () => {
    if (!taskId || !templateId) {
      message.error('Task ID or template ID is required!')
      return
    }

    setPageLoading(true)

    try {
      const taskDetail = await frontiterApi.getTaskDetail(taskId!)
      if (taskDetail.data.data_display.template_id !== templateId) {
        message.error('Template not match!')
        return
      }

      if (isBnb) {
        const lastSubmission = await getLastSubmission(taskDetail.data.frontier_id, taskId!)
        handleResultStatus(lastSubmission?.status)
      } else {
        const totalRewards = taskDetail.data.reward_info
          .filter((item) => {
            return item.reward_mode === 'REGULAR' && item.reward_type === 'POINTS'
          })
          .reduce((acc, cur) => {
            return acc + cur.reward_value
          }, 0)

        setRewardPoints(totalRewards)
      }
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: error.message ? error.message : 'Failed to get task detail!',
        okText: 'Try Again',
        className: '[&_.ant-btn]:!bg-[#875DFF]',
        onOk: () => {
          checkTaskStatus()
        }
      })
    } finally {
      setPageLoading(false)
    }
  }, [taskId, templateId, isBnb])

  const onBack = () => {
    window.history.back()
  }

  useEffect(() => {
    checkTaskStatus()
  }, [checkTaskStatus])

  return (
    <AuthChecker>
      <Spin spinning={pageLoading} className="min-h-screen">
        <div className="mx-auto min-h-screen max-w-[1272px] px-6 py-3 md:py-8">
          <h1 className="flex items-center justify-between text-center text-base font-bold">
            {!isMobile ? (
              <div className="flex cursor-pointer items-center gap-2 text-sm font-normal text-[white]" onClick={onBack}>
                <ArrowLeft size={18} /> Back
              </div>
            ) : (
              <span></span>
            )}
            Submit Application Data
            <span></span>
          </h1>
          {resultType ? (
            isBnb ? (
              <Result type={resultType} onSubmitAgain={onSubmitAgain} />
            ) : (
              <SubmitSuccessModal points={rewardPoints} open={true} onClose={() => window.history.back()} />
            )
          ) : (
            <Form onSubmit={onSubmit} isMobile={isMobile} />
          )}
        </div>
      </Spin>
    </AuthChecker>
  )
}

// http://localhost:5175/frontier/project/KITCHEN_TPL_W9/8296052588300109940/task-9-kitchen1time

// for week 9
