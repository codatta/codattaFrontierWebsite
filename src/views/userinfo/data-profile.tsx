import { useEffect, useMemo, useState } from 'react'
import { Button, message, Pagination, Spin } from 'antd'
import { Info } from 'lucide-react'
import dayjs from 'dayjs'

// Icons
import TotalSubmissionIcon from '@/assets/userinfo/total-submission.svg'
import TotalRewardIcon from '@/assets/userinfo/total-reward.svg'
import OnChainRecordsIcon from '@/assets/userinfo/onchain-records.svg'
import ClaimableIcon from '@/assets/userinfo/claimable.svg'
import frontiterApi, { SubmissionRecord, SubmissionStatics } from '@/apis/frontiter.api'
import { useNavigate } from 'react-router-dom'

export default function DataProfile() {
  // Mock data - replace with API calls
  const [stats, setStats] = useState<SubmissionStatics>({
    total_submissions: 0,
    total_rewards: [],
    on_chained: 0,
    claimable_rewards: []
  })

  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([])

  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 12

  const handlePageChange = (page: number) => {
    setPage(page)
  }

  const getSubmissionStatics = async () => {
    try {
      const res = await frontiterApi.getSubmissionStatics()
      setStats(res.data)
    } catch (err) {
      message.error(err.message)
    }
  }

  const getSubmissionRecords = async (page: number) => {
    setLoading(true)
    try {
      const res = await frontiterApi.getSubmissionRecords({ page_num: page, page_size: pageSize })
      setSubmissions(res.data)
      setTotal(res.total_count)
    } catch (err) {
      message.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSubmissionStatics()
    getSubmissionRecords(page)
  }, [])

  useEffect(() => {
    getSubmissionRecords(page)
  }, [page])

  return (
    <div className="flex flex-1 flex-col">
      <h3 className="mb-6 text-[32px] font-bold leading-[48px]">Data Profile</h3>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Data Table */}
      <DataTable
        submissions={submissions}
        loading={loading}
        page={page}
        total={total}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

function DataProfileReward(props: { rewards: { reward_type: string; reward_amount: number }[] }) {
  const { rewards } = props
  const rewardList = useMemo(() => {
    if (rewards && rewards.length > 0) return rewards
    else
      return [
        { reward_type: 'XNY', reward_amount: 0 },
        { reward_type: 'USDT', reward_amount: 0 }
      ]
  }, [rewards])
  return (
    <div className="flex items-center gap-4">
      {rewardList.map((reward) => (
        <div key={reward.reward_type}>
          <span className="text-2xl font-bold">{Number(reward.reward_amount).toLocaleString()}</span>
          <span className="ml-2">{reward.reward_type}</span>
        </div>
      ))}
    </div>
  )
}

// Stats Cards Component
function StatsCards({ stats }: { stats: SubmissionStatics }) {
  const navigate = useNavigate()

  const handleClaim = () => {
    navigate('/app/settings/data-assets')
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Total Submissions */}
      <div className="rounded-2xl bg-[#252532] p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
            <img src={TotalSubmissionIcon} className="h-6 w-6" />
          </div>
          <div className="text-base font-bold">Total Submissions</div>
          <div className="ml-auto text-[28px] font-bold">{stats.total_submissions.toLocaleString()}</div>
        </div>
      </div>

      {/* Total Rewards */}
      <div className="col-span-2 rounded-2xl bg-[#252532] p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
            <img src={TotalRewardIcon} className="h-6 w-6" />
          </div>
          <div className="mb-1 flex flex-wrap gap-2">
            <div className="text-base font-bold">Total Rewards</div>
            <div className="inline-block">
              <div className="flex items-center gap-1 rounded-md bg-[#1C1C26] p-1 px-2 text-xs text-[#77777D]">
                <Info size={16}></Info>Updated after round end
              </div>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <DataProfileReward rewards={stats.total_rewards}></DataProfileReward>
          </div>
        </div>
      </div>

      {/* On-chain Records */}
      <div className="rounded-2xl bg-[#252532] p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
            <img src={OnChainRecordsIcon} className="h-6 w-6" />
          </div>
          <div className="text-base font-bold">On-chain Records</div>
          <div className="ml-auto text-[28px] font-bold">{stats.on_chained?.toLocaleString()}</div>
        </div>
      </div>

      {/* Claimable */}
      <div className="col-span-2 rounded-2xl bg-[#252532] p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#252532]">
            <img src={ClaimableIcon} className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="text-base font-bold">Claimable on</div>
          </div>
          <div className="flex items-center gap-4">
            <DataProfileReward rewards={stats.claimable_rewards}></DataProfileReward>
          </div>
          <Button
            type="primary"
            shape="round"
            className="h-10 w-[80px] bg-[#875DFF] hover:bg-[#7B52E6]"
            onClick={handleClaim}
          >
            Claim
          </Button>
        </div>
      </div>
    </div>
  )
}

// Data Table Component
function DataTable({
  submissions,
  loading,
  page,
  total,
  pageSize,
  onPageChange
}: {
  submissions: SubmissionRecord[]
  loading: boolean
  page: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
}) {
  return (
    <div className="rounded-xl bg-[#252532] p-6">
      <Spin spinning={loading}>
        {/* Table Header - Hidden on mobile */}
        <div className="hidden grid-cols-12 gap-4 border-b border-white/5 pb-4 text-sm font-medium text-[#BBBBBE] md:grid">
          <div className="col-span-2">Time</div>
          <div className="col-span-2">Frontier Name</div>
          <div className="col-span-3">Task</div>
          <div className="col-span-1">Score</div>
          <div className="col-span-2">Rewards</div>
          <div className="col-span-2">Action</div>
        </div>

        {/* Table Body */}
        <div>
          {submissions.map((item) => (
            <SubmissionRow key={item.submission_id} submission={item} />
          ))}
        </div>
        <div className="flex justify-center pt-6">
          <Pagination
            current={page}
            total={total}
            pageSize={pageSize}
            onChange={onPageChange}
            showSizeChanger={false}
          />
        </div>
      </Spin>
    </div>
  )
}

// Submission Row Component
function SubmissionRow({ submission }: { submission: SubmissionRecord }) {
  const getScoreColor = (score: string) => {
    switch (score) {
      case 'S':
        return 'bg-[#FFD700] text-black'
      case 'A':
        return 'bg-[#32CD32] text-white'
      case 'B':
        return 'bg-[#1E90FF] text-white'
      case 'C':
        return 'bg-[#FF8C00] text-white'
      case 'D':
        return 'bg-[#FF4500] text-white'
      default:
        return 'bg-[#252532] text-white'
    }
  }

  function handleViewDetails(submission: SubmissionRecord) {
    window.open(`/app/submission/${submission.submission_id}/detail`, '_blank')
  }

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden grid-cols-12 items-center gap-4 border-b border-white/5 py-4 text-sm transition-colors hover:bg-[#252532] md:grid">
        <div className="col-span-2">{dayjs(submission.submission_time * 1000).format('YYYY-MM-DD')}</div>
        <div className="col-span-2 truncate font-medium">{submission.frontier_name}</div>
        <div className="col-span-3 truncate">{submission.task_name}</div>
        <div className="col-span-1">
          <span
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full font-bold ${getScoreColor(submission.rating_name)}`}
          >
            {submission.rating_name}
          </span>
        </div>

        <div className="col-span-2 text-sm font-medium">
          {submission.rewards
            .filter((reward) => reward.reward_type !== 'POINTS')
            .map((reward) => {
              return (
                <span key={reward.reward_type}>
                  {reward.reward_amount} {reward.reward_type}
                </span>
              )
            })}
        </div>

        <div className="col-span-2">
          <button
            className="flex items-center gap-1 text-sm text-[#875DFF] hover:text-[#7B52E6]"
            onClick={() => handleViewDetails(submission)}
          >
            View Details
          </button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="rounded-2xl py-4 transition-colors md:hidden">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm text-[#BBBBBE]">{dayjs(submission.submission_time).format('YYYY-MM-DD')}</div>
          <span
            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${getScoreColor(submission.rating_name)}`}
          >
            {submission.rating_name}
          </span>
        </div>

        <div className="mb-2 text-sm font-medium">{submission.frontier_name}</div>

        <div className="mb-3 text-sm text-[#BBBBBE]">{submission.task_name}</div>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">
            {submission.rewards
              .filter((reward) => reward.reward_type !== 'POINTS')
              .map((reward) => {
                return (
                  <span key={reward.reward_type}>
                    {reward.reward_amount} {reward.reward_type}
                  </span>
                )
              })}
          </div>
          <button
            className="flex items-center gap-1 text-sm text-[#875DFF] hover:text-[#7B52E6]"
            onClick={() => handleViewDetails(submission)}
          >
            View Details
          </button>
        </div>
      </div>
    </>
  )
}
