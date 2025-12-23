import { Table, TableProps } from 'antd'
import type { ComponentProps } from 'react'

interface StakingTableProps<T> extends TableProps<T> {
  total?: number
  current?: number
  pageSize?: number
  onPageChange?: (page: number, pageSize: number) => void
}

export default function StakingTable<T extends object>({
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
                className={`border-b border-[#FFFFFF1F] p-4 text-left text-sm font-normal first:!pl-0 last:pl-8 ${props.className || ''}`}
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
