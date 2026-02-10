import { useEffect, useMemo, useRef, useState } from 'react'
import { message } from 'antd'
import dayjs from 'dayjs'
import { InfoCircleOutlined } from '@ant-design/icons'

import frontiterApi, { DataProfileListItem, SubmissionStatics } from '@/apis/frontiter.api'
import { useNavigate } from 'react-router-dom'
import MobileAppFrontierHeader from '@/components/mobile-app/frontier-header'
import { Loader2, X } from 'lucide-react'
import EmptyImg from '@/assets/dataprofile/data-profile-empty.png'

function RequirementsModal(props: { onClose: () => void }) {
  const { onClose } = props
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/20" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-[32px] bg-white/60 px-4 pb-4 pt-5 shadow-glass backdrop-blur-md">
        {/* Title */}
        <h2 className="mb-4 text-center text-[24px] font-semibold text-black">My Submissions</h2>

        {/* Requirements List */}
        <div className="pb-3 text-center">
          Data Profile currently shows Booster Fingerprint campaign data only.More sources will be added soon.
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute left-1/2 top-full mt-4 flex size-[44px] -translate-x-1/2 items-center justify-center rounded-full bg-white/70 shadow-glass backdrop-blur-md"
          aria-label="Close"
        >
          <X size={24} />
        </button>
      </div>
    </>
  )
}

function getSubmissionBadge(submission: DataProfileListItem) {
  const isAnchored = Boolean(submission.tx_hash || submission.chain_time)
  if (isAnchored) {
    return { label: 'Anchored', color: '#5DDD22' }
  }
  if ((submission.status || '').toUpperCase() === 'ADOPT') {
    return { label: 'Adopted', color: '#FFA800' }
  }
  return { label: 'Adopted', color: '#FF8A00' }
}

export default function AppDataProfile() {
  const [stats, setStats] = useState<SubmissionStatics>({
    total_submissions: 0,
    on_chained: 0
  })

  const [submissions, setSubmissions] = useState<DataProfileListItem[]>([])

  const [loading, setLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [showRequirementsModal, setShowRequirementsModal] = useState(false)
  const pageSize = 12
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const fetchingMoreRef = useRef(false)

  const navigate = useNavigate()

  const getSubmissionStatics = async () => {
    try {
      const res = await frontiterApi.getSubmissionStatics()
      setStats((value) => {
        return {
          ...value,
          total_submissions: res.data.total_submissions
        }
      })
    } catch (err) {
      message.error(err.message)
    }
  }

  const getSubmissionRecords = async (page: number) => {
    setLoading(true)
    try {
      const res = await frontiterApi.getDataProfileList(page, pageSize)
      // Reset hasMore on a fresh load
      if (page <= 1) setHasMore(true)

      setSubmissions((prev) => {
        if (page <= 1) {
          // If first page returns less than pageSize, there's no more.
          if (!res.data?.length || res.data.length < pageSize) setHasMore(false)
          return res.data
        }

        const merged = [...prev]
        const beforeLen = merged.length
        for (const item of res.data) {
          if (!merged.find((x) => x.submission_id === item.submission_id)) merged.push(item)
        }
        const afterLen = merged.length

        // Stop if API returns empty, duplicates only, or a short page.
        if (!res.data?.length || afterLen === beforeLen || res.data.length < pageSize) {
          setHasMore(false)
        }

        return merged
      })
      setTotal(res.total_count)
      setStats((value) => {
        return { ...value, on_chained: res.total_count }
      })
    } catch (err) {
      message.error(err.message)
    } finally {
      setLoading(false)
      setHasLoaded(true)
    }
  }

  useEffect(() => {
    getSubmissionStatics()
  }, [])

  useEffect(() => {
    getSubmissionRecords(page)
  }, [page])

  const canLoadMore = useMemo(() => hasMore && submissions.length < total, [hasMore, submissions.length, total])

  // reset "inflight" latch after request finished
  useEffect(() => {
    if (!loading) fetchingMoreRef.current = false
  }, [loading])

  // infinite scroll: observe a sentinel at the bottom
  useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return
    if (!canLoadMore) return
    if (loading) return
    if (hasLoaded && submissions.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting) return
        if (loading) return
        if (!canLoadMore) return
        if (fetchingMoreRef.current) return
        fetchingMoreRef.current = true
        setPage((p) => p + 1)
      },
      {
        root: null,
        // start loading a bit before reaching bottom
        rootMargin: '200px 0px',
        threshold: 0
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [canLoadMore, hasLoaded, loading, submissions.length])

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-black">
      <MobileAppFrontierHeader title="Data Profile" canSubmit={false} showSubmitButton={false} />

      <div className="px-5 pb-10">
        <StatsCards stats={stats} />

        <div className="mb-4 flex items-center gap-2">
          <div className="text-[17px] font-semibold">My Submissions</div>
          <InfoCircleOutlined className="text-[#999]" onClick={() => setShowRequirementsModal(true)} />
        </div>

        <div className="flex flex-col gap-4">
          {submissions.map((s) => (
            <SubmissionCard
              key={s.submission_id}
              submission={s}
              onClick={() => navigate('/app/settings/data-profile/app/detail', { state: { submission: s } })}
            />
          ))}
        </div>

        {hasLoaded && !loading && submissions.length === 0 ? (
          <div className="mt-[120px] flex flex-col items-center justify-center">
            <img src={EmptyImg} alt="No data" className="w-[66px]" />
            <div className="text-[13px] text-[#666666]">No submission</div>
          </div>
        ) : null}

        {/* sentinel for infinite scroll */}
        {canLoadMore && !(hasLoaded && submissions.length === 0) ? <div ref={loadMoreRef} className="h-8" /> : null}

        {loading ? (
          <div className="my-6 flex items-center justify-center gap-2 text-black/40">
            <Loader2 className="size-4 animate-spin"></Loader2>
            <div className="text-[13px]">Loading...</div>
          </div>
        ) : null}

        {hasLoaded && !loading && submissions.length > 0 && !canLoadMore ? (
          <div className="my-6 text-center text-[13px] text-black/30">No more data</div>
        ) : null}
      </div>

      {showRequirementsModal ? <RequirementsModal onClose={() => setShowRequirementsModal(false)} /> : null}
    </div>
  )
}

function StatsCards({ stats }: { stats: SubmissionStatics }) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4 pt-2">
      <div
        className="rounded-3xl p-4 shadow-glass"
        style={{
          background: 'linear-gradient(0deg, rgba(255, 168, 0, 0.04), rgba(255, 168, 0, 0.1)), rgba(255, 255, 255, 0.6)'
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-white/70">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM17.4571 9.45711L11 15.9142L6.79289 11.7071L8.20711 10.2929L11 13.0858L16.0429 8.04289L17.4571 9.45711Z"
                fill="#FFA800"
              />
            </svg>
          </div>
          <div>
            <div className="text-[20px] font-semibold leading-6">{stats.total_submissions.toLocaleString()}</div>
            <div className="text-xs text-[#999]">Adopted</div>
          </div>
        </div>
      </div>

      <div
        className="rounded-3xl p-4 shadow-glass"
        style={{
          background: 'linear-gradient(0deg, rgba(93, 221, 34, 0.04), rgba(93, 221, 34, 0.1)), rgba(255, 255, 255, 0.4)'
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-white/70">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 1C16.9706 1 21 5.02944 21 10V14C21 17.0383 19.4945 19.7249 17.1887 21.3546C17.7164 19.6635 18 17.8649 18 16L17.9996 13.999H15.9996L16 16L15.997 16.3149C15.9535 18.5643 15.4459 20.7 14.5657 22.6304C13.7516 22.8705 12.8909 23 12 23C11.6587 23 11.3218 22.981 10.9903 22.944C12.2637 20.9354 13 18.5537 13 16V9H11V16L10.9963 16.2884C10.9371 18.5891 10.1714 20.7142 8.90785 22.4547C7.9456 22.1028 7.05988 21.5909 6.28319 20.9515C7.35876 19.5892 8 17.8695 8 16V10L8.0049 9.80036C8.03767 9.1335 8.23376 8.50957 8.554 7.96773L7.10935 6.52332C6.41083 7.50417 6 8.70411 6 10V16L5.99586 16.2249C5.95095 17.4436 5.54259 18.5694 4.87532 19.4973C3.69863 17.9762 3 16.0697 3 14V10C3 5.02944 7.02944 1 12 1ZM12 4C10.7042 4 9.50434 4.41077 8.52353 5.10921L9.96848 6.55356C10.5639 6.20183 11.2584 6 12 6C14.2091 6 16 7.79086 16 10V12H18V10C18 6.68629 15.3137 4 12 4Z"
                fill="#5DDD22"
              />
            </svg>
          </div>
          <div>
            <div className="text-[20px] font-semibold leading-6">{stats.on_chained?.toLocaleString()}</div>
            <div className="text-xs text-[#999]">Anchored</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SubmissionCard(props: { submission: DataProfileListItem; onClick: () => void }) {
  const { submission, onClick } = props
  const badge = useMemo(() => getSubmissionBadge(submission), [submission])
  const timeText = submission.submission_time ? dayjs(submission.submission_time).format('MM/DD/YYYY HH:mm') : '-'
  const points = typeof submission.result === 'number' ? submission.result : 0

  return (
    <button type="button" onClick={onClick} className="w-full rounded-3xl bg-white px-5 pb-5 text-left">
      <div className="mb-2">
        <div
          className="h-[3px] w-8 rounded-full"
          style={{
            backgroundColor: badge.color,
            boxShadow: `2px 2px 6px ${badge.color}80`
          }}
        />
      </div>
      <div className="mb-2 text-[13px] font-medium" style={{ color: badge.color }}>
        {badge.label}
      </div>

      <div className="mb-1 text-[17px] leading-6 text-black">{submission.task_name}</div>
      <div className="mb-3 text-[13px] text-[#999]">
        Frontier · <span className="text-[#666]">{submission.frontier_name}</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-full bg-[#40E1EF]/20 px-3 py-1 text-[15px] font-semibold text-[#40E1EF]">
            <span>{submission.rating_name}</span>
            <div className="mx-2 h-[13px] w-px bg-black/5"></div>
            <span>+{points}Points</span>
          </div>
        </div>
        <div className="text-[13px] text-[#999]">{timeText}</div>
      </div>
    </button>
  )
}
