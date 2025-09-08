import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { cn } from '@udecode/cn'
import { message, Spin } from 'antd'

import AuthChecker from '@/components/app/auth-checker'
import Header from '@/components/frontier/high-quality-user/header'
import Access from '@/components/frontier/high-quality-user/access'
import Task1 from '@/components/frontier/high-quality-user/task-1'
import Task2 from '@/components/frontier/high-quality-user/task-2'
import Form from '@/components/frontier/high-quality-user/form'
import Result from '@/components/frontier/high-quality-user/result'

import type { FormData, ResultType } from '@/components/frontier/high-quality-user/types'

import { useIsMobile } from '@/hooks/use-is-mobile'
import frontiterApi from '@/apis/frontiter.api'
import userApi from '@/apis/user.api'

export default function HighQualityUser({ templateId }: { templateId: string }) {
  const { taskId, questId } = useParams()
  const isMobile = useIsMobile()
  const isBnb = questId?.toLocaleUpperCase().includes('TASK')

  const [isPageLoading, setIsPageLoading] = useState<boolean>(true)
  const [isHighQualityUser, setIsHighQualityUser] = useState<boolean>(false)
  const [viewType, setViewType] = useState<'ACCESS' | 'TASK1' | 'TASK2' | 'FORM'>('FORM')
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

  async function getLastSubmission(frontierId: string) {
    const res = await frontiterApi.getSubmissionList({
      page_num: 1,
      page_size: 1,
      frontier_id: frontierId,
      task_ids: taskId
    })
    const lastSubmission = res.data[0]
    return lastSubmission
  }

  async function checkTaskBasicInfo(taskId: string, templateId: string) {
    const res = await frontiterApi.getTaskDetail(taskId)
    const { data_display } = res.data
    if (data_display.template_id !== templateId) {
      console.log(data_display.template_id, templateId)
      throw new Error('Template not match!')
    }
    return res.data
  }

  function onSubmitAgain() {
    setResultType(null)
  }

  async function checkTaskStatus() {
    setIsPageLoading(true)
    try {
      if (!taskId || !templateId) throw new Error('Task ID or template ID is required!')
      const taskDetail = await checkTaskBasicInfo(taskId, templateId)
      const lastSubmission = await getLastSubmission(taskDetail.frontier_id)

      if (!lastSubmission) {
        const isHighQualityUser = await userApi.isHighQualityUser()
        setIsHighQualityUser(isHighQualityUser)
        setViewType('ACCESS')
        console.log('isHighQualityUser', isHighQualityUser)
      } else {
        handleResultStatus(lastSubmission?.status)
      }
    } catch (err) {
      message.error(err.message)
    }
    setIsPageLoading(false)
  }

  useEffect(() => {
    checkTaskStatus()
  }, [])

  const handleSubmit = async (data: FormData): Promise<boolean> => {
    try {
      const res = await frontiterApi.submitTask(taskId!, {
        templateId: templateId,
        taskId: taskId,
        data: Object.assign(
          { source: isBnb ? 'binance' : 'codatta' },
          {
            question: data.question,
            answer: [
              {
                name: 'chat_gpt_4o',
                images: data.chatGPT4oImage
              },
              {
                name: 'qwen_3',
                images: data.qwen3Image
              }
            ]
          }
        )
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

  console.log(taskId, questId)
  return (
    <AuthChecker>
      <Spin spinning={isPageLoading} className="min-h-screen">
        <div className="relative min-h-screen overflow-hidden">
          <Header title="Join Exclusive Telegram Group" />
          <div
            className={cn(
              'mx-auto max-w-[600px] px-6 text-sm leading-[22px] text-white md:max-w-[1272px] md:rounded-2xl md:bg-[#252532] md:px-10 md:pb-12 md:pt-6',
              viewType === 'FORM' && 'md:bg-transparent'
            )}
          >
            {resultType && <Result type={resultType} onSubmitAgain={onSubmitAgain} />}
            {!resultType && (
              <>
                {viewType === 'ACCESS' && <Access isGranted={isHighQualityUser} onStart={() => setViewType('TASK1')} />}
                {viewType === 'TASK1' && <Task1 onJoinedTelegram={() => setViewType('TASK2')} />}
                {viewType === 'TASK2' && <Task2 onJoinedTelegram={() => setViewType('FORM')} />}
                {viewType === 'FORM' && <Form isMobile={isMobile} onSubmit={handleSubmit} />}
              </>
            )}
          </div>
        </div>
      </Spin>
    </AuthChecker>
  )
}
