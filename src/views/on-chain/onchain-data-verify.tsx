import React, { useCallback, useMemo, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import Form, { IFormData } from '@/components/on-chain/form'
import DataVerify from '@/components/on-chain/data-verify'
import bridge from '@/components/mobile-app/bridge'

const Page: React.FC = () => {
  const [verifyData, setVerifyData] = useState<IFormData>()
  const [mode, setMode] = useState<'form' | 'verify'>('form')

  const handleSubmit = async (next: IFormData) => {
    setVerifyData(next)
    setMode('verify')
    requestAnimationFrame(() => window.scrollTo({ top: 0 }))
  }

  const handleBackToForm = useCallback(() => {
    setMode('form')
    setVerifyData(undefined)
    requestAnimationFrame(() => window.scrollTo({ top: 0 }))
  }, [])

  const translateClass = useMemo(() => (mode === 'verify' ? '-translate-x-1/2' : 'translate-x-0'), [mode])

  const onBack = () => {
    if (mode === 'verify') {
      handleBackToForm()
      return
    }
    bridge.goBack()
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Shared header */}
      <div className="h-[76px]" />
      <div
        className={`fixed top-0 z-10 grid w-full grid-cols-[44px_1fr_44px] p-4 text-[17px] ${'bg-gradient-to-b from-[#F8F8F8] via-[#F8F8F8BB] to-[#F8F8F800]'}`}
      >
        <button
          type="button"
          onClick={onBack}
          className="flex size-[44px] items-center justify-center rounded-full bg-[#f9f9f930] shadow-app-btn backdrop-blur-sm"
          aria-label="Back"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center justify-center font-semibold">Verify</div>
        <div className="size-[44px]" />
      </div>

      <div className="overflow-hidden">
        <div
          className={[
            'flex w-[200%] transition-transform duration-300 ease-out will-change-transform',
            translateClass
          ].join(' ')}
        >
          <div className="w-1/2">
            <Form
              defaultSubmissionId={verifyData?.submissionId || ''}
              defaultWalletAddress={verifyData?.walletAddress || ''}
              defaultQuality={verifyData?.quality || ''}
              defaultSubmissionJsonString={
                verifyData?.submissionJson ? JSON.stringify(verifyData.submissionJson, null, 2) : ''
              }
              onSubmit={handleSubmit}
              onBack={onBack}
              title="Verify"
            />
          </div>

          <div className="w-1/2">
            <div className="pt-2">
              <DataVerify verifyData={mode === 'verify' ? verifyData : undefined} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
