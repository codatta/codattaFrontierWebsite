import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Pagination, Spin, Tooltip } from 'antd'
import { useSnapshot } from 'valtio'

import arrowLeft from '@/assets/common/arrow-left.svg'
import AirdropTagIcon from '@/assets/frontier/home/airdrop-tag-icon.svg?react'
import ActivityTagIcon from '@/assets/frontier/home/activity-tag-icon.svg?react'

import { frontiersStore, frontierStoreActions } from '@/stores/frontier.store'
import dayjs from 'dayjs'

import CustomEmpty from '@/components/common/empty'
import { cn } from '@udecode/cn'
import React from 'react'
import { TaskDetail } from '@/apis/frontiter.api'

function SubmissionResultLevel({ result }: { result: 'S' | 'A' | 'B' | 'C' | 'D' }) {
  const resultColorMap = {
    S: 'bg-[#E7B231]',
    A: 'bg-[#54F0B7]',
    B: 'bg-[#5CB0FF]',
    C: 'bg-[#F0A254]',
    D: 'bg-[#F07354]'
  }

  return (
    <div
      className={cn(
        'flex size-8 items-center justify-center rounded-full font-bold text-black',
        resultColorMap[result]
      )}
    >
      {result}
    </div>
  )
}

const statusColorMap: Record<string, string> = {
  ADOPT: '#5DDD22',
  PENDING: '#FFA800',
  REFUSED: '#EF4444'
}

const CardItem = ({ item }: { item: TaskDetail }) => {
  return (
    <div
      key={`${item.submission_id}-${item.task_type}`}
      className="relative flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-[#FFFFFF1F] p-4 transition-all hover:border-primary hover:shadow-primary md:p-6"
    >
      <div className="absolute left-5 top-[-12px] flex items-center gap-2">
        {item.tags?.map((tag: string) => (
          <React.Fragment key={tag}>
            {tag === 'airdrop' && (
              <Tooltip title="Airdrop">
                <AirdropTagIcon className="size-6" />
              </Tooltip>
            )}
            {tag === 'activity' && (
              <Tooltip title="Activity">
                <ActivityTagIcon className="size-6" />
              </Tooltip>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex-1">
        <div className="mb-3 flex items-center break-all font-semibold md:mb-5">
          {item.name}
          {item.task_type_name && (
            <span className="ml-3 flex h-7 items-center rounded-full bg-[#875DFF33] px-2 text-sm font-normal text-[#875DFF]">
              {item.task_type_name}
            </span>
          )}
        </div>
        <div className="text-white/45">{dayjs(item.create_time * 1000).format('DD MMM YYYY h:mm a')}</div>
      </div>
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2 py-2 text-sm">
          <div style={{ backgroundColor: statusColorMap[item.status] }} className={cn('size-1 rounded-full')}></div>
          <span style={{ color: statusColorMap[item.status] }} className={cn('text-sm')}>
            {item.status}
          </span>
        </div>
      </div>
      {item.result && (
        <div className="ml-auto shrink-0">
          <SubmissionResultLevel result={item.result}></SubmissionResultLevel>
        </div>
      )}
      {item.reward_points && item.reward_points > 0 ? (
        <div className="text-primary">
          + <strong>{item.reward_points}</strong> Points
        </div>
      ) : null}
    </div>
  )
}

const CardList = () => {
  const { historyPageData } = useSnapshot(frontiersStore)

  return (
    <div className="mt-6 w-full">
      <div className="flex w-full flex-col gap-6">
        {historyPageData.list?.map((item, index) => (
          <CardItem key={`${item.submission_id}-${index}`} item={item as TaskDetail} />
        ))}
      </div>
      {historyPageData.list?.length === 0 && (
        <div className="flex h-[calc(100vh_-_380px)] w-full items-center justify-center">
          <CustomEmpty />
        </div>
      )}
    </div>
  )
}

export default function Component() {
  const navigate = useNavigate()
  const { frontier_id } = useParams()

  const {
    historyPageData: { page, page_size, total, listLoading }
  } = useSnapshot(frontiersStore)

  const handlePageChange = (page: number) => {
    frontierStoreActions.changeFrontiersHistoryFilter(page, frontier_id!)
  }

  useEffect(() => {
    frontierStoreActions.changeFrontiersHistoryFilter(1, frontier_id!)
  }, [frontier_id])

  return (
    <div className=" ">
      <div className="mb-6 flex cursor-pointer text-2xl font-semibold leading-8" onClick={() => navigate(-1)}>
        <img src={arrowLeft} alt="" className="mr-1" />
        <span>History</span>
      </div>
      <Spin spinning={listLoading}>
        <CardList />
        <div className="mt-6">
          <Pagination
            showSizeChanger={false}
            onChange={handlePageChange}
            align="center"
            total={total}
            pageSize={page_size}
            current={page}
            size="small"
          ></Pagination>
        </div>
      </Spin>
    </div>
  )
}
