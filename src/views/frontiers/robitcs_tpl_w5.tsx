/**
 *  Month2 Week1
 */

import { Spin, message } from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { cn } from '@udecode/cn'
import { motion } from 'framer-motion'

import AuthChecker from '@/components/app/auth-checker'
import SubmissionProgress from '@/components/frontier/robotics_tpl/submission-progress'
import Result from '@/components/frontier/robotics_tpl/result'

import { Button } from '@/components/booster/button'
import Rect from '@/components/frontier/robotics_tpl/rect'
import { ResultType } from '@/components/frontier/robotics_tpl/types'

import CheckCircle from '@/assets/common/check-circle.svg?react'

import boosterApi from '@/apis/booster.api'
import frontiterApi from '@/apis/frontiter.api'

type Question = {
  imageUrl: string
  num: string
}

const extractDaysFromString = (str?: string): number => {
  const match = str?.match(/-robotics(\d+)/)

  console.log('match', match)
  if (match && match[1]) {
    return parseInt(match[1], 10)
  }
  return 1
}

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

const RoboticsForm: React.FC<{ templateId: string }> = ({ templateId }) => {
  const { taskId, questId } = useParams()
  const [pageLoading, setPageLoading] = useState(false)
  const [resultType, setResultType] = useState<'PENDING' | 'REJECT' | 'ADOPT' | null>(null)
  const [validatedDays, setValidatedDays] = useState(0)
  const maxValidateDays = useMemo(() => extractDaysFromString(questId), [questId])
  const [data, setData] = useState<Question>()
  const [position, setPosition] = useState('50%,50%')
  const [isShaking, setIsShaking] = useState(false)
  const isW5 = useMemo(() => templateId?.toLowerCase().includes('w5'), [templateId])

  const checkTaskStatus = useCallback(async () => {
    if (!taskId || !templateId) {
      message.error('Task ID or template ID is required!')
      return
    }

    setPageLoading(true)

    try {
      const [annotationDays, taskDetail] = await Promise.all([
        boosterApi.getFoodAnnotationDays(questId!),
        frontiterApi.getTaskDetail(taskId!)
      ])

      const lastSubmission = await getLastSubmission(taskDetail.data.frontier_id, taskId!)

      if (lastSubmission) {
        if (['PENDING', 'SUBMITTED'].includes(lastSubmission.status)) {
          setResultType('PENDING')
        } else if (lastSubmission.status === 'REFUSED') {
          setResultType('REJECT')
        } else if (lastSubmission.status === 'ADOPT') {
          if (annotationDays.data.has_current_date || maxValidateDays <= annotationDays.data.day_count) {
            setResultType('ADOPT')
          }
        }
      }

      setValidatedDays(annotationDays.data.day_count)

      const question = taskDetail.data.questions as unknown as {
        image_url: string
        num: string
      }

      if (question) {
        setData({
          imageUrl: question.image_url,
          num: question.num
        })
      }

      console.log('question', question)
    } catch (error) {
      message.error(error.message)
    } finally {
      setPageLoading(false)
    }
  }, [questId, taskId, templateId, maxValidateDays])

  const onSubmit = ({ status }: { status: ResultType }) => {
    if (status === 'ADOPT') {
      setValidatedDays(validatedDays + 1)
    }
    setResultType(status)
  }

  useEffect(() => {
    checkTaskStatus()
  }, [checkTaskStatus])

  return (
    <AuthChecker>
      <Spin spinning={pageLoading} className="min-h-screen">
        <h1 className="mb-4 py-4 text-center text-base font-bold">Robotics Data Annotation</h1>
        {resultType ? (
          <Result
            type={resultType}
            maxValidateDays={maxValidateDays}
            validatedDays={validatedDays}
            showProgress={maxValidateDays > 1 || isW5}
            onSubmitAgain={() => setResultType(null)}
          />
        ) : (
          <main>
            {(maxValidateDays > 1 || isW5) && (
              <SubmissionProgress maxValidateDays={maxValidateDays} validatedDays={validatedDays} />
            )}
            <DataPreview imgUrl={data?.imageUrl} onPositionChange={setPosition} isShaking={isShaking} />
            <Form
              taskId={taskId!}
              templateId={templateId}
              onSubmitted={onSubmit}
              position={position}
              num={data?.num}
              imgUrl={data?.imageUrl}
              onShake={() => {
                setIsShaking(true)
                setTimeout(() => setIsShaking(false), 900)
              }}
            />
          </main>
        )}
      </Spin>
    </AuthChecker>
  )
}

export default RoboticsForm

function DataPreview({
  imgUrl,
  onPositionChange,
  isShaking
}: {
  imgUrl?: string
  onPositionChange: (pos: string) => void
  isShaking: boolean
}) {
  const constraintsRef = useRef<HTMLDivElement>(null)
  const dragControlRef = useRef<HTMLDivElement>(null)

  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent) => {
    const container = constraintsRef.current
    const dragControl = dragControlRef.current
    if (!container || !dragControl) return

    const {
      width: containerWidth,
      height: containerHeight,
      left: containerLeft,
      top: containerTop
    } = container.getBoundingClientRect()
    const { width: squareSize, left: squareLeft, top: squareTop } = dragControl.getBoundingClientRect()

    const rangeX = containerWidth - squareSize
    const rangeY = containerHeight - squareSize
    const squareX = squareLeft - containerLeft
    const squareY = squareTop - containerTop

    if (rangeX <= 0 || rangeY <= 0) return

    const xPercent = (squareX / rangeX) * 100
    const yPercent = (squareY / rangeY) * 100

    // Clamp values to prevent going out of 0-100 range due to dragElasticity.
    const clampedX = Math.max(0, Math.min(100, xPercent))
    const clampedY = Math.max(0, Math.min(100, yPercent))

    onPositionChange(`${clampedX.toFixed(0)}%,${clampedY.toFixed(0)}%`)
  }

  return (
    <div className="px-6 text-sm text-[#BBBBBE]">
      <h3 className="mb-2 mt-1 pl-4 font-normal">Images*</h3>
      <div
        className={cn('relative overflow-hidden rounded-xl', imgUrl ? '' : 'h-[200px] bg-[#252532]')}
        ref={constraintsRef}
      >
        <img src={imgUrl} alt="" className="h-auto w-full" />
        <motion.div
          ref={dragControlRef}
          drag
          dragElastic={0.05}
          dragConstraints={constraintsRef}
          onDrag={handleDrag}
          onDragEnd={handleDrag}
          className="absolute size-10 cursor-grab rounded-sm active:cursor-grabbing"
          style={{
            left: `calc(50% - 20px)`,
            top: `calc(50% - 20px)`
          }}
          animate={{
            scale: isShaking ? [1, 1.2, 1, 1.2, 1, 1.2, 1] : 1
          }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          <Rect className="ml-[-7px] mt-[-7px] size-[53px]" />
        </motion.div>
      </div>
    </div>
  )
}

function Form({
  taskId,
  templateId,
  position = '50%,50%',
  num,
  imgUrl,
  onSubmitted,
  onShake
}: {
  taskId: string
  templateId: string
  position: string
  num?: string
  imgUrl?: string
  onSubmitted: ({ status }: { status: ResultType }) => void
  onShake: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<'yes' | 'no' | null>(null)
  const [textInput, setTextInput] = useState('')
  const [isPositionChanged, setIsPositionChanged] = useState(false)

  useEffect(() => {
    if (position !== '50%,50%') {
      setIsPositionChanged(true)
    }
  }, [position])

  const isSubmittable = isPositionChanged && ((selected === 'yes' && textInput.trim() !== '') || selected === 'no')

  const handleSubmit = async () => {
    if (loading) return

    if (!isPositionChanged) {
      onShake()
      message.warning('Please drag the rectangle to mark the robotic arm position.')
      return
    }

    if (!isSubmittable) {
      message.warning('Please complete all required fields before submitting.')
      return
    }

    setLoading(true)
    try {
      const res = await frontiterApi.submitTask(taskId!, {
        templateId: templateId,
        taskId: taskId,
        num: num,
        imgUrl: imgUrl,
        data: {
          selected: selected,
          contact_target: textInput,
          position: position
        }
      })
      const resultData = res.data as unknown as {
        status: ResultType
      }
      message.success('Annotation submitted successfully!').then(() => {
        setLoading(false)
        onSubmitted({
          status: resultData.status
        })
      })
    } catch (error) {
      message.error(error.message ? error.message : 'Failed to submit annotation!').then(() => {
        setLoading(false)
      })
    }
  }

  return (
    <div className="mt-5 px-6 text-white">
      <h3 className="mb-2 mt-1 pl-4 font-normal text-[#BBBBBE]">Does the robotic arm touch an object?*</h3>
      <div className="flex items-center gap-3 text-base">
        <button
          className="flex flex-1 flex-nowrap items-center justify-between rounded-xl bg-[#FFFFFF14] px-4 py-[10px]"
          onClick={() => setSelected('yes')}
        >
          <span>Yes</span> <CheckCircle className={selected === 'yes' ? 'opacity-100' : 'opacity-0'} />
        </button>
        <button
          className="flex flex-1 flex-nowrap items-center justify-between rounded-xl bg-[#FFFFFF14] px-4 py-[10px]"
          onClick={() => setSelected('no')}
        >
          <span>No</span> <CheckCircle className={selected === 'no' ? 'opacity-100' : 'opacity-0'} />
        </button>
      </div>
      <div className={selected === 'no' ? 'hidden' : ''}>
        <h3 className="mb-2 mt-[22px] pl-4 font-normal text-[#BBBBBE]">Contact Target*</h3>
        <textarea
          placeholder="Describe the target object that the robotic arm iscontacting..."
          className="w-full rounded-xl px-4 py-[10px] text-base text-black placeholder:text-[#77777D]"
          value={textInput}
          maxLength={128}
          onChange={(e) => setTextInput(e.target.value.trim())}
        ></textarea>
      </div>

      <h3 className="mb-2 mt-[22px] pl-4 font-normal text-[#BBBBBE]">Robotic arm position*</h3>
      <div className="rounded-xl bg-[#252532] px-4 py-[10px]">
        {/* <div className="text-base">Position({position})</div> */}
        <p className="mt-1 text-sm text-[#77777D]">Drag the rectangle in the image to mark the robotic arm position</p>
      </div>

      <Button
        text="Confirm"
        onClick={handleSubmit}
        className={cn(
          'mt-6 w-full rounded-full bg-primary px-4 leading-[44px] text-white',
          !isSubmittable ? 'cursor-not-allowed opacity-25' : 'cursor-pointer opacity-100'
        )}
        loading={loading}
      />
    </div>
  )
}

// http://localhost:8080/frontier/project/ROBOTICS_TPL_000001/7890645093800107259/task-7-robotics1time
