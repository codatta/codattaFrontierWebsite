import { useParams } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { cn } from '@udecode/cn'
import { message, Modal, Spin } from 'antd'

import AuthChecker from '@/components/app/auth-checker'
import Header from '@/components/frontier/high-quality-user/header'
import Access from '@/components/frontier/high-quality-user/access'
import Task1 from '@/components/frontier/high-quality-user/task-1'
import TaskRead from '@/components/frontier/high-quality-user/task-read'
import Task2 from '@/components/frontier/high-quality-user/task-2'
import Result from '@/components/frontier/high-quality-user/result'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'

import type { ResultType } from '@/components/frontier/high-quality-user/types'

import { useIsMobile } from '@/hooks/use-is-mobile'
import frontiterApi from '@/apis/frontiter.api'
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

export default function HighQualityUser({ templateId }: { templateId: string }) {
  const { taskId, questId } = useParams()
  const isMobile = useIsMobile()
  const isBnb = questId?.toLocaleUpperCase().includes('TASK')

  const [rewardPoints, setRewardPoints] = useState(0)
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true)
  const [isSubmited, setIsSubmited] = useState<boolean>(false)
  const [isHighQualityUser, setIsHighQualityUser] = useState<boolean>(false)
  const [viewType, setViewType] = useState<'ACCESS' | 'TASK1' | 'TASK_READ' | 'TASK2'>('TASK2')
  const [resultType, setResultType] = useState<'ADOPT' | 'PENDING' | 'REJECT' | null>(null)
  const title = useMemo(() => {
    if (viewType === 'ACCESS') return isHighQualityUser ? ' Access Granted' : 'Access Denied'
    if (viewType === 'TASK1') return 'Join Exclusive Telegram Group'
    return 'Model Comparison Challenge'
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
        setIsSubmited(true)
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
  }, [taskId, templateId, isBnb])

  const onBack = () => {
    window.history.back()
  }

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
              viewType === 'TASK2' && 'md:bg-transparent'
            )}
          >
            {resultType &&
              (isBnb || isSubmited ? (
                <Result type={resultType} onSubmitAgain={onSubmitAgain} />
              ) : (
                <SubmitSuccessModal points={rewardPoints} open={true} onClose={onBack} />
              ))}
            {!resultType && (
              <>
                {viewType === 'ACCESS' && <Access isGranted={isHighQualityUser} onNext={() => setViewType('TASK1')} />}
                {viewType === 'TASK1' && <Task1 onNext={() => setViewType('TASK_READ')} isMobile={isMobile} />}
                {viewType === 'TASK_READ' && <TaskRead onNext={() => setViewType('TASK2')} />}
                {viewType === 'TASK2' && <Task2 onNext={handleSubmit} isMobile={isMobile} />}
              </>
            )}
          </div>
        </div>
      </Spin>
    </AuthChecker>
  )
}
