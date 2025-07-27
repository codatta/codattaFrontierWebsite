import { useState, useMemo, useEffect, useCallback } from 'react'
import { useLocalStorage } from '@uidotdev/usehooks'
import { cn } from '@udecode/cn'

import { EXCHANGE_OPTIONS, NETWORK_OPTIONS, CURRENCY_OPTIONS } from '@/components/frontier/crypto/consts'
import type { Exchange, Network, Currency } from '@/components/frontier/crypto/consts'
import Select from '@/components/frontier/crypto/select'
// import Input from '@/components/frontier/crypto/input'
import Upload from '@/components/frontier/crypto/upload'
import { Button } from '@/components/booster/button'

// import { validateCryptoAddress, validateTxHash } from '@/components/frontier/crypto/util'

interface WithdrawFormData {
  exchange: Exchange
  network: Network
  currency: Currency
  // transactionHash: string
  // sourceAddress: string
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
  const initialFormData = useMemo(
    (): WithdrawFormData => ({
      exchange: '' as Exchange,
      network: '' as Network,
      currency: '' as Currency,
      // transactionHash: '',
      // sourceAddress: '',
      images: []
    }),
    []
  )

  const [formData, setFormData] = useLocalStorage<WithdrawFormData>('WITHDRAW_FORM_DATA_CACHE', initialFormData)

  const canSubmit = useMemo(() => {
    return (
      Object.values(errors).every((error) => !error) &&
      !!formData.exchange &&
      !!formData.network &&
      !!formData.currency &&
      // !!formData.transactionHash &&
      // !!formData.sourceAddress &&
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
    if (!formData.network) {
      newErrors.network = 'Network is required'
    }
    if (!formData.currency) {
      newErrors.currency = 'Currency is required'
    }
    // if (!formData.transactionHash || !validateTxHash(formData.transactionHash)) {
    //   newErrors.transactionHash = 'Please provide a valid transaction hash'
    // }
    // if (!formData.sourceAddress || !validateCryptoAddress(formData.sourceAddress)) {
    //   newErrors.sourceAddress = 'Please provide a valid address'
    // }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const resetForm = useCallback(() => {
    setFormData(initialFormData)
  }, [initialFormData, setFormData])
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
    if (resultType) {
      resetForm()
    }
  }, [resultType, resetForm])

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
            Network<span className="text-red-400">*</span>
          </h3>
          <Select
            options={NETWORK_OPTIONS}
            placeholder="Select Network"
            value={formData.network || undefined}
            onChange={(value) => handleFormChange('network', value)}
            isMobile={isMobile}
          />
          <p className={cn('mt-2 text-sm text-red-400', isMobile ? 'px-4' : 'px-0')}>{errors.network}</p>
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
            Withdraw Address Screenshot<span className="text-red-400">*</span>
          </h3>
          <Upload
            value={formData.images}
            onChange={(images) => handleFormChange('images', images)}
            isMobile={isMobile}
            description={
              <div className="text-left text-xs text-[#606067] md:text-center md:text-sm">
                <p>Click to upload screenshot{isBnb ? '' : ' or drag and drop'} </p>
                <p>
                  Go to the on-chain deposit page in the app and click “Save Image” (not a screenshot). Make sure the
                  exchange name is visible, or your reward may be affected.
                </p>
              </div>
            }
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
