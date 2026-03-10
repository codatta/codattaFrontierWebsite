import { useEffect, useMemo, useState } from 'react'
import { createPublicClient, encodeAbiParameters, http, keccak256 } from 'viem'
import { Loader2, Check, X } from 'lucide-react'

import type { IFormData } from './form'
import { contract as onchainDataContract } from '@/contracts/onchain-data.abi'

function canonicalizeJson(value: unknown): string {
  // Lightweight JCS-style canonicalization:
  // - Object keys sorted lexicographically
  // - Arrays keep order
  // - Uses JSON number/string escaping rules via JSON.stringify primitives
  const t = typeof value
  if (value === null || t === 'boolean' || t === 'number' || t === 'string') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map((v) => canonicalizeJson(v)).join(',')}]`
  if (t === 'object') {
    const obj = value as Record<string, unknown>
    const keys = Object.keys(obj).sort()
    return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalizeJson(obj[k])}`).join(',')}}`
  }
  // Fallback for unsupported types (undefined/function/symbol)
  return JSON.stringify(null)
}

function safeHex(hex: string) {
  if (!hex) return ''
  return hex.startsWith('0x') ? hex : `0x${hex}`
}

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return 'Unknown error'
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function StepIndicator(props: { status: 'pending' | 'loading' | 'success' | 'error'; showLine?: boolean }) {
  const { status, showLine = true } = props
  const dot = (() => {
    if (status === 'loading') {
      return (
        <div className="flex size-6 items-center justify-center rounded-full bg-[#40E1EF]/15 text-[#40E1EF]">
          <Loader2 className="size-4 animate-spin" />
        </div>
      )
    }
    if (status === 'success') {
      return (
        <div className="flex size-6 items-center justify-center rounded-full bg-[#40E1EF]">
          <div className="size-2.5 rounded-full bg-white" />
        </div>
      )
    }
    if (status === 'error') {
      return (
        <div className="flex size-6 items-center justify-center rounded-full bg-[#FF3B30]">
          <div className="size-2.5 rounded-full bg-white" />
        </div>
      )
    }
    return <div className="size-6 rounded-full border-2 border-[#40E1EF]/30 bg-white" />
  })()

  return (
    <div className="flex w-7 flex-col items-center">
      {dot}
      {showLine ? <div className="mt-2 h-full w-[2px] flex-1 bg-[#40E1EF]/15" /> : null}
    </div>
  )
}

function StepCard(props: {
  status: 'pending' | 'loading' | 'success' | 'error'
  title: string
  desc: string
  fingerprint?: string
  children?: React.ReactNode
  showLine?: boolean
}) {
  const { status, title, desc, fingerprint, children, showLine } = props
  const titleText = status === 'loading' ? title.replace(/^Complete /i, 'Completing ') : title

  return (
    <div className="flex gap-3 bg-white px-5 pt-5">
      <StepIndicator status={status} showLine={showLine} />
      <div className="min-w-0 flex-1 pb-5">
        <div className="text-[17px] font-semibold leading-6 text-black">{titleText}</div>
        <div className="mt-2 text-[13px] leading-5 text-[#999]">{desc}</div>

        {fingerprint ? (
          <div className="mt-4 rounded-2xl bg-[#F5F5F5] p-4">
            <div className="text-[12px] text-[#999]">Fingerprint</div>
            <div className="mt-2 break-all text-[12px] leading-5 text-[#666]">{fingerprint}</div>
          </div>
        ) : null}

        {children}
      </div>
    </div>
  )
}

function calculateLocalFingerprint(verifyData: IFormData): string {
  if (!verifyData.submissionJson) throw new Error('Missing submission JSON')
  const submissionData = canonicalizeJson(verifyData.submissionJson)
  const encodedData = encodeAbiParameters(
    [
      { name: 'address', type: 'address' },
      { name: 'quality', type: 'string' },
      { name: 'submissionData', type: 'string' }
    ],
    [verifyData.walletAddress as `0x${string}`, verifyData.quality, submissionData]
  )
  return keccak256(encodedData)
}

async function readOnChainFingerprint(verifyData: IFormData): Promise<string> {
  const client = createPublicClient({
    chain: onchainDataContract.chain,
    transport: http(onchainDataContract.chain.rpcUrls.default.http[0])
  })

  let submissionId: bigint
  try {
    submissionId = BigInt(verifyData.submissionId)
  } catch {
    throw new Error('Invalid submissionId: must be a uint256-compatible integer string')
  }

  const result = await client.readContract({
    abi: onchainDataContract.abi,
    address: onchainDataContract.address as `0x${string}`,
    functionName: 'getUserRecordBySubmissionId',
    args: [verifyData.walletAddress as `0x${string}`, submissionId, 0n, 100n]
  })

  // Accept several shapes for future-proofing.
  if (typeof result === 'string') return safeHex(result)
  if (Array.isArray(result)) {
    const maybe = result[1] as unknown
    if (typeof maybe === 'string') return safeHex(maybe)
    if (isObject(maybe) && typeof maybe.fingerPrint === 'string') return safeHex(maybe.fingerPrint)
    if (Array.isArray(maybe) && isObject(maybe[0]) && typeof maybe[0].fingerPrint === 'string') {
      return safeHex(maybe[0].fingerPrint)
    }
  }
  if (isObject(result) && typeof result.fingerPrint === 'string') return safeHex(result.fingerPrint)
  throw new Error('Unexpected contract return value')
}

export default function TaskDataVerify(props: { verifyData: IFormData | undefined }) {
  const { verifyData } = props
  const [currentStep, setCurrentStep] = useState(1)

  const [localFingerprint, setLocalFingerprint] = useState('')
  const [onChainFingerprint, setOnChainFingerprint] = useState('')
  const [error1, setError1] = useState<string | null>(null)
  const [error2, setError2] = useState<string | null>(null)

  useEffect(() => {
    setCurrentStep(verifyData ? 1 : 0)
    setLocalFingerprint('')
    setOnChainFingerprint('')
    setError1(null)
    setError2(null)
  }, [verifyData])

  const compareResult = useMemo(() => {
    if (!localFingerprint || !onChainFingerprint) return null
    return safeHex(localFingerprint) === safeHex(onChainFingerprint)
  }, [localFingerprint, onChainFingerprint])

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!verifyData) return

      // Step 1
      setError1(null)
      try {
        const fp = calculateLocalFingerprint(verifyData)
        if (cancelled) return
        setLocalFingerprint(fp)
        setCurrentStep(2)
      } catch (e: unknown) {
        if (cancelled) return
        setError1(getErrorMessage(e))
        setCurrentStep(1)
        return
      }

      // Step 2
      setError2(null)
      try {
        const fp = await readOnChainFingerprint(verifyData)
        if (cancelled) return
        setOnChainFingerprint(fp)
        setCurrentStep(3)
      } catch (e: unknown) {
        if (cancelled) return
        setError2(getErrorMessage(e))
        setCurrentStep(2)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [verifyData])

  if (!verifyData) return null

  const step1Status: 'pending' | 'loading' | 'success' | 'error' = error1
    ? 'error'
    : localFingerprint
      ? 'success'
      : currentStep === 1
        ? 'loading'
        : 'pending'
  const step2Status: 'pending' | 'loading' | 'success' | 'error' = error2
    ? 'error'
    : onChainFingerprint
      ? 'success'
      : currentStep === 2
        ? 'loading'
        : 'pending'
  const step3Status: 'pending' | 'loading' | 'success' | 'error' =
    compareResult == null ? 'pending' : compareResult ? 'success' : 'error'

  return (
    <div className="bg-[#F5F5F5]">
      <div className="flex flex-col gap-4 divide-black/5">
        <StepCard
          status={step1Status}
          title="Complete the local fingerprint generation"
          desc="We hash your JSON + address + quality locally to calculate your unique fingerprint."
          fingerprint={localFingerprint || undefined}
          showLine={true}
        >
          {error1 ? <div className="mt-3 text-[13px] text-[#FF3B30]">{error1}</div> : null}
        </StepCard>

        <StepCard
          status={step2Status}
          title="Complete the on-chain fingerprint reading"
          desc="Fetch the attested fingerprint from chain. Read-only call - no writes, no gas."
          fingerprint={onChainFingerprint || undefined}
          showLine={true}
        >
          {error2 ? <div className="mt-3 text-[13px] text-[#FF3B30]">{error2}</div> : null}
        </StepCard>

        <StepCard
          status={step3Status}
          title="Complete the fingerprint comparison"
          desc="Comparing the local and on-chain fingerprints means that the data has not been tampered with and can be self-verified."
          showLine={false}
        >
          {compareResult == null ? null : (
            <div className="mt-4 rounded-2xl bg-[#F5F5F5] p-4">
              {compareResult ? (
                <div>
                  <div className="flex items-center gap-2 text-[#5DDD22]">
                    <Check className="size-4" />
                    <div className="text-[15px] font-semibold">Verification successful</div>
                  </div>
                  <div className="mt-2 text-[13px] leading-5 text-[#666]">
                    your data matches the on-chain record (attested & tamper-proof).
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 text-[#FF3B30]">
                    <X className="size-4" />
                    <div className="text-[15px] font-semibold">Verification failed</div>
                  </div>
                  <div className="mt-2 text-[13px] leading-5 text-[#666]">
                    Make sure your JSON/address/quality match the original submission.
                  </div>
                </div>
              )}
            </div>
          )}
        </StepCard>
      </div>
    </div>
  )
}
