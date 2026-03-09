import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { message, Spin } from 'antd'
import { Plus, ChevronsUpDown, Trash2, Check } from 'lucide-react'

import AuthChecker from '@/components/app/auth-checker'
import frontiterApi from '@/apis/frontiter.api'
import SuccessModal from '@/components/mobile-app/success-modal'
import MobileAppFrontierHeader from '@/components/mobile-app/frontier-header'
import MobileDatePicker from '@/components/mobile-app/date-picker'
import ScrollTimePicker from '@/components/mobile-app/scroll-time-picker'
import LocationPicker from '@/components/mobile-app/location-picker'
import bridge from '@/components/mobile-app/bridge'

interface ChildInfo {
  id: string
  occupation: string
  healthStatus: string
  relationship: string
}

interface LocationValue {
  country?: string
  province?: string
  city?: string
}

interface FateFormData {
  birthDate: string
  birthTime: string
  placeOfBirth: LocationValue
  gender: string
  fatherOccupation: string
  relationshipWithFather: string
  motherOccupation: string
  relationshipWithMother: string
  children: ChildInfo[]
  educationalBackground: string
  careerDevelopment: string
  healthStatus: string
  emotionalRelationships: string
  financialStatus: string
  otherNotableEvents: string
}

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' }
]

const occupationOptions = [
  { label: 'Business Owner', value: 'business_owner' },
  { label: 'Employee', value: 'employee' },
  { label: 'Government Official', value: 'government_official' },
  { label: 'Teacher/Professor', value: 'teacher' },
  { label: 'Doctor/Nurse', value: 'medical' },
  { label: 'Engineer', value: 'engineer' },
  { label: 'Artist', value: 'artist' },
  { label: 'Retired', value: 'retired' },
  { label: 'Unemployed', value: 'unemployed' },
  { label: 'Other', value: 'other' }
]

const relationshipOptions = [
  { label: 'Very Close', value: 'very_close' },
  { label: 'Close', value: 'close' },
  { label: 'Normal', value: 'normal' },
  { label: 'Distant', value: 'distant' },
  { label: 'Estranged', value: 'estranged' },
  { label: 'No Contact', value: 'no_contact' }
]

const childOccupationOptions = [
  { label: 'Student', value: 'student' },
  { label: 'Employee', value: 'employee' },
  { label: 'Business Owner', value: 'business_owner' },
  { label: 'Freelancer', value: 'freelancer' },
  { label: 'Unemployed', value: 'unemployed' },
  { label: 'Other', value: 'other' }
]

const healthStatusOptions = [
  { label: 'Excellent', value: 'excellent' },
  { label: 'Good', value: 'good' },
  { label: 'Fair', value: 'fair' },
  { label: 'Poor', value: 'poor' }
]

// Swipeable Child Card Component
const SwipeableChildCard: React.FC<{
  child: ChildInfo
  index: number
  onEdit: () => void
  onDelete: () => void
  isSwiped: boolean
  onSwipeChange: (swiped: boolean) => void
}> = ({ child, index, onEdit, onDelete, isSwiped, onSwipeChange }) => {
  const [touchStart, setTouchStart] = useState(0)
  const [touchCurrent, setTouchCurrent] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
    setTouchCurrent(0)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const diff = touchStart - e.touches[0].clientX
    if (diff > 0 && diff <= 100) {
      setTouchCurrent(diff)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    if (touchCurrent > 50) {
      onSwipeChange(true)
    } else {
      setTouchCurrent(0)
      onSwipeChange(false)
    }
  }

  const translateX = isSwiped ? -100 : isDragging ? -touchCurrent : 0

  return (
    <div className="overflow-hidden">
      <div className="flex">
        <div
          ref={cardRef}
          className="w-full shrink-0 cursor-pointer bg-white px-4 py-3 transition-transform duration-200"
          style={{ transform: `translateX(${translateX}px)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => {
            if (!isSwiped) onEdit()
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[17px] font-semibold text-black">Child {index + 1}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[15px] text-black">Occupation</span>
              <span className="text-[15px] text-[#999]">
                {childOccupationOptions.find((o) => o.value === child.occupation)?.label || child.occupation}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[15px] text-black">Health</span>
              <span className="text-[15px] text-[#999]">
                {healthStatusOptions.find((o) => o.value === child.healthStatus)?.label || child.healthStatus}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[15px] text-black">Relationship</span>
              <span className="text-[15px] text-[#999]">
                {relationshipOptions.find((o) => o.value === child.relationship)?.label || child.relationship}
              </span>
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="flex w-[100px] shrink-0 flex-col items-center justify-center gap-1 bg-[#FF3B30] text-white transition-transform duration-200"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-white/20">
            <Trash2 size={20} />
          </div>
          <span className="text-[13px] font-medium">Delete</span>
        </button>
      </div>
    </div>
  )
}

const YourLifeJourney: React.FC<{ templateId: string }> = ({ templateId }) => {
  const [formData, setFormData] = useState<FateFormData>({
    birthDate: '',
    birthTime: '',
    placeOfBirth: {},
    gender: '',
    fatherOccupation: '',
    relationshipWithFather: '',
    motherOccupation: '',
    relationshipWithMother: '',
    children: [],
    educationalBackground: '',
    careerDevelopment: '',
    healthStatus: '',
    emotionalRelationships: '',
    financialStatus: '',
    otherNotableEvents: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FateFormData, string>>>({})
  const { taskId } = useParams()
  const [loading, setLoading] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [rewardPoints, setRewardPoints] = useState(0)
  const [showChildModal, setShowChildModal] = useState(false)
  const [editingChild, setEditingChild] = useState<ChildInfo | null>(null)
  const [swipedChildId, setSwipedChildId] = useState<string | null>(null)

  const allFieldsFilled = useMemo(() => {
    const checks = {
      birthDate: formData.birthDate !== '',
      birthTime: formData.birthTime !== '',
      placeOfBirthCountry: !!formData.placeOfBirth.country,
      placeOfBirthProvince: !!formData.placeOfBirth.province,
      placeOfBirthCity: !!formData.placeOfBirth.city,
      gender: formData.gender !== '',
      fatherOccupation: formData.fatherOccupation !== '',
      relationshipWithFather: formData.relationshipWithFather !== '',
      motherOccupation: formData.motherOccupation !== '',
      relationshipWithMother: formData.relationshipWithMother !== '',
      educationalBackground: formData.educationalBackground.trim() !== '',
      careerDevelopment: formData.careerDevelopment.trim() !== '',
      healthStatus: formData.healthStatus.trim() !== '',
      emotionalRelationships: formData.emotionalRelationships.trim() !== '',
      financialStatus: formData.financialStatus.trim() !== '',
      otherNotableEvents: formData.otherNotableEvents.trim() !== ''
    }

    const allFilled = Object.values(checks).every((check) => check)

    // Debug: log missing fields
    if (!allFilled) {
      const missingFields = Object.entries(checks)
        .filter(([, value]) => !value)
        .map(([key]) => key)
      console.log('Missing fields:', missingFields)
    }

    return allFilled
  }, [formData])

  const updateFormData = <K extends keyof FateFormData>(field: K, value: FateFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const clearFormData = () => {
    setFormData({
      birthDate: '',
      birthTime: '',
      placeOfBirth: {},
      gender: '',
      fatherOccupation: '',
      relationshipWithFather: '',
      motherOccupation: '',
      relationshipWithMother: '',
      children: [],
      educationalBackground: '',
      careerDevelopment: '',
      healthStatus: '',
      emotionalRelationships: '',
      financialStatus: '',
      otherNotableEvents: ''
    })
    setErrors({})
  }

  const addChildInfo = () => {
    setEditingChild({
      id: Date.now().toString(),
      occupation: '',
      healthStatus: '',
      relationship: ''
    })
    setShowChildModal(true)
  }

  const editChildInfo = (child: ChildInfo) => {
    setEditingChild({ ...child })
    setShowChildModal(true)
  }

  const saveChildInfo = () => {
    if (!editingChild) return

    if (!editingChild.occupation || !editingChild.healthStatus || !editingChild.relationship) {
      message.error('Please fill in all child information fields')
      return
    }

    const existingIndex = formData.children.findIndex((c) => c.id === editingChild.id)
    if (existingIndex >= 0) {
      const updatedChildren = [...formData.children]
      updatedChildren[existingIndex] = editingChild
      updateFormData('children', updatedChildren)
    } else {
      updateFormData('children', [...formData.children, editingChild])
    }

    setShowChildModal(false)
    setEditingChild(null)
  }

  const cancelChildEdit = () => {
    setShowChildModal(false)
    setEditingChild(null)
  }

  const removeChildInfo = (id: string) => {
    const updatedChildren = formData.children.filter((child) => child.id !== id)
    updateFormData('children', updatedChildren)
    setSwipedChildId(null)
  }

  const handleChildSwipe = (childId: string, isSwiped: boolean) => {
    setSwipedChildId(isSwiped ? childId : null)
  }

  const updateEditingChild = (field: keyof ChildInfo, value: string) => {
    if (editingChild) {
      setEditingChild({ ...editingChild, [field]: value })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FateFormData, string>> = {}

    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required'
    }
    if (!formData.birthTime) {
      newErrors.birthTime = 'Birth time is required'
    }
    if (!formData.placeOfBirth.country || !formData.placeOfBirth.province || !formData.placeOfBirth.city) {
      newErrors.placeOfBirth = 'Place of birth is required'
    }
    if (!formData.gender) {
      newErrors.gender = 'Gender is required'
    }
    if (!formData.fatherOccupation) {
      newErrors.fatherOccupation = "Father's occupation is required"
    }
    if (!formData.relationshipWithFather) {
      newErrors.relationshipWithFather = 'Relationship with father is required'
    }
    if (!formData.motherOccupation) {
      newErrors.motherOccupation = "Mother's occupation is required"
    }
    if (!formData.relationshipWithMother) {
      newErrors.relationshipWithMother = 'Relationship with mother is required'
    }
    if (!formData.educationalBackground.trim()) {
      newErrors.educationalBackground = 'Educational background is required'
    }
    if (!formData.careerDevelopment.trim()) {
      newErrors.careerDevelopment = 'Career development is required'
    }
    if (!formData.healthStatus.trim()) {
      newErrors.healthStatus = 'Health status is required'
    }
    if (!formData.emotionalRelationships.trim()) {
      newErrors.emotionalRelationships = 'Emotional relationships is required'
    }
    if (!formData.financialStatus.trim()) {
      newErrors.financialStatus = 'Financial status is required'
    }
    if (!formData.otherNotableEvents.trim()) {
      newErrors.otherNotableEvents = 'Other notable events is required'
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
        data: formData,
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
        .filter((item) => item.reward_mode === 'REGULAR')
        .reduce((acc, cur) => acc + cur.reward_value, 0)

      setRewardPoints(totalRewards)
    } catch (error) {
      message.error(error.message ? error.message : 'Failed to get task detail!')
    } finally {
      setLoading(false)
    }
  }, [taskId, templateId])

  const onBack = () => {
    bridge.goBack()
  }

  useEffect(() => {
    checkTaskStatus()
  }, [checkTaskStatus])

  return (
    <AuthChecker>
      <Spin spinning={loading}>
        <div className="min-h-screen bg-[#F8F8F8] pb-20">
          <MobileAppFrontierHeader title="Your Life Journey" />

          {/* Form Content */}
          <div className="px-5">
            <div className="mb-8 space-y-6">
              {/* Personal Data Section */}
              <div className="space-y-2">
                <label className="block px-4 text-[17px] font-normal text-[#999]">Personal Data</label>

                {/* Date and Time of Birth */}
                <div className="space-y-2 rounded-[26px] bg-white px-4 py-1 [&>div:last-child]:border-b-0">
                  {/* Date of Birth */}
                  <div className="flex items-center justify-between border-b border-black/5 py-3">
                    <span className="text-[17px] text-black">Date of Birth</span>
                    <MobileDatePicker
                      value={formData.birthDate}
                      onChange={(date) => updateFormData('birthDate', date)}
                      placeholder="Jun 5, 2023"
                    />
                  </div>

                  {/* Time of Birth */}
                  <div className="flex items-center justify-between border-b border-black/5 py-3">
                    <span className="text-[17px] text-black">Time of Birth</span>
                    <ScrollTimePicker
                      value={formData.birthTime}
                      onChange={(time) => updateFormData('birthTime', time)}
                      placeholder="09:41"
                      showSeconds={false}
                    />
                  </div>

                  {/* Place of Birth */}
                  <div className="flex items-center justify-between border-b border-black/5 py-3">
                    <span className="text-[17px] text-black">Place of Birth</span>
                    <LocationPicker
                      value={formData.placeOfBirth}
                      onChange={(location) => updateFormData('placeOfBirth', location)}
                      placeholder="Select"
                    />
                  </div>

                  {/* Gender */}
                  <div className="relative flex items-center justify-between border-b border-black/5">
                    <span className="py-3 text-[17px] text-black">Gender</span>
                    <select
                      value={formData.gender}
                      onChange={(e) => updateFormData('gender', e.target.value)}
                      className="appearance-none bg-white py-3 pr-6 text-right text-[17px] outline-none"
                      style={{ color: formData.gender ? '#999' : '#3C3C434D', textAlignLast: 'right' }}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {genderOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronsUpDown className="pointer-events-none absolute right-0 size-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Family Background Section */}
              <div className="space-y-2">
                <label className="block px-4 text-[17px] font-normal text-[#999]">Family Background</label>
                <div className="space-y-2 rounded-[26px] bg-white px-4 py-1 [&>div:last-child]:border-b-0">
                  {/* Father's Occupation */}
                  <div className="relative flex items-center justify-between border-b border-black/5">
                    <span className="py-3 text-[17px] text-black">Father's Occupation</span>
                    <select
                      value={formData.fatherOccupation}
                      onChange={(e) => updateFormData('fatherOccupation', e.target.value)}
                      className="appearance-none bg-white py-3 pr-6 text-right text-[17px] outline-none"
                      style={{ color: formData.fatherOccupation ? '#999' : '#3C3C434D', textAlignLast: 'right' }}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {occupationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronsUpDown className="pointer-events-none absolute right-0 size-4 text-gray-400" />
                  </div>

                  {/* Relationship with Father */}
                  <div className="relative flex items-center justify-between border-b border-black/5">
                    <span className="py-3 text-[17px] text-black">
                      Relationship <br /> with Father
                    </span>
                    <select
                      value={formData.relationshipWithFather}
                      onChange={(e) => updateFormData('relationshipWithFather', e.target.value)}
                      className="appearance-none bg-white py-3 pr-6 text-right text-[17px] outline-none"
                      style={{ color: formData.relationshipWithFather ? '#999' : '#3C3C434D', textAlignLast: 'right' }}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {relationshipOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronsUpDown className="pointer-events-none absolute right-0 size-4 text-gray-400" />
                  </div>

                  {/* Mother's Occupation */}
                  <div className="relative flex items-center justify-between border-b border-black/5">
                    <span className="py-3 text-[17px] text-black">Mother's Occupation</span>
                    <select
                      value={formData.motherOccupation}
                      onChange={(e) => updateFormData('motherOccupation', e.target.value)}
                      className="appearance-none bg-white py-3 pr-6 text-right text-[17px] outline-none"
                      style={{ color: formData.motherOccupation ? '#999' : '#3C3C434D', textAlignLast: 'right' }}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {occupationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronsUpDown className="pointer-events-none absolute right-0 size-4 text-gray-400" />
                  </div>

                  {/* Relationship with Mother */}
                  <div className="relative flex items-center justify-between border-b border-black/5">
                    <span className="py-3 text-[17px] text-black">
                      Relationship
                      <br />
                      with Mother
                    </span>
                    <select
                      value={formData.relationshipWithMother}
                      onChange={(e) => updateFormData('relationshipWithMother', e.target.value)}
                      className="appearance-none bg-white py-3 pr-6 text-right text-[17px] outline-none"
                      style={{ color: formData.relationshipWithMother ? '#999' : '#3C3C434D', textAlignLast: 'right' }}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {relationshipOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronsUpDown className="pointer-events-none absolute right-0 size-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Child Information Section */}
              <div>
                <label className="mb-2 block px-4 text-[17px] font-normal text-[#999]">
                  Child Information<span className="text-[#999]">(Optional)</span>
                </label>

                <div className="overflow-hidden rounded-[26px] bg-white">
                  {formData.children.map((child, index) => (
                    <>
                      <SwipeableChildCard
                        key={child.id}
                        child={child}
                        index={index}
                        onEdit={() => editChildInfo(child)}
                        onDelete={() => removeChildInfo(child.id)}
                        isSwiped={swipedChildId === child.id}
                        onSwipeChange={(swiped) => handleChildSwipe(child.id, swiped)}
                      />
                      <hr className="mx-4 border-black/5" />
                    </>
                  ))}
                  <button
                    onClick={addChildInfo}
                    className="flex w-full items-center justify-center gap-2 bg-white py-3 text-[17px] font-normal text-[#40E1EF]"
                  >
                    <Plus size={20} />
                    Add Child Information
                  </button>
                </div>
              </div>

              {/* Educational Background */}
              <div className="space-y-2">
                <label className="block px-4 text-[17px] font-normal text-[#999]">Educational Background</label>
                <textarea
                  value={formData.educationalBackground}
                  onChange={(e) => updateFormData('educationalBackground', e.target.value)}
                  placeholder="e.g., degrees, schools, key achievements..."
                  className="w-full rounded-[26px] bg-white p-4 text-[17px] text-black placeholder:text-[#3C3C434D]"
                  rows={4}
                  maxLength={1000}
                />
                {errors.educationalBackground && (
                  <p className="px-4 text-xs text-red-400">{errors.educationalBackground}</p>
                )}
              </div>

              {/* Career Development */}
              <div className="space-y-2">
                <label className="block px-4 text-[17px] font-normal text-[#999]">Career Development</label>
                <textarea
                  value={formData.careerDevelopment}
                  onChange={(e) => updateFormData('careerDevelopment', e.target.value)}
                  placeholder="e.g., jobs held, companies, promotions, key projects..."
                  className="w-full rounded-[26px] bg-white p-4 text-[17px] text-black placeholder:text-[#3C3C434D]"
                  rows={4}
                  maxLength={1000}
                />
                {errors.careerDevelopment && <p className="px-4 text-xs text-red-400">{errors.careerDevelopment}</p>}
              </div>

              {/* Health Status */}
              <div className="space-y-2">
                <label className="block px-4 text-[17px] font-normal text-[#999]">Health Status</label>
                <textarea
                  value={formData.healthStatus}
                  onChange={(e) => updateFormData('healthStatus', e.target.value)}
                  placeholder="e.g., major illnesses, general well-being, fitness habits..."
                  className="w-full rounded-[26px] bg-white p-4 text-[17px] text-black placeholder:text-[#3C3C434D]"
                  rows={4}
                  maxLength={1000}
                />
                {errors.healthStatus && <p className="px-4 text-xs text-red-400">{errors.healthStatus}</p>}
              </div>

              {/* Emotional Relationships */}
              <div className="space-y-2">
                <label className="block px-4 text-[17px] font-normal text-[#999]">Emotional Relationships</label>
                <textarea
                  value={formData.emotionalRelationships}
                  onChange={(e) => updateFormData('emotionalRelationships', e.target.value)}
                  placeholder="e.g., marriage, partnerships, significant friendships..."
                  className="w-full rounded-[26px] bg-white p-4 text-[17px] text-black placeholder:text-[#3C3C434D]"
                  rows={4}
                  maxLength={1000}
                />
                {errors.emotionalRelationships && (
                  <p className="px-4 text-xs text-red-400">{errors.emotionalRelationships}</p>
                )}
              </div>

              {/* Financial Status */}
              <div className="space-y-2">
                <label className="block px-4 text-[17px] font-normal text-[#999]">Financial Status</label>
                <textarea
                  value={formData.financialStatus}
                  onChange={(e) => updateFormData('financialStatus', e.target.value)}
                  placeholder="e.g., key financial milestones, investments, significant changes..."
                  className="w-full rounded-[26px] bg-white p-4 text-[17px] text-black placeholder:text-[#3C3C434D]"
                  rows={4}
                  maxLength={1000}
                />
                {errors.financialStatus && <p className="px-4 text-xs text-red-400">{errors.financialStatus}</p>}
              </div>

              {/* Other Notable Events */}
              <div className="space-y-2">
                <label className="block px-4 text-[17px] font-normal text-[#999]">Other Notable Events</label>
                <textarea
                  value={formData.otherNotableEvents}
                  onChange={(e) => updateFormData('otherNotableEvents', e.target.value)}
                  placeholder="e.g., relocations, major life changes, personal achievements..."
                  className="w-full rounded-[26px] bg-white p-4 text-[17px] text-black placeholder:text-[#3C3C434D]"
                  rows={4}
                  maxLength={1000}
                />
                {errors.otherNotableEvents && <p className="px-4 text-xs text-red-400">{errors.otherNotableEvents}</p>}
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!allFieldsFilled || loading}
              className={`h-[56px] w-full rounded-full text-base font-semibold transition-all ${
                allFieldsFilled ? 'bg-black text-white shadow-app-btn' : 'bg-[#A0A0A0]/40 text-white'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>

          <SuccessModal open={modalShow} onClose={onBack} points={rewardPoints} />

          {/* Child Information Drawer */}
          {showChildModal && editingChild && (
            <>
              {/* Backdrop */}
              <div
                className={`fixed inset-0 z-50 bg-black/30 transition-opacity duration-300 ${showChildModal ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                onClick={cancelChildEdit}
              />

              {/* Drawer */}
              <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up rounded-t-3xl bg-white/80 p-5 pb-8 backdrop-blur-md">
                {/* Header with Close and Confirm buttons */}
                <div className="relative mb-5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={cancelChildEdit}
                    className="flex size-10 items-center justify-center rounded-full bg-white/75 shadow-app-btn transition-all"
                  >
                    <Plus size={24} className="rotate-45 text-gray-600" />
                  </button>
                  <div className="text-[18px] font-bold text-black">Add Child Information</div>
                  <button
                    type="button"
                    onClick={saveChildInfo}
                    className="flex size-10 items-center justify-center rounded-full bg-[#40E1EF] shadow-app-btn backdrop-blur-sm transition-all"
                  >
                    <Check size={20} className="text-white" />
                  </button>
                </div>

                {/* Form Content */}
                <div className="mb-5 space-y-8">
                  {/* Occupation */}
                  <div className="rounded-full bg-white px-4 py-3">
                    <div className="relative flex items-center justify-between">
                      <span className="text-[16px] text-black">Occupation</span>
                      <select
                        value={editingChild.occupation}
                        onChange={(e) => updateEditingChild('occupation', e.target.value)}
                        className="flex-1 appearance-none bg-white pr-6 text-right text-[16px] text-[#999] outline-none"
                        style={{ textAlignLast: 'right' }}
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        {childOccupationOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronsUpDown className="pointer-events-none absolute right-0 size-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Health Status */}
                  <div className="rounded-full bg-white px-4 py-3">
                    <div className="relative flex items-center justify-between">
                      <span className="text-[16px] text-black">Health Status</span>
                      <select
                        value={editingChild.healthStatus}
                        onChange={(e) => updateEditingChild('healthStatus', e.target.value)}
                        className="flex-1 appearance-none bg-white pr-6 text-right text-[16px] text-[#999] outline-none"
                        style={{ textAlignLast: 'right' }}
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        {healthStatusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronsUpDown className="pointer-events-none absolute right-0 size-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Relationship */}
                  <div className="rounded-full bg-white px-4 py-3">
                    <div className="relative flex items-center justify-between">
                      <span className="text-[16px] text-black">Relationship</span>
                      <select
                        value={editingChild.relationship}
                        onChange={(e) => updateEditingChild('relationship', e.target.value)}
                        className="flex-1 appearance-none bg-white pr-6 text-right text-[16px] text-[#999] outline-none"
                        style={{ textAlignLast: 'right' }}
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        {relationshipOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronsUpDown className="pointer-events-none absolute right-0 size-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Spin>
    </AuthChecker>
  )
}

export default YourLifeJourney
