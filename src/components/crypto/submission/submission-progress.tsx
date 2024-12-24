import { TReward } from '@/api-v1/submission.api'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { cn } from '@udecode/cn'
import { Steps, type StepsProps } from 'antd'
import { Clock } from 'lucide-react'
import { ReactNode, useEffect, useMemo } from 'react'

type stepStatus = 'error' | 'wait' | 'finish' | 'process'

const statusMap = new Map<string, stepStatus>()
statusMap.set('PASSED', 'finish')
statusMap.set('FAILED', 'error')
statusMap.set('PENDING', 'wait')

const Point = (props: { point: number }) => {
  const { point = 0 } = props
  return (
    <div className={cn('inline-block rounded-full bg-primary px-2 py-0.5 text-xs text-white')}>
      +{point} {point > 1 ? 'points' : 'point'}
    </div>
  )
}

const Result = (props: { content: ReactNode | string; pass: boolean }) => {
  const { content, pass } = props
  const icon = pass ? (
    <CheckCircleFilled className="mr-1 text-primary" />
  ) : (
    <CloseCircleFilled className="mr-1 text-error" />
  )
  return (
    <div className={cn('flex items-center whitespace-nowrap text-xs', 'text-gray-900')}>
      {icon} {content}
    </div>
  )
}

const ExpectTime = (props: { time: string }) => {
  const { time = '' } = props
  return (
    <span className="flex items-center rounded-full bg-gray-400 px-2 py-0.5 text-xs">
      <Clock size={12} className="mr-1" /> <span>{time}</span>
    </span>
  )
}

export default function SubmissionProgress(props: {
  reward: TReward
  tooltipTitle?: string
  onPopErrMsg?: (msg: string) => void
}) {
  const { reward, onPopErrMsg } = props
  // if (!reward) return <></>

  // const { stage_1, stage_2, stage_3, stage_4, ai_check_reason } = reward

  function getStatus(status: string) {
    const split = status ? status?.split('_') : ['PENDING']
    return statusMap.get(split[split.length - 1])
  }

  const aiCheckResult = useMemo(() => {
    if (!reward?.ai_check_reason) return []
    try {
      const json = JSON.parse(reward.ai_check_reason) as { msg: string; type: string; success: boolean }[]
      return Array.isArray(json) ? json : []
    } catch (err) {
      console.log(err)
      return []
    }
  }, [reward])

  useEffect(() => {
    const item = aiCheckResult.find((item) => item.success === false)
    if (item) {
      if (item.type === 'link_check') {
        onPopErrMsg?.('The link can not support the data submitted')
      } else if (item.type === 'text_check') {
        onPopErrMsg?.("Textual description doesn't relate to data submitted")
      } else if (item.type === 'img_check') {
        onPopErrMsg?.('Image authentication check failed')
      }
    } else {
      if (reward?.stage_1?.status === 'S1_FAILED')
        onPopErrMsg?.('Submitted data failed system validation, please recheck data and evidence')
    }
  }, [reward, aiCheckResult, onPopErrMsg])

  const items: StepsProps['items'] = [
    {
      title: (
        <div className="relative min-w-[100px]">
          <span className="font-semibold">AI Validation</span>
          <div className="">
            {reward?.stage_1?.status === 'S1_PASSED' && <Point point={reward?.stage_1.point ?? 0} />}
          </div>
        </div>
      ),
      description: (
        <div className="mt-2 flex flex-col gap-1 text-gray-900">
          {aiCheckResult.map((item) => {
            if (item.type === 'link_check') return <Result content={'Link Authentication Check'} pass={item.success} />
            else if (item.type === 'text_check')
              return <Result content={'Description Correlation Check'} pass={item.success} />
            else if (item.type === 'img_check')
              return <Result content={'Image Authentication Check'} pass={item.success} />
          })}
          {reward?.stage_1?.status === 'S1_FAILED' && <Result content={'Verified Data Cross Check'} pass={false} />}
        </div>
      ),
      status: getStatus(reward?.stage_1?.status)
    },
    {
      title: (
        <div className="relative">
          <span className="font-semibold">Human Intelligence</span>
          {reward?.stage_2?.status === 'PENDING' && (
            <div className="flex justify-center">
              <ExpectTime time="48h+" />
            </div>
          )}
          {!!reward?.stage_2?.completed && (
            <Point point={(reward?.stage_2?.point ?? 0) + (reward?.stage_3?.completed ? reward?.stage_3?.point : 0)} />
          )}
        </div>
      ),
      description: (
        <div className="mt-2 whitespace-nowrap text-xs empty:hidden">
          {!!reward?.stage_2?.completed && (
            <Result
              content={
                <>
                  <span>Public Voting </span>
                  <span className="ml-1 text-primary">
                    {' '}
                    +{reward.stage_2.point} {reward.stage_2.point == 1 ? 'point' : 'points'}{' '}
                  </span>
                </>
              }
              pass={reward.stage_2.status === 'S2_PASSED'}
            ></Result>
          )}
          {!!reward?.stage_3?.completed && (
            <Result
              content={
                <>
                  <span>Domain Expert Voting</span>
                  <span className="ml-1 text-primary">
                    +{reward.stage_3.point} {reward.stage_3.point == 1 ? 'point' : 'points'}{' '}
                  </span>
                </>
              }
              pass={reward.stage_3.status === 'S3_PASSED'}
            ></Result>
          )}
        </div>
      ),
      status: getStatus(
        reward?.stage_2?.completed ? reward?.stage_3?.status || reward?.stage_2?.status : reward?.stage_2?.status || ''
      )
    },
    {
      title: (
        <div className="relative">
          <span className="font-semibold">Public Review</span>
          {reward?.stage_2?.status === 'S2_PASSED' &&
            reward?.stage_3?.status !== 'S3_FAILED' &&
            !reward?.stage_4?.completed && (
              <div className="flex justify-center">
                <ExpectTime time="60d" />
              </div>
            )}
        </div>
      ),
      status: getStatus(reward?.stage_4?.status || '')
    },
    {
      title: <div className="font-semibold">Complete</div>
    }
  ]

  return <Steps size="small" progressDot items={items} className="" />
}
