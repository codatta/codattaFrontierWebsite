import { Spin } from 'antd'
import { useMemo, useState } from 'react'
import { cn } from '@udecode/cn'
import { useSessionStorage } from '@uidotdev/usehooks'

import AuthChecker from '@/components/app/auth-checker'
import Header from '@/components/frontier/high-quality-user/v2/header'
import Access from '@/components/frontier/high-quality-user/v2/access'
import Read from '@/components/frontier/high-quality-user/v2/read'
import Task from '@/components/frontier/high-quality-user/v2/task-2'
import Result from '@/components/frontier/high-quality-user/v2/result'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'

import { useIsMobile } from '@/hooks/use-is-mobile'

export default function HighQualityUserV2Task2({ templateId }: { templateId: string }) {
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

  function onSubmitAgain(): void {
    throw new Error('Function not implemented.')
  }

  function onBack(): void {
    throw new Error('Function not implemented.')
  }

  const handleSubmit = async (formData: unknown): Promise<boolean> => {
    throw new Error('Function not implemented.')
  }

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
