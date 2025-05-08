import React, { useEffect } from 'react'
import { Pagination, Spin } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useSnapshot } from 'valtio'
import AngleRight from '@/assets/crypto/angle-right.svg'

import { frontiersStore, changeFrontiersFilter } from '@/stores/frontier.store'
import CustomEmpty from '@/components/common/empty'
import { TaskDetail } from '@/apis/frontiter.api'

const RoboticsTaskList: React.FC = () => {
  const navigate = useNavigate()
  const { frontier_id = 'ROBSTIC001' } = useParams()

  const {
    pageData: { page, page_size, total, list, listLoading }
  } = useSnapshot(frontiersStore)

  const goToForm = (data: unknown) => {
    // Create a mutable copy of the readonly object to avoid TypeScript errors
    const mutableData = JSON.parse(JSON.stringify(data)) as TaskDetail

    if (mutableData.data_display.template_id === 'CMU_TPL_000001') {
      navigate(`/frontier/project/${mutableData.data_display.template_id}/${mutableData.task_id}`)
    } else {
      navigate(`/frontier/robotics/${mutableData.data_display.template_id}/${mutableData.task_id}`)
    }
  }

  const handlePageChange = (page: number, _pageSize: number) => {
    changeFrontiersFilter({ page: page, frontier_id: frontier_id })
  }

  useEffect(() => {
    changeFrontiersFilter({ page, page_size, frontier_id: frontier_id })
  }, [page, page_size, frontier_id])

  return (
    <div>
      <div className="mb-3 flex flex-1 items-center justify-between">
        <div className="flex">
          <div className="text-lg font-normal text-white/80">Start earning rewards!</div>
        </div>
        <div
          onClick={() => navigate(`/app/robotics/history/${frontier_id}`)}
          className="flex cursor-pointer items-center"
        >
          <div className="text-xs font-normal text-white/80">History</div>
          <AngleRight size={14} />
        </div>
      </div>

      <Spin spinning={listLoading}>
        <div className="mt-6">
          <div className="">
            {list?.map((item) => (
              <div
                onClick={() => goToForm(item)}
                key={item.task_id}
                className="mb-3 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#FFFFFF1F] p-6 transition-all hover:border-primary hover:shadow-primary"
              >
                <div className="flex flex-col items-center gap-1 md:flex-row md:gap-4">
                  <div className="flex w-full flex-none items-center justify-start gap-4 md:w-auto">
                    {item.reward_info?.map((reward) => (
                      <div className="flex items-center text-center md:flex-col">
                        <img src={reward.reward_icon} alt="" className="size-12" />
                        <span>{reward.reward_value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-first flex-auto break-all font-semibold md:order-last">{item.name}</div>
                </div>
                <div className="w-[88px] shrink-0 cursor-pointer rounded-full bg-[#875DFF] py-2 text-center text-xs text-[#FFFFFF]">
                  Submit
                </div>
              </div>
            ))}
          </div>
          {list?.length === 0 && (
            <div className="flex h-[calc(100vh_-_380px)] w-full items-center justify-center">
              <CustomEmpty />
            </div>
          )}
        </div>
        <div>
          <div className="mt-auto flex items-center">
            <span className="text-sm">Total {total}</span>
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
      </Spin>
    </div>
  )
}

export default RoboticsTaskList
