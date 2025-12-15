import React, { useEffect, useMemo, useState } from 'react'
import { Button, Pagination, Spin, Tooltip } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useSnapshot } from 'valtio'

import AngleRight from '@/assets/crypto/angle-right.svg'
import FilterIcon from '@/assets/icons/filter.svg?react'
import AirdropTagIcon from '@/assets/frontier/home/airdrop-tag-icon.svg?react'
import ActivityTagIcon from '@/assets/frontier/home/activity-tag-icon.svg?react'

import CustomEmpty from '@/components/common/empty'

import { frontiersStore, frontierStoreActions } from '@/stores/frontier.store'
import { TaskDetail } from '@/apis/frontiter.api'
import { cn } from '@udecode/cn'
import RoboticsTaskFilterModal, { type RoboticsFilterState } from './task-filter-modal'

const RoboticsTaskList: React.FC = () => {
  const navigate = useNavigate()
  const { frontier_id = 'ROBSTIC001' } = useParams()

  const {
    pageData: { page, page_size, total, list, listLoading }
  } = useSnapshot(frontiersStore)

  const DEFAULT_FILTER_STATE: RoboticsFilterState = {
    taskTypes: ['submission', 'validation']
  }

  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [filter, setFilter] = useState<RoboticsFilterState>(DEFAULT_FILTER_STATE)

  const displayList = useMemo(() => {
    return list?.filter((item) => !item.data_display?.hide)
  }, [list])

  const goToForm = (data: TaskDetail) => {
    navigate(`/frontier/project/${data.data_display.template_id}/${data.task_id}`)
  }

  const handlePageChange = (page: number, _pageSize: number) => {
    frontierStoreActions.changeFrontiersFilter({ page: page, frontier_id: frontier_id })
  }

  useEffect(() => {
    frontierStoreActions.changeFrontiersFilter({ page, page_size, frontier_id: frontier_id })
  }, [page, page_size, frontier_id])

  useEffect(() => {
    console.log('filter', filter, filter.taskTypes)
    // Refetch list when filter conditions change
    frontierStoreActions.changeFrontiersFilter({
      page: 1,
      page_size,
      frontier_id: frontier_id,
      task_types: filter.taskTypes.join(',')
    })
  }, [filter, page_size, frontier_id])

  return (
    <div>
      <div className="mb-3 flex flex-1 items-center justify-between">
        <div className="flex">
          <div className="text-lg font-normal text-white/80">Start earning rewards!</div>
        </div>
        <div className="flex gap-4 text-base">
          <Button
            className="flex h-[44px] cursor-pointer items-center gap-[50px] rounded-full px-4"
            onClick={() => setFilterModalOpen(true)}
          >
            <div className="">Filter</div>
            <FilterIcon className="size-5" />
          </Button>
          <Button
            onClick={() => navigate(`/app/frontier/${frontier_id}/history`)}
            className="flex h-[44px] cursor-pointer items-center gap-1 rounded-full px-4"
          >
            <div className="">History</div>
            <AngleRight size={14} />
          </Button>
        </div>
      </div>
      <Spin spinning={listLoading}>
        <div className="mt-6">
          <div className="">
            {displayList?.map((item) => (
              <div
                onClick={() => goToForm(item as TaskDetail)}
                key={item.task_id}
                className={cn(
                  'relative mb-5 flex cursor-pointer flex-row items-center justify-between gap-4 rounded-2xl border border-[#FFFFFF1F] p-4 transition-all hover:border-primary hover:shadow-primary md:mb-7 md:p-6'
                )}
              >
                <div className="absolute left-6 top-[-12px] flex items-center gap-2">
                  {item.tags?.map((tag) => (
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
                <div className="flex flex-col items-center gap-1 md:flex-row md:gap-4">
                  {item.data_display.template_id !== 'CMU_TPL_000001' && (
                    <div className="flex w-full flex-none items-center justify-start gap-4 md:w-auto">
                      {item.reward_info?.map((reward) => (
                        <div className="flex items-center text-center">
                          <Tooltip
                            title={
                              reward.reward_mode === 'REGULAR'
                                ? 'Instant reward granted for your submission'
                                : reward.reward_mode === 'DYNAMIC'
                                  ? 'Additional reward unlocked upon approval'
                                  : ''
                            }
                          >
                            <img src={reward.reward_icon} alt="" className="size-8 md:size-12" />
                          </Tooltip>
                          <span className="text-sm">x{reward.reward_value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="order-first flex-auto break-all font-semibold md:order-last">{item.name}</div>
                </div>
                <div className="w-[88px] shrink-0 cursor-pointer rounded-full bg-[#875DFF] py-2 text-center text-xs text-[#FFFFFF]">
                  {item.task_type_name}
                </div>
              </div>
            ))}
          </div>
          {displayList?.length === 0 && (
            <div className="flex h-[calc(100vh_-_380px)] w-full items-center justify-center">
              <CustomEmpty />
            </div>
          )}
        </div>
        {total > page_size && (
          <div>
            <div className="mt-auto flex items-center">
              <span className="hidden text-sm md:block">Total {total}</span>
              <Pagination
                showSizeChanger={false}
                onChange={handlePageChange}
                className="ml-auto py-5"
                total={total}
                pageSize={page_size}
                current={page}
              ></Pagination>
            </div>
          </div>
        )}
      </Spin>
      <RoboticsTaskFilterModal
        open={filterModalOpen}
        value={filter}
        onChange={setFilter}
        onClose={() => setFilterModalOpen(false)}
      />
    </div>
  )
}

export default RoboticsTaskList
