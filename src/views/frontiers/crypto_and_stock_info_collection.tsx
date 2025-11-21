import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { Input, Select, DatePicker, message, Spin } from 'antd'
import type { Dayjs } from 'dayjs'

import { Button } from '@/components/booster/button'
import AuthChecker from '@/components/app/auth-checker'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'

import frontiterApi from '@/apis/frontiter.api'

const { TextArea } = Input
const { Option } = Select

interface CryptoStockFormData {
  informationCategory: string
  informationUrl: string
  informationSourceCategory: string
  publicationTime: Dayjs | null
  timezone: string
  fullText: string
  informationTitle?: string
  keyAssetTicker?: string
}

// Global timezone options
const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  // Americas
  { value: 'America/New_York', label: 'America/New_York (EST/EDT)' },
  { value: 'America/Chicago', label: 'America/Chicago (CST/CDT)' },
  { value: 'America/Denver', label: 'America/Denver (MST/MDT)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST/PDT)' },
  { value: 'America/Phoenix', label: 'America/Phoenix (MST)' },
  { value: 'America/Anchorage', label: 'America/Anchorage (AKST/AKDT)' },
  { value: 'America/Honolulu', label: 'America/Honolulu (HST)' },
  { value: 'America/Toronto', label: 'America/Toronto (EST/EDT)' },
  { value: 'America/Vancouver', label: 'America/Vancouver (PST/PDT)' },
  { value: 'America/Mexico_City', label: 'America/Mexico_City (CST/CDT)' },
  { value: 'America/Sao_Paulo', label: 'America/Sao_Paulo (BRT/BRST)' },
  { value: 'America/Buenos_Aires', label: 'America/Buenos_Aires (ART)' },
  { value: 'America/Lima', label: 'America/Lima (PET)' },
  { value: 'America/Bogota', label: 'America/Bogota (COT)' },
  { value: 'America/Santiago', label: 'America/Santiago (CLT/CLST)' },
  { value: 'America/Caracas', label: 'America/Caracas (VET)' },
  // Europe
  { value: 'Europe/London', label: 'Europe/London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin (CET/CEST)' },
  { value: 'Europe/Rome', label: 'Europe/Rome (CET/CEST)' },
  { value: 'Europe/Madrid', label: 'Europe/Madrid (CET/CEST)' },
  { value: 'Europe/Amsterdam', label: 'Europe/Amsterdam (CET/CEST)' },
  { value: 'Europe/Brussels', label: 'Europe/Brussels (CET/CEST)' },
  { value: 'Europe/Vienna', label: 'Europe/Vienna (CET/CEST)' },
  { value: 'Europe/Zurich', label: 'Europe/Zurich (CET/CEST)' },
  { value: 'Europe/Stockholm', label: 'Europe/Stockholm (CET/CEST)' },
  { value: 'Europe/Oslo', label: 'Europe/Oslo (CET/CEST)' },
  { value: 'Europe/Copenhagen', label: 'Europe/Copenhagen (CET/CEST)' },
  { value: 'Europe/Helsinki', label: 'Europe/Helsinki (EET/EEST)' },
  { value: 'Europe/Warsaw', label: 'Europe/Warsaw (CET/CEST)' },
  { value: 'Europe/Prague', label: 'Europe/Prague (CET/CEST)' },
  { value: 'Europe/Budapest', label: 'Europe/Budapest (CET/CEST)' },
  { value: 'Europe/Athens', label: 'Europe/Athens (EET/EEST)' },
  { value: 'Europe/Istanbul', label: 'Europe/Istanbul (TRT)' },
  { value: 'Europe/Moscow', label: 'Europe/Moscow (MSK)' },
  { value: 'Europe/Kiev', label: 'Europe/Kiev (EET/EEST)' },
  { value: 'Europe/Dublin', label: 'Europe/Dublin (GMT/IST)' },
  { value: 'Europe/Lisbon', label: 'Europe/Lisbon (WET/WEST)' },
  // Asia
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai (CST)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
  { value: 'Asia/Hong_Kong', label: 'Asia/Hong_Kong (HKT)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT)' },
  { value: 'Asia/Seoul', label: 'Asia/Seoul (KST)' },
  { value: 'Asia/Taipei', label: 'Asia/Taipei (CST)' },
  { value: 'Asia/Bangkok', label: 'Asia/Bangkok (ICT)' },
  { value: 'Asia/Jakarta', label: 'Asia/Jakarta (WIB)' },
  { value: 'Asia/Manila', label: 'Asia/Manila (PHT)' },
  { value: 'Asia/Kuala_Lumpur', label: 'Asia/Kuala_Lumpur (MYT)' },
  { value: 'Asia/Ho_Chi_Minh', label: 'Asia/Ho_Chi_Minh (ICT)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST)' },
  { value: 'Asia/Riyadh', label: 'Asia/Riyadh (AST)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
  { value: 'Asia/Karachi', label: 'Asia/Karachi (PKT)' },
  { value: 'Asia/Dhaka', label: 'Asia/Dhaka (BDT)' },
  { value: 'Asia/Colombo', label: 'Asia/Colombo (IST)' },
  { value: 'Asia/Kathmandu', label: 'Asia/Kathmandu (NPT)' },
  { value: 'Asia/Tehran', label: 'Asia/Tehran (IRST)' },
  { value: 'Asia/Baghdad', label: 'Asia/Baghdad (AST)' },
  { value: 'Asia/Jerusalem', label: 'Asia/Jerusalem (IST/IDT)' },
  { value: 'Asia/Beirut', label: 'Asia/Beirut (EET/EEST)' },
  { value: 'Asia/Amman', label: 'Asia/Amman (EET/EEST)' },
  { value: 'Asia/Baku', label: 'Asia/Baku (AZT)' },
  { value: 'Asia/Yerevan', label: 'Asia/Yerevan (AMT)' },
  { value: 'Asia/Tbilisi', label: 'Asia/Tbilisi (GET)' },
  { value: 'Asia/Almaty', label: 'Asia/Almaty (ALMT)' },
  { value: 'Asia/Tashkent', label: 'Asia/Tashkent (UZT)' },
  { value: 'Asia/Ulaanbaatar', label: 'Asia/Ulaanbaatar (ULAT)' },
  // Australia & Pacific
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST/AEDT)' },
  { value: 'Australia/Melbourne', label: 'Australia/Melbourne (AEST/AEDT)' },
  { value: 'Australia/Brisbane', label: 'Australia/Brisbane (AEST)' },
  { value: 'Australia/Perth', label: 'Australia/Perth (AWST)' },
  { value: 'Australia/Adelaide', label: 'Australia/Adelaide (ACST/ACDT)' },
  { value: 'Australia/Darwin', label: 'Australia/Darwin (ACST)' },
  { value: 'Pacific/Auckland', label: 'Pacific/Auckland (NZST/NZDT)' },
  { value: 'Pacific/Fiji', label: 'Pacific/Fiji (FJT)' },
  { value: 'Pacific/Honolulu', label: 'Pacific/Honolulu (HST)' },
  { value: 'Pacific/Guam', label: 'Pacific/Guam (ChST)' },
  // Africa
  { value: 'Africa/Cairo', label: 'Africa/Cairo (EET/EEST)' },
  { value: 'Africa/Johannesburg', label: 'Africa/Johannesburg (SAST)' },
  { value: 'Africa/Lagos', label: 'Africa/Lagos (WAT)' },
  { value: 'Africa/Nairobi', label: 'Africa/Nairobi (EAT)' },
  { value: 'Africa/Casablanca', label: 'Africa/Casablanca (WET/WEST)' },
  { value: 'Africa/Tunis', label: 'Africa/Tunis (CET)' },
  { value: 'Africa/Algiers', label: 'Africa/Algiers (CET)' }
]

// Get system timezone
const getSystemTimezone = (): string => {
  try {
    const systemTz = Intl.DateTimeFormat().resolvedOptions().timeZone
    // Check if system timezone exists in our options list
    const exists = TIMEZONE_OPTIONS.some((opt) => opt.value === systemTz)
    return exists ? systemTz : 'UTC'
  } catch {
    return 'UTC'
  }
}

const CryptoStockInfoCollection: React.FC<{ templateId: string }> = ({ templateId }) => {
  const [formData, setFormData] = useState<CryptoStockFormData>({
    informationCategory: '',
    informationUrl: '',
    informationSourceCategory: '',
    publicationTime: null,
    timezone: getSystemTimezone(),
    fullText: '',
    informationTitle: '',
    keyAssetTicker: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CryptoStockFormData, string>>>({})
  const { taskId } = useParams()
  const [loading, setLoading] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [rewardPoints, setRewardPoints] = useState(0)

  const allFieldsFilled = useMemo(() => {
    return (
      formData.informationCategory.trim() !== '' &&
      formData.informationUrl.trim() !== '' &&
      formData.informationSourceCategory.trim() !== '' &&
      formData.publicationTime !== null &&
      formData.timezone.trim() !== '' &&
      formData.fullText.trim() !== ''
    )
  }, [formData])

  const updateFormData = (field: keyof CryptoStockFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const clearFormData = () => {
    setFormData({
      informationCategory: '',
      informationUrl: '',
      informationSourceCategory: '',
      publicationTime: null,
      timezone: getSystemTimezone(),
      fullText: '',
      informationTitle: '',
      keyAssetTicker: ''
    })
    setErrors({})
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CryptoStockFormData, string>> = {}

    if (!formData.informationCategory.trim()) {
      newErrors.informationCategory = 'Information Category is required'
    }
    if (!formData.informationUrl.trim()) {
      newErrors.informationUrl = 'Information URL is required'
    }
    if (!formData.informationSourceCategory.trim()) {
      newErrors.informationSourceCategory = 'Information Source Category is required'
    }
    if (!formData.publicationTime) {
      newErrors.publicationTime = 'Publication Time is required'
    }
    if (!formData.timezone.trim()) {
      newErrors.timezone = 'Timezone is required'
    }
    if (!formData.fullText.trim()) {
      newErrors.fullText = 'Full Text is required'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      message.error('Please fill in all required fields correctly.')
      return
    }

    setLoading(true)
    try {
      await frontiterApi.submitTask(taskId!, {
        data: {
          ...formData,
          publicationTime: formData.publicationTime?.format('YYYY-MM-DD HH:mm:ss'),
          timezone: formData.timezone
        },
        templateId: templateId,
        taskId: taskId
      })

      clearFormData()

      setModalShow(true)
    } catch (error) {
      message.error(error.message ? error.message : 'Failed to submit!')
    } finally {
      setLoading(false)
    }
  }

  const checkTaskStatus = useCallback(async () => {
    if (!taskId || !templateId) {
      message.error('Task ID or template ID is required!')
      return
    }

    setLoading(true)

    try {
      const taskDetail = await frontiterApi.getTaskDetail(taskId!)
      if (taskDetail.data.data_display.template_id !== templateId) {
        message.error('Template not match!')
        return
      }
      const totalRewards = taskDetail.data.reward_info
        .filter((item) => {
          return item.reward_mode === 'REGULAR' && item.reward_type === 'POINTS'
        })
        .reduce((acc, cur) => {
          return acc + cur.reward_value
        }, 0)

      setRewardPoints(totalRewards)
    } catch (error) {
      message.error(error.message ? error.message : 'Failed to get task detail!')
    } finally {
      setLoading(false)
    }
  }, [taskId, templateId])

  const onBack = () => {
    window.history.back()
  }

  useEffect(() => {
    checkTaskStatus()
  }, [checkTaskStatus])

  return (
    <AuthChecker>
      <Spin spinning={loading} className="min-h-screen">
        <div className="min-h-screen py-3 md:py-8">
          <div className="border-[#FFFFFF1F] pb-3 md:border-b md:pb-8">
            <h1 className="mx-auto flex max-w-[1320px] items-center justify-between px-6 text-center text-base font-bold">
              <div className="flex cursor-pointer items-center gap-2 text-sm font-normal text-[white]" onClick={onBack}>
                <ArrowLeft size={18} /> Back
              </div>
              Crypto & US Stock Information Collection
              <span></span>
            </h1>
          </div>

          {/* Guidelines Section */}
          <div className="mt-12 bg-[#FFFFFF0A]">
            <div className="mx-auto max-w-[1320px] px-6">
              <div className="py-[30px] text-sm leading-[22px] text-[#8D8D93]">
                <h2 className="text-lg font-bold text-white">
                  <span>📋 Guidelines</span>
                </h2>

                <h3 className="mb-2 mt-4 font-semibold text-white">📋 Task Description</h3>
                <p className="mt-2 leading-[22px]">
                  This project aims to build a high-fidelity structured historical database for quantitative strategy
                  backtesting for professional quantitative firms. We need to ensure no omissions, no errors, and no
                  distortions. We are collecting historical key information related to US stocks and cryptocurrencies.
                </p>

                <h3 className="mb-2 mt-6 font-semibold text-white">📝 Audit Standards (Must Read)</h3>
                <ul className="mt-2 space-y-2 leading-[22px]">
                  <li>
                    <span className="font-semibold text-white">Uniqueness:</span> Only information not yet included in
                    the database is rewarded; duplicate submissions are invalid.
                  </li>
                  <li>
                    <span className="font-semibold text-white">Accuracy (Time):</span> Publication Time must be
                    absolutely accurate, as falsifying it will lead to an account ban.
                  </li>
                  <li>
                    <span className="font-semibold text-white">Completeness (Content):</span> The Core Content must be a
                    complete copy of the original text; personal summaries or comments are prohibited.
                  </li>
                  <li>
                    <span className="font-semibold text-white">Relevance (Quality):</span> Advertisements, spam, broken
                    links, or valueless market noise are rejected.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="mx-auto mt-12 max-w-[1320px] space-y-[30px] px-6">
            {/* Information Category */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Information Category<span className="text-red-400">*</span>
              </label>
              <Select
                value={formData.informationCategory || undefined}
                onChange={(value) => updateFormData('informationCategory', value)}
                placeholder="Select Information Category"
                className={`w-full ${errors.informationCategory ? '[&_.ant-select-selector]:!border-red-500' : ''}`}
                size="large"
              >
                <Option value="crypto">Crypto</Option>
                <Option value="us_stock">US Stock</Option>
              </Select>
              {errors.informationCategory && <p className="text-sm text-red-400">{errors.informationCategory}</p>}
            </div>

            {/* Information URL */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Information URL<span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                value={formData.informationUrl}
                onChange={(e) => updateFormData('informationUrl', e.target.value)}
                placeholder="Enter Information URL"
                className={`w-full rounded-lg px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:border-blue-500 focus:outline-none ${
                  errors.informationUrl ? 'border-red-500' : ''
                }`}
                size="large"
              />
              {errors.informationUrl && <p className="text-sm text-red-400">{errors.informationUrl}</p>}
            </div>

            {/* Information Source Category */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Information Source Category<span className="text-red-400">*</span>
              </label>
              <Select
                value={formData.informationSourceCategory || undefined}
                onChange={(value) => updateFormData('informationSourceCategory', value)}
                placeholder="Select Information Source Category"
                className={`w-full ${
                  errors.informationSourceCategory ? '[&_.ant-select-selector]:!border-red-500' : ''
                }`}
                size="large"
              >
                <Option value="News Media">News Media</Option>
                <Option value="Social Platforms">Social Platforms</Option>
                <Option value="Project / Company Official">Project / Company Official</Option>
                <Option value="Regulatory / Government">Regulatory / Government</Option>
                <Option value="Data / Analytics Platforms">Data / Analytics Platforms</Option>
                <Option value="Community / Groups">Community / Groups</Option>
                <Option value="Personal Blog / Substack">Personal Blog / Substack</Option>
                <Option value="Other">Other</Option>
              </Select>
              {errors.informationSourceCategory && (
                <p className="text-sm text-red-400">{errors.informationSourceCategory}</p>
              )}
            </div>

            {/* Publication Time and Timezone */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Publication Time & Timezone<span className="text-red-400">*</span>
              </label>
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1 space-y-3">
                  <DatePicker
                    showTime
                    value={formData.publicationTime}
                    onChange={(value) => updateFormData('publicationTime', value)}
                    placeholder="Select time"
                    className={`w-full ${errors.publicationTime ? '[&_.ant-picker]:!border-red-500' : ''}`}
                    format="YYYY-MM-DD HH:mm:ss"
                    size="large"
                    style={{ width: '100%' }}
                  />
                  {errors.publicationTime && <p className="text-sm text-red-400">{errors.publicationTime}</p>}
                </div>
                <div className="flex-1 space-y-3">
                  <Select
                    value={formData.timezone || undefined}
                    onChange={(value) => updateFormData('timezone', value)}
                    placeholder="Select timezone"
                    className={`w-full ${errors.timezone ? '[&_.ant-select-selector]:!border-red-500' : ''}`}
                    size="large"
                    showSearch
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={TIMEZONE_OPTIONS}
                  />
                  {errors.timezone && <p className="text-sm text-red-400">{errors.timezone}</p>}
                </div>
              </div>
            </div>

            {/* Full Text */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Full Text<span className="text-red-400">*</span>
              </label>
              <TextArea
                value={formData.fullText}
                onChange={(e) => updateFormData('fullText', e.target.value)}
                placeholder="Please copy and paste the full text of the information you see here.."
                rows={8}
                className={`w-full rounded-lg px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:border-blue-500 focus:outline-none ${
                  errors.fullText ? 'border-red-500' : ''
                }`}
                style={{ resize: 'vertical' }}
              />
              {errors.fullText && <p className="text-sm text-red-400">{errors.fullText}</p>}
            </div>

            {/* Information Title */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">Information Title</label>
              <Input
                type="text"
                value={formData.informationTitle}
                onChange={(e) => updateFormData('informationTitle', e.target.value)}
                placeholder="If the original text has a title, please paste it here"
                className="w-full rounded-lg px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                size="large"
              />
            </div>

            {/* Key Asset Ticker */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">Key Asset Ticker</label>
              <Input
                type="text"
                value={formData.keyAssetTicker}
                onChange={(e) => updateFormData('keyAssetTicker', e.target.value)}
                placeholder="e.g., BTC, ETH, NVDA"
                className="w-full rounded-lg px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                size="large"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mx-auto mt-12 max-w-[1320px] px-6">
            <Button
              text="Submit"
              className={`h-[44px] w-full rounded-full text-base font-bold ${!allFieldsFilled && 'opacity-50'} md:mx-auto md:w-[240px]`}
              onClick={handleSubmit}
              disabled={!allFieldsFilled}
              loading={loading}
            />
          </div>

          <SubmitSuccessModal points={rewardPoints} open={modalShow} onClose={() => window.history.back()} />
        </div>
      </Spin>
    </AuthChecker>
  )
}

export default CryptoStockInfoCollection
