import frontiterApi, { CMUDataRequirements } from '@/apis/frontiter.api'
import { Button, Modal } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check, Info } from 'lucide-react'
import TaskRefresh from '@/assets/cmu-video-labeling/task-refresh.svg'
import TaskTimesUp from '@/assets/cmu-video-labeling/task-timesup.svg'

function CMUTaskItem(props: { task: CMUDataRequirements }) {
  const navigate = useNavigate()
  const { task } = props

  async function handleTaskClick(item: CMUDataRequirements) {
    navigate(`/frontier/project/CMU_TPL_000001/7227058050400100824/quest/${item.num}`, {
      state: item
    })
  }

  return (
    <div
      className="flex items-center justify-between rounded-2xl border border-white/10 p-6"
      key={task.num}
      onClick={() => handleTaskClick(task)}
    >
      <span>{task.queryText}</span>
      <div className="flex min-w-[160px] shrink-0 justify-end">
        {task.status === 2 ? (
          <span>Finished</span>
        ) : (
          <Button shape="round" size="large" type="primary" className="w-[120px]">
            Submit
          </Button>
        )}
      </div>
    </div>
  )
}

export default function CMUVideoTaskList() {
  const [taskList, setTaskList] = useState<CMUDataRequirements[]>([])
  const [taskStatus, setTaskStatus] = useState<number | undefined>()
  const [showNoMoreQuestions, setShowNoMoreQuestions] = useState<boolean>(false)
  const [showChangeGroup, setShowChangeGroup] = useState<boolean>(true)
  const { taskId } = useParams()

  async function getTaskList(taskId: string) {
    const res = await frontiterApi.getTaskDetail(taskId)
    setTaskList(res.data.questions || [])
    setTaskStatus(res.data.question_status)
  }

  const finishedTaskCount = useMemo(() => taskList.filter((item) => item.status === 2).length, [taskList])
  const canClaimReward = useMemo(() => finishedTaskCount === taskList.length, [finishedTaskCount, taskList])

  useEffect(() => {
    getTaskList(taskId!)
  }, [taskId])

  useEffect(() => {
    if (taskStatus === 2) setShowNoMoreQuestions(true)
    if (taskStatus === 3) setShowChangeGroup(true)
  }, [taskStatus])

  return (
    <div className="w-full">
      <div className="mb-3 flex w-full items-center justify-between">
        <h1 className="text-lg font-bold">Video Annotation</h1>
        <div className="flex items-center gap-3">
          Task {finishedTaskCount} of {taskList.length}
          <Button shape="round" size="large" type="primary" disabled={!canClaimReward}>
            Claim Reward
          </Button>
        </div>
      </div>
      <div className="mb-6 flex items-start gap-3 rounded-2xl bg-white/5 p-3">
        <Info className="shrink-0 text-white" size={24} />
        <span className="text-white">
          Complete all 20 tasks to receive your cash reward in a single payment. Finish all questions as soon as
          possible - if someone else completes this set first, we'll give you a fresh new set to work on (as long as
          tasks remain available).
        </span>
      </div>

      <div>
        <h1 className="mb-3 text-lg font-bold">Multiple Tasks</h1>
        <div className="flex flex-col gap-3">
          {taskList.map((item) => (
            <CMUTaskItem key={item.num} task={item} />
          ))}
        </div>
      </div>

      <Modal open={showChangeGroup} onCancel={() => setShowChangeGroup(false)} closable={false} footer={null} centered>
        <div className="flex flex-col items-center">
          <img src={TaskRefresh} alt="" className="mb-3" />
          <h1 className="mb-2 text-xl font-bold">Task Refreshed!</h1>
          <p className="mb-6 text-center text-white/60">
            This set was submitted by another user. Don't worry - we've assigned you a new set!
          </p>
          <div className="flex gap-3">
            <Button
              type="primary"
              size="large"
              shape="round"
              className="w-[120px]"
              onClick={() => setShowChangeGroup(false)}
            >
              Confirm
            </Button>
            <button>Close</button>
          </div>
        </div>
      </Modal>

      <Modal
        open={showNoMoreQuestions}
        onCancel={() => setShowNoMoreQuestions(false)}
        closable={false}
        footer={null}
        centered
        maskClosable={false}
      >
        <div className="flex flex-col items-center">
          <img src={TaskTimesUp} alt="" className="mb-3" />
          <h1 className="mb-2 text-xl font-bold">Time's Up!</h1>
          <p className="mb-3 text-center text-white/60">This activity has now concluded.</p>
          <div className="mb-9 text-white/60">
            <div>
              <Check className="inline text-[#5DDD22]" size={20}></Check> All completed tasks will be rewarded
            </div>
            <div>
              <Check className="inline text-[#5DDD22]" size={20}></Check> Final results will be emailed
            </div>
            <div>
              <Check className="inline text-[#5DDD22]" size={20}></Check> Stay tuned for future opportunities!
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              type="primary"
              size="large"
              shape="round"
              className="w-[120px]"
              onClick={() => setShowNoMoreQuestions(false)}
            >
              Got it
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
