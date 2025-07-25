import { useState, useMemo, useEffect } from 'react'
import { cn } from '@udecode/cn'

import { EXCHANGE_OPTIONS, BLOCKCHAIN_OPTIONS, CURRENCY_OPTIONS } from '@/components/frontier/crypto/consts'
import type { Exchange, Blockchain, Currency } from '@/components/frontier/crypto/consts'
import Select from '@/components/frontier/crypto/select'
import Input from '@/components/frontier/crypto/input'
import Upload from '@/components/frontier/crypto/upload'
import { Button } from '@/components/booster/button'

import { validateCryptoAddress, validateTxHash } from '@/components/frontier/crypto/util'

interface WithdrawFormData {
  exchange: Exchange
  blockchain: Blockchain
  currency: Currency
  transactionHash: string
  sourceAddress: string
  images: { url: string; hash: string }[]
}

export default function WithdrawForm({
  isMobile,
  resultType,
  isBnb,
  onSubmit
}: {
  isBnb?: boolean
  isMobile: boolean
  resultType?: 'ADOPT' | 'PENDING' | 'REJECT' | null
  onSubmit: (data: WithdrawFormData) => Promise<boolean>
}) {
  const [loading, setLoading] = useState(false)
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

  useEffect(() => {
    resetForm()
  }, [resultType])

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    const res = await onSubmit(formData)
    if (res) {
      resetForm()
    }
    setLoading(false)
  }

  return (
    <>
      <div className="mt-[34px] space-y-[22px] md:mt-[72px] md:space-y-[30px]">
        <div>
          <h3 className={cn('mb-2 text-sm text-[#BBBBBE] md:text-base md:text-white', isMobile ? 'px-4' : 'px-0')}>
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
          <h3 className={cn('mb-2 text-sm text-[#BBBBBE] md:text-base md:text-white', isMobile ? 'px-4' : 'px-0')}>
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
          <h3 className={cn('mb-2 text-sm text-[#BBBBBE] md:text-base md:text-white', isMobile ? 'px-4' : 'px-0')}>
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
          <h3 className={cn('mb-2 text-sm text-[#BBBBBE] md:text-base md:text-white', isMobile ? 'px-4' : 'px-0')}>
            Transaction Hash<span className="text-red-400">*</span>
          </h3>
          <Input
            isMobile={isMobile}
            placeholder="Provide Transaction Hash for verification"
            value={formData.transactionHash}
            maxLength={255}
            onChange={(value) => handleFormChange('transactionHash', value)}
          />
          <p className={cn('mt-2 text-sm text-red-400', isMobile ? 'px-4' : 'px-0')}>{errors.transactionHash}</p>
        </div>
        <div>
          <h3 className={cn('mb-2 text-sm text-[#BBBBBE] md:text-base md:text-white', isMobile ? 'px-4' : 'px-0')}>
            Source Address<span className="text-red-400">*</span>
          </h3>
          <Input
            isMobile={isMobile}
            placeholder="Address where funds were transferred from deposit address "
            value={formData.sourceAddress}
            maxLength={255}
            onChange={(value) => handleFormChange('sourceAddress', value)}
          />
          <p className={cn('mt-2 text-sm text-red-400', isMobile ? 'px-4' : 'px-0')}>{errors.sourceAddress}</p>
        </div>

        <div>
          <h3 className={cn('mb-2 text-sm text-[#BBBBBE] md:text-base md:text-white', isMobile ? 'px-4' : 'px-0')}>
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
        text={`Submit Withdraw${isBnb ? ' Data' : ''}`}
        onClick={handleSubmit}
        className={cn(
          'mt-4 w-full rounded-full bg-primary px-4 leading-[44px] text-white md:mx-auto md:w-[240px] md:text-sm md:font-normal',
          !canSubmit ? 'cursor-not-allowed opacity-25' : 'cursor-pointer opacity-100'
        )}
        disabled={!canSubmit}
        loading={loading}
      />
    </>
  )
}
