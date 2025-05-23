import aiModelApi, { OnChainRecord } from '@/apis/ai-model.api'
import { message, Pagination, Spin } from 'antd'
import { Copy, Link } from 'lucide-react'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

interface SortIconProps {
  active: boolean
  direction: 'asc' | 'desc'
}

const SortIcon: React.FC<SortIconProps> = ({ active, direction }) => {
  return (
    <div className="ml-1 inline-flex flex-col">
      <div
        className={`size-0 border-x-[5px] border-b-[5px] border-x-transparent ${
          active && direction === 'asc' ? 'border-b-white' : 'border-b-white/30'
        }`}
      />
      <div
        className={`mt-1 size-0 border-x-[5px] border-t-[5px] border-x-transparent ${
          active && direction === 'desc' ? 'border-t-white' : 'border-t-white/30'
        }`}
      />
    </div>
  )
}

export default function ArenaOnChainList() {
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<OnChainRecord[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [userId, _setUserId] = useState<string>()
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [sortField, setSortField] = useState<string>('chain_time')

  async function getOnChainRecords(page: number, userId?: string, sortField?: string, sortDirection?: string) {
    setLoading(true)

    try {
      const res = await aiModelApi.getOnChainRecord(page, userId, sortField, sortDirection)
      setList(res.data.list)
      setTotal(res.data.count)
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  function shorttenTxHash(txhash: string) {
    return txhash.slice(0, 8) + '...' + txhash.slice(-8)
  }

  useEffect(() => {
    getOnChainRecords(page, userId, sortField, sortDirection)
  }, [page, userId, sortField, sortDirection])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  // const handleInputKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
  //   if (e.key === 'Enter') {
  //     const input = e.target as HTMLInputElement
  //     setUserId(input.value)
  //   }
  // }

  function handleCopy(str: string) {
    navigator.clipboard.writeText(str)
    message.success(`${str} copied to clipboard`)
  }

  return (
    <div>
      {/* <div className="mb-6 flex">
        <div className="w-[360px] rounded-full border border-white/10">
          <Input
            variant="borderless"
            size="large"
            allowClear
            onClear={() => setUserId('')}
            className="px-4"
            placeholder="User ID"
            suffix={<Search className="text-white/20" size={16} />}
            onKeyDown={handleInputKeyDown}
          ></Input>
        </div>
      </div> */}
      <Spin spinning={loading}>
        <div className="overflow-hidden rounded-lg border border-white/5 bg-[#1e1e29] px-2 text-sm text-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-[#1e1e29] text-sm text-white">
                <th className="cursor-pointer p-4 text-left" onClick={() => handleSort('chain_time')}>
                  <div className="flex items-center gap-1">
                    Timestamp
                    <SortIcon active={sortField === 'chain_time'} direction={sortDirection} />
                  </div>
                </th>
                {/* <th className="cursor-pointer p-4 text-left">
                  <div className="flex items-center gap-1">User ID</div>
                </th> */}
                <th className="cursor-pointer px-4 py-3 text-left">
                  <div className="flex items-center gap-1">Transaction Hash</div>
                </th>
                <th className="cursor-pointer px-4 py-3 text-left">
                  <div className="flex items-center gap-1">Block Number</div>
                </th>
                <th className="px-4 py-3 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.id} className="transition-all hover:bg-white/5">
                  <td className="p-4">{dayjs(item.chain_time).format('YYYY/MM/DD HH:mm:ss')}</td>
                  {/* <td className="p-4">{item.user_id}</td> */}
                  <td className="flex items-center gap-2 p-4">
                    {shorttenTxHash(item.tx_hash)}{' '}
                    <Copy size={16} onClick={() => handleCopy(item.tx_hash)} className="cursor-pointer"></Copy>
                  </td>
                  <td className="p-4">{item.block_number}</td>
                  <td className="p-4">
                    <a href={`${item.chan_link}`} target="_blank" className="flex items-center gap-2 text-primary">
                      <Link size={16} />
                      check
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center py-8">
            <Pagination total={total} pageSize={20} onChange={(page) => setPage(page)}></Pagination>
          </div>
        </div>
      </Spin>
    </div>
  )
}
