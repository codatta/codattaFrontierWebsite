import { Table, TableProps } from 'antd'

export default function StakingTable<T extends object>({
  columns,
  dataSource
}: {
  columns: TableProps<T>['columns']
  dataSource: T[]
}) {
  return (
    <div className="rounded-2xl bg-[#252532] p-6">
      <Table
        className="[&_.ant-table-placeholder]:border-b-0 [&_.ant-table]:bg-transparent"
        columns={columns}
        dataSource={dataSource}
        pagination={{
          total: 40,
          position: ['bottomRight'],
          showSizeChanger: false,
          className:
            'mt-6 flex w-full items-center gap-x-2 [&_.ant-pagination-total-text]:mr-auto [&_.ant-pagination-item-active]:bg-[#40404b] [&_.ant-pagination-item-active]:text-white [&_.ant-pagination-item-active]:border-none [&_.ant-pagination-item]:bg-transparent [&_.ant-pagination-item]:text-white/60 [&_.ant-pagination-item]:border-none [&_.ant-pagination-prev_button]:!text-white/60 [&_.ant-pagination-next_button]:!text-white/60',
          showTotal: (total) => <span>{`Total ${total}`}</span>
        }}
        components={{
          table: ({ children }: { children: React.ReactNode }) => (
            <table className="w-full border-collapse">{children}</table>
          ),
          header: {
            wrapper: ({ children }: { children: React.ReactNode }) => (
              <thead className="bg-transparent">{children}</thead>
            ),
            row: ({ children }: { children: React.ReactNode }) => <tr className="">{children}</tr>,
            cell: ({ children }: { children: React.ReactNode }) => (
              <th className="border-b border-[#FFFFFF1F] p-4 text-left text-sm font-normal first:!pl-0 last:pl-8">
                {children}
              </th>
            )
          },
          body: {
            row: ({ children }: { children: React.ReactNode }) => (
              <tr className="border-b border-[#FFFFFF1F] last:border-b-0">{children}</tr>
            ),
            cell: ({ children }: { children: React.ReactNode }) => (
              <td className="p-4 text-sm text-white first:!pl-0 last:pl-8">{children}</td>
            )
          }
        }}
      />
    </div>
  )
}
