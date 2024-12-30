import CustomEmpty from '@/components/common/empty'
import TransitionEffect from '@/components/common/transition-effect'
import { getSubmissions, useSubmissionStore } from '@/stores/submission.store'
import { Button, Flex, Pagination, Select, Spin, message } from 'antd'
import { useEffect, useState } from 'react'
import ReactGA from 'react-ga4'
import { useNavigate } from 'react-router-dom'
import SubmissionDetailList from '@/components/crypto/submission/submission-detail-list'
import { ArrowLeft, Plus } from 'lucide-react'
import { TPagination } from '@/api-v1/request'

type SubmissionStatus = 'ALL' | 'InProgress' | 'Completed'

const FilterOptions: { label: string; value: SubmissionStatus }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'In Progress', value: 'InProgress' },
  { label: 'Completed', value: 'Completed' }
]

export default function Component() {
  const [filter, setFilter] = useState<SubmissionStatus>('ALL')
  const { list, listLoading, total } = useSubmissionStore()
  const [page, setPage] = useState(1)
  const pageSize = 12
  const navigate = useNavigate()

  async function fetchSubmissions(pagination: TPagination, filter: SubmissionStatus) {
    try {
      const { current, pageSize } = pagination
      await getSubmissions({ filter, page: current, page_size: pageSize })
    } catch (err) {
      message.error(err.message)
    }
  }

  function handleStatusChange(status: SubmissionStatus) {
    setFilter(status)
  }

  useEffect(() => {
    fetchSubmissions({ current: page, pageSize }, filter)
  }, [page, filter])

  function SubmissionList() {
    return (
      <>
        {list.length === 0 ? (
          <div className="flex h-[calc(100vh_-_200px)] items-center justify-center">
            <CustomEmpty />
          </div>
        ) : (
          <SubmissionDetailList list={list} />
        )}
      </>
    )
  }

  function SubmissionPagination() {
    if (list.length) {
      return (
        <>
          <span className="text-sm">Total {total}</span>
          <Pagination
            showSizeChanger={false}
            onChange={(page) => setPage(page)}
            className="ml-auto py-5"
            total={total}
            pageSize={pageSize}
            current={page}
          ></Pagination>
        </>
      )
    }
    return null
  }

  function handleSubmissionClick() {
    navigate('/app/crypto/submission/submit')
    ReactGA.event('submission_history_submission_btn_click')
  }

  return (
    <>
      <TransitionEffect className="">
        <div className="mb-6 flex items-center gap-2">
          <ArrowLeft size={28} onClick={() => navigate(-1)} className="cursor-pointer" />
          <h1 className="text-2xl font-bold">Histroy</h1>
        </div>
        <div className="mb-4 flex justify-between">
          <Select
            options={FilterOptions}
            defaultValue="ALL"
            className="w-[160px]"
            onChange={handleStatusChange}
            size="large"
          ></Select>
          <Flex align="center" gap={16}>
            <Button type="primary" shape="round" size="large" onClick={handleSubmissionClick}>
              <Plus size={16} /> Submission
            </Button>
          </Flex>
        </div>
        <Spin spinning={listLoading}>
          <div className="no-scrollbar overflow-y-scroll">
            <div className="flex h-full flex-col gap-2 overflow-hidden rounded-sm bg-gray-50">
              <SubmissionList />
            </div>
          </div>
          <div className="mt-auto flex items-center">
            <SubmissionPagination></SubmissionPagination>
          </div>
        </Spin>
      </TransitionEffect>
    </>
  )
}
