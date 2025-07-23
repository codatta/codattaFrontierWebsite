import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spin } from 'antd'

import AuthChecker from '@/components/app/auth-checker'

import { EXCHANGE_OPTIONS, BLOCKCHAIN_OPTIONS, CURRENCY_OPTIONS } from '@/components/frontier/crypto/consts'
import type { Exchange, Blockchain, Currency } from '@/components/frontier/crypto/consts'

import Select from '@/components/frontier/crypto/select'

export default function CryptoForm({ templateId }: { templateId: string }) {
  const isWithdrawal = /withdrawal/.test(templateId.toLowerCase())
  const { taskId: _taskId } = useParams()

  const [pageLoading, _setPageLoading] = useState(false)

  const [formData, setFormData] = useState<{ exchange: Exchange; blockchain: Blockchain; currency: Currency }>({
    exchange: '',
    blockchain: '',
    currency: ''
  })

  useEffect(() => {
    console.log(templateId)
  }, [templateId])

  const handleSelectChange = (field: 'exchange' | 'blockchain' | 'currency', value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <AuthChecker>
      <Spin spinning={pageLoading} className="min-h-screen">
        <div className="min-h-screen px-6 py-3">
          <h1 className="text-center text-base font-bold">{isWithdrawal ? 'Withdrawal' : 'Deposit'}</h1>
          <div className="mt-[34px] space-y-[22px]">
            <div>
              <h3 className="mb-2 px-4 text-sm text-[#BBBBBE]">Exchange Name*</h3>
              <Select
                options={EXCHANGE_OPTIONS}
                placeholder="Select Exchange"
                value={formData.exchange || undefined}
                onChange={(value) => handleSelectChange('exchange', value)}
              />
            </div>
            <div>
              <h3 className="mb-2 px-4 text-sm text-[#BBBBBE]">Blockchain*</h3>
              <Select
                options={BLOCKCHAIN_OPTIONS}
                placeholder="Select Blockchain"
                value={formData.blockchain || undefined}
                onChange={(value) => handleSelectChange('blockchain', value)}
              />
            </div>
            <div>
              <h3 className="mb-2 px-4 text-sm text-[#BBBBBE]">Currency*</h3>
              <Select
                options={CURRENCY_OPTIONS}
                placeholder="Select Currency"
                value={formData.currency || undefined}
                onChange={(value) => handleSelectChange('currency', value)}
              />
            </div>
          </div>
        </div>
      </Spin>
    </AuthChecker>
  )
}
