/**
 *  Month2 Week1
 */

import { Spin, message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { cn } from '@udecode/cn'

import AuthChecker from '@/components/app/auth-checker'
import SubmissionProgress from '@/components/frontier/robotics_tpl/submission-progress'
import Result from '@/components/frontier/robotics_tpl/result'

import { Button } from '@/components/booster/button'

import CheckCircle from '@/assets/common/check-circle.svg?react'

import boosterApi from '@/apis/booster.api'

import frontiterApi from '@/apis/frontiter.api'
import { motion, PanInfo } from 'framer-motion'

/**
 * TODO: Get annotation display data
 * @param param0
 * @returns
 */

const RoboticsForm: React.FC<{ templateId: string }> = ({ templateId }) => {
  const { taskId, questId } = useParams()
  const [pageLoading, setPageLoading] = useState(false)
  const [submitted, setSubmitted] = useState(true)
  const [validatedDays, setValidatedDays] = useState(0)
  const [position, setPosition] = useState('50%,50%')

  useEffect(() => {
    setPageLoading(true)
    boosterApi
      .getFoodAnnotationDays(questId!)
      .then((annotationDays) => {
        setSubmitted(annotationDays.data.has_current_date)
        setValidatedDays(annotationDays.data.day_count)
      })
      .finally(() => {
        setPageLoading(false)
      })
  }, [questId])

  return (
    <AuthChecker>
      <Spin spinning={pageLoading} className="min-h-screen">
        <h1 className="mb-4 py-4 text-center text-base font-bold">Robotics Data Annotation</h1>
        {submitted ? (
          <Result />
        ) : (
          <main>
            <SubmissionProgress questId={questId!} validatedDays={validatedDays} />
            <DataPreview imgUrl={'/robotics-example.png'} onPositionChange={setPosition} />
            <Form taskId={taskId!} templateId={templateId} onSubmitted={() => setSubmitted(true)} position={position} />
          </main>
        )}
      </Spin>
    </AuthChecker>
  )
}

export default RoboticsForm

function DataPreview({ imgUrl, onPositionChange }: { imgUrl: string; onPositionChange: (pos: string) => void }) {
  const constraintsRef = useRef<HTMLDivElement>(null)
  const dragControlRef = useRef<HTMLDivElement>(null)

  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
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
      <div className="relative overflow-hidden rounded-xl" ref={constraintsRef}>
        <img src={imgUrl} alt="" className="h-auto w-full" />
        <motion.div
          ref={dragControlRef}
          drag
          dragElastic={0.05}
          dragConstraints={constraintsRef}
          onDrag={handleDrag}
          onDragEnd={handleDrag}
          className="absolute size-10 cursor-grab rounded-sm border border-[#FFA800] active:cursor-grabbing"
          style={{
            left: `calc(50% - 20px)`,
            top: `calc(50% - 20px)`
          }}
        ></motion.div>
      </div>
    </div>
  )
}

function Form({
  taskId,
  templateId,
  position = '50%,50%',
  onSubmitted
}: {
  taskId: string
  templateId: string
  position: string
  onSubmitted: () => void
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

  const isSubmittable = isPositionChanged && selected !== null && textInput.trim() !== ''

  const handleSubmit = async () => {
    if (loading) return

    if (!isSubmittable) {
      message.warning('Please complete all required fields before submitting.')
      return
    }

    setLoading(true)
    try {
      await frontiterApi.submitTask(taskId!, {
        templateId: templateId,
        taskId: taskId,
        data: {
          is_yes: selected === 'yes',
          contact_target: textInput,
          position: position
        }
      })
      message.success('Annotation submitted successfully!').then(() => {
        setLoading(false)
        onSubmitted()
      })
    } catch (error) {
      message.error(error.message ? error.message : 'Failed to submit annotation!').then(() => {
        setLoading(false)
      })
    }
  }

  return (
    <div className="mt-5 px-6 text-white">
      <h3 className="mb-2 mt-1 pl-4 font-normal text-[#BBBBBE]">Does the robotic arm touch an object?</h3>
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
      <h3 className="mb-2 mt-[22px] pl-4 font-normal text-[#BBBBBE]">Contact Target*</h3>
      <textarea
        placeholder="Describe the target object that the robotic arm iscontacting..."
        className="w-full rounded-xl px-4 py-[10px] text-base text-black placeholder:text-[#77777D]"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
      ></textarea>
      <h3 className="mb-2 mt-[22px] pl-4 font-normal text-[#BBBBBE]">Robotic arm position*</h3>
      <div className="rounded-xl bg-[#252532] px-4 py-[10px]">
        <div className="text-base">Position({position})</div>
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
