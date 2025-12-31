import TransitionEffect from '@/components/common/transition-effect'
import { useEffect, useMemo, useState } from 'react'
import { useSnapshot } from 'valtio'
import { notificationStore, notificationStoreActions } from '@/stores/notification.store'
import { Pagination, Select, Spin } from 'antd'
import dayjs from 'dayjs'
import CustomEmpty from '@/components/common/empty'
import notificationApi, { NotificationListItem, NotificationType } from '@/apis/notification.api'

const FilterOptions = [
  { label: 'All', value: '' },
  { label: 'Validation', value: 'validation' },
  { label: 'Submission', value: 'submission' },
  { label: 'System', value: 'system' }
]

function MessageItem(props: { message: NotificationListItem }) {
  const { message } = props
  const displayTime = dayjs(message.create_time * 1000).format('YYYY-MM-DD HH:mm')

  return (
    <div className="rounded-2xl border border-white/5 bg-[#252532] p-6 text-base">
      <div className="mb-4 flex text-white">
        <span className="flex items-center gap-3 font-bold">
          {message.have_read === 0 ? <div className="size-1.5 rounded-full bg-[red]"></div> : null}
          <span> {message.msg_title} </span>
        </span>
        <span className="ml-auto">{displayTime}</span>
      </div>
      <div className="text-[#77777D]">{message.msg_content}</div>
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
  const [filter, setFilter] = useState<NotificationType>()

  useEffect(() => {
    notificationStoreActions.getMessageList(page, page_size, filter || undefined)
  }, [page, filter])

  function handlePageChange(pageNum: number) {
    setPage(pageNum)
  }

  function handleFilterChange(filterValue: NotificationType | undefined) {
    setFilter(filterValue)
    setPage(1)
  }

  const MessageList = useMemo(() => {
    const unReadMessageIds = list.filter((item) => item.have_read === 0).map((item) => item.msg_id)
    if (unReadMessageIds.length > 0) notificationApi.setNotificationRead(unReadMessageIds)

    return list.map((item) => <MessageItem key={item.msg_id} message={item} />)
  }, [list])

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
