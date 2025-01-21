import ImageLogo from '@/assets/images/logo-white.png'
import { motion } from 'framer-motion'
import { Undo2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import QuestTrueFalse from '@/components/quest/quest-true-false'
import QuestSelect from '@/components/quest/quest-select'
import taskApi, { Quest } from '@/api-v1/task.api'
import taskApi2 from '@/apis/task.api'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Spin, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

function Indicator(props: { index: number; total: number }) {
  const { index, total } = props

  const indicatorItems: React.ReactNode[] = []
  for (let i = 0; i < total; i++) {
    const bgColor = i === index ? 'bg-primary' : 'bg-gray-200'
    indicatorItems.push(<div key={i} className={`${bgColor} h-1 w-full rounded-sm`}></div>)
  }

  return <div className="mx-auto flex w-full max-w-[320px] items-center justify-evenly gap-1">{indicatorItems}</div>
}

function QuestPageHeader() {
  function handleBack() {
    window.history.back()
  }
  return (
    <header className="flex w-full items-center justify-between p-4">
      <img src={ImageLogo} className="h-6" alt="" />
      <div onClick={handleBack} className="rounded-full bg-gray-200 p-2">
        <Undo2 />
      </div>
    </header>
  )
}

function QuestChallengeController(props: { quests: Quest[]; onFinish: () => void }) {
  const [current, setCurrent] = useState(0)
  const { quests, onFinish } = props

  function handleNext() {
    window.scrollTo(0, 0)
    const nextIndex = current + 1
    if (nextIndex >= quests.length) {
      onFinish()
    } else {
      setCurrent(nextIndex)
    }
  }

  return (
    <>
      {quests.map((item, index) => {
        return (
          <motion.div
            initial={{ opacity: 0, left: 200 }}
            animate={{
              opacity: current === index ? 1 : 0,
              display: current === index ? 'block' : 'none',
              left: current === index ? 0 : 200
            }}
            key={index}
            className="absolute top-0 w-full"
          >
            <div className="p-4">
              {item.type === 'true-false' && (
                <QuestTrueFalse
                  quest={props.quests[index]}
                  onSuccess={handleNext}
                  indicator={<Indicator index={current} total={quests.length} />}
                />
              )}
              {item.type === 'single-select' && (
                <QuestSelect
                  quest={props.quests[index]}
                  onSuccess={handleNext}
                  indicator={<Indicator index={current} total={quests.length} />}
                />
              )}
            </div>
          </motion.div>
        )
      })}
    </>
  )
}

export default function Component() {
  const location = useLocation()
  const taskId = location.state?.taskId
  const [loading, setLoading] = useState(true)
  const [quests, setQuests] = useState<Quest[]>([])
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    taskApi
      .getQuestDetail(id || '')
      .then((res) => {
        setQuests(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  async function handleFinish() {
    setLoading(true)
    try {
      await taskApi2.finishTask(taskId)
      message.success('Congratulations! You have completed the quest.')
      navigate(-1)
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  return (
    <>
      <QuestPageHeader />
      <Spin spinning={loading} size="large" indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}>
        <div className="relative mx-auto h-[calc(100vh-72px)] w-full max-w-[1200px]">
          <QuestChallengeController quests={quests} onFinish={handleFinish} />
        </div>
      </Spin>
    </>
  )
}
