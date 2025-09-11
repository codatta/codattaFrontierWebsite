import { message, Modal, Spin } from 'antd'
import { cn } from '@udecode/cn'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import AuthChecker from '@/components/app/auth-checker'
import Header from '@/components/frontier/high-quality-user/v2/header'
import Access from '@/components/frontier/high-quality-user/v2/access'
import Read from '@/components/frontier/high-quality-user/v2/read'
import Task from '@/components/frontier/high-quality-user/v2/task-2'
import Result from '@/components/frontier/high-quality-user/v2/result'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'

import { useIsMobile } from '@/hooks/use-is-mobile'
import frontiterApi from '@/apis/frontiter.api'
import { ResultType } from '@/components/frontier/high-quality-user/v2/types'
import userApi from '@/apis/user.api'

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

export default function HighQualityUserV2Task2({ templateId }: { templateId: string }) {
  const { taskId, questId = '' } = useParams()
  const isBnb = templateId.toLocaleUpperCase().includes('TASK')
  const isMobile = useIsMobile()
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
  const [isHighQualityUser, setIsHighQualityUser] = useState<boolean>(true)
  const [rewardPoints, setRewardPoints] = useState(0)

  const [viewType, setViewType] = useState<'ACCESS' | 'READ' | 'TASK'>('TASK')
  const [resultType, setResultType] = useState<'ADOPT' | 'PENDING' | 'REJECT' | null>(null)

  const title = useMemo(() => {
    if (viewType === 'ACCESS') return isHighQualityUser ? ' Access Granted' : 'Access Denied'
    if (viewType === 'READ') return 'Read & Complete'
    return "Find the AI's Mistake"
  }, [isHighQualityUser, viewType])

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

  function onSubmitAgain() {
    setResultType(null)
  }

  const onBack = () => {
    window.history.back()
  }

  const handleSubmit = async (formData: unknown): Promise<boolean> => {
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

  const checkTaskStatus = useCallback(async () => {
    if (!taskId || !templateId) {
      message.error('Task ID or template ID is required!')
      return
    }

    setIsPageLoading(true)

    try {
      const taskDetail = await frontiterApi.getTaskDetail(taskId!)
      if (taskDetail.data.data_display.template_id !== templateId) {
        message.error('Template not match!')
        return
      }

      const totalRewards = taskDetail.data.reward_info
        .filter((item) => {
          return item.reward_mode === 'REGULAR' && item.reward_type === 'POINTS'
        })
        .reduce((acc, cur) => {
          return acc + cur.reward_value
        }, 0)

      setRewardPoints(totalRewards)

      const lastSubmission = await getLastSubmission(taskDetail.data.frontier_id, taskId!)

      if (!lastSubmission) {
        const isHighQualityUser = await userApi.isHighQualityUser()
        setIsHighQualityUser(isHighQualityUser)

        setViewType('ACCESS')
      } else {
        handleResultStatus(lastSubmission?.status)
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
      setIsPageLoading(false)
    }
  }, [taskId, templateId, setViewType])

  useEffect(() => {
    checkTaskStatus()
  }, [checkTaskStatus])

  return (
    <AuthChecker>
      <Spin spinning={isPageLoading} className="min-h-screen">
        <div className="relative min-h-screen overflow-hidden">
          <Header title={title} />
          <div
            className={cn(
              'mx-auto max-w-[600px] px-6 text-sm leading-[22px] text-white md:max-w-[1272px] md:rounded-2xl md:bg-[#252532] md:px-10 md:pb-12 md:pt-6',
              viewType === 'TASK' && 'md:bg-transparent'
            )}
          >
            {resultType &&
              (isBnb ? (
                <Result type={resultType} onSubmitAgain={onSubmitAgain} />
              ) : (
                <SubmitSuccessModal points={rewardPoints} open={true} onClose={onBack} />
              ))}
            {!resultType && (
              <>
                {viewType === 'ACCESS' && <Access isGranted={isHighQualityUser} onNext={() => setViewType('READ')} />}
                {viewType === 'READ' && <Read onNext={() => setViewType('TASK')} />}
                {viewType === 'TASK' && <Task onNext={handleSubmit} isMobile={isMobile} />}
              </>
            )}
          </div>
        </div>
      </Spin>
    </AuthChecker>
  )
}

// http://localhost:5175/frontier/project/HIGH_QUALITY_USER_TASK2/8503405438200101317/task-12-qualityb1time
