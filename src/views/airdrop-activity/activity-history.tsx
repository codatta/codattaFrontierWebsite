import descriptionBgp from '@/assets/leaderboard/description-bg.png'
import { ArrowLeft, Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TrophyImage from '@/assets/airdrop-activity/trophy.png'
import { Empty, message, Select, Spin } from 'antd'
import { Pagination } from 'antd'
import airdropApi, {
  AirdropActivityHistoryItem,
  AirdropActivityHistoryParams,
  SubmissionStatus
} from '@/apis/airdrop-actvitiy'
import { useEffect, useState } from 'react'
import { airdropActivityActions, useAirdropActivityStore } from '@/stores/airdrop-activity.store'

const FilterOptions: { label: string; value: SubmissionStatus | null }[] = [
  { label: 'Adopt', value: 'ADOPT' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Refused', value: 'REFUSED' }
]

function Headerback() {
  const navigate = useNavigate()
  return (
    <div className="mb-6 flex cursor-pointer items-center gap-2" onClick={() => navigate(-1)}>
      <ArrowLeft size={14} />
      <h1>Back</h1>
    </div>
  )
}

function AirdropActivityHistoryHeader() {
  const { currentAirdropInfo, currentAirdropSeasonId } = useAirdropActivityStore()
  const [totalScore, setTotalScore] = useState(0)

  async function getAirdropStats(seasonId: string) {
    const res = await airdropApi.getUserAirdropActivityStatics(seasonId)
    setTotalScore(res.data.total_score)
  }

  useEffect(() => {
    if (!currentAirdropSeasonId) return
    getAirdropStats(currentAirdropSeasonId)
  }, [currentAirdropSeasonId])

  return (
    <div
      className="relative flex w-full items-center gap-[60px] rounded-2xl bg-[length:auto_100%] bg-center bg-repeat py-[34px] pr-[60px]"
      style={{ backgroundImage: `url("${descriptionBgp}")` }}
    >
      <div className="flex shrink-0 flex-col items-center gap-1">
        <div className="flex h-[100px] w-[240px] items-center">
          <img src={TrophyImage} alt="" className="pointer-events-none w-full" />
        </div>
      </div>
      <div className="flex flex-auto flex-wrap items-center justify-center gap-2">
        <div className="rounded-full border px-2 py-0.5">Current Season</div>
        <h1 className="text-nowrap text-2xl font-bold">{currentAirdropInfo?.name}</h1>
      </div>
      <div className="flex flex-auto flex-wrap items-center justify-center gap-2">
        <div className="text-nowrap rounded-full border px-2 py-0.5">Total Points</div>
        <div className="text-nowrap text-2xl font-bold text-[#FCC800]">{totalScore?.toLocaleString()}</div>
      </div>
    </div>
  )
}

function HistoryItem({ item }: { item: AirdropActivityHistoryItem }) {
  const getStatusDisplay = (status: SubmissionStatus) => {
    switch (status) {
      case 'ADOPT':
        return <div className="flex items-center gap-1">Success</div>
      case 'PENDING':
        return (
          <div className="flex items-center gap-1">
            <div className="size-1 rounded-full bg-[#F59E0B]"></div>
            <span className="text-[#F59E0B]">Pending</span>
          </div>
        )
      case 'REFUSED':
        return (
          <div className="flex items-center gap-1">
            <div className="size-1 rounded-full bg-[#EF4444]"></div>
            <span className="text-[#EF4444]">Refused</span>
          </div>
        )
      default:
        return <span>{status}</span>
    }
  }

  const getPointsDisplay = (status: SubmissionStatus, score: number) => {
    if (status === 'ADOPT' && score > 0) {
      return (
        <div className="inline-block rounded-full bg-[#8B5CF6]/20 px-2 py-0.5 font-bold text-[#8B5CF6]">+{score}</div>
      )
    }
    return <span className="text-[#BBBBBE]">-</span>
  }

  return (
    <div className="grid grid-cols-[2fr_2fr_1fr_1fr] rounded-2xl border border-white/5 p-6">
      <div className="">
        <p className="mb-1.5 text-[#BBBBBE]">Frontier</p>
        <p>{item.frontier_name}</p>
      </div>
      <div>
        <p className="mb-1.5 text-[#BBBBBE]">Task</p>
        <p>{item.task_name}</p>
      </div>
      <div>
        <p className="mb-1.5 text-[#BBBBBE]">Status</p>
        {getStatusDisplay(item.status)}
      </div>
      <div>
        <p className="mb-1.5 text-[#BBBBBE]">Points</p>
        {getPointsDisplay(item.status, item.score)}
      </div>
    </div>
  )
}

function SeasonGroup({ seasonName, items }: { seasonName: string; items: AirdropActivityHistoryItem[] }) {
  return (
    <div className="mb-6">
      {/* Season Header */}
      <div className="mb-3 rounded-lg bg-primary/10 px-4 py-2">
        <h3 className="font-medium text-white">{seasonName}</h3>
      </div>

      {/* Season Items */}
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <HistoryItem key={item.submission_id} item={item} />
        ))}
      </div>
    </div>
  )
}

export default function AirdropActivityHistory() {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(16)
  const [total, setTotal] = useState(0)
  const [seasonId, setSeasonId] = useState('')
  const [itemStatus, setItemStatus] = useState<SubmissionStatus | null>(null)

  const [list, setList] = useState<AirdropActivityHistoryItem[]>([])
  const [loading, setLoading] = useState(false)

  const { airdropNameList } = useAirdropActivityStore()
  const airdropSeasonSelectOptions = airdropNameList.map((item) => ({
    label: item.name,
    value: item.season_id
  }))

  // Group items by season_id
  const groupedItems = list.reduce(
    (acc, item) => {
      const seasonName = airdropNameList.find((s) => s.season_id === item.season_id)?.name || `Season ${item.season_id}`
      if (!acc[seasonName]) {
        acc[seasonName] = []
      }
      acc[seasonName].push(item)
      return acc
    },
    {} as Record<string, AirdropActivityHistoryItem[]>
  )

  function handleStatusChange(value: SubmissionStatus) {
    setItemStatus(value)
  }

  function handleAirdropSeasonChange(value: string) {
    setSeasonId(value)
  }

  async function getActivityHistory(params: AirdropActivityHistoryParams) {
    setLoading(true)
    try {
      const res = await airdropApi.getAirdropActivityHistory(params)
      setList(res.data.list)
      setTotal(res.data.count)
    } catch (err) {
      message.error(err.message)
    }

    setLoading(false)
  }

  useEffect(() => {
    getActivityHistory({
      season_id: seasonId,
      page_num: page,
      page_size: pageSize,
      submission_status: itemStatus
    })
  }, [page, pageSize, itemStatus, seasonId])

  useEffect(() => {
    airdropActivityActions.getAirdropNames()
  }, [])

  return (
    <div>
      <Headerback></Headerback>
      <div>
        <div className="mb-16">
          <AirdropActivityHistoryHeader></AirdropActivityHistoryHeader>
        </div>
        <div className="mb-6">
          <div className="flex items-center">
            <h2 className="text-xl font-bold">Activity History</h2>
            <div className="ml-auto flex items-center gap-2">
              <Select
                options={FilterOptions}
                placeholder="Select Status"
                className="w-[200px]"
                classNames={{ root: '[&_.ant-select-selector]:!rounded-full' }}
                onChange={handleStatusChange}
                size="large"
                allowClear
              ></Select>
              <Select
                placeholder="Select Season"
                options={airdropSeasonSelectOptions}
                className="w-[200px]"
                classNames={{ root: '[&_.ant-select-selector]:!rounded-full' }}
                onChange={handleAirdropSeasonChange}
                size="large"
                allowClear
              ></Select>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-6 flex gap-2 text-[#BBBBBE]">
        <Info></Info>
        <span>
          season event points and records will be cleared after the start of the next cycle's activity, and submitted
          records can be viewed in the corresponding frontier.
        </span>
      </div>
      <Spin spinning={loading}>
        <div className="mb-6">
          {Object.keys(groupedItems).length === 0 && <Empty />}
          {Object.entries(groupedItems).map(([seasonName, items]) => (
            <SeasonGroup key={seasonName} seasonName={seasonName} items={items} />
          ))}
        </div>
      </Spin>
      <div className="flex justify-center">
        <Pagination
          current={page}
          total={total}
          pageSize={pageSize}
          hideOnSinglePage
          onChange={(page) => setPage(page)}
        ></Pagination>
      </div>
    </div>
  )
}
