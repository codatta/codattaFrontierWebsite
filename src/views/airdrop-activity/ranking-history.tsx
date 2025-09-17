import { ArrowLeft, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Headerback() {
  const navigate = useNavigate()
  return (
    <div className="mb-6 flex cursor-pointer items-center gap-2" onClick={() => navigate(-1)}>
      <ArrowLeft size={14} />
      <h1>Back</h1>
    </div>
  )
}

function RankingHistoryItem() {
  return (
    <div className="grid grid-cols-4 items-center rounded-2xl border border-white/5 p-6 leading-[24px]">
      <div className="col-span-2">
        <p className="mb-[6px] text-base font-bold">Blockchain Data Analysis Challenge</p>
        <div className="flex items-center gap-6 text-[#BBBBBE]">
          <div className="flex items-center gap-1">
            <Clock size={14}></Clock> 2024-08-01 to 2024-08-31
          </div>

          <div className="flex items-center gap-1">
            <Clock size={14}></Clock> 2024-08-01 to 2024-08-31
          </div>
        </div>
      </div>
      <div>
        <p className="mb-[6px]">Ranking: #7</p>
        <p>Reward: 1000 USDT</p>
      </div>
      <div className="text-right">Complete</div>
    </div>
  )
}

export default function RankingHistory() {
  return (
    <div>
      <Headerback></Headerback>
      <h1 className="mb-6 text-3xl font-bold">Ranking History</h1>
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((item) => (
          <RankingHistoryItem key={item}></RankingHistoryItem>
        ))}
      </div>
    </div>
  )
}
