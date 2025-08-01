import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Pagination, Spin } from 'antd'
import { useSnapshot } from 'valtio'
import { ArrowUpRight } from 'lucide-react'

import arrowLeft from '@/assets/common/arrow-left.svg'
import { frontiersStore, frontierStoreActions } from '@/stores/frontier.store'
import dayjs from 'dayjs'

import CustomEmpty from '@/components/common/empty'
import { cn } from '@udecode/cn'

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

const CardList = () => {
  const { historyPageData } = useSnapshot(frontiersStore)
  return (
    <div className="mt-6 w-full">
      <div className="flex w-full flex-col gap-3">
        {historyPageData.list?.map((item, index) => (
          <div
            key={`${item.submission_id}-${item.task_type}-${index}`}
            className="flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-[#FFFFFF1F] p-4 transition-all hover:border-primary hover:shadow-primary md:p-6"
          >
            <div className="flex-1">
              <div className="mb-1 break-all font-semibold md:mb-1">{item.name}</div>
              <div className="text-white/45">{dayjs(item.create_time * 1000).format('DD MMM YYYY h:mm a')}</div>
            </div>
            <div className="ml-auto shrink-0">
              <SubmissionResultLevel result={item.result}></SubmissionResultLevel>
            </div>
            <div className="flex items-center">
              <div className="ml-auto w-[88px] flex-none rounded-full bg-white/5 py-2 text-center text-xs text-[#8D8D93]">
                {item.status}
              </div>
            </div>
          </div>
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
