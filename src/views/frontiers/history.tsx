import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Pagination, Spin } from 'antd'
import { useSnapshot } from 'valtio'
import { ArrowUpRight } from 'lucide-react'

import arrowLeft from '@/assets/common/arrow-left.svg'
import { frontiersStore, frontierStoreActions } from '@/stores/frontier.store'
import dayjs from 'dayjs'

import CustomEmpty from '@/components/common/empty'

const CardList = () => {
  const { historyPageData } = useSnapshot(frontiersStore)
  return (
    <div className="mt-6 w-full">
      <div className="flex w-full flex-col gap-3">
        {historyPageData.list?.map((item, index) => (
          <div
            key={`${item.submission_id}-${item.task_type}-${index}`}
            className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#FFFFFF1F] p-4 transition-all hover:border-primary hover:shadow-primary md:p-6"
          >
            <div className="flex-1">
              <div className="mb-2 break-all font-semibold md:mb-6">{item.name}</div>
              <div>{dayjs(item.create_time * 1000).format('DD MMM YYYY h:mm a')}</div>
            </div>
            <div className="flex w-[100px] flex-col items-center">
              <div className="mb-2 ml-auto w-[88px] flex-none rounded-full bg-white/5 py-2 text-center text-xs text-[#8D8D93]">
                {item.status}
              </div>
              {!['CMU_TPL_000001', 'FATE_TPL_000001'].includes(item.data_submission?.['templateId'] as string) ? (
                <>
                  {item.status === 'SUBMITTED' ? (
                    <a className="flex hover:text-primary" href={item.txHashUrl} target="_blank">
                      <span className="text-xs">On-chain Success!</span>
                      <ArrowUpRight strokeWidth={1.25} size={16} />
                    </a>
                  ) : (
                    <div>On-chain...</div>
                  )}
                </>
              ) : null}
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
