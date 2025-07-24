import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Spin, message } from 'antd'
import { cn } from '@udecode/cn'
import { ArrowLeft } from 'lucide-react'

import AuthChecker from '@/components/app/auth-checker'
import { EXCHANGE_OPTIONS, BLOCKCHAIN_OPTIONS, CURRENCY_OPTIONS } from '@/components/frontier/crypto/consts'
import type { Exchange, Blockchain, Currency } from '@/components/frontier/crypto/consts'
import Select from '@/components/frontier/crypto/select'
import Input from '@/components/frontier/crypto/input'
import Upload from '@/components/frontier/crypto/upload'
import { Button } from '@/components/booster/button'
import Result from '@/components/frontier/crypto/result'

import { useIsMobile } from '@/hooks/use-is-mobile'
import frontiterApi from '@/apis/frontiter.api'
import { validateCryptoAddress, validateTxHash } from '@/components/frontier/crypto/util'

interface WithdrawFormData {
  exchange: Exchange
  blockchain: Blockchain
  currency: Currency
  transactionHash: string
  sourceAddress: string
  images: { url: string; hash: string }[]
}

export default function CryptoWithdrawForm({ templateId }: { templateId: string }) {
  const { taskId } = useParams()
  const isMobile = useIsMobile()

  const [pageLoading, _setPageLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resultType, setResultType] = useState<'ADOPT' | 'PENDING' | 'REJECT' | null>('ADOPT')

  const [errors, setErrors] = useState<Partial<Record<keyof WithdrawFormData, string>>>({})
  const [formData, setFormData] = useState<WithdrawFormData>({
    exchange: '' as Exchange,
    blockchain: '' as Blockchain,
    currency: '' as Currency,
    transactionHash: '',
    sourceAddress: '',
    images: []
  })
  const canSubmit = useMemo(() => {
    return (
      Object.values(errors).every((error) => !error) &&
      !!formData.exchange &&
      !!formData.blockchain &&
      !!formData.currency &&
      !!formData.transactionHash &&
      !!formData.sourceAddress &&
      formData.images?.length > 0
    )
  }, [errors, formData])

  useEffect(() => {
    console.log(templateId)
  }, [templateId])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof WithdrawFormData, string>> = {}

    if (formData.images.length === 0) {
      newErrors.images = 'Please upload an image'
    }
    if (!formData.exchange) {
      newErrors.exchange = 'Exchange is required'
    }
    if (!formData.blockchain) {
      newErrors.blockchain = 'Blockchain is required'
    }
    if (!formData.currency) {
      newErrors.currency = 'Currency is required'
    }
    if (!formData.transactionHash || !validateTxHash(formData.transactionHash)) {
      newErrors.transactionHash = 'Please provide a valid transaction hash'
    }
    if (!formData.sourceAddress || !validateCryptoAddress(formData.sourceAddress)) {
      newErrors.sourceAddress = 'Please provide a valid address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const resetForm = () => {
    setFormData({
      images: [],
      exchange: '' as Exchange,
      blockchain: '' as Blockchain,
      currency: '' as Currency,
      transactionHash: '',
      sourceAddress: ''
    })
  }
  const handleFormChange = (
    field: keyof WithdrawFormData,
    value: string | number | { url: string; hash: string }[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    setLoading(true)

    try {
      await frontiterApi.submitTask(taskId!, {
        templateId: templateId,
        taskId: taskId,
        data: Object.assign({}, formData)
      })
      resetForm()
    } catch (error) {
      message.error(error.message)
    }
    setLoading(false)
  }

  const onSubmitAgain = () => {
    resetForm()
    setResultType(null)
  }

  return (
    <AuthChecker>
      <Spin spinning={pageLoading} className="min-h-screen">
        <div className="mx-auto min-h-screen max-w-[1272px] px-6 py-3 md:py-8">
          <h1 className="flex items-center justify-between text-center text-base font-bold">
            {!isMobile ? (
              <div className="flex items-center gap-2 text-sm font-normal text-[white]">
                <ArrowLeft size={18} /> Back
              </div>
            ) : (
              <span></span>
            )}
            Withdraw Submission
            <span></span>
          </h1>
          {resultType ? (
            <Result type={resultType} onSubmitAgain={onSubmitAgain} />
          ) : (
            <>
              <div className="mt-[34px] space-y-[22px] md:mt-[72px] md:space-y-[30px]">
                <div>
                  <h3
                    className={cn('mb-2 text-sm text-[#BBBBBE] md:text-base md:text-white', isMobile ? 'px-4' : 'px-0')}
                  >
                    Exchange Name<span className="text-red-400">*</span>
                  </h3>
                  <Select
                    isMobile={isMobile}
                    options={EXCHANGE_OPTIONS}
                    placeholder="Select Exchange"
                    value={formData.exchange || undefined}
                    onChange={(value) => handleFormChange('exchange', value)}
                  />
                  <p className={cn('mt-2 text-sm text-red-400', isMobile ? 'px-4' : 'px-0')}>{errors.exchange}</p>
                </div>
                <div>
                  <h3
                    className={cn('mb-2 text-sm text-[#BBBBBE] md:text-base md:text-white', isMobile ? 'px-4' : 'px-0')}
                  >
                    Blockchain<span className="text-red-400">*</span>
                  </h3>
                  <Select
                    options={BLOCKCHAIN_OPTIONS}
                    placeholder="Select Blockchain"
                    value={formData.blockchain || undefined}
                    onChange={(value) => handleFormChange('blockchain', value)}
                    isMobile={isMobile}
                  />
                  <p className={cn('mt-2 text-sm text-red-400', isMobile ? 'px-4' : 'px-0')}>{errors.blockchain}</p>
                </div>
                <div>
                  <h3
                    className={cn('mb-2 text-sm text-[#BBBBBE] md:text-base md:text-white', isMobile ? 'px-4' : 'px-0')}
                  >
                    Currency<span className="text-red-400">*</span>
                  </h3>
                  <Select
                    isMobile={isMobile}
                    options={CURRENCY_OPTIONS}
                    placeholder="Select Currency"
                    value={formData.currency || undefined}
                    onChange={(value) => handleFormChange('currency', value)}
                  />
                  <p className={cn('mt-2 text-sm text-red-400', isMobile ? 'px-4' : 'px-0')}>{errors.currency}</p>
                </div>
                <div>
                  <h3
                    className={cn('mb-2 text-sm text-[#BBBBBE] md:text-base md:text-white', isMobile ? 'px-4' : 'px-0')}
                  >
                    Transaction Hash <span className="text-red-400">*</span>
                  </h3>
                  <Input
                    isMobile={isMobile}
                    placeholder="Address where funds were transferred from deposit address for verification"
                    value={formData.transactionHash}
                    maxLength={255}
                    onChange={(value) => handleFormChange('transactionHash', value)}
                  />
                  <p className={cn('mt-2 text-sm text-red-400', isMobile ? 'px-4' : 'px-0')}>
                    {errors.transactionHash}
                  </p>
                </div>
                <div>
                  <h3
                    className={cn('mb-2 text-sm text-[#BBBBBE] md:text-base md:text-white', isMobile ? 'px-4' : 'px-0')}
                  >
                    Source Address <span className="text-red-400">*</span>
                  </h3>
                  <Input
                    isMobile={isMobile}
                    placeholder="Optional: Address where funds were transferred from deposit address "
                    value={formData.sourceAddress}
                    maxLength={255}
                    onChange={(value) => handleFormChange('sourceAddress', value)}
                  />
                  <p className={cn('mt-2 text-sm text-red-400', isMobile ? 'px-4' : 'px-0')}>{errors.sourceAddress}</p>
                </div>

                <div>
                  <h3
                    className={cn('mb-2 text-sm text-[#BBBBBE] md:text-base md:text-white', isMobile ? 'px-4' : 'px-0')}
                  >
                    Withdraw Address Screenshot<span className="text-red-400">*</span>
                  </h3>
                  <Upload
                    value={formData.images}
                    onChange={(images) => handleFormChange('images', images)}
                    isMobile={isMobile}
                  />
                  <p className={cn('mt-2 text-sm text-red-400', isMobile ? 'px-4' : 'px-0')}>{errors.images}</p>
                </div>
              </div>
              <Button
                text={`Submit Withdraw`}
                onClick={handleSubmit}
                className={cn(
                  'mt-4 w-full rounded-full bg-primary px-4 leading-[44px] text-white md:mx-auto md:w-[240px] md:text-sm md:font-normal',
                  !canSubmit ? 'cursor-not-allowed opacity-25' : 'cursor-pointer opacity-100'
                )}
                disabled={!canSubmit}
                loading={loading}
              />
            </>
          )}
        </div>
      </Spin>
    </AuthChecker>
  )
}
