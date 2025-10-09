import descriptionBgp from '@/assets/leaderboard/description-bg.png'
import { cn } from '@udecode/cn'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Empty, message, Pagination, Spin } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import GoldMedal from '@/assets/leaderboard/gold-medal.svg'
import SilverMedal from '@/assets/leaderboard/silver-medal.svg'
import BronzeMedal from '@/assets/leaderboard/bronze-medal.svg'
import { useEffect, useState } from 'react'
import airdropApi, { AirdropSeasonRankItem } from '@/apis/airdrop-actvitiy'
import { useAirdropActivityStore } from '@/stores/airdrop-activity.store'
import TransitionEffect from '@/components/common/transition-effect'

function Headerback() {
  const navigate = useNavigate()
  return (
    <div className="mb-6 flex cursor-pointer items-center gap-2" onClick={() => navigate(-1)}>
      <ArrowLeft size={14} />
      <h1>Back</h1>
    </div>
  )
}

function UserRank(props: { rank: number; className: string }) {
  const { rank } = props
  return (
    <div className={`relative flex w-full justify-center`}>
      {rank <= 3 && (
        <div className="flex items-center">
          <div
            className={cn(
              'absolute left-0 h-[40px] w-[2px] rounded-b-full rounded-t-full',
              rank === 1 && 'bg-[#FCC800]',
              rank === 2 && 'bg-[#CCCCCB]',
              rank === 3 && 'bg-[#FC8800]'
            )}
          ></div>
          <div className="w-9 text-center">
            {rank === 1 && <img src={GoldMedal} alt="" />}
            {rank === 2 && <img src={SilverMedal} alt="" />}
            {rank === 3 && <img src={BronzeMedal} alt="" />}
          </div>
        </div>
      )}

      {rank > 3 && <div className="w-9 text-center">{rank > 99 ? '99+' : rank}</div>}
    </div>
  )
}

function UserAvatar(props: { rank: number; avatar: string; className: string }) {
  const { rank, avatar, className } = props
  return (
    <div
      className={cn(
        `${className} relative size-9 shrink-0 rounded-full`,
        rank === 1 && 'border border-[#FCC800]',
        rank === 2 && 'border border-[#CCCCCB]',
        rank === 3 && 'border border-[#FC8800]'
      )}
    >
      <div
        className="size-full rounded-full"
        style={{ background: 'linear-gradient(to left top, #a0fdb6, #1049cf)' }}
      ></div>
      {avatar ? (
        <img src={avatar} className="absolute left-0 top-0 size-full shrink-0 grow-0 rounded-full" />
      ) : (
        <img
          src="https://file.b18a.io/default.png"
          className="absolute left-0 top-0 size-full shrink-0 grow-0 rounded-full"
        />
      )}
    </div>
  )
}

function LeaderboardHeader(props: { userRank: number }) {
  const { userRank } = props
  const { currentAirdropInfo } = useAirdropActivityStore()

  return (
    <div
      className="relative flex w-full items-center gap-[60px] rounded-2xl bg-[length:auto_100%] bg-center bg-repeat px-[60px] py-[34px]"
      style={{ backgroundImage: `url("${descriptionBgp}")` }}
    >
      <div className="flex shrink-0 flex-col items-center gap-1">
        <span>Current Ranking</span>
        <div className="flex items-center gap-1 rounded-full bg-gradient-to-b from-[#FFEA98] to-[#FCC800] px-6 py-1.5 text-2xl font-bold text-black">
          🏆 {userRank}
        </div>
        <Link to={{ pathname: '/app/airdrop/ranking-history' }} className="flex items-center gap-1">
          History <ArrowRight size={14}></ArrowRight>
        </Link>
      </div>
      <div>
        <h2 className="mb-2 text-3xl font-bold">{currentAirdropInfo?.name}</h2>
        <p className="text-sm text-gray-500">{currentAirdropInfo?.description}</p>
      </div>
    </div>
  )
}

function LeaderboardTable(props: { list: AirdropSeasonRankItem[] }) {
  const { list } = props

  return (
    <div className={`relative w-full rounded-2xl text-white`}>
      {/* Use CSS Grid to ensure column alignment */}
      <div className="mb-1 mt-6 grid grid-cols-[112px_36px_1fr_108px_108px_108px] gap-3 border-b border-b-[#ffffff1f] py-2 text-sm font-normal text-gray-400">
        <div className="text-center">Rank</div>
        <div className="text-center">User</div>
        <div className="text-left">Name</div>
        <div className="text-center">Score</div>
        <div className="text-center">Reward</div>
        <div className="text-center">Points</div>
      </div>
      <ul className="box-border min-h-[290px] overflow-y-auto pt-3 text-sm">
        {list.length <= 0 ? (
          <div className="flex h-full items-center justify-center">
            <Empty />
          </div>
        ) : (
          list.map((user, index) => (
            <li
              key={user.user_id}
              className={cn(
                'mb-1 grid h-[60px] grid-cols-[112px_36px_1fr_108px_108px_108px] items-center gap-3 rounded-lg px-0',
                user.rank === 1 && 'bg-gradient-to-r from-[#FCC800]/[0.16] to-40%',
                user.rank === 2 && 'bg-gradient-to-r from-[#CCCCCB]/[0.16] to-40%',
                user.rank === 3 && 'bg-gradient-to-r from-[#FC8800]/[0.16] to-40%'
              )}
            >
              <div className="flex justify-center">
                <UserRank rank={user.rank} className="" />
              </div>
              <div className="flex justify-center">
                <UserAvatar rank={user.rank || index + 4} className="" avatar={user.image_url}></UserAvatar>
              </div>
              <div
                className={cn(
                  'flex items-center overflow-hidden text-ellipsis text-left',
                  user.rank === 1 && 'text-[#FCC800]',
                  user.rank === 2 && 'text-[#CCCCCB]',
                  user.rank === 3 && 'text-[#FC8800]'
                )}
              >
                {user.user_name}
              </div>
              <div className="text-center">{user.score.toLocaleString()}</div>
              <div className="text-center font-bold text-primary">
                {user.reward_amount ? `${user.reward_amount} ${user.reward_type}` : '-'}
              </div>
              <div className="text-center">
                {user.point_reward_amount ? `${user.point_reward_amount} ${user.point_reward_type}` : '-'}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default function AirdropLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<AirdropSeasonRankItem[]>([])
  const [total, setTotal] = useState(0)
  const { currentAirdropSeasonId } = useAirdropActivityStore()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(24)
  const [loading, setLoading] = useState(false)
  const [userRank, setUserRank] = useState(0)

  async function getLeaderboard(seasonId: string, page: number, pageSize: number) {
    setLoading(true)
    try {
      const res = await airdropApi.getAirdropSeasonRanks({
        season_id: seasonId,
        page_num: page,
        page_size: pageSize
      })
      setLeaderboard(res.data.list)
      setTotal(res.data.count)
      setUserRank(res.data.user_rank)
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!currentAirdropSeasonId) return
    getLeaderboard(currentAirdropSeasonId, page, pageSize)
  }, [currentAirdropSeasonId, page, pageSize])

  return (
    <TransitionEffect>
      <Headerback></Headerback>
      <LeaderboardHeader userRank={userRank} />
      <Spin spinning={loading}>
        <LeaderboardTable list={leaderboard}></LeaderboardTable>
        <div className="mt-12 flex items-center">
          <Pagination
            current={page}
            total={total}
            hideOnSinglePage
            pageSize={pageSize}
            onChange={(page) => setPage(page)}
          />
          <Link to="/app/airdrop/activity-history" className="ml-auto rounded-full bg-primary px-4 py-2">
            All Submissions
          </Link>
        </div>
      </Spin>
    </TransitionEffect>
  )
}
