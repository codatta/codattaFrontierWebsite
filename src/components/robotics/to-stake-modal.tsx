import React, { useEffect, useMemo, useState } from 'react'
import { Button, Modal, message } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import frontiterApi, { TaskStakeInfo } from '@/apis/frontiter.api'
import { formatNumber } from '@/utils/str'

interface ToStakeModalProps {
  open: boolean
  onClose: () => void
  taskId: string
  onStake: (task_id: string) => void
}

const ToStakeModal: React.FC<ToStakeModalProps> = ({ open, onClose, taskId, onStake }) => {
  const [loading, setLoading] = useState(false)
  const [taskStakeInfo, settaskStakeInfo] = useState<TaskStakeInfo>()
  const percent = useMemo(() => {
    if (!taskStakeInfo) return 0
    return Math.round((taskStakeInfo.user_reputation / taskStakeInfo.need_reputation) * 100)
  }, [taskStakeInfo])
  const stakeToKen = useMemo(() => {
    return taskStakeInfo?.stake_asset_type === 'XnYCoin' ? 'XNY' : taskStakeInfo?.stake_asset_type
  }, [taskStakeInfo])

  useEffect(() => {
    if (!open) {
      return
    }

    if (!taskId) {
      message.error('Invalid task ID')
      onClose()
      return
    }

    let active = true

    const fetchtaskStakeInfo = async () => {
      setLoading(true)
      try {
        const res = await frontiterApi.getTaskStakeInfo(taskId)
        if (!active) return

        if (res.success) {
          const taskData = res.data
          if (taskData.user_reputation_flag === 2) {
            message.error('Reputation not met!').then(() => onClose())
          } else if (taskData.user_reputation_flag !== 0) {
            message.success('Reputation requirement met, no need to stake.').then(() => onClose())
          } else {
            settaskStakeInfo(taskData)
          }
        } else {
          message.error(res.errorMessage || 'Failed to fetch task details')
          onClose()
        }
      } catch (error) {
        if (!active) return
        console.error(error)
        message.error('Failed to fetch task details')
        onClose()
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchtaskStakeInfo()

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, taskId])

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      closable={!loading}
      maskClosable={false}
      styles={{
        content: {
          padding: 0,
          backgroundColor: '#1C1C26',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          minHeight: '200px'
        }
      }}
    >
      {/* Header Warning */}
      <div className="flex items-center justify-center gap-2 bg-[#D92B2B14] py-3 text-base text-[#D92B2B]">
        <ExclamationCircleFilled />
        <span className="font-medium">Gate not met</span>
      </div>

      <div className="p-6 text-base">
        {taskStakeInfo?.has_staked ? (
          <>
            <h2 className="mb-3 font-bold text-white">
              Your current reputation hasn't met the participation gate for this task yet.
            </h2>

            <p className="mb-6 text-sm text-[#A0A0B0]">
              Stake {stakeToKen} to build up your reputation and unlock this task.
            </p>
          </>
        ) : (
          <>
            <h2 className="mb-3 font-bold text-white">Your reputation for this task is still at the starting level.</h2>

            <p className="mb-6 text-sm text-[#A0A0B0]">
              About <span className="font-semibold text-white">{percent}%</span> of the gate is already covered by your
              rewards. Stake a bit more {stakeToKen} to unlock this task.
            </p>
          </>
        )}

        {/* Progress Card */}
        <div className="mb-6 rounded-2xl bg-[#252532] p-5 text-base">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-[#BBBBBE]">Reputation Level</span>
            <span className="text-white">Level {taskStakeInfo?.user_level ?? 0}</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="shrink-0 text-[#BBBBBE]">Your Progress</span>
            <div className="flex w-1/2 items-center gap-1">
              <div className="h-2 flex-1 rounded-full bg-white">
                <div
                  className="h-2 rounded-full bg-[linear-gradient(90deg,#58E6F3,#79A5FC,#D35BFC,#FEBCCC)]"
                  style={{ width: `${percent || 0}%` }}
                ></div>
              </div>
              <div className="text-white">{percent}%</div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-6">
              <span className="text-white">Suggested Stake</span>
              <div className="text-lg text-[#FFA800]">
                <span className="font-bold">{formatNumber(taskStakeInfo?.stake_amount ?? 0, 2)} </span>
                {stakeToKen}
              </div>
            </div>

            <Button
              type="primary"
              onClick={() => onStake(taskId)}
              className="h-10 rounded-full border-none bg-gradient-to-r from-[#875DFF] to-[#6A45E6] px-8 text-sm"
            >
              Stake to unlock
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ToStakeModal
