import { useEffect, useMemo, useState } from 'react'
import { message, Spin } from 'antd'
import { Filter, Compass, ArrowRightLeft, Database, Users } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import dayjs from 'dayjs'

import { useUserStore } from '@/stores/user.store'
import { referralStoreActions, useReferralStore } from '@/stores/referral.store'
import userApi, { InviteRecord } from '@/apis/user.api'
import { formatNumber } from '@/utils/format'

import CodattaLogoIcon from '@/assets/home/logo-gray.svg'
import GiftBoxImage from '@/assets/referral/gift-box.png'
import ReferralGiftBoxImage from '@/assets/referral/referral-gift-box.png'

// Format large numbers with k suffix
function formatCompact(num: number): string {
  if (num >= 1000) {
    return `${Math.floor(num / 1000)}k`
  }
  return String(num)
}

// Bottom tab navigation
const tabs = [
  { key: 'discover', label: 'Discover', icon: Compass, path: '/app' },
  { key: 'frontier', label: 'Frontier', icon: ArrowRightLeft, path: '/app/frontier' },
  { key: 'dataset', label: 'Dataset', icon: Database, path: '/dataset' },
  { key: 'referral', label: 'Referral Test', icon: Users, path: '/m/referral' }
]

// History item component
function HistoryItem({ record }: { record: InviteRecord }) {
  return (
    <div className="border-b border-black/5 py-4 last:border-b-0">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-black">{record.user_name}</span>
        <span className="text-sm text-black/40">{dayjs(record.gmt_create * 1000).format('MM/DD/YYYY')}</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        {record.reward > 0 && (
          <>
            <span className="rounded-full bg-[#E0F7FA] px-2 py-0.5 text-xs text-[#00BCD4]">
              XNY +{formatNumber(record.reward)}
            </span>
            <span className="rounded-full bg-[#E0F7FA] px-2 py-0.5 text-xs text-[#00BCD4]">
              Point +{formatNumber(record.reward)}
            </span>
          </>
        )}
        {record.chest_count > 0 && (
          <span className="rounded-full bg-[#E0F7FA] px-2 py-0.5 text-xs text-[#00BCD4]">
            Chest +{record.chest_count}
          </span>
        )}
      </div>
    </div>
  )
}

// Reward card component
function RewardCard({
  title,
  description,
  count,
  image,
  variant = 'default',
  onOpen
}: {
  title: string
  description: string
  count: number
  image: string
  variant?: 'default' | 'cyan'
  onOpen: () => void
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white p-4">
      <div className="flex-1">
        <h4 className="text-base font-bold text-black">{title}</h4>
        <p className="mt-0.5 text-xs text-black/50">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onOpen}
          className={`rounded-full px-5 py-2 text-sm font-semibold ${
            variant === 'cyan'
              ? 'bg-gradient-to-r from-[#00E5FF] to-[#00BCD4] text-white'
              : 'rounded-full border border-black/10 bg-white text-black'
          }`}
        >
          OPEN
        </button>
        <div className="relative">
          <img src={image} alt="" className="h-12 w-auto" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ReferralApp() {
  const navigate = useNavigate()
  const location = useLocation()
  const { info } = useUserStore()
  const { referralInfo, chestProgress } = useReferralStore()

  const [loading, setLoading] = useState(false)
  const [bannerCollapsed, setBannerCollapsed] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [allRecords, setAllRecords] = useState<InviteRecord[]>([])

  const shareLink = useMemo(() => {
    const shareCode = info?.user_data.referee_code || ''
    return `${window.location.origin}/referral/${shareCode}`
  }, [info])

  // Fetch referral info
  async function fetchReferralInfo() {
    try {
      await referralStoreActions.getInviteInfo()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load referral info'
      message.error(errorMessage)
    }
  }

  // Fetch referral list
  async function fetchReferralList(pageNum: number) {
    setLoading(true)
    try {
      const res = await referralStoreActions.getReferralList(pageNum)
      if (pageNum === 1) {
        setAllRecords(res.data?.list || [])
      } else {
        setAllRecords((prev) => [...prev, ...(res.data?.list || [])])
      }
      const totalCount = res.data?.total_count || 0
      const pageSize = res.data?.page_size || 10
      setHasMore(pageNum * pageSize < totalCount)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load referral list'
      message.error(errorMessage)
    }
    setLoading(false)
  }

  // Open chest
  async function handleOpenChest() {
    try {
      setLoading(true)
      const res = await userApi.openReferralChest()
      if (res.data && res.data.status === 1) {
        message.success(`Congratulations! You earned ${res.data.reward_value} points!`)
        await Promise.all([fetchReferralInfo(), fetchReferralList(1)])
      } else {
        message.error('Failed to open chest')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to open chest'
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Handle invite
  function handleInvite() {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink)
      message.success('Invite link copied to clipboard!')
    }
  }

  // Handle scroll to collapse banner
  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const scrollTop = e.currentTarget.scrollTop
    setBannerCollapsed(scrollTop > 100)
  }

  // Load more
  function handleLoadMore() {
    const nextPage = page + 1
    setPage(nextPage)
    fetchReferralList(nextPage)
  }

  useEffect(() => {
    fetchReferralInfo()
    fetchReferralList(1)
  }, [])

  const hasData = referralInfo.user_count > 0

  return (
    <div className="flex h-screen flex-col bg-black">
      {/* Header */}
      <div className="shrink-0 px-6 pb-4 pt-3">
        <h1 className="text-center text-lg font-bold text-white">Referral Test</h1>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
        {/* Expanded banner */}
        {!bannerCollapsed && (
          <div className="px-4 pb-4">
            <div className="relative overflow-hidden rounded-3xl bg-white p-5">
              {/* Logo */}
              <div className="relative z-10">
                <img src={CodattaLogoIcon} alt="" className="size-7" />
              </div>

              {/* Gift box image */}
              <div className="absolute right-2 top-2 z-0">
                <img src={GiftBoxImage} alt="" className="h-24 w-auto opacity-90" />
              </div>

              {/* Title */}
              <div className="relative z-10 mt-2">
                <h2 className="text-2xl font-bold leading-tight text-black">
                  Invite Friends
                  <br />
                  Earn Together
                </h2>
                <p className="mt-2 text-sm text-black/60">
                  Invite a friend, both get <span className="font-bold text-[#00BCD4]">100</span> points.
                </p>
              </div>

              {/* Progress bar */}
              <div className="relative z-10 mt-4 flex items-center gap-3 text-xs text-black/50">
                <span>Chest every 5 invites</span>
                <span>Daily limit: {chestProgress}/10 users</span>
              </div>
              <div className="relative z-10 mt-2 h-2 w-full overflow-hidden rounded-full bg-black/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] to-[#00BCD4] transition-all duration-300"
                  style={{ width: `${Math.min((chestProgress / 5) * 100, 100)}%` }}
                />
              </div>

              {/* Invite button */}
              <button
                onClick={handleInvite}
                className="relative z-10 mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-black bg-white py-3 text-base font-semibold text-black transition-colors active:bg-black/5"
              >
                <span className="size-2 rounded-full bg-[#00E5FF]" />
                Invite Now
              </button>
            </div>
          </div>
        )}

        {/* Collapsed banner */}
        {bannerCollapsed && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between rounded-full bg-[#2A2A35] px-4 py-3">
              <div className="flex items-center gap-3">
                <img src={GiftBoxImage} alt="" className="h-10 w-auto" />
                <div>
                  <span className="text-sm font-bold text-white">Invite Friends</span>
                  <br />
                  <span className="text-sm font-bold text-white">Earn Together</span>
                </div>
              </div>
              <button
                onClick={handleInvite}
                className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
              >
                <span className="size-1.5 rounded-full bg-[#00E5FF]" />
                Invite Now
              </button>
            </div>
          </div>
        )}

        {/* Stats section */}
        <div className="rounded-t-3xl bg-[#F5F5F5] px-4 pt-6">
          {/* Stats row */}
          <div className="flex items-center justify-around py-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-black">{formatCompact(referralInfo.user_count || 0)}</div>
              <div className="mt-1 text-xs text-black/40">Invited Friends</div>
            </div>
            <div className="mx-4 h-8 w-px bg-black/10" />
            <div className="text-center">
              <div className="text-3xl font-bold text-black">{formatCompact(referralInfo.reward || 0)}</div>
              <div className="mt-1 text-xs text-black/40">Rewards Points</div>
            </div>
            {hasData && (
              <>
                <div className="mx-4 h-8 w-px bg-black/10" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-black">{formatCompact(referralInfo.reward || 0)}</div>
                  <div className="mt-1 text-xs text-black/40">Rewards XNY</div>
                </div>
              </>
            )}
          </div>

          {/* Reward cards */}
          <div className="mt-4 space-y-3">
            <RewardCard
              title="Contribute & Win"
              description="Chest on friend's first accepted contribution"
              count={referralInfo.chest_available_count || 5}
              image={ReferralGiftBoxImage}
              variant="default"
              onOpen={handleOpenChest}
            />
            {hasData && (
              <RewardCard
                title="XNY Giveaway"
                description="Chest on friend's 10 more accepted contribution"
                count={2}
                image={GiftBoxImage}
                variant="cyan"
                onOpen={handleOpenChest}
              />
            )}
          </div>

          {/* History section */}
          <div className="mt-6 pb-24">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-black">History</h3>
              <button className="p-1 text-black/40">
                <Filter size={18} />
              </button>
            </div>

            <Spin spinning={loading && allRecords.length === 0}>
              {allRecords.length === 0 && !loading ? (
                <div className="flex flex-col items-center py-12">
                  <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-[#FFF3E0]">
                    <span className="text-3xl">🔍</span>
                  </div>
                  <p className="text-sm text-black/40">Start inviting to earn points!</p>
                </div>
              ) : (
                <div className="mt-2">
                  {allRecords.map((record, index) => (
                    <HistoryItem key={`${record.user_id}-${index}`} record={record} />
                  ))}
                  {hasMore && (
                    <button
                      onClick={handleLoadMore}
                      className="mt-4 w-full py-3 text-center text-sm font-medium text-[#00BCD4]"
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Load More'}
                    </button>
                  )}
                </div>
              )}
            </Spin>
          </div>
        </div>
      </div>

      {/* Bottom tab bar */}
      <div className="shrink-0 border-t border-black/5 bg-white px-2 pb-6 pt-2">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => navigate(tab.path)}
                className={`flex flex-col items-center gap-1 px-3 py-1 ${
                  isActive ? 'text-[#00BCD4]' : 'text-black/40'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
