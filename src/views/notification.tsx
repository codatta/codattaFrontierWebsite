import TransitionEffect from '@/components/common/transition-effect'
import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import { notificationStore, notificationStoreActions } from '@/stores/notification.store'
import { Pagination, Select, Spin } from 'antd'
import dayjs from 'dayjs'
import CustomEmpty from '@/components/common/empty'
import { NotificationItem } from '@/api-v1/notification.api'

const FilterOptions = [
  { label: 'All', value: '' },
  { label: 'Validation', value: 'validation' },
  { label: 'Submission', value: 'submission' },
  { label: 'Bounty', value: 'bounty' }
]

function MessageItem(props: { message: NotificationItem }) {
  const { message } = props
  const displayTime = dayjs(message.create_time * 1000).format('YYYY-MM-DD')
  const messageRead: boolean = message.have_read == '1'

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-gray-100 p-4 text-sm lg:flex-row">
      <div className="flex gap-2 lg:w-[70%]">
        {!messageRead && (
          <div className="flex w-2 items-center justify-center">
            <i className="block size-2 rounded-full bg-primary"></i>
          </div>
        )}

        <div className={`break-all ${!messageRead ? 'text-gray-900' : 'text-gray-700'}`}>{message.msg_content}</div>
      </div>

      <div className="flex w-full items-center gap-2 lg:w-[30%]">
        <div className="w-[80px]">
          <div className="inline-block rounded-2xl bg-gray-200 px-2 py-1 text-xs leading-[15px]">
            {message.notify_type}
          </div>
        </div>

        <div className="ml-auto w-[90px] flex-none text-right text-sm font-semibold text-gray-500">{displayTime}</div>
      </div>
    </div>
  )
}

function PaginationSection(props: {
  total: number
  pageSize: number
  page: number
  onPageChange: (page: number, pageSize: number) => void
}) {
  const { total, pageSize, page, onPageChange } = props

  if (total === 0) return <></>
  return (
    <div className="mt-auto flex items-center">
      <span className="text-sm">Total {total}</span>
      <Pagination
        showSizeChanger={false}
        onChange={onPageChange}
        className="ml-auto py-5"
        total={total}
        pageSize={pageSize}
        current={page}
      ></Pagination>
    </div>
  )
}

export default function Component() {
  const page_size = 20
  const { list, total, listLoading } = useSnapshot(notificationStore)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<null | string>('')

  useEffect(() => {
    notificationStoreActions.getMessageList(page, page_size, filter || undefined)
  }, [page, filter])

  function handlePageChange(pageNum: number) {
    setPage(pageNum)
  }

  function handleFilterChange(filterValue: string) {
    setFilter(filterValue)
    setPage(1)
  }

  const MessageList = list.map((item) => <MessageItem key={item.msg_id} message={item} />)

  return (
    <TransitionEffect className="min-h-[calc(100vh-200px)]">
      <h1 className="mb-4 text-[32px] font-semibold leading-8">Notification</h1>
      <div className="mb-4 flex justify-between">
        <Select options={FilterOptions} value={filter} className="w-[160px]" onChange={handleFilterChange}></Select>
      </div>
      <Spin spinning={listLoading}>
        <div className="flex min-h-[calc(100vh-160px)] flex-col">
          <div className="flex flex-col gap-[16px]">{MessageList.length > 0 ? MessageList : <CustomEmpty />}</div>
          <PaginationSection
            total={total}
            pageSize={page_size}
            page={page}
            onPageChange={handlePageChange}
          ></PaginationSection>
        </div>
      </Spin>
    </TransitionEffect>
  )
}
