import { ArrowLeft, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import airdropApi, { AirdropRankHistoryItem } from '@/apis/airdrop-actvitiy'
import { Empty, message, Spin } from 'antd'
import { Pagination } from 'antd'
import dayjs from 'dayjs'

function Headerback() {
  const navigate = useNavigate()
  return (
    <div className="mb-6 flex cursor-pointer items-center gap-2" onClick={() => navigate(-1)}>
      <ArrowLeft size={14} />
      <h1>Back</h1>
    </div>
  )
}

function RankingHistoryItem(props: { item: AirdropRankHistoryItem }) {
  const { item } = props

  function getFormatTime(time: string) {
    return dayjs(time).format('YYYY-MM-DD')
  }

  // Determine status based on current date and end time
  const getStatus = () => {
    const now = dayjs()
    const endTime = dayjs(item.end_time)

    if (now.isBefore(endTime)) {
      return { text: 'Ongoing', color: 'text-[#F59E0B]', dot: 'bg-[#F59E0B]' }
    } else {
      return { text: 'Complete', color: 'text-[#BBBBBE]', dot: 'bg-[#8D8D93]' }
    }
  }

  const status = getStatus()

  return (
    <div className="grid grid-cols-4 items-center rounded-2xl border border-white/5 p-6 leading-[24px]">
      <div className="col-span-2">
        <p className="mb-[6px] text-base font-bold text-white">{item.name}</p>
        <div className="flex items-center gap-6 text-[#BBBBBE]">
          <div className="flex items-center gap-1">
            <Clock size={14}></Clock> {getFormatTime(item.start_time)} to {getFormatTime(item.end_time)}
          </div>
        </div>
      </div>
      <div>
        <p className="mb-[6px]">Ranking: #{item.user_rank}</p>
        <p>
          Reward:{' '}
          <span className="font-bold text-primary">
            {item.reward_amount} {item.reward_type}
          </span>
        </p>
      </div>
      <div className="text-right">
        <div className="flex items-center justify-end gap-1">
          <div className={`size-1 rounded-full ${status.dot}`}></div>
          <span className={`text-sm ${status.color}`}>{status.text}</span>
        </div>
      </div>
    </div>
  )
}

export default function RankingHistory() {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const [list, setList] = useState<AirdropRankHistoryItem[]>([])

  async function getRankingHistory(page: number, pageSize: number) {
    setLoading(true)
    try {
      const res = await airdropApi.getAirdropRankHistory({
        page_num: page,
        page_size: pageSize
      })
      setList(res.data.list)
      setTotal(res.data.count)
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    getRankingHistory(page, pageSize)
  }, [page, pageSize])

  return (
    <div>
      <Headerback></Headerback>
      <h1 className="mb-6 text-3xl font-bold">Ranking History</h1>
      <Spin spinning={loading}>
        <div className="mb-8 flex flex-col gap-4">
          {list.map((item) => (
            <RankingHistoryItem key={item.season_id} item={item}></RankingHistoryItem>
          ))}

          {list.length === 0 && <Empty />}
        </div>
        <div className="flex justify-center">
          <Pagination
            current={page}
            total={total}
            // hideOnSinglePage
            pageSize={pageSize}
            onChange={(page) => setPage(page)}
          />
        </div>
      </Spin>
    </div>
  )
}
