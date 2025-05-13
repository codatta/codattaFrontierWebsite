import { CMUDataRequirements } from '@/apis/frontiter.api'
import { Button, Modal, Spin } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check, Info } from 'lucide-react'
import TaskRefresh from '@/assets/cmu-video-labeling/task-refresh.svg'
import TaskTimesUp from '@/assets/cmu-video-labeling/task-timesup.svg'
import { cmuStoreActions, useCMUStore } from '@/stores/cmu.store'
import USDRewardIcon from '@/assets/cmu-video-labeling/usd-reward-icon.png'

function CMUTaskItem(props: { task: unknown }) {
  const navigate = useNavigate()
  const task = JSON.parse(JSON.stringify(props.task)) as CMUDataRequirements

  async function handleTaskClick(item: CMUDataRequirements) {
    console.log(item, 'handleTaskClick')

    if (item.status === 2) return
    navigate(`/frontier/project/CMU_TPL_000001/7227058050400100824/quest/${item.num}`)
  }

  return (
    <div className="flex items-center justify-start gap-4 rounded-2xl border border-white/10 p-6" key={task.num}>
      <div className="flex flex-col items-center">
        <img
          src="https://static.codatta.io/static/images/23910bf5647f1d35fa92e6b1688f5869e8335f16.png"
          alt=""
          className="size-12"
        />
        <span className="text-xs">200</span>
      </div>
      <div className="flex flex-col items-center">
        <img src={USDRewardIcon} alt="" className="size-12" />
        <span className="text-xs">$1</span>
      </div>
      <span>{task.querytext}</span>
      <div className="ml-auto flex min-w-[160px] shrink-0 justify-end">
        {task.status === 2 ? (
          <button className="w-[120px] rounded-full bg-white/5 py-3 text-center text-sm text-white/40">Finished</button>
        ) : (
          <Button onClick={() => handleTaskClick(task)} shape="round" size="large" type="primary" className="w-[120px]">
            Submit
          </Button>
        )}
      </div>
    </div>
  )
}

export default function CMUVideoTaskList() {
  const [showNoMoreQuestions, setShowNoMoreQuestions] = useState<boolean>(false)
  const [showChangeGroup, setShowChangeGroup] = useState<boolean>(false)
  const { taskId } = useParams()
  const cmuStore = useCMUStore()
  const [loading, setLoading] = useState<boolean>(false)

  const finishedTaskCount = useMemo(
    () => cmuStore.taskList.filter((item) => item.status === 2).length,
    [cmuStore.taskList]
  )
  const canClaimReward = useMemo(
    () => finishedTaskCount === cmuStore.taskList.length && finishedTaskCount > 0,
    [finishedTaskCount, cmuStore.taskList]
  )

  async function getTaskList(taskId: string) {
    setLoading(true)
    await cmuStoreActions.getTaskList(taskId)
    setLoading(false)
  }

  useEffect(() => {
    if (!taskId) return
    getTaskList(taskId)
  }, [taskId])

  useEffect(() => {
    if (cmuStore.taskStatus === 2) setShowNoMoreQuestions(true)
    if (cmuStore.taskStatus === 3) setShowChangeGroup(true)
  }, [cmuStore.taskStatus])

  function handleClaimRewardClick() {
    window.open('https://forms.gle/VQ7pPtCRKMWYDxmPA')
  }

  return (
    <div className="w-full">
      <div className="mb-3 flex w-full items-center justify-between">
        <h1 className="text-lg font-bold">Video Annotation</h1>
        <div className="flex items-center gap-3">
          Task {finishedTaskCount} of {cmuStore.taskList.length}
          <Button shape="round" size="large" type="primary" disabled={!canClaimReward} onClick={handleClaimRewardClick}>
            Claim Reward
          </Button>
        </div>
      </div>
      <div className="mb-6 flex items-start gap-3 rounded-2xl bg-white/5 p-3">
        <Info className="shrink-0 text-white" size={24} />
        <span className="text-white">
          Complete all {cmuStore.taskList.length} tasks to receive your cash reward in a single payment. <br />
          Finish all questions as soon as possible - if someone else completes this set first, we'll give you a fresh
          new set to work on (as long as tasks remain available).
        </span>
      </div>

      <div>
        <Spin spinning={loading}>
          <h1 className="mb-3 text-lg font-bold">Multiple Tasks</h1>
          <div className="flex flex-col gap-3">
            {cmuStore.taskList.map((item) => (
              <CMUTaskItem key={item.num} task={item} />
            ))}
          </div>
        </Spin>
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
