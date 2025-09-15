import { message, Modal, Spin } from 'antd'
import { cn } from '@udecode/cn'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import AuthChecker from '@/components/app/auth-checker'
import Header from '@/components/frontier/high-quality-user/v2/header'
import Task from '@/components/frontier/high-quality-user/v2/task-1'
import TaskComplete from '@/components/frontier/high-quality-user/v2/task-complete'

import { useIsMobile } from '@/hooks/use-is-mobile'
import boosterApi from '@/apis/booster.api'

export default function HighQualityUserV2Task1({ templateId }: { templateId: string }) {
  const { questId = '' } = useParams()
  const isMobile = useIsMobile()
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)

  const [view, setView] = useState<'task-form' | 'task-complete'>('task-form')

  const handleSubmit = async (formData: unknown): Promise<boolean> => {
    try {
      const res = await boosterApi.submitTask(questId!, JSON.stringify(formData))
      if (res.data?.status === 1) {
        setView('task-complete')
      } else {
        message.error(res.data?.info || 'Failed to submit!')
      }
    } catch (error) {
      message.error(error.message ? error.message : 'Failed to submit!')
      return false
    }
    return true
  }

  const checkTaskStatus = useCallback(async () => {
    if (!questId || !templateId) {
      message.error('Task ID or template ID is required!')
      return
    }

    setIsPageLoading(true)

    try {
      const taskInfo = await boosterApi.getTaskInfo(questId!)
      if (taskInfo.data?.status === 2) {
        setView('task-complete')
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
  }, [questId, templateId])

  useEffect(() => {
    checkTaskStatus()
  }, [checkTaskStatus])

  return (
    <AuthChecker>
      <Spin spinning={isPageLoading} className="min-h-screen">
        {view === 'task-complete' ? (
          <TaskComplete title="Join in Codatta Webapp" />
        ) : (
          <div className="relative min-h-screen overflow-hidden md:pb-12">
            <Header title="Join in Codatta Webapp" />
            <div
              className={cn(
                'mx-auto max-w-[600px] px-6 pb-6 text-sm leading-[22px] text-white md:mt-[80px] md:rounded-2xl md:bg-[#252532] md:px-10 md:py-[48px] md:pb-12'
              )}
            >
              <Task onNext={handleSubmit} isMobile={isMobile} />
            </div>
          </div>
        )}
      </Spin>
    </AuthChecker>
  )
}

// http://localhost:5175/frontier/project/HIGH_QUALITY_USER_TASK1/task-12-email-quiz
