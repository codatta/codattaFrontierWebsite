import { useSnapshot } from 'valtio'
import { cn } from '@udecode/cn'

import GoldMedal from '@/assets/leaderboard/gold-medal.svg'
import SilverMedal from '@/assets/leaderboard/silver-medal.svg'
import BronzeMedal from '@/assets/leaderboard/bronze-medal.svg'

import Empty from '@/components/common/empty'
// import ReputationRate from '@/components/common/reputation-rate'

import { rankStore } from '@/stores/rank.store'

import { formatNumber, truncateStr } from '@/utils/str'

function UserRank(props: { rank: number; className: string }) {
  const { rank } = props
  return (
    <div className={`relative w-[112px] shrink-0`}>
      {rank <= 3 && (
        <div className="flex items-center">
          <div
            className={cn(
              'h-8 w-[1px]',
              rank === 1 && 'bg-[#FCC800]',
              rank === 2 && 'bg-[#CCCCCB]',
              rank === 3 && 'bg-[#FC8800]'
            )}
          ></div>
          <div className="ml-6 w-9 text-center">
            {rank === 1 && <img src={GoldMedal} alt="" />}
            {rank === 2 && <img src={SilverMedal} alt="" />}
            {rank === 3 && <img src={BronzeMedal} alt="" />}
          </div>
        </div>
      )}

      {rank > 3 && <div className="ml-6 w-9 text-center">{rank > 99 ? '99+' : rank}</div>}
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

export default function Component() {
  const { reputationRank } = useSnapshot(rankStore)

  return (
    <div className={`relative w-full rounded-2xl text-white`}>
      <div className="mb-1 mt-6 flex w-full items-center justify-end gap-6 border-b border-b-[#ffffff1f] py-2 text-sm font-normal text-gray-400">
        <div className="relative w-[100px] shrink-0 text-center">
          <div className="ml-6 w-9 text-center">#</div>
        </div>
        <div className="relative mr-auto h-[22px] w-9 shrink-0 text-sm">User</div>
        <div className="my-2 flex flex-1 items-center overflow-hidden text-ellipsis text-left"></div>
        <div className="flex w-[108px] gap-0.5">Reputation</div>
      </div>
      <ul className="box-border min-h-[290px] overflow-y-auto pt-3 text-sm">
        {reputationRank.length <= 0 ? (
          <div className="flex h-full items-center justify-center">
            <Empty />
          </div>
        ) : (
          reputationRank.map((user) => (
            <li
              key={user.user_id}
              className={cn(
                'mb-1 flex h-[60px] w-full items-center justify-end gap-3 rounded-lg',
                user.rank === 1 && 'bg-gradient-to-r from-[#FCC800]/[0.16] to-40%',
                user.rank === 2 && 'bg-gradient-to-r from-[#CCCCCB]/[0.16] to-40%',
                user.rank === 3 && 'bg-gradient-to-r from-[#FC8800]/[0.16] to-40%'
              )}
            >
              <UserRank rank={user.rank} className="mr-auto" />
              <UserAvatar rank={user.rank} className="mr-auto" avatar={user.avatar}></UserAvatar>
              <div
                className={cn(
                  'my-2 flex flex-1 items-center overflow-hidden text-ellipsis text-left',
                  user.flag && 'text-primary'
                )}
              >
                {user.email || truncateStr(user.user_id, { len: 10, ellipsis: '***' })}
              </div>
              {/* <ReputationRate gap={2} size={20} color="#FFA800E0" rate={user.reputation ?? 0}></ReputationRate> */}
              <div className="w-[108px] text-base font-bold text-[#875DFF]">
                {formatNumber(user.reputation ?? 0, 2)}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
