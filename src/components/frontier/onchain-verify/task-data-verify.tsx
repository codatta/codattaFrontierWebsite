import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ValidationFormData } from '@/views/frontiers/onchain-verify'
import frontiterApi from '@/apis/frontiter.api'
import { message } from 'antd'
import { contract as binanceDataOnchainContract } from '@/contracts/binance-data-onchain.abi'
import { createPublicClient, http } from 'viem'
import DoubleCheckSVG from '@/assets/frontier/onchain-verify/check-double-fill.svg'
import LoaderSVG from '@/assets/frontier/onchain-verify/loader-line.svg'
import CloseSVG from '@/assets/frontier/onchain-verify/close-line.svg'
import boosterApi from '@/apis/booster.api'
import PageHeader from './page-header-back'
import PageHeaderBack from './page-header-back'

// Step 1: Calculating Local Fingerprint
function Step1CalculatingFingerprint({
  verifyData,
  onComplete
}: {
  verifyData: ValidationFormData
  onComplete: (fingerprint: string) => void
}) {
  const [loading, setLoading] = useState(true)
  const [fingerprint, setFingerprint] = useState('')

  async function getFingerprint(verifyData: ValidationFormData) {
    setLoading(true)
    try {
      const res = await frontiterApi.generateFingerprint({
        submit_data: verifyData.jsonData,
        address: verifyData.address,
        quality: verifyData.quality
      })
      const fingerprint = `0x${res.data.fingerprint}`
      setFingerprint(fingerprint)
      setTimeout(() => {
        onComplete(fingerprint)
      }, 300)
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!verifyData) return
    getFingerprint(verifyData)
  }, [verifyData])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-2 p-3">
        <div className="flex w-5 flex-col items-center pt-1">
          {loading ? (
            <img src={LoaderSVG} className="size-5 animate-spin" alt="" />
          ) : (
            <img src={DoubleCheckSVG} className="size-5 text-green-400" alt="" />
          )}
          <div className="relative top-2 h-[calc(100%-32px)] w-[1px] bg-white/10"></div>
        </div>
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-bold leading-[28px] text-white">
            {loading ? 'Calculating local fingerprint...' : 'Complete the local fingerprint generation'}
          </h3>
          <p className="text-sm text-[#BBBBBE]">
            We hash your JSON + address + quality locally to calculate your unique fingerprint.
          </p>
          {!loading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 rounded-lg bg-[#1a1a24] p-3"
            >
              <p className="mb-1 text-xs text-gray-400">Fingerprint:</p>
              <p className="font-mono break-all text-xs text-[#BBBBBE]">{fingerprint}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Step 2: Reading On-Chain Fingerprint
function Step2ReadingOnChain({
  verifyData,
  onComplete
}: {
  verifyData: ValidationFormData
  onComplete: (fingerprint: string) => void
}) {
  const [loading, setLoading] = useState(true)
  const [fingerprint, setFingerprint] = useState('')

  async function getOnChainFingerprint(verifyData: ValidationFormData) {
    setLoading(true)

    try {
      const client = createPublicClient({
        chain: binanceDataOnchainContract.chain,
        transport: http()
      })

      const userAddress = verifyData.address
      const submissionId = verifyData.submissionId

      // TODO
      // const userAddress = '0xC48BAbE752CB4a12e1D8bEa56952dfb9D25361A1'
      // const submissionId = '2025082914162800106779'

      const fingerprint = (await client.readContract({
        abi: binanceDataOnchainContract.abi,
        address: binanceDataOnchainContract.address as `0x${string}`,
        functionName: 'getUserRecordBySubmissionId',
        args: [userAddress, submissionId, 0, 100]
      })) as Array<object>
      const fingerprintOnChainData = fingerprint[1] as {
        fingerPrint: string
        submissionId: bigint
      }

      setFingerprint(fingerprintOnChainData.fingerPrint)
      setTimeout(() => {
        onComplete(fingerprintOnChainData.fingerPrint)
      }, 500)
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!verifyData) return
    getOnChainFingerprint(verifyData)
  }, [verifyData])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-2 p-3">
        <div className="flex w-5 flex-col items-center pt-1">
          {loading ? (
            <img src={LoaderSVG} className="size-5 animate-spin" alt="" />
          ) : (
            <img src={DoubleCheckSVG} className="size-5 text-green-400" alt="" />
          )}
          <div className="relative top-2 h-[calc(100%-32px)] w-[1px] bg-white/10"></div>
        </div>
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <h3 className="text-lg font-bold leading-[28px] text-white">
              {loading ? 'Reading on-chain fingerprint...' : 'Complete the on-chain fingerprint reading'}
            </h3>
          </div>
          <p className="mb-2 text-sm text-[#BBBBBE]">
            Fetch the attested fingerprint from chain. Read-only call — no writes, no gas.
          </p>
          {!loading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 rounded-lg bg-[#1a1a24] p-3"
            >
              <p className="mb-1 text-xs text-gray-400">Fingerprint:</p>
              <p className="font-mono break-all text-xs text-[#BBBBBE]">{fingerprint}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Step 3: Comparing Fingerprints
function Step3ComparingFingerprints({
  onComplete,
  localFingerprint,
  onChainFingerprint
}: {
  onComplete: (result: boolean) => void
  localFingerprint: string
  onChainFingerprint: string
}) {
  const [loading] = useState(false)

  const result = useMemo(() => {
    return localFingerprint === onChainFingerprint
  }, [localFingerprint, onChainFingerprint])

  useEffect(() => {
    setTimeout(() => onComplete(result), 500)
  }, [result])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-2 p-3">
        <div className="flex w-5 flex-col items-center pt-1">
          {loading ? (
            <img src={LoaderSVG} className="size-5 animate-spin" alt="" />
          ) : (
            <img src={DoubleCheckSVG} className="size-5 text-green-400" alt="" />
          )}
          <div className="relative top-2 h-[calc(100%-32px)] w-[1px] bg-white/10"></div>
        </div>
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <h3 className="text-lg font-bold leading-[28px] text-white">
              {loading
                ? 'Comparing local fingerprint with on-chain fingerprint...'
                : 'Complete the fingerprint comparison'}
            </h3>
          </div>
          <p className="mb-2 text-sm text-[#BBBBBE]">
            Comparing the local and on-chain fingerprints means that the data has not been tampered with and can be
            self-verified.
          </p>
          <div className="mt-4 rounded-lg bg-[#1a1a24] p-3">
            {result == true ? (
              <div>
                <div className="flex items-center gap-2">
                  <img src={DoubleCheckSVG} className="size-5 text-green-400" alt="" />
                  <p className="text-base text-green-400">Verification successful</p>
                </div>
                <p className="text-sm text-[#BBBBBE]">
                  your data matches the on-chain record (attested & tamper-proof).
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2">
                  <img src={CloseSVG} className="size-5 text-[#D92B2B]" alt="" />
                  <p className="text-base text-[#D92B2B]">Verification failed</p>
                </div>
                <p className="text-sm text-[#BBBBBE]">
                  Make sure your JSON/address/quality match the original submission. You can go back to the JSON page to
                  re-copy.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Step 4: Verification Successful
function Step4TaskResult(props: { result: boolean }) {
  const { result } = props

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-2 p-3">
        <div className="flex w-5 flex-col items-center pt-1">
          {result ? (
            <img src={DoubleCheckSVG} className="size-5 text-green-400" alt="" />
          ) : (
            <img src={CloseSVG} className="size-5 text-[#D92B2B]" alt="" />
          )}
          <div className="relative top-2 h-[calc(100%-32px)] w-[1px] bg-white/10"></div>
        </div>
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <h3 className="text-lg font-bold leading-[28px] text-white">
              {result ? (
                <span className="text-[#5DDD22]">Completed</span>
              ) : (
                <span className="text-[#D92B2B]">Not completed</span>
              )}
            </h3>
          </div>
          <p className="mb-2 text-sm text-[#BBBBBE]">
            {result
              ? 'To receive your reward, please verify the task on the Binance Wallet campaign page.'
              : 'This verification does not meet the campaign completion criteria'}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// Main Component
export default function TaskDataVerify(props: { verifyData: ValidationFormData; taskKey: string; onBack: () => void }) {
  const { verifyData, taskKey } = props
  const [currentStep, setCurrentStep] = useState(1)
  const [localFingerprint, setLocalFingerprint] = useState('')
  const [onChainFingerprint, setOnChainFingerprint] = useState('')
  const [verificationResult, setVerificationResult] = useState(false)

  const handleStepComplete = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const handleLocalFingerprintComplete = (fingerprint: string) => {
    setLocalFingerprint(fingerprint)
    handleStepComplete()
  }

  const handleOnChainFingerprintComplete = (fingerprint: string) => {
    setOnChainFingerprint(fingerprint)
    handleStepComplete()
  }

  const handleVerificationComplete = (result: boolean) => {
    setVerificationResult(result)
    handleStepComplete()

    if (result)
      completeTask(
        taskKey,
        JSON.stringify({
          task_key: taskKey,
          submission_id: verifyData.submissionId,
          user_address: verifyData.address,
          local_fingerprint: localFingerprint,
          on_chain_fingerprint: onChainFingerprint
        })
      )
  }

  async function completeTask(taskKey: string, data: string) {
    await boosterApi.submitTask(taskKey, data)
  }

  return (
    <>
      <PageHeaderBack title="Verify" onBack={props.onBack} />
      <div className="pb-10">
        <AnimatePresence mode="wait">
          <div className="mx-6 rounded-xl border border-white/5 bg-[#252532]">
            {currentStep >= 1 && (
              <Step1CalculatingFingerprint
                key="step1"
                verifyData={verifyData}
                onComplete={handleLocalFingerprintComplete}
              />
            )}
            {currentStep >= 2 && (
              <Step2ReadingOnChain key="step2" verifyData={verifyData} onComplete={handleOnChainFingerprintComplete} />
            )}
            {currentStep >= 3 && (
              <Step3ComparingFingerprints
                key="step3"
                onComplete={handleVerificationComplete}
                localFingerprint={localFingerprint}
                onChainFingerprint={onChainFingerprint}
              />
            )}
            {currentStep >= 4 && <Step4TaskResult key="step4" result={verificationResult} />}
          </div>
        </AnimatePresence>
      </div>
    </>
  )
}
