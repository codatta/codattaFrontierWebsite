import { Table, TableProps } from 'antd'
import { ComponentProps, useEffect, useState, useCallback } from 'react'
import { ExternalLink } from 'lucide-react'
import dayjs from 'dayjs'
import userApi, { StakeRecordItem } from '@/apis/user.api'
import { formatNumber } from '@/utils/str'

interface HistoryItem {
  key: string
  time: string
  amount: string
  status: string
  tx: string
}

interface StakingTableProps<T> extends TableProps<T> {
  total?: number
  current?: number
  pageSize?: number
  onPageChange?: (page: number, pageSize: number) => void
}

function StakingTable<T extends object>({
  columns,
  dataSource,
  total = 0,
  current = 1,
  pageSize = 10,
  onPageChange
}: StakingTableProps<T>) {
  return (
    <div className="rounded-2xl bg-[#252532] p-6">
      <Table
        className="[&_.ant-table-placeholder]:border-b-0 [&_.ant-table-placeholder_.ant-empty-description]:text-[#BBBBBE] [&_.ant-table-placeholder_.ant-empty]:flex [&_.ant-table-placeholder_.ant-empty]:flex-col [&_.ant-table-placeholder_.ant-empty]:items-center [&_.ant-table-placeholder_.ant-table-cell]:!px-0 [&_.ant-table-placeholder_.ant-table-cell]:!text-center [&_.ant-table]:bg-transparent"
        columns={columns}
        dataSource={dataSource}
        pagination={{
          total,
          current,
          pageSize,
          onChange: onPageChange,
          position: ['bottomRight'],
          showSizeChanger: false,
          className:
            'mt-6 flex w-full items-center gap-x-2 [&_.ant-pagination-total-text]:mr-auto [&_.ant-pagination-item-active]:bg-[#40404b] [&_.ant-pagination-item-active]:text-white [&_.ant-pagination-item-active]:border-none [&_.ant-pagination-item]:bg-transparent [&_.ant-pagination-item]:text-white/60 [&_.ant-pagination-item]:border-none [&_.ant-pagination-prev_button]:!text-white/60 [&_.ant-pagination-next_button]:!text-white/60',
          showTotal: (total) => <span className="text-[#BBBBBE]">{`Total ${total}`}</span>
        }}
        components={{
          table: ({ children, ...props }: ComponentProps<'table'>) => (
            <table {...props} className={`w-full border-collapse ${props.className || ''}`}>
              {children}
            </table>
          ),
          header: {
            wrapper: ({ children, ...props }: ComponentProps<'thead'>) => (
              <thead {...props} className={`bg-transparent ${props.className || ''}`}>
                {children}
              </thead>
            ),
            row: ({ children, ...props }: ComponentProps<'tr'>) => (
              <tr {...props} className={`${props.className || ''}`}>
                {children}
              </tr>
            ),
            cell: ({ children, ...props }: ComponentProps<'th'>) => (
              <th
                {...props}
                className={`border-b border-[#FFFFFF1F] !bg-transparent p-4 text-left text-sm font-normal first:!pl-0 last:pl-8 ${props.className || ''}`}
              >
                {children}
              </th>
            )
          },
          body: {
            row: ({ children, ...props }: ComponentProps<'tr'>) => (
              <tr {...props} className={`border-b border-[#FFFFFF1F] last:border-b-0 ${props.className || ''}`}>
                {children}
              </tr>
            ),
            cell: ({ children, ...props }: ComponentProps<'td'>) => (
              <td {...props} className={`p-4 text-sm text-white first:!pl-0 last:pl-8 ${props.className || ''}`}>
                {children}
              </td>
            )
          }
        }}
      />
    </div>
  )
}

interface HistoryTabProps {
  refreshTrigger?: number
}

export default function HistoryTab({ refreshTrigger = 0 }: HistoryTabProps) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<HistoryItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 10

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true)
      const res = await userApi.getStakeHistory({ page, page_size: pageSize })
      const list = res.data?.list || []

      const historyItems: HistoryItem[] = list.map((item: StakeRecordItem, index: number) => ({
        key: `${item.tx_hash}-${index}`,
        time: item.stake_time ? dayjs(item.stake_time.substring(0, 19) + 'Z').format('YYYY-MM-DD HH:mm') : '-',
        amount: `${formatNumber(item.balance)} ${item.asset_type === 'XnYCoin' ? 'XNY' : item.asset_type}`,
        status: item.status_name,
        tx: item.tx_hash
      }))

      setData(historyItems)
      setTotal(res.total_count || 0)
    } catch (error) {
      console.error('Failed to fetch stake history:', error)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory, refreshTrigger])

  const columns: TableProps<HistoryItem>['columns'] = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: '25%'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: '25%'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '25%',
      render: (status: string) => (
        <div className="flex w-[120px] items-center justify-center rounded-full border border-[#FFFFFF1F] py-1 text-sm text-[#BBBBBE]">
          {status}
        </div>
      )
    },
    {
      title: 'Tx',
      dataIndex: 'tx',
      key: 'tx',
      width: '25%',
      render: (tx: string) => (
        <a
          href={`https://scan.codatta.org/tx/${tx}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 pl-4 text-[#875DFF] hover:underline"
        >
          TX:{tx.slice(0, 6)}...{tx.slice(-4)} <ExternalLink size={24} />
        </a>
      )
    }
  ]

  return (
    <div>
      <StakingTable<HistoryItem>
        columns={columns}
        dataSource={data}
        loading={loading}
        total={total}
        current={page}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  )
}
