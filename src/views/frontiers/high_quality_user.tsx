import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { cn } from '@udecode/cn'

import Header from '@/components/frontier/high-quality-user/header'
import Access from '@/components/frontier/high-quality-user/access'
import Task1 from '@/components/frontier/high-quality-user/task-1'
import Task2 from '@/components/frontier/high-quality-user/task-2'
import Form from '@/components/frontier/high-quality-user/form'
import type { FormData, ResultType } from '@/components/frontier/high-quality-user/types'

import frontiterApi from '@/apis/frontiter.api'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { message } from 'antd'

export default function HighQualityUser({ templateId }: { templateId: string }) {
  const { taskId, questId } = useParams()
  const isMobile = useIsMobile()
  const isBnb = questId?.toLocaleUpperCase().includes('TASK')
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
    <div className="relative min-h-screen overflow-hidden">
      <Header title="Join Exclusive Telegram Group" />
      <div
        className={cn(
          'mx-auto max-w-[600px] px-6 text-sm leading-[22px] text-white md:max-w-[1272px] md:rounded-2xl md:bg-[#252532] md:px-10 md:pb-12 md:pt-6',
          viewType === 'FORM' && 'md:bg-transparent'
        )}
      >
        {/* <Access isGranted={true} onStart={() => {}} /> */}
        {/* <Task1 onJoinedTelegram={() => {}} /> */}
        {/* <Task2 /> */}
        <Form isMobile={isMobile} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
