import { DataProfileListItem } from '@/apis/frontiter.api'
import CopyAction from '@/components/common/copy'
import { useUserStore } from '@/stores/user.store'
import defaultAvatar from '@/assets/home/default-avatar.png'
import dayjs from 'dayjs'
import { ArrowLeft, Check, ChevronDown, Database, ExternalLink, Fingerprint, X } from 'lucide-react'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import LogoLightSvg from '@/assets/common/logo-light.svg?react'

function DataProfileDetailPageHeader() {
  const navigate = useNavigate()

  const onBack = () => {
    navigate(-1)
  }

  return (
    <div className="flex h-[60px] items-center border-b border-white/10">
      <div className="mx-auto flex w-full max-w-[1172px] items-center px-6">
        <div className="flex w-[72px] cursor-pointer items-center gap-2 text-sm text-white/80" onClick={onBack}>
          <ArrowLeft size={18} /> Back
        </div>
        <div className="flex-1 text-center text-sm font-medium">Submission Detail</div>
        <div className="w-[72px]"></div>
      </div>
    </div>
  )
}

function StepMarker({ state }: { state: 'done' | 'active' | 'pending' }) {
  if (state === 'done') {
    return (
      <div className="relative flex size-6 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-[#875DFF]" />
        <Check size={14} className="relative text-white" />
      </div>
    )
  }

  if (state === 'active') {
    return (
      <div className="relative flex size-6 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-[#875DFF]" />
        <div className="relative size-2.5 rounded-full bg-[#1C1C26]" />
      </div>
    )
  }

  return <div className="size-3 rounded-full bg-[#875DFF]" />
}

function CardShell({ title, timeText, children }: { title: string; timeText?: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-[#252532] p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-[22px] font-semibold leading-[30px]">{title}</h3>
        {timeText ? <div className="text-sm text-white/60">{timeText}</div> : null}
      </div>
      {children}
    </div>
  )
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

function shortenMiddle(value: string, start = 18, end = 8) {
  if (!value) return '-'
  if (value.length <= start + end + 3) return value
  return `${value.slice(0, start)}...${value.slice(-end)}`
}

function getTxExplorerUrl(chainName?: string, tx?: string) {
  if (!tx) return undefined
  const c = (chainName || '').toLowerCase()
  if (c.includes('base')) return `https://basescan.org/tx/0x${tx}`
  if (c.includes('bsc')) return `https://bscscan.com/tx/0x${tx}`
  if (c.includes('kite')) return `https://testnet.kitescan.ai/tx/0x${tx}`
  return undefined
}

function SubmissionDataPill(props: { onClick?: () => void; className?: string }) {
  const { onClick, className } = props
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80',
        onClick ? 'cursor-pointer transition-colors hover:bg-white/15' : 'cursor-default',
        className || ''
      ].join(' ')}
    >
      <Database size={16} className="text-white/70" />
      <span>Submission data</span>
    </button>
  )
}

type UserInfoPopoverData = {
  user_data?: { did?: string }
  accounts_data?: readonly { account: string; account_type: string }[]
}

function UserInfoPopover(props: { open: boolean; onClose: () => void; userInfo?: UserInfoPopoverData | null }) {
  const { open, onClose, userInfo } = props
  if (!open) return null

  const did = userInfo?.user_data?.did?.trim()
  const emails = Array.from(
    new Set(
      (userInfo?.accounts_data || [])
        .filter((a) => a.account_type === 'email')
        .map((a) => a.account)
        .filter(Boolean)
    )
  )
  const wallets = Array.from(
    new Set(
      (userInfo?.accounts_data || [])
        .filter((a) => ['block_chain', 'wallet', 'blockchain'].includes(a.account_type))
        .map((a) => a.account)
        .filter(Boolean)
    )
  )

  const emailText = emails.length ? emails.join(', ') : null
  const walletText = wallets.length ? wallets.join(', ') : '-'

  return (
    <>
      {/* click outside to close (no dark mask) */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div
        className="absolute left-0 top-full z-50 mt-3 w-[340px] max-w-[92vw] rounded-2xl bg-[#1C1C26] p-5 ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="text-base font-semibold text-white/90">User Info</div>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4 text-sm">
          {did ? (
            <div>
              <div className="text-white/50">DID</div>
              <div className="mt-2 flex items-center justify-between gap-3 text-white/80">
                <span className="break-all">{did}</span>
                <CopyAction content={did} className="shrink-0 text-white/60 hover:text-white/80" />
              </div>
            </div>
          ) : null}

          {emailText ? (
            <div>
              <div className="text-white/50">Email</div>
              <div className="mt-2 flex items-center justify-between gap-3 text-white/80">
                <span className="break-all">{emailText}</span>
                <CopyAction content={emails[0]} className="shrink-0 text-white/60 hover:text-white/80" />
              </div>
            </div>
          ) : null}

          <div>
            <div className="text-white/50">Wallet</div>
            {wallets.length ? (
              <div className="mt-2 flex flex-col gap-2">
                {wallets.map((w) => (
                  <div key={w} className="flex items-center justify-between gap-3 text-white/80">
                    <span className="break-all">{shortenMiddle(w, 6, 4)}</span>
                    <CopyAction content={w} className="shrink-0 text-white/60 hover:text-white/80" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 text-white/80">{walletText}</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function SubmissionCreateInfo(props: {
  submission: DataProfileListItem
  username: string
  avatar?: string
  onOpenSubmissionData?: () => void
  userInfo?: UserInfoPopoverData | null
}) {
  const { submission, username, avatar, onOpenSubmissionData, userInfo } = props
  const [showUserInfo, setShowUserInfo] = useState(false)

  const displayName = useMemo(() => {
    if (!username) return '@User'
    return username.startsWith('@') ? username : `@${username}`
  }, [username])

  return (
    <CardShell
      title="Submission Created"
      timeText={submission.submission_time ? dayjs(submission.submission_time).format('YYYY-MM-DD HH:mm') : undefined}
    >
      <div className="flex flex-col gap-4">
        <div className="relative flex items-center gap-3 text-sm text-white/80">
          <div className="flex cursor-pointer flex-wrap items-center gap-2" onClick={() => setShowUserInfo((v) => !v)}>
            <span className="flex items-center gap-1 rounded-full bg-white/10 p-1.5 font-semibold text-white">
              <img src={avatar || defaultAvatar} className="size-6 rounded-full" alt="" />
              <span>{displayName}</span>
            </span>
            <span className="font-semibold text-white/80">submitted to</span>
            <span className="text-white/70">
              {submission.frontier_name} / {submission.task_name}
            </span>
          </div>

          <UserInfoPopover open={showUserInfo} onClose={() => setShowUserInfo(false)} userInfo={userInfo} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SubmissionDataPill onClick={onOpenSubmissionData} />
          <div className="text-sm text-white/60">
            Stored on <span className="uppercase">{submission.chain_name || 'BASE'}</span>
          </div>
        </div>
      </div>
    </CardShell>
  )
}

function SubmissionValidationInfo(props: { submission: DataProfileListItem; onOpenSubmissionData?: () => void }) {
  const { submission, onOpenSubmissionData } = props
  // const resultLabel = submission.status?.toLowerCase() === 'refused' ? 'Failed' : 'Passed'

  return (
    <CardShell title="Validation">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 text-sm text-white/80">
          <div className="flex size-6 items-center justify-center rounded-md bg-white/5">
            <LogoLightSvg className="size-6"></LogoLightSvg>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-white/80">Codatta Platform</span>
            <span className="font-semibold text-white/80">validated your</span>
            <span className="inline-flex">
              <SubmissionDataPill onClick={onOpenSubmissionData} />
            </span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 text-sm text-white/60">
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <div>
              Result: <span className="text-white/80">{submission.status}</span>
            </div>
            <div>
              Quality: <span className="text-white/80">{submission.rating_name || '-'}</span>
            </div>
            <div>
              Validated by: <span className="text-white/80">Agent</span>
            </div>
          </div>
        </div>
      </div>
    </CardShell>
  )
}

function SubmissionOnChainInfo(props: { submission: DataProfileListItem }) {
  const { submission } = props
  const [showDrawer, setShowDrawer] = useState(false)
  const fingerprint = submission.fingerprint || ''
  const fingerprintShort = fingerprint ? `${fingerprint.slice(0, 18)}...${fingerprint.slice(-8)}` : '-'

  return (
    <CardShell
      title="Anchor on-chain"
      timeText={submission.chain_time ? dayjs(submission.chain_time).format('YYYY-MM-DD HH:mm') : undefined}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-white/80">
            <div className="flex size-6 items-center justify-center rounded-md bg-white/5">
              <LogoLightSvg className="size-6"></LogoLightSvg>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-white/80">Codatta Platform</span>
              <span className="font-semibold text-white/80">anchored your submission</span>
              <span className="text-white/60">
                on <span className="uppercase">{submission.chain_name || 'BASE'}</span>
              </span>
            </div>
          </div>

          <button
            className="h-9 rounded-full bg-white px-5 text-sm font-semibold text-black hover:bg-white/90"
            onClick={() => setShowDrawer(true)}
          >
            Details
          </button>
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <Fingerprint size={16} className="text-white/60" />
              <span>
                Contribution Fingerprint (CF) <span className="text-white/80">{fingerprintShort}</span>
              </span>
              <CopyAction content={fingerprint} className="text-white/60 hover:text-white/80" />
            </div>
          </div>
        </div>
      </div>

      <AnchorDetailsDrawer open={showDrawer} onClose={() => setShowDrawer(false)} submission={submission} />
    </CardShell>
  )
}

function AnchorDetailsDrawer(props: { open: boolean; onClose: () => void; submission: DataProfileListItem }) {
  const { open, onClose, submission } = props
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [dataOpen, setDataOpen] = useState(true)

  useEffect(() => {
    if (open) {
      setIsVisible(true)
      setTimeout(() => setIsAnimating(true), 10)
      document.body.style.overflow = 'hidden'
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => setIsVisible(false), 300)
      document.body.style.overflow = ''
      return () => clearTimeout(timer)
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const fingerprint = submission.fingerprint || ''
  const fingerprintShort = fingerprint ? shortenMiddle(fingerprint, 18, 8) : '-'
  const chainName = submission.chain_name || '-'
  const anchorTime = submission.chain_time ? dayjs(submission.chain_time).format('YYYY-MM-DD HH:mm') : '-'
  const tx = submission.tx_hash || ''
  const txShort = tx ? shortenMiddle(tx, 18, 8) : '-'
  const txUrl = getTxExplorerUrl(submission.chain_name, tx)

  const dataSubmissionText = useMemo(() => toPrettyJsonText(submission?.data_submission), [submission])

  if (!isVisible) return null

  return (
    <>
      <div
        className={[
          'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-out',
          isAnimating ? 'opacity-100' : 'opacity-0'
        ].join(' ')}
        onClick={onClose}
      />

      <div
        className={[
          'shadow-2xl fixed inset-y-0 right-0 z-50 w-[460px] max-w-[92vw] overflow-hidden bg-[#1C1C26] transition-transform duration-300 ease-out',
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        ].join(' ')}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div className="text-base font-semibold text-white/90">Anchor Details</div>
            <button type="button" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="mb-6">
              <div className="mb-3 text-sm font-semibold text-white/80">Summary</div>
              <div className="rounded-2xl bg-white/5 p-4 text-sm">
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="text-white/50">Contribution Fingerprint (CF)</div>
                    <div className="mt-2 flex items-center justify-between gap-3 text-white/80">
                      <span className="break-all">{fingerprintShort}</span>
                      <CopyAction content={fingerprint} className="shrink-0 text-white/60 hover:text-white/80" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-white/50">Chain</div>
                      <div className="mt-1 text-white/80">{chainName}</div>
                    </div>
                    <div>
                      <div className="text-white/50">Anchor time</div>
                      <div className="mt-1 text-white/80">{anchorTime}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-white/50">Tx hash</div>
                    <div className="mt-2 flex items-center justify-between gap-3 text-white/80">
                      <span className="break-all">{txShort}</span>
                      <div className="flex shrink-0 items-center gap-2">
                        {txUrl ? (
                          <a
                            href={txUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/60 hover:text-white/80"
                            aria-label="Open in explorer"
                          >
                            <ExternalLink size={18} />
                          </a>
                        ) : null}
                        <CopyAction content={tx} className="text-white/60 hover:text-white/80" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-3 text-sm font-semibold text-white/80">Verify fingerprint</div>
              <a
                href="https://onchain-data-verify.codatta.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-full items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10"
              >
                Start verification
              </a>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setDataOpen((v) => !v)}
                className="mb-3 flex w-full items-center justify-between text-sm font-semibold text-white/80"
              >
                <span>Data (JSON)</span>
                <ChevronDown
                  size={18}
                  className={['transition-transform duration-200', dataOpen ? 'rotate-180' : 'rotate-0'].join(' ')}
                />
              </button>

              {dataOpen ? (
                <div className="rounded-2xl bg-white/5 p-4">
                  <div className="mb-2 flex justify-end">
                    <CopyAction content={dataSubmissionText} className="text-white/60 hover:text-white/80" />
                  </div>
                  <pre className="max-h-[56vh] overflow-auto text-xs leading-5 text-white/80">{dataSubmissionText}</pre>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function SubmissionDataDrawer(props: { open: boolean; onClose: () => void; submission: DataProfileListItem }) {
  const { open, onClose, submission } = props
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (open) {
      setIsVisible(true)
      setTimeout(() => setIsAnimating(true), 10)
      document.body.style.overflow = 'hidden'
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => setIsVisible(false), 300)
      document.body.style.overflow = ''
      return () => clearTimeout(timer)
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const dataSubmissionText = useMemo(() => toPrettyJsonText(submission?.data_submission), [submission])

  if (!isVisible) return null

  return (
    <>
      <div
        className={[
          'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-out',
          isAnimating ? 'opacity-100' : 'opacity-0'
        ].join(' ')}
        onClick={onClose}
      />

      <div
        className={[
          'shadow-2xl fixed inset-y-0 right-0 z-50 w-[460px] max-w-[92vw] overflow-hidden bg-[#1C1C26] transition-transform duration-300 ease-out',
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        ].join(' ')}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div className="text-base font-semibold text-white/90">Submission Data</div>
            <button type="button" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="mb-6">
              <div className="mb-3 text-sm font-semibold text-white/80">Metadata</div>
              <div className="rounded-2xl bg-white/5 p-4 text-sm">
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="text-white/50">Submission id</div>
                    <div className="mt-2 flex items-center justify-between gap-3 text-white/80">
                      <span className="break-all">{submission.submission_id || '-'}</span>
                      <CopyAction
                        content={submission.submission_id}
                        className="shrink-0 text-white/60 hover:text-white/80"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="text-white/50">Task name</div>
                    <div className="mt-2 flex items-center justify-between gap-3 text-white/80">
                      <span className="break-all">{submission.task_name || '-'}</span>
                      <CopyAction
                        content={submission.task_name}
                        className="shrink-0 text-white/60 hover:text-white/80"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="text-white/50">Frontier</div>
                    <div className="mt-2 flex items-center justify-between gap-3 text-white/80">
                      <span className="break-all">{submission.frontier_name || '-'}</span>
                      <CopyAction
                        content={submission.frontier_name}
                        className="shrink-0 text-white/60 hover:text-white/80"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-white/80">Data (JSON)</div>
                <CopyAction content={dataSubmissionText} className="text-white/60 hover:text-white/80" />
              </div>

              <pre className="max-h-[56vh] overflow-auto rounded-2xl bg-white/5 p-4 text-xs leading-5 text-white/80">
                {dataSubmissionText}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function DataProfileDetail() {
  const location = useLocation()
  const navigate = useNavigate()
  const { info, username } = useUserStore()
  const submission = (location.state as { submission: DataProfileListItem } | undefined)?.submission
  const [showSubmissionData, setShowSubmissionData] = useState(false)

  const stepStates = useMemo(() => {
    const hasOnChain = Boolean(submission?.tx_hash || submission?.chain_time || submission?.fingerprint)
    return [
      { label: 'Step1', state: 'done' as const },
      { label: 'Step2', state: hasOnChain ? ('done' as const) : ('active' as const) },
      { label: 'Step3', state: hasOnChain ? ('done' as const) : ('pending' as const) }
    ]
  }, [submission])

  if (!submission) {
    return (
      <div className="flex flex-col">
        <DataProfileDetailPageHeader />
        <div className="mx-auto w-full max-w-[1172px] px-6 py-10">
          <div className="text-white/70">No submission found.</div>
          <button
            className="mt-4 h-10 rounded-full bg-white px-5 text-sm font-semibold text-black"
            onClick={() => navigate(-1)}
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <DataProfileDetailPageHeader />
      <div className="mx-auto w-full max-w-[1172px] px-6 py-10">
        <div className="mb-10">
          <h1 className="text-[40px] font-bold leading-[52px]">Submission Detail</h1>
          <div className="mt-2 text-sm text-white/60">
            {submission.frontier_name} - {submission.task_name} - {submission.rating_name} Data Lineage
          </div>
        </div>

        <div className="mb-8 text-xl font-semibold">Data Lineage</div>

        {/* Content */}
        <div className="flex flex-col">
          <div className="grid grid-cols-12 gap-6">
            {/* Mobile: show a compact marker per card */}
            <div className="relative col-span-2 pt-6">
              <div className="absolute inset-y-0 left-3 top-6 w-px -translate-x-1/2 bg-primary"></div>
              <div className="relative flex items-center gap-3">
                <StepMarker state={stepStates[0].state} />
                <div className="text-sm font-medium text-white/80">Step1</div>
              </div>
            </div>
            <div className="col-span-10">
              <SubmissionCreateInfo
                submission={submission}
                username={username}
                avatar={info?.user_data?.avatar || defaultAvatar}
                onOpenSubmissionData={() => setShowSubmissionData(true)}
                userInfo={info}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="relative col-span-2">
              <div className="absolute inset-y-0 left-3 w-px -translate-x-1/2 bg-primary"></div>
              <div className="flex items-center gap-3 pt-14">
                <StepMarker state={stepStates[1].state} />
                <div className="text-sm font-medium text-white/80">Step2</div>
              </div>
            </div>
            <div className="col-span-10 py-8">
              <SubmissionValidationInfo
                submission={submission}
                onOpenSubmissionData={() => setShowSubmissionData(true)}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="relative col-span-2">
              <div className="absolute inset-y-0 left-3 w-px -translate-x-1/2 bg-primary"></div>

              <div className="relative flex items-center gap-3 pt-6">
                <StepMarker state={stepStates[2].state} />
                <div className="text-sm font-medium text-white/80">Step3</div>
              </div>
            </div>
            <div className="col-span-10">
              <SubmissionOnChainInfo submission={submission} />
            </div>
          </div>
        </div>
      </div>

      <SubmissionDataDrawer
        open={showSubmissionData}
        onClose={() => setShowSubmissionData(false)}
        submission={submission}
      />
    </div>
  )
}
