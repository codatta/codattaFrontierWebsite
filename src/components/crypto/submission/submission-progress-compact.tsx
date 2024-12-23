import { TReward } from '@/api-v1/submission.api'
import { StepProps, Tooltip, type StepsProps } from 'antd'
import { ReactNode } from 'react'

type stepStatus = 'error' | 'wait' | 'finish' | 'process' | undefined

const statusMap = new Map<string, stepStatus>()
statusMap.set('PASSED', 'finish')
statusMap.set('FAILED', 'error')
statusMap.set('PENDING', 'wait')

export default function SubmissionProgressCompact(props: { reward: TReward }) {
  const { reward } = props
  if (!reward) return <></>

  const { stage_1, stage_2, stage_3, stage_4 } = reward

  const transformStatus = (status?: string) =>
    statusMap.get(status === 'PENDING' ? 'PENDING' : status?.split('_')?.[1] || '')
  const getPointLabel = (point: number = 0) => point + ' ' + (point > 1 ? 'points' : 'point')

  function getS2Status() {
    const s2status = transformStatus(stage_2?.status)
    const s3status = transformStatus(stage_3?.status)

    if (s2status === 'error' || s3status === 'error') {
      return 'error'
    } else if (s3status === 'finish') {
      return 'finish'
    } else if (s2status === 'finish' && s3status === 'wait') {
      return 'wait'
    } else if (s2status === 'wait') {
      return 'wait'
    }
  }

  const items: StepsProps['items'] = [
    {
      title: 'AI Validation',
      status: transformStatus(stage_1.status),
      description: stage_1?.completed ? getPointLabel(stage_1.point) : null
    },
    {
      title: 'Human Intelligence',
      status: getS2Status(),
      description: stage_2?.completed ? getPointLabel(stage_2.point + (stage_3?.completed ? stage_3.point : 0)) : null
    },
    {
      title: 'Public Review',
      status: transformStatus(stage_4?.status)
    },
    {
      title: 'Complete'
    }
  ]

  function ProgressBar(props: { status: stepStatus }) {
    const { status } = props
    const color = ['finish', 'wait'].includes(status || '') ? '#875DFF' : status === 'error' ? 'red' : '#606067'
    return <div className="h-[2px] min-w-[14px] rounded-[1px]" style={{ backgroundColor: color }}></div>
  }

  function ProgressDot(props: { status: stepStatus; tooltip: string | ReactNode }) {
    const { status, tooltip } = props
    const color = 'finish' == status ? '#875DFF' : status === 'error' ? 'red' : '#606067'
    return (
      <Tooltip title={tooltip}>
        <div className="size-2 rounded-full" style={{ backgroundColor: color }}></div>
      </Tooltip>
    )
  }

  function RenderSteps(steps: StepProps[]) {
    const items = steps.map((item, index) => {
      const isFirst = index === 0
      return (
        <div className="flex items-center gap-[2px]" key={index}>
          {isFirst ? null : (
            <div className="flex-1">
              <ProgressBar status={item.status} />
            </div>
          )}
          <ProgressDot status={item.status} tooltip={item.description}></ProgressDot>
        </div>
      )
    })
    return <div className="flex h-5 items-center gap-[2px]">{items}</div>
  }

  return RenderSteps(items)
}
