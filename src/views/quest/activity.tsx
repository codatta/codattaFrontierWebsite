import taskApi, { TaskStatus, type Activity, type TaskReward, type Task_New } from '@/api-v1/task.api'
import TaskAction from '@/components/task/task-action'
import TaskCard from '@/components/task/task-card'
import TransitionEffect from '@/components/common/transition-effect'
import { activity as activityStore, reloadActivities } from '@/stores/activity.store'
import { Avatar, Flex, Space, Spin, message } from 'antd'
import { sortBy } from 'lodash'
import { Ellipsis, HelpCircle, ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import ReactGA from 'react-ga4'
import { useParams, useNavigate } from 'react-router-dom'
import { useSnapshot } from 'valtio'

import campaignApi, { CampaignRevealed } from '@/api-v1/campaign.api'
import userApi from '@/apis/user.api'

const channel = new BroadcastChannel('codatta:social-link')
const taskStatusSort: Record<TaskStatus, number> = {
  [TaskStatus.Rewarded]: 4,
  [TaskStatus.Finished]: 1,
  [TaskStatus.Pending]: 3,
  [TaskStatus.NotStart]: 2
}

export default function Component() {
  const { categoryId } = useParams()
  const [activity, setActivity] = useState<Activity>()
  const [sortedTasks, setSortedTasks] = useState<Task_New[]>([])
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [consult, setConsult] = useState<CampaignRevealed>()

  async function loadData(categoryId: string) {
    try {
      const res = await taskApi.getActivity(categoryId)
      setActivity(res.data)
    } catch (err) {
      message.error(err.message)
    }
  }

  async function getActivity(categoryId: string = '') {
    try {
      const res = await taskApi.getActivity(categoryId)
      setActivity(res.data)
      ReactGA.event('view_quest_list', {
        customParams: JSON.stringify({
          list: res.data.tasks?.map(({ task_id }: { task_id: string }) => task_id)
        })
      })
    } catch (err) {
      message.error(err.message)
      history.back()
    }
  }

  useEffect(() => {
    const tasks = sortBy(activity?.tasks ?? [], (task) => taskStatusSort[task.status])
    setSortedTasks(tasks)
  }, [activity])

  useEffect(() => {
    getActivity(categoryId)
    channel.onmessage = () => {
      getActivity(categoryId)
      userApi.getDetail()
    }
    return () => {
      channel.onmessage = null
    }
  }, [categoryId])

  const [messageApi, contextHolder] = message.useMessage()

  const onReward = (rewards: TaskReward[]) => {
    messageApi.success({
      content: (
        <span className="font-medium text-[#020008E0]">
          You have earned {rewards.map((reward) => reward.reward_value + ' ' + reward.reward_type).join(', ')}
        </span>
      ),
      icon: (
        <Avatar.Group>
          {rewards.map((reward) => (
            <Avatar shape="square" key={reward.reward_type} src={reward.reward_icon} className="!border-none" />
          ))}
        </Avatar.Group>
      ),
      className: `[&_.ant-message-custom-content]:(flex items-center gap-2) [&_.ant-message-notice-content]:(!bg-gradient-to-r from-#E9F0FFCC via-#FFF3FFCC via-30% to-#FFFFFFCC to-80% !px-6 !py-3)`
    })
  }

  const afterAction = async () => {
    try {
      await reloadActivities()
      await campaignApi.getConsult(CampaignRevealed.Task, categoryId).then((res) => setConsult(res.data))
    } catch (err) {
      message.error(err.message)
    }
  }

  const handleActionPending = async () => {
    await Promise.all([afterAction(), loadData(categoryId || '')])
  }

  useEffect(() => {
    setLoading(true)
    campaignApi
      .getConsult(CampaignRevealed.Task, categoryId)
      .then((data) => setConsult(data))
      .catch((err) => message.error(err.message))
      .finally(() => setLoading(false))
  }, [categoryId])

  return (
    <TransitionEffect className="">
      <div className="mb-6 flex items-center gap-2">
        <ArrowLeft size={28} onClick={() => navigate(-1)} className="cursor-pointer" />
        <h1 className="text-2xl font-bold leading-9">Quest</h1>
      </div>
      <div className="flex flex-col gap-6">
        {contextHolder}
        {consult === undefined && <Summary id={categoryId ?? ''} activity={activity ?? null} compact={!!consult} />}
        <Spin
          spinning={loading}
          className="!max-h-full"
          wrapperClassName={'[&>.ant-spin-blur::after]:bg-transparent [&>div>.ant-spin]:max-h-[calc(100vh_-_220px)]'}
        >
          {sortedTasks.length ? (
            <Flex vertical gap={32} component="ul">
              {sortedTasks.map((task) => {
                return (
                  <TaskCard
                    key={task.task_id}
                    task={task}
                    action={<TaskAction task={task} onReward={onReward} onPending={handleActionPending} />}
                    onTimeout={() => getActivity(categoryId ?? '')}
                  />
                )
              })}
            </Flex>
          ) : (
            <div className="h-[calc(100vh_-_220px)]"></div>
          )}
        </Spin>
      </div>
    </TransitionEffect>
  )
}

function Summary(props: { activity: Activity | null; id: Activity['sub_cate_id']; compact?: boolean }) {
  const { groups } = useSnapshot(activityStore)
  const { activity, id, compact } = props

  const activitySummary = groups?.flatMap(({ sub }) => sub).find(({ sub_cate_id }) => sub_cate_id === id)

  if (!activitySummary || !activity) return null

  if (compact)
    return (
      <div className="mx-auto flex flex-col items-center gap-2 text-center">
        <h1 className="font-mona text-[32px] font-bold leading-8">{activitySummary.sub_cate_name}</h1>
      </div>
    )

  return (
    <Space direction="vertical" size={24}>
      <h1 className="text-[32px] font-bold leading-8">{activitySummary.sub_cate_name}</h1>
      <p className="text-gray-700">{activitySummary.sub_cate_description}</p>
      <Space size={8}>
        <Avatar.Group>
          {activitySummary.avatars
            ?.slice(0, 3)
            .map((src: string, index: number) => (
              <Avatar key={index} src={src} size={24} style={{ background: '#DDDDDD' }} />
            ))}
          <Avatar
            icon={<Ellipsis color="#727272" />}
            size={24}
            style={{ background: '#444', border: '1px solid #555' }}
          />
        </Avatar.Group>
        <div className="pb-1 text-xs text-gray-700">{activitySummary.completed_count} completed</div>
      </Space>
      <HelpInfo activity={activity} />
    </Space>
  )
}

function HelpInfo({ activity, className }: { activity: Activity; className?: string }) {
  const showHelp = (helpInfo: Activity['help_info'][number]) => {
    window.open(
      helpInfo.link,
      'targetWindow',

      `width=800,height=600,scrollbars=yes,toolbar=no,location=no,titlebar=no,menubar=no,resizable=yes,left=${-screen.width / 2 - 400},top=${screen.height / 2 - 400}`
    )
  }

  if (!activity?.help_info) return null

  return (
    <Space size={16} className={`${className ?? ''}`}>
      {activity.help_info.map((helpInfo) => (
        <a
          key={helpInfo.name}
          onClick={() => {
            showHelp(helpInfo)
            ReactGA.event('view_quest_help')
          }}
          className="font-medium hover:text-primary"
        >
          <HelpCircle size={20} fill="#25314C" color="white" className="-mt-0.5 mr-1 inline-block" />
          <span>{helpInfo.name}</span>
        </a>
      ))}
    </Space>
  )
}
