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
import Upload, { UploadedImage } from '@/components/frontier/crypto/upload'

import { useIsMobile } from '@/hooks/use-is-mobile'
import frontiterApi from '@/apis/frontiter.api'
import { Button } from '@/components/booster/button'

interface CryptoFormData {
  exchange: Exchange
  blockchain: Blockchain
  currency: Currency
  transactionHash: string
  collectionAddress: string
  images: { url: string; hash: string }[]
}

function validateTxHash(hash: string): boolean {
  if (!hash || typeof hash !== 'string') {
    return false
  }
  const hexRegex = /^(?:0x)?[a-f0-9]{64}$/i
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{60,90}$/

  return hexRegex.test(hash) || base58Regex.test(hash)
}
function validateCryptoAddress(address: string): boolean {
  if (!address || typeof address !== 'string') {
    return false
  }

  const regex = /^[a-zA-Z0-9]{25,}$/

  return regex.test(address)
}

export default function CryptoForm({ templateId }: { templateId: string }) {
  const isWithdraw = /withdraw/.test(templateId.toLowerCase())
  const { taskId } = useParams()
  const isMobile = useIsMobile()

  const [pageLoading, _setPageLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState<Partial<Record<keyof CryptoFormData, string>>>({})
  const [formData, setFormData] = useState<CryptoFormData>({
    exchange: '' as Exchange,
    blockchain: '' as Blockchain,
    currency: '' as Currency,
    transactionHash: '',
    collectionAddress: '',
    images: []
  })
  const canSubmit = useMemo(() => {
    return (
      Object.values(errors).every((error) => !error) &&
      Object.keys(formData).every((key) => {
        if (['transactionHash', 'collectionAddress'].includes(key)) {
          return true
        }
        if (key === 'images') {
          return formData.images?.length > 0
        }
        return !!formData[key as keyof CryptoFormData]
      })
    )
  }, [errors, formData])

  useEffect(() => {
    console.log(templateId)
  }, [templateId])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CryptoFormData, string>> = {}

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
    if (formData.transactionHash && !validateTxHash(formData.transactionHash)) {
      newErrors.transactionHash = 'Please provide a valid transaction hash'
    }
    if (formData.collectionAddress && !validateCryptoAddress(formData.collectionAddress)) {
      newErrors.collectionAddress = 'Please provide a valid address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const resetForm = () => {
    setFormData({
      images: [],
      exchange: '',
      blockchain: '',
      currency: '',
      transactionHash: '',
      collectionAddress: ''
    })
  }
  const handleFormChange = (field: keyof typeof formData, value: string | number | UploadedImage[]) => {
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
            {isWithdraw ? 'Withdraw' : 'Deposit'} Submission
            <span></span>
          </h1>
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
                Transaction Hash
              </h3>
              <Input
                isMobile={isMobile}
                placeholder="Provide transaction hash for verification"
                maxLength={255}
                value={formData.transactionHash}
                onChange={(value) => handleFormChange('transactionHash', value)}
              />
              <p className={cn('mt-2 text-sm text-red-400', isMobile ? 'px-4' : 'px-0')}>{errors.transactionHash}</p>
            </div>
            <div>
              <h3 className={cn('mb-2 text-sm text-[#BBBBBE] md:text-base md:text-white', isMobile ? 'px-4' : 'px-0')}>
                Collection Address
              </h3>
              <Input
                isMobile={isMobile}
                placeholder="Address where funds were transferred from deposit address for verification"
                value={formData.collectionAddress}
                maxLength={255}
                onChange={(value) => handleFormChange('collectionAddress', value)}
              />
              <p className={cn('mt-2 text-sm text-red-400', isMobile ? 'px-4' : 'px-0')}>{errors.collectionAddress}</p>
            </div>
            <div>
              <h3 className={cn('mb-2 text-sm text-[#BBBBBE] md:text-base md:text-white', isMobile ? 'px-4' : 'px-0')}>
                {isWithdraw ? 'Withdraw' : 'Deposit'} Address Screenshot<span className="text-red-400">*</span>
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
            text={`Submit ${isWithdraw ? 'Withdraw' : 'Deposit'}`}
            onClick={handleSubmit}
            className={cn(
              'mt-4 w-full rounded-full bg-primary px-4 leading-[44px] text-white md:mx-auto md:w-[240px] md:text-sm md:font-normal',
              !canSubmit ? 'cursor-not-allowed opacity-25' : 'cursor-pointer opacity-100'
            )}
            disabled={!canSubmit}
            loading={loading}
          />
        </div>
      </Spin>
    </AuthChecker>
  )
}
