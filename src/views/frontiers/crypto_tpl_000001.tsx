import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spin } from 'antd'

import AuthChecker from '@/components/app/auth-checker'

import { EXCHANGE_OPTIONS, BLOCKCHAIN_OPTIONS, CURRENCY_OPTIONS } from '@/components/frontier/crypto/consts'
import type { Exchange, Blockchain, Currency } from '@/components/frontier/crypto/consts'

import Select from '@/components/frontier/crypto/select'
import Input from '@/components/frontier/crypto/input'
import PCUpload, { UploadedImage } from '@/components/frontier/crypto/upload'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { cn } from '@udecode/cn'

export default function CryptoForm({ templateId }: { templateId: string }) {
  const isWithdraw = /withdraw/.test(templateId.toLowerCase())
  const { taskId: _taskId } = useParams()
  const isMobile = useIsMobile()

  const [pageLoading, _setPageLoading] = useState(false)

  const [formData, setFormData] = useState({
    exchange: '' as Exchange,
    blockchain: '' as Blockchain,
    currency: '' as Currency,
    transactionHash: '',
    collectionAddress: '',
    file: [] as UploadedImage[]
  })

  useEffect(() => {
    console.log(templateId)
  }, [templateId])

  const handleFormChange = (field: keyof typeof formData, value: string | number | UploadedImage[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <AuthChecker>
      <Spin spinning={pageLoading} className="min-h-screen">
        <div className="mx-auto min-h-screen max-w-[1272px] px-6 py-3">
          <h1 className="text-center text-base font-bold">Submit {isWithdraw ? 'Withdraw' : 'Deposit'} Data</h1>
          <div className="mt-[34px] space-y-[22px]">
            <div>
              <h3 className={cn('mb-2 text-sm text-[#BBBBBE]', isMobile ? 'px-4' : 'px-0')}>
                Exchange Name<span className="text-red-400">*</span>
              </h3>
              <Select
                isMobile={isMobile}
                options={EXCHANGE_OPTIONS}
                placeholder="Select Exchange"
                value={formData.exchange || undefined}
                onChange={(value) => handleFormChange('exchange', value)}
              />
            </div>
            <div>
              <h3 className={cn('mb-2 text-sm text-[#BBBBBE]', isMobile ? 'px-4' : 'px-0')}>
                Blockchain<span className="text-red-400">*</span>
              </h3>
              <Select
                options={BLOCKCHAIN_OPTIONS}
                placeholder="Select Blockchain"
                value={formData.blockchain || undefined}
                onChange={(value) => handleFormChange('blockchain', value)}
                isMobile={isMobile}
              />
            </div>
            <div>
              <h3 className={cn('mb-2 text-sm text-[#BBBBBE]', isMobile ? 'px-4' : 'px-0')}>
                Currency<span className="text-red-400">*</span>
              </h3>
              <Select
                isMobile={isMobile}
                options={CURRENCY_OPTIONS}
                placeholder="Select Currency"
                value={formData.currency || undefined}
                onChange={(value) => handleFormChange('currency', value)}
              />
            </div>
            <div>
              <h3 className={cn('mb-2 text-sm text-[#BBBBBE]', isMobile ? 'px-4' : 'px-0')}>
                Transaction Hash<span className="text-red-400">*</span>
              </h3>
              <Input
                isMobile={isMobile}
                placeholder="Enter Transaction Hash"
                value={formData.transactionHash}
                onChange={(value) => handleFormChange('transactionHash', value)}
              />
            </div>
            <div>
              <h3 className={cn('mb-2 text-sm text-[#BBBBBE]', isMobile ? 'px-4' : 'px-0')}>
                Collection Address<span className="text-red-400">*</span>*
              </h3>
              <Input
                isMobile={isMobile}
                placeholder="Enter Collection Address"
                value={formData.collectionAddress}
                onChange={(value) => handleFormChange('collectionAddress', value)}
              />
            </div>
            <div>
              <h3 className={cn('mb-2 text-sm text-[#BBBBBE]', isMobile ? 'px-4' : 'px-0')}>
                Upload Screenshot<span className="text-red-400">*</span>
              </h3>
              <PCUpload
                value={formData.file}
                onChange={(fileList) => handleFormChange('file', fileList)}
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>
      </Spin>
    </AuthChecker>
  )
}
