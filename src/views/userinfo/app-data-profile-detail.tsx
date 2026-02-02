import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { InfoCircleOutlined } from '@ant-design/icons'
import { ExternalLink, MoreVertical, X } from 'lucide-react'

import MobileAppFrontierHeader from '@/components/mobile-app/frontier-header'
import BottomDrawer from '@/components/mobile-app/bottom-drawer'
import CopyAction from '@/components/common/copy'
import { userStoreActions, useUserStore } from '@/stores/user.store'
import defaultAvatar from '@/assets/home/default-avatar.png'
import LogoLightSvg from '@/assets/common/logo-light.svg?react'
import { DataProfileListItem } from '@/apis/frontiter.api'

function isInApp() {
  const userAgent = navigator.userAgent.toLowerCase()
  return userAgent.includes('codatta')
}

function shortenMiddle(value: string, start = 18, end = 8) {
  if (!value) return '-'
  if (value.length <= start + end + 3) return value
  return `${value.slice(0, start)}...${value.slice(-end)}`
}

function toPrettyJsonText(raw: unknown) {
  if (raw == null || raw === '') return '-'
  if (typeof raw !== 'string') return JSON.stringify(raw, null, 2)
  try {
    const parsed = JSON.parse(raw)
    return JSON.stringify(parsed, null, 2)
  } catch {
    return raw
  }
}

function getTxExplorerUrl(chainId?: string, tx?: string) {
  if (!tx) return undefined
  const normalizedTx = tx.startsWith('0x') ? tx : `0x${tx}`

  const raw = String(chainId || '').toLowerCase()
  const matches = raw.match(/\d+/g)
  const id = matches?.length ? Number(matches[matches.length - 1]) : NaN

  // supports: bsc(56), base(8453), kiteai testnet(2368)
  if (id === 8453) return `https://basescan.org/tx/${normalizedTx}`
  if (id === 56) return `https://bscscan.com/tx/${normalizedTx}`
  if (id === 2368) return `https://testnet.kitescan.ai/tx/${normalizedTx}`
  return undefined
}

function DrawerHeader(props: { title: string; onClose: () => void }) {
  const { title, onClose } = props
  return (
    <div className="flex items-center justify-between border-black/5 px-5 py-4">
      <div className="size-[44px]"></div>
      <div className="text-[17px] font-semibold text-black">{title}</div>
      <button
        type="button"
        onClick={onClose}
        className="flex size-[44px] items-center justify-center rounded-full bg-[#f9f9f930] shadow-app-btn backdrop-blur-sm"
        aria-label="Close"
      >
        <X size={18} />
      </button>
    </div>
  )
}

function SectionHeader(props: { title: string; timeText?: string; right?: React.ReactNode; onInfoClick?: () => void }) {
  const { title, timeText, right, onInfoClick } = props
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="text-[17px] font-semibold leading-7 text-black">{title}</div>
        {title === 'Anchor on-chain' ? <InfoCircleOutlined className="text-[#999]" onClick={onInfoClick} /> : null}
      </div>
      <div className="flex items-center gap-2">
        {timeText ? <div className="text-[13px] text-[#999]">{timeText}</div> : null}
        {right}
      </div>
    </div>
  )
}

function TimelineRow(props: { icon?: React.ReactNode; children: React.ReactNode; onMoreClick?: () => void }) {
  const { children, onMoreClick, icon } = props
  return (
    <div className="relative flex gap-3">
      <div className="w-6 shrink-0">{icon ? <div>{icon}</div> : null}</div>
      <div className="flex-1">{children}</div>
      <div className="w-4 shrink-0 text-center">
        {onMoreClick ? <MoreVertical size={16} onClick={onMoreClick}></MoreVertical> : null}
      </div>
    </div>
  )
}

function UserInfoDrawer(props: {
  open: boolean
  onClose: () => void
  info: {
    user_data?: { did?: string; user_name?: string; avatar?: string }
    accounts_data?: readonly { account: string; account_type: string }[]
  } | null
}) {
  const { open, onClose, info } = props

  const did = info?.user_data?.did?.trim()
  const emails = useMemo(() => {
    const raw = (info?.accounts_data || [])
      .filter((a) => a.account_type === 'email')
      .map((a) => a.account)
      .filter(Boolean)
    return Array.from(new Set(raw))
  }, [info])

  const wallets = useMemo(() => {
    const raw = (info?.accounts_data || [])
      .filter((a) => ['block_chain', 'wallet', 'blockchain'].includes(a.account_type))
      .map((a) => a.account)
      .filter(Boolean)
    return Array.from(new Set(raw))
  }, [info])

  return (
    <BottomDrawer open={open} onClose={onClose} className="rounded-t-[38px]">
      <div className="sticky top-0 -mx-5 -mt-4 bg-white">
        <DrawerHeader title="User Info" onClose={onClose} />
      </div>

      <div className="py-4">
        {emails.length ? (
          <div className="mb-5">
            <div className="mb-3 text-[15px] font-semibold text-black">Email</div>
            <div className="rounded-2xl bg-[#F5F5F5] p-4 text-[13px]">
              <div className="flex flex-col gap-3">
                {emails.map((e) => (
                  <div key={e}>
                    <div className="mt-2 flex items-center justify-between gap-3 text-black/80">
                      <span className="break-all">{e}</span>
                      <CopyAction content={e} className="shrink-0 text-black/40 hover:text-black/60" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {wallets.length ? (
          <div className="mb-5">
            <div className="mb-3 text-[15px] font-semibold text-black">Wallet</div>
            <div className="rounded-2xl bg-[#F5F5F5] p-4 text-[13px]">
              <div className="flex flex-col gap-3">
                {wallets.map((w) => (
                  <div key={w}>
                    <div className="mt-2 flex items-center justify-between gap-3 text-black/80">
                      <span className="break-all">{shortenMiddle(w, 6, 4)}</span>
                      <CopyAction content={w} className="shrink-0 text-black/40 hover:text-black/60" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {did ? (
          <div className="mb-2">
            <div className="mb-3 text-[15px] font-semibold text-black">DID</div>
            <div className="rounded-2xl bg-[#F5F5F5] p-4 text-[13px]">
              <div className="mt-2 flex items-center justify-between gap-3 text-black/80">
                <span className="break-all">{did}</span>
                <CopyAction content={did} className="shrink-0 text-black/40 hover:text-black/60" />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </BottomDrawer>
  )
}

function SubmissionDataDrawer(props: { open: boolean; onClose: () => void; submission: DataProfileListItem }) {
  const { open, onClose, submission } = props
  const dataOpen = true
  const dataText = useMemo(() => toPrettyJsonText(submission.data_submission), [submission.data_submission])

  return (
    <BottomDrawer open={open} onClose={onClose} className="rounded-t-[38px]">
      <div className="sticky top-0 -mx-5 -mt-4 bg-white">
        <DrawerHeader title="Submission Data" onClose={onClose} />
      </div>

      <div className="py-4">
        <div className="mb-5">
          <div className="mb-3 text-[15px] font-semibold text-black">Metadata</div>
          <div className="rounded-2xl bg-[#F5F5F5] p-4 text-[13px]">
            <div className="flex flex-col gap-4">
              <div>
                <div className="text-black/50">Submission id</div>
                <div className="mt-2 flex items-center justify-between gap-3 text-black/80">
                  <span className="break-all">{submission.submission_id || '-'}</span>
                  <CopyAction
                    content={submission.submission_id}
                    className="shrink-0 text-black/40 hover:text-black/60"
                  />
                </div>
              </div>
              <div>
                <div className="text-black/50">Task name</div>
                <div className="mt-2 flex items-center justify-between gap-3 text-black/80">
                  <span className="break-all">{submission.task_name || '-'}</span>
                  <CopyAction content={submission.task_name} className="shrink-0 text-black/40 hover:text-black/60" />
                </div>
              </div>
              <div>
                <div className="text-black/50">Frontier</div>
                <div className="mt-2 flex items-center justify-between gap-3 text-black/80">
                  <span className="break-all">{submission.frontier_name || '-'}</span>
                  <CopyAction
                    content={submission.frontier_name}
                    className="shrink-0 text-black/40 hover:text-black/60"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-3 flex w-full items-center justify-between text-[15px] font-semibold text-black">
          <span>Data (JSON)</span>
        </div>

        {dataOpen ? (
          <div className="rounded-2xl bg-[#f5f5f5] p-4">
            <div className="mb-2 flex justify-end">
              <CopyAction content={dataText} className="text-black/40 hover:text-black/60" />
            </div>
            <pre className="max-h-[50vh] overflow-auto text-[12px] leading-5 text-black/80">{dataText}</pre>
          </div>
        ) : null}
      </div>
    </BottomDrawer>
  )
}

function AnchorDetailsDrawer(props: { open: boolean; onClose: () => void; submission: DataProfileListItem }) {
  const { open, onClose, submission } = props
  const dataOpen = true

  const fingerprint = submission.fingerprint || ''
  const fingerprintShort = fingerprint ? shortenMiddle(fingerprint, 18, 8) : '-'
  const tx = submission.tx_hash || ''
  const txShort = tx ? shortenMiddle(tx, 18, 8) : '-'
  const txUrl = getTxExplorerUrl(submission.chain_id, tx)
  const dataText = useMemo(() => toPrettyJsonText(submission.data_submission), [submission.data_submission])

  return (
    <BottomDrawer open={open} onClose={onClose} className="rounded-t-[26px]">
      <div className="sticky top-0 -mx-5 -mt-4 bg-white">
        <DrawerHeader title="Anchor Details" onClose={onClose} />
      </div>

      <div className="py-4">
        <div className="mb-5">
          <div className="mb-3 text-[15px] font-semibold text-black">Summary</div>
          <div className="rounded-2xl bg-black/5 p-4 text-[13px]">
            <div className="flex flex-col gap-4">
              <div>
                <div className="text-black/50">Contribution Fingerprint (CF)</div>
                <div className="mt-2 flex items-center justify-between gap-3 text-black/80">
                  <span className="break-all">{fingerprintShort}</span>
                  <CopyAction content={fingerprint} className="shrink-0 text-black/40 hover:text-black/60" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-black/50">Chain</div>
                  <div className="mt-2 text-black/80">{submission.chain_name || '-'}</div>
                </div>
                <div>
                  <div className="text-black/50">Anchor time</div>
                  <div className="mt-2 text-black/80">
                    {submission.chain_time ? dayjs(submission.chain_time).format('YYYY-MM-DD HH:mm') : '-'}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-black/50">Tx hash</div>
                <div className="mt-2 flex items-center justify-between gap-3 text-black/80">
                  <span className="break-all">{txShort}</span>
                  <div className="flex shrink-0 items-center gap-2">
                    {txUrl ? (
                      <a
                        href={txUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black/40 hover:text-black/60"
                        aria-label="Open in explorer"
                      >
                        <ExternalLink size={18} />
                      </a>
                    ) : null}
                    <CopyAction content={tx} className="text-black/40 hover:text-black/60" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <div className="mb-3 text-[15px] font-semibold text-black">Verify fingerprint</div>
          <Link
            to="/app/settings/data-profile/onchain-data-verify"
            className="flex h-11 w-full items-center justify-center rounded-full border border-black/10 bg-white text-[15px] font-semibold text-black"
          >
            Start verification
          </Link>
        </div>

        <div className="mb-3 flex w-full items-center justify-between text-[15px] font-semibold text-black">
          <span>Data (JSON)</span>
        </div>

        {dataOpen ? (
          <div className="rounded-2xl bg-black/5 p-4">
            <div className="mb-2 flex justify-end">
              <CopyAction content={dataText} className="text-black/40 hover:text-black/60" />
            </div>
            <pre className="max-h-[50vh] overflow-auto text-[12px] leading-5 text-black/80">{dataText}</pre>
          </div>
        ) : null}
      </div>
    </BottomDrawer>
  )
}

function AnchorInfoModal(props: { onClose: () => void }) {
  const { onClose } = props
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/20" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-[32px] bg-white/60 px-4 pb-4 pt-5 shadow-glass backdrop-blur-md">
        {/* Title */}
        <h2 className="mb-4 text-center text-[24px] font-semibold text-black">Anchor on-chain</h2>

        {/* Requirements List */}
        <div className="pb-3 text-center">
          Generates a fingerprint and records proof on-chain, providing tamper-evident evidence for verification and
          dispute handling.
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

export default function AppDataProfileDetail() {
  const location = useLocation()
  const navigate = useNavigate()
  const { info, username } = useUserStore()

  const submission = (location.state as { submission: DataProfileListItem } | undefined)?.submission

  const [showSubmissionData, setShowSubmissionData] = useState(false)
  const [showAnchorDetails, setShowAnchorDetails] = useState(false)
  const [showUserInfo, setShowUserInfo] = useState(false)
  const [showAnchorInfo, setShowAnchorInfo] = useState(false)

  useEffect(() => {
    userStoreActions.getUserInfo()
  }, [])

  const onBack = () => {
    if (isInApp()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).native?.call?.('goBack')
    } else {
      navigate(-1)
    }
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] text-black">
        <MobileAppFrontierHeader title="Submission Detail" canSubmit={false} showSubmitButton={false} onBack={onBack} />
        <div className="px-5 pt-6 text-[15px] text-black/60">No submission found.</div>
      </div>
    )
  }

  const createdTime = submission.submission_time
    ? dayjs(submission.submission_time).format('MM/DD/YYYY HH:mm')
    : undefined
  const anchorTime = submission.chain_time ? dayjs(submission.chain_time).format('MM/DD/YYYY HH:mm') : undefined

  return (
    <div className="min-h-screen bg-white text-black">
      <MobileAppFrontierHeader title="Submission Detail" canSubmit={false} showSubmitButton={false} onBack={onBack} />

      <div className="px-5 pb-10">
        <div className="h-2" />

        {/* Section 1 */}
        <div className="mb-6">
          <SectionHeader title="Submission Created" timeText={createdTime} />
          <TimelineRow
            icon={<img src={info?.user_data.avatar || defaultAvatar} className="size-6 rounded-full"></img>}
            onMoreClick={() => setShowUserInfo(true)}
          >
            <div className="text-[13px] text-[#666]">@{username}</div>
            <div className="pb-6 text-[17px]">
              <span>Submitted to </span>
              <span className="text-[13px] text-[#666666]">
                {submission.frontier_name} / {submission.task_name}
              </span>
            </div>
          </TimelineRow>
          <TimelineRow onMoreClick={() => setShowSubmissionData(true)}>
            <div className="text-[13px] text-[#666]">Submission data</div>
            <div className="text-[17px]">
              <span>Stored on {submission.chain_name}</span>
            </div>
          </TimelineRow>
        </div>

        <div className="-mx-5 mb-6 h-4 bg-[#F5F5F5]" />

        {/* Section 2 */}
        <div className="mb-6">
          <SectionHeader title="Validation" />
          <TimelineRow
            icon={
              <div className="flex size-6 items-center justify-center rounded-full bg-black">
                <LogoLightSvg className="size-3.5"></LogoLightSvg>
              </div>
            }
          >
            <div className="text-[13px] text-[#666]">Codatta Platform</div>
            <div className="pb-6 text-[17px]">
              <span>Validated your </span>
              <span className="text-[13px] text-[#666666]">Submission data</span>
            </div>
          </TimelineRow>
          <TimelineRow>
            <div className="text-[13px] text-[#666]">Result</div>
            <div className="pb-6 text-[17px]">
              <span>{submission.status}</span>
            </div>
          </TimelineRow>
          <TimelineRow>
            <div className="text-[13px] text-[#666]">Quality</div>
            <div className="pb-6 text-[17px]">
              <span>{submission.rating_name}</span>
            </div>
          </TimelineRow>
          <TimelineRow>
            <div className="text-[13px] text-[#666]">Validated by</div>
            <div className="text-[17px]">
              <span>Agent</span>
            </div>
          </TimelineRow>
        </div>

        <div className="-mx-5 mb-6 h-4 bg-[#F5F5F5]" />

        {/* Section 3 */}
        <div className="mb-2">
          <SectionHeader title="Anchor on-chain" timeText={anchorTime} onInfoClick={() => setShowAnchorInfo(true)} />
          <TimelineRow
            icon={
              <div className="flex size-6 items-center justify-center rounded-full bg-black">
                <LogoLightSvg className="size-3.5"></LogoLightSvg>
              </div>
            }
          >
            <div className="text-[13px] text-[#666]">Codatta Platform</div>
            <div className="pb-6 text-[17px]">
              <span>Anchord your submission </span>
              <span className="text-[13px] text-[#666666]">on {submission.chain_name}</span>
            </div>
          </TimelineRow>
          <TimelineRow onMoreClick={() => setShowAnchorDetails(true)}>
            <div className="text-[13px] text-[#666]">Contribution Fingerprint (CF)</div>
            <div className="text-[17px]">
              <span>0x{shortenMiddle(submission.fingerprint, 8, 8)} </span>
            </div>
          </TimelineRow>
        </div>
      </div>

      <SubmissionDataDrawer
        open={showSubmissionData}
        onClose={() => setShowSubmissionData(false)}
        submission={submission}
      />
      <AnchorDetailsDrawer
        open={showAnchorDetails}
        onClose={() => setShowAnchorDetails(false)}
        submission={submission}
      />
      <UserInfoDrawer open={showUserInfo} onClose={() => setShowUserInfo(false)} info={info} />
      {showAnchorInfo ? <AnchorInfoModal onClose={() => setShowAnchorInfo(false)} /> : null}
    </div>
  )
}
