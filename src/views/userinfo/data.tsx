import { Empty, message, Table } from 'antd'
import type { TableProps, TablePaginationConfig } from 'antd'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'

import BookIcon from '@/assets/userinfo/book-icon.svg?react'
import ChainIcon from '@/assets/userinfo/chain-icon.svg?react'
// import LevelASvg from '@/assets/userinfo/level-a-icon.svg?react'
// import LevelBSvg from '@/assets/userinfo/level-b-icon.svg?react'
// import LevelCSvg from '@/assets/userinfo/level-c-icon.svg?react'
// import LevelDSvg from '@/assets/userinfo/level-d-icon.svg?react'
// import LevelSSvg from '@/assets/userinfo/level-s-icon.svg?react'

import { getFrontierUserRecords, getFrontierUserStatics, useFrontierStore } from '@/stores/frontier.store'

import { SubmissionRecord } from '@/apis/frontiter.api'

export default function UserInfoData() {
  return (
    <div>
      <h3 className="mb-1 text-[32px] font-bold leading-[48px]">Submission Records</h3>
      <p className="mb-12 text-sm text-[#BBBBBE]">Track your data annotation history and blockchain status.</p>
      <TotalView />
      <RecordView />
    </div>
  )
}

function TotalView() {
  const { userStatics } = useFrontierStore()

  useEffect(() => {
    getFrontierUserStatics()
  }, [])

  return (
    <div className="mb-6 flex items-center gap-6">
      <div className="flex min-w-[60px] flex-1 items-center justify-between rounded-2xl bg-[#252532] px-6 py-7">
        <div className="flex items-center gap-4">
          <BookIcon />
          <span className="text-base font-bold">Total Submissions</span>
        </div>
        <span className="text-[32px] font-bold leading-[48px]">{userStatics.total_submissions}</span>
      </div>
      <div className="flex min-w-[60px] flex-1 items-center justify-between rounded-2xl bg-[#252532] px-6 py-7">
        <div className="flex items-center gap-4">
          <ChainIcon />
          <span className="text-base font-bold">Onchained</span>
        </div>
        <span className="text-[32px] font-bold leading-[48px]">{userStatics.on_chained}</span>
      </div>
    </div>
  )
}

interface DataType {
  id: string
  key: string
  time: string
  frontier_name: string
  score: string
  reward: string
  on_chained: boolean
}

// const getScoreBackgroundColor = (score: string) => {
//   switch (score) {
//     case 'S':
//       return 'bg-[#F5A623]'
//     case 'A':
//       return 'bg-[#4A90E2]'
//     case 'B':
//       return 'bg-[#50E3C2]'
//     case 'C':
//       return 'bg-[#E35050]'
//     case 'D':
//       return 'bg-[#9B59B6]'
//     default:
//       return 'bg-gray-400'
//   }
// }

const onChain = () => {
  message.info('Coming soon!')
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
    width: '30%'
  },
  {
    title: 'Frontier Name',
    dataIndex: 'frontier_name',
    key: 'frontier_name',
    width: '25%'
  },
  // {
  //   title: 'Score',
  //   dataIndex: 'score',
  //   key: 'score',
  //   width: '15%',
  //   align: 'center',
  //   render: (score: string) => (
  //     <div className="ml-2 flex size-6 items-center rounded-full font-bold text-black">
  //       {score === 'S' ? (
  //         <LevelSSvg />
  //       ) : score === 'A' ? (
  //         <LevelASvg />
  //       ) : score === 'B' ? (
  //         <LevelBSvg />
  //       ) : score === 'C' ? (
  //         <LevelCSvg />
  //       ) : score === 'D' ? (
  //         <LevelDSvg />
  //       ) : null}
  //     </div>
  //   )
  // },
  {
    title: 'Reward',
    dataIndex: 'reward',
    key: 'reward',
    width: '25%',
    render: (reward: string) => <span className="text-[#875DFF]">{reward}</span>
  },
  {
    title: 'Action',
    dataIndex: 'on_chained',
    key: 'on_chained',
    width: '15%',
    align: 'center',
    render: (on_chained: boolean) => {
      if (on_chained) {
        return <span className="px-4 py-1.5 text-xs text-white">Onchained</span>
      }
      return (
        <button
          className="cursor-pointer rounded-full border-none bg-[#6A4FF4] px-4 py-1.5 text-xs text-white"
          onClick={onChain}
        >
          Onchain
        </button>
      )
    }
  }
]

function RecordView() {
  const { userRecords } = useFrontierStore()
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: userRecords.page,
    pageSize: userRecords.page_size,
    total: userRecords.total || 0
  })

  useEffect(() => {
    getFrontierUserRecords({ page: pagination.current || 1 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current])

  useEffect(() => {
    setPagination((p) => ({ ...p, total: userRecords.total || 0 }))
  }, [userRecords.total])

  const handleTableChange = (p: TablePaginationConfig) => {
    setPagination((prev) => ({ ...prev, current: p.current || 1 }))
  }

  return (
    <div className="rounded-2xl bg-[#252532] p-6">
      <Table<DataType>
        className="[&_.ant-table-placeholder]:border-b-0 [&_.ant-table]:bg-transparent"
        columns={columns}
        dataSource={userRecords.list.map((r: SubmissionRecord) => ({
          id: r.submission_id,
          key: r.submission_id,
          time: dayjs(r.submission_time * 1000).format('YYYY/MM/DD HH:mm'),
          frontier_name: r.frontier_name,
          score: r.score,
          reward: r.reward,
          on_chained: !!r.on_chained
        }))}
        rowKey="key"
        loading={userRecords.listLoading}
        pagination={{
          ...pagination,
          position: ['bottomCenter'],
          className:
            'mt-6 flex items-center justify-center gap-x-4 [&_.ant-pagination-item-active]:bg-[#40404b] [&_.ant-pagination-item-active]:text-white [&_.ant-pagination-item-active]:border-none [&_.ant-pagination-item]:bg-transparent [&_.ant-pagination-item]:text-white [&_.ant-pagination-item]:border-none',
          showTotal: (total) => <span className="text-white/60">{`Total (${total})`}</span>,
          itemRender: (current: number, type: string, originalElement: React.ReactNode) => {
            if (type === 'prev' || type === 'next' || type === 'jump-prev' || type === 'jump-next') {
              return <span className="flex h-full items-center justify-center text-white/60">{originalElement}</span>
            }
            if (type === 'page') {
              return (
                <a
                  className={`flex size-8 items-center justify-center rounded-md border-none !text-white ${
                    current === pagination.current ? 'bg-[#40404b]' : ''
                  }`}
                >
                  {current}
                </a>
              )
            }
            return originalElement
          }
        }}
        onChange={handleTableChange}
        components={{
          table: ({ children }: { children: React.ReactNode }) => (
            <table className="w-full table-fixed">{children}</table>
          ),
          header: {
            wrapper: ({ children }: { children: React.ReactNode }) => (
              <thead className="bg-transparent text-white">{children}</thead>
            ),
            row: ({ children }: { children: React.ReactNode }) => (
              <tr className="border-b border-white/10">{children}</tr>
            ),
            cell: ({ children }: { children: React.ReactNode }) => (
              <th className="p-4 text-left text-sm font-normal first:!pl-0 last:pl-8">{children}</th>
            )
          },
          body: {
            row: ({ children }: { children: React.ReactNode }) => (
              <tr className="border-b border-white/10 last:border-b-0 hover:bg-white/5">{children}</tr>
            ),
            cell: ({ children }: { children: React.ReactNode }) =>
              userRecords.total === 0 ? null : (
                <td className="truncate p-4 text-sm text-white first:!pl-0">{children}</td>
              )
          }
        }}
      />
      {userRecords.total === 0 && <Empty className="my-10" />}
    </div>
  )
}
