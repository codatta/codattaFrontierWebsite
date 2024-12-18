import taskApi, {
  TaskStatus,
  TaskType,
  type TaskReward,
  type Task_New
} from '@/apis/task.api'
import useRequest from '@/hooks/useRequest'
import { Button, Space, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import type React from 'react'
import ReactGA from 'react-ga4'
import { useNavigate } from 'react-router-dom'
import Button3D from '../common/button-3d'
import { userStoreActions, useUserStore } from '@/stores/user.store'
import { questStoreActions, QUEST_TMA_TASK_IDS } from '@/stores/quest.store'
import { useEffect, useState } from 'react'
import { cn } from '@udecode/cn'

interface TaskActionProps {
  task: Task_New
  onReward?: (rewards: TaskReward[]) => void
  onPending?: () => void
}

export default function TaskAction(props: TaskActionProps) {
  const {
    task: { type, status, locked }
  } = props

  useEffect(() => {
    return () => {
      questStoreActions.unMountCompleteModal()
    }
  }, [])

  return (
    <Space size={16}>
      {locked ? (
        <Button
          size="large"
          disabled
          className="h-[46px] min-w-[120px] rounded-[36px] border-none font-medium"
        >
          Complete
        </Button>
      ) : (
        taskActionMap[type]?.[status]?.map((ActionButton, index) => (
          <ActionButton {...props} key={index} />
        ))
      )}
    </Space>
  )
}

type ActionButton = React.FunctionComponent<TaskActionProps>

const actionButton: Record<string, ActionButton> = {
  Verify: (props) => {
    const [_, loading, verify] = useRequest(taskApi.verify)
    const [btnLoading, setBtnLoading] = useState(false)
    return (
      <Button
        disabled={props.task.locked}
        className={cn(
          `relative h-[46px] min-w-[120px] overflow-hidden rounded-[36px] border-none bg-white text-gray hover:!bg-gray-700 hover:!text-gray`,
          btnLoading ? 'bg-gray-200 text-gray-500' : ''
        )}
        onClick={async () => {
          setBtnLoading(true)
          if (loading) return
          ReactGA.event('verify_quest')
          try {
            const verifyRes = await verify(props.task.task_id)
            if (verifyRes.verify_result === 'PASSED') {
              props.onReward(verifyRes.rewards)
            } else {
              const erroMsg =
                verifyRes.msg ||
                'Verification failed. No quests completion were detected. Please carefully review the quest requirements.'
              message.info(erroMsg)
            }
          } catch (error: unknown) {
            message.error((error as Error).message)
          }
          await props.onPending()
          setBtnLoading(false)
        }}
      >
        Verify
        <div
          className={cn(
            `leading-46px absolute left-[-100%] top-0 z-[1] h-[46px] w-full rounded-[36px] bg-transparent`,
            btnLoading ? 'bg-gray-300 text-gray-500' : ''
          )}
          style={{
            animation: btnLoading ? 'verifyAnimate 2s linear infinite' : 'none'
          }}
        ></div>
        {btnLoading && (
          <>
            <div className="absolute left-0 top-0 h-[46px] w-full rounded-[36px] bg-gray-200 leading-[46px] text-gray-500"></div>
            <div className="absolute left-0 top-0 z-20 h-[46px] w-full rounded-[36px] bg-transparent leading-[46px] text-gray-500">
              Verify
            </div>
          </>
        )}
      </Button>
    )
  },
  Execute: (props) => {
    const [loading, setLoading] = useState(false)
    const { schema, task_id } = props.task
    if (!schema) return null
    const url = new URL(schema)
    const isAppSchema = url.protocol === 'app:'
    const to = schema.replace('app://', '/app/')
    const state = Object.fromEntries([
      ...url.searchParams.entries(),
      ['taskId', props.task.task_id]
    ])

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate = useNavigate()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { info } = useUserStore()
    const xAccount = info?.social_account_info?.find(
      (item) => item.channel === 'X'
    )
    const discordAccount = info?.social_account_info?.find(
      (item) => item.channel === 'Discord'
    )
    const telegramAccount = info?.social_account_info?.find(
      (item) => item.channel === 'Telegram'
    )

    async function handleLinkClick() {
      setLoading(true)
      ReactGA.event('goto_quest', { customParams: JSON.stringify({ schema }) })
      const _fn = async () => {
        if (task_id == 'BIND-X-AUTH') {
          await userStoreActions.linkX()
        } else if (task_id == 'BIND-TELEGRAM-AUTH') {
          await userStoreActions.linkTelegram()
        } else if (task_id == 'BIND-DISCORD-AUTH') {
          await userStoreActions.linkDiscord()
        } else if (
          ['FOLLOW-X', 'MANTA-FOLLOW-X'].includes(task_id) &&
          !xAccount
        ) {
          await userStoreActions.linkX()
        } else if (task_id == 'JOIN-TELEGRAM-TEAM' && !telegramAccount) {
          await userStoreActions.linkTelegram()
        } else if (task_id == 'JOIN-DISCORD-TEAM' && !discordAccount) {
          await userStoreActions.linkDiscord()
        } else if (task_id === 'PLUGIN-QUEST-SUBMISSION') {
          questStoreActions.showExtensionGuideModal()
        } else {
          if (isAppSchema) {
            navigate(to, { state })
          } else {
            window.open(to, '_blank')
          }
          setLoading(true)
          setTimeout(async () => {
            if (
              [
                'FOLLOW-X',
                'MANTA-FOLLOW-X',
                'OKX_GIVEAWAY',
                'XNY-BLOG-DOC',
                'XNY-LITEPAPER'
              ].includes(task_id)
            ) {
              await taskApi.finishTask(task_id)
              await props.onPending()
              setLoading(false)
            }
          }, 0)
        }
      }
      if (QUEST_TMA_TASK_IDS.includes(task_id)) {
        questStoreActions.showCompleteModal(schema)
      } else {
        await _fn()
      }
      setLoading(false)
    }

    return (
      <Button
        type="primary"
        loading={loading}
        className="h-[46px] min-w-[120px] rounded-[36px]"
        onClick={handleLinkClick}
      >
        {loading ? '' : 'Complete'}
      </Button>
    )
  },
  ReceiveReward: (props) => {
    const [loading, setLoading] = useState(false)
    const [, , receiveReward] = useRequest(taskApi.receiveReward)
    return (
      <Button3D
        className="disabled min-w-[120px] rounded-[36px] text-gray"
        onClick={async () => {
          ReactGA.event('receive_quest_reward')
          setLoading(true)
          try {
            const receiveRewardRes = await receiveReward(props.task.instance_id)
            props.onReward(receiveRewardRes)
          } catch (err: unknown) {
            message.error((err as Error).message)
          }
          await props.onPending()
          setLoading(false)
        }}
      >
        {loading ? <LoadingOutlined /> : 'Claim'}
      </Button3D>
    )
  },
  Finished: () => (
    <Button
      disabled
      className="h-[46px] min-w-[120px] rounded-[36px] border-none px-6 font-medium !text-[#0500197D]"
    >
      Gained Reward
    </Button>
  )
}

const taskActionMap: Record<TaskType, Record<TaskStatus, ActionButton[]>> = {
  [TaskType.Auto]: {
    [TaskStatus.NotStart]: [],
    [TaskStatus.Pending]: [actionButton.Execute],
    [TaskStatus.Finished]: [actionButton.ReceiveReward],
    [TaskStatus.Rewarded]: [actionButton.Finished]
  },
  [TaskType.Manual]: {
    [TaskStatus.NotStart]: [],
    [TaskStatus.Pending]: [actionButton.Verify, actionButton.Execute],
    [TaskStatus.Finished]: [],
    [TaskStatus.Rewarded]: [actionButton.Finished]
  }
}
