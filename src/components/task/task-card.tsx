import { TaskStatus, type TaskReward, type TaskItem } from '@/api-v1/task.api'
import ImageLocked from '@/assets/task/locked.png'
import { useDuration } from '@/hooks/use-duration'
import { cn } from '@udecode/cn'
import { Avatar, Flex } from 'antd'
import dayjs from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'
import RewardBgIcon from '@/assets//task/reward-bg-icon.png'
import QuestRightBgIcon from '@/assets/task/quest-right-bg.png'
import QuestRightDisabledBg from '@/assets/task/quest-right-diabled-bg.png'
import Sandglass from '@/assets/task/sandglass.png'
import AlarmClock from '@/assets/task/alarm-clock.png'
import CountDownBg1 from '@/assets/task/count-down-bg1.png'
import CountDownActiveBg from '@/assets/task/count-down-active-bg.png'
import SandglassItem from '@/assets/task/sandglass-item.png'
import SandglassActiveItem from '@/assets/task/sandglass-active-item.png'
import CountDownIcon from '@/assets/task/countdown-icon.png'

const TaskCard = ({ task, action, onTimeout }: { task: TaskItem; action?: JSX.Element; onTimeout: () => void }) => {
  const checkDisplayRightBg = useMemo(() => {
    if (task.locked) return false
    if (task.max_count) return true
    if (task.start_time && task.expire_time) return true
    if (task.refresh_time) return true
    return false
  }, [task])

  return (
    <Flex
      gap={12}
      component="li"
      className={cn('relative overflow-hidden rounded-3xl bg-gray-100')}
      style={{
        background:
          task.status === TaskStatus.Finished
            ? 'linear-gradient(90deg,#58E6F3 0%,#79A5FC 34.87%,#D35BFC 67.15%,#FEBCCC 100%)'
            : '#2E2E37',
        padding: task.status === TaskStatus.Finished ? '1px' : '0'
      }}
    >
      <div className={cn('w-full overflow-hidden rounded-3xl bg-gray-100', task.locked && 'bg-gray-200')}>
        {checkDisplayRightBg && (
          <div
            className={cn(
              'right-0 top-0 px-6 py-3 sm:absolute sm:h-[76px] sm:w-[329px] sm:pl-[48px] sm:pr-3 sm:pt-[11px]',
              'bg-[length:0%_0%] sm:bg-[length:100%_100%]',
              'bg-primary sm:bg-transparent'
            )}
            style={{
              backgroundImage: checkDisplayRightBg
                ? `url(${TaskStatus.Rewarded === task.status ? QuestRightDisabledBg : QuestRightBgIcon})`
                : ''
            }}
          >
            <Flex gap={8}>
              {task.refresh_time && (
                <CountDownPie refresh_time={task.refresh_time} duration={task.duration} onTimeout={onTimeout} />
              )}
              {!task.refresh_time && task.start_time && task.expire_time && (
                <CountDown startTime={task.start_time} endTime={task.expire_time} />
              )}
              {task.max_count && (
                <CompleteProgress
                  current={
                    [TaskStatus.Finished, TaskStatus.Rewarded].includes(task.status)
                      ? task.max_count!
                      : task.current_count!
                  }
                  max={task.max_count}
                />
              )}
            </Flex>
          </div>
        )}

        <div className="block w-full items-end gap-6 p-6 md:flex">
          <div className="flex flex-col gap-2 md:max-w-[65%]">
            {task.locked ? (
              <div className="w-[48px] shrink-0">
                <img src={ImageLocked} alt="locked" />
              </div>
            ) : (
              <Flex align="center" gap={12}>
                {task.rewards?.map((reward, index) => (
                  <RewardTag key={`${index}-${reward.reward_type}`} reward={reward} />
                ))}
              </Flex>
            )}
            <h2 className="mt-2 text-xl font-bold">{task.name}</h2>
            <p className="mb-3 line-clamp-2 leading-normal text-gray-500">{task.description}</p>
          </div>
          <div className="flex flex-1 justify-end">{action}</div>
        </div>
      </div>
    </Flex>
  )
}

const RewardTag = ({ reward }: { reward: TaskReward }) => (
  <div
    className="relative flex size-[50px] items-center justify-center"
    style={{
      backgroundImage: `url(${RewardBgIcon})`,
      backgroundSize: 'contain'
    }}
  >
    <Avatar
      className="absolute z-[1]"
      src={reward.reward_icon}
      size={30}
      shape="square"
      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
    />
    <p className="absolute bottom-px right-px rounded-bl-none rounded-br-md rounded-tl-md rounded-tr-none bg-[#5734BB] px-[3px] text-xs leading-[15px]">
      {reward.reward_value}
    </p>
  </div>
)

function CompleteProgress(props: { current: number; max: number; count?: number }) {
  const percent = Math.round((props.current / props.max) * 100)
  return <TaskProgress label={percent + ' %'} percent={percent} count={props.count} />
}

function CountDown(props: { startTime: string | number; endTime: string | number }) {
  const dur = useDuration(props.endTime)
  const totalDuration = useMemo(
    () => dayjs.duration(dayjs.utc(props.endTime).diff(dayjs.utc(props.startTime))).asSeconds(),
    [props.startTime, props.endTime]
  )
  const percent = 100 - Math.round(((totalDuration - dur.asSeconds()) / totalDuration) * 100)
  return (
    <div className="flex items-center">
      <img className="relative z-[1] mr-[-9px]" src={AlarmClock} width={32} height={32} alt="" />
      <div
        className="relative flex h-[22px] w-[99px] items-center overflow-hidden pl-[9px]"
        style={{
          backgroundImage: `url(${CountDownBg1})`,
          backgroundSize: '100% 100%'
        }}
      >
        <div
          className="absolute top-[3px] h-4 w-full"
          style={{
            backgroundImage: `url(${CountDownActiveBg})`,
            backgroundSize: `100% 100%`,
            left: `-${100 - percent}%`
          }}
        ></div>
        <div className="absolute left-3 top-px z-[1] text-sm">
          {percent < 0
            ? '0h 0m 0s'
            : dur.asSeconds() > 1
              ? dur.asDays() >= 1
                ? dur.format('D[d] H[h] m[m]')
                : dur.format('H[h] m[m] s[s]')
              : '0h 0m 0s'}
        </div>
      </div>
    </div>
  )
}

function CountDownPie(props: { refresh_time: number; onTimeout: () => void; duration: number }) {
  const { refresh_time, onTimeout } = props
  const [refershTime] = useState(refresh_time)

  const dur = useDuration((refresh_time + 2) * 1000)
  const durFormat = dur.days() >= 1 ? 'D[d] H[h] m[m]' : 'H[h] m[m] s[s]'

  useEffect(() => {
    const intervalTimer = setInterval(() => {
      const now = Date.now() / 1000
      if (now > refershTime) {
        onTimeout()
        clearInterval(intervalTimer)
      }
    }, 1000)
    return () => {
      clearInterval(intervalTimer)
    }
  }, [onTimeout, refershTime])

  return (
    <div className="flex items-center font-semibold">
      <img className="relative z-[1] mr-[-9px]" src={CountDownIcon} width={32} height={32} alt="" />
      <div
        className="flex h-[22px] w-[121px] items-center justify-center"
        style={{
          backgroundImage: `url(${CountDownBg1})`,
          backgroundSize: '100% 100%'
        }}
      >
        <div className="text-sm">{dur.format(durFormat)}</div>
      </div>
    </div>
  )
}

function RateItem(props: { value: number; bgColor?: string }) {
  const { value } = props
  return (
    <div className="relative">
      <div
        className="h-4 w-[10px]"
        style={{
          backgroundImage: `url(${SandglassItem})`,
          backgroundSize: '100%'
        }}
      ></div>
      <div
        className="absolute left-0 top-0 h-4 overflow-hidden"
        style={{
          backgroundImage: `url(${SandglassActiveItem})`,
          backgroundSize: '100%',
          width: `${value}%`
        }}
      ></div>
    </div>
  )
}

const TaskProgress = (props: {
  label?: React.ReactNode
  icon?: React.ReactNode
  percent: number
  className?: string
  count?: number
}) => {
  const { percent: rateValue, count: countValue } = props
  const [rate, setRate] = useState<number>(0)
  const [count, setCount] = useState(countValue || 5)

  useEffect(() => {
    setRate(rateValue)
    setCount(countValue || 5)
  }, [rateValue, countValue])

  function renderRateItems(count: number) {
    let _rateValue = rateValue
    const items = []
    const unit = 100 / count
    for (let i = 0; i < count; i++) {
      // const itemFullValue = (i + 1) * unit
      const itemRate = _rateValue < unit ? _rateValue : 100
      _rateValue = _rateValue - unit
      items.push(<RateItem value={itemRate} key={i} />)
    }
    return items
  }

  return (
    <div className={props.className}>
      <Flex align="center" className="text-xs font-semibold">
        <img className="relative z-[1] mr-[-9px]" src={Sandglass} width={32} height={32} alt="" />
        <div
          className="flex w-[112px] items-center justify-end py-[4px] pr-[5px]"
          style={{
            backgroundImage: `url(${CountDownBg1})`,
            backgroundSize: '100% 100%'
          }}
        >
          <span className="mr-[2px]">{rate}%</span>
          <div className="flex gap-[2px]">{renderRateItems(count)}</div>
        </div>
      </Flex>
    </div>
  )
}

export default TaskCard
