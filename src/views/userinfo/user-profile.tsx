import { useEffect, useState, useMemo } from 'react'
import { Select, Button, Radio, Modal, Cascader, message, Tooltip, Input, Spin } from 'antd'
import { PlusOutlined, DownOutlined } from '@ant-design/icons'
import { cn } from '@udecode/cn'

import userApi, { BaseDataResponse, UserQualification } from '@/apis/user.api'
import { MultiSelectList, MultiSelectRow } from '@/components/user-profile/multi-select-list'
import { SchoolEmailVerify } from '@/components/user-profile/school-email-verify'
import { CertificateUpload } from '@/components/user-profile/certificate-upload'
import { EducationReviewModal } from '@/components/user-profile/education-review-modal'
import LightEmergencyIcon from '@/assets/userinfo/light-emergency-icon.svg?react'
import LockIcon from '@/assets/userinfo/lock-icon.svg?react'
import CalendarIcon from '@/assets/userinfo/calendar-icon.svg?react'

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex w-full items-center rounded-md border-l-4 border-[#875DFF] bg-[rgba(135,93,255,0.08)] px-4 py-[6px]">
      <span className="text-lg font-bold text-white">{title}</span>
    </div>
  )
}

function LockedField({ value }: { value: string }) {
  return (
    <div className="flex h-[48px] items-center rounded-lg border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.12)] px-4">
      <span className="text-sm text-white">{value}</span>
    </div>
  )
}

function FieldLabel({ label, locked }: { label: string; locked?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-sm font-semibold text-white">{label}</span>
      {locked && (
        <Tooltip title="It cannot be modified after submission">
          <span className="flex cursor-pointer items-center">
            <LockIcon />
          </span>
        </Tooltip>
      )}
    </div>
  )
}

function SelectField({
  placeholder,
  value,
  onChange,
  suffixIcon,
  options,
  locked,
  isHistorical,
  className,
  disabled
}: {
  placeholder?: string
  value?: string
  onChange?: (v: string) => void
  options?: { label: string; value: string }[]
  locked?: boolean
  isHistorical?: boolean
  className?: string
  suffixIcon?: React.ReactNode
  disabled?: boolean
}) {
  if (locked && isHistorical && value) {
    const label = options?.find((o) => o.value === value)?.label || value
    return <LockedField value={label} />
  }
  return (
    <Select
      showSearch
      optionFilterProp="label"
      className={cn('h-[48px] w-full', className)}
      placeholder={placeholder}
      value={value || undefined}
      onChange={onChange}
      options={options}
      suffixIcon={suffixIcon || <DownOutlined className="text-white" />}
      disabled={disabled}
    />
  )
}

interface HistoricalProfile {
  basic_info?: UserQualification['basic_info']
  language_skills?: UserQualification['language_skills']
  education_background?: UserQualification['education_background']
  professional_role?: UserQualification['professional_role']
}

const EMPTY_ROW: MultiSelectRow = { id: 0, isOther: false, value: '', isHistorical: false }

export default function UserProfile() {
  const [historicalProfile, setHistoricalProfile] = useState<HistoricalProfile | null>(null)
  const [baseData, setBaseData] = useState<BaseDataResponse>({})
  const [loading, setLoading] = useState(false)

  // Location options for Cascader
  type CascaderOption = {
    value: string
    label: string
    isLeaf?: boolean
    loading?: boolean
    disabled?: boolean
    children?: CascaderOption[]
  }
  const [birthOptions, setBirthOptions] = useState<CascaderOption[]>([])
  const [residenceOptions, setResidenceOptions] = useState<CascaderOption[]>([])

  // Birth place cascader value [country, state, city]
  const [birthPlace, setBirthPlace] = useState<string[]>([])
  // Current residence cascader value [country, state, city]
  const [residencePlace, setResidencePlace] = useState<string[]>([])

  const currentYear = new Date().getFullYear()
  const yearOptions = useMemo(
    () =>
      Array.from({ length: 80 - 10 + 1 }, (_, i) => {
        const year = currentYear - 10 - i
        return { label: year.toString(), value: year.toString() }
      }),
    [currentYear]
  )

  // Helper function to filter out "other" option from API response
  const filterOtherOption = (options: { name: string; code: string }[] | undefined) => {
    if (!options) return []
    return options
      .filter((opt) => opt.code.toLowerCase() !== 'other')
      .map((opt) => ({ label: opt.name, value: opt.code }))
  }

  const [reviewMethod, setReviewMethod] = useState<'email' | 'photo'>('email')
  const [isRetryingAudit, setIsRetryingAudit] = useState(false)
  const [schoolEmail, setSchoolEmail] = useState<string>('')
  const [schoolEmailVerified, setSchoolEmailVerified] = useState<boolean>(false)
  const [certificatePhoto, setCertificatePhoto] = useState<string>('')
  const [showReviewModal, setShowReviewModal] = useState(false)

  // Basic Info
  const [birthYear, setBirthYear] = useState<string>()
  const [gender, setGender] = useState<string>()

  // Language Skills
  const [nativeLangRows, setNativeLangRows] = useState<MultiSelectRow[]>([{ ...EMPTY_ROW }])
  const [otherLangRows, setOtherLangRows] = useState<
    { id: number; lang: string; level: string; isOther: boolean; customLang: string; error?: string }[]
  >([])

  // Education Background
  const [highestDegree, setHighestDegree] = useState<string>()
  const [universityRows, setUniversityRows] = useState<MultiSelectRow[]>([{ ...EMPTY_ROW }])
  const [majorRows, setMajorRows] = useState<MultiSelectRow[]>([{ ...EMPTY_ROW }])
  const [eduStatus, setEduStatus] = useState<string>()

  // Professional Role
  const [occupationRows, setOccupationRows] = useState<MultiSelectRow[]>([{ ...EMPTY_ROW }])

  // Form validation errors
  const [formErrors, setFormErrors] = useState<{
    university?: string
    major?: string
    status?: string
    languageLevel?: string
  }>({})

  // Whether the selected highest degree is Pre-Bachelor's (hides sub-fields)
  const isPreBachelor = useMemo(() => {
    if (!highestDegree || !baseData.highest_degree) return false
    const selected = baseData.highest_degree.find((d) => d.code === highestDegree)
    const name = selected?.name?.toLowerCase().replace(/[-'\s]/g, '') ?? ''
    return name.includes('prebachelor')
  }, [highestDegree, baseData.highest_degree])

  // Check if education is in audit status
  const auditStatus = historicalProfile?.education_background?.audit_status
  const isAuditPending = auditStatus === 'PENDING'
  const isAuditRefused = auditStatus === 'REFUSED'
  // const isAuditPending = false
  // const isAuditRefused = true

  // Fetch base data and qualification
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [baseDataRes, qualRes] = await Promise.all([
          userApi.getBaseDatas(
            'country,language,university,major,gender,language_level,highest_degree,education_background_status,occupation_area'
          ),
          userApi.getUserQualification()
        ])

        if (baseDataRes.success) {
          setBaseData(baseDataRes.data)
        }

        if (qualRes.success && qualRes.data) {
          const d = qualRes.data
          setHistoricalProfile(d)

          // Populate Basic Info
          const { birth_place_country, birth_place_state, birth_place_city } = d.basic_info
          const { current_residence_country, current_residence_state, current_residence_city } = d.basic_info
          if (birth_place_country)
            setBirthPlace([birth_place_country, birth_place_state, birth_place_city].filter(Boolean))
          if (current_residence_country)
            setResidencePlace(
              [current_residence_country, current_residence_state, current_residence_city].filter(Boolean)
            )
          setBirthYear(d.basic_info.birth_year?.toString())
          setGender(d.basic_info.gender)

          // Populate Language Skills
          if (d.language_skills.native_language?.length) {
            setNativeLangRows(
              d.language_skills.native_language.map((langObj, i) => ({
                id: i,
                isOther: false,
                value: typeof langObj === 'string' ? langObj : langObj.code,
                isHistorical: true
              }))
            )
          }
          if (d.language_skills.other_language?.length) {
            setOtherLangRows(
              d.language_skills.other_language.map((langObj, i) => {
                const isOther = typeof langObj === 'object' && langObj.source === 'other'
                const code = typeof langObj === 'string' ? langObj : langObj.code
                const level = typeof langObj === 'object' ? langObj.level : ''
                return {
                  id: i,
                  lang: isOther ? '' : code,
                  level,
                  isOther,
                  customLang: isOther ? code : ''
                }
              })
            )
          }

          // Populate Education
          setHighestDegree(d.education_background.highest_degree)
          if (d.education_background.review_method) {
            setReviewMethod(d.education_background.review_method)
          }
          if (d.education_background.school_email) {
            setSchoolEmail(d.education_background.school_email)
            // If email exists in historical data and audit is not refused, mark as verified
            // If audit is refused, user needs to re-verify when trying again
            if (d.education_background.audit_status !== 'REFUSED') {
              setSchoolEmailVerified(true)
            }
          }
          if (d.education_background.certificate_photo) {
            setCertificatePhoto(d.education_background.certificate_photo)
          }
          if (d.education_background.university) {
            setUniversityRows([{ id: 0, isOther: false, value: d.education_background.university, isHistorical: true }])
          }
          setEduStatus(d.education_background.status)
          if (d.education_background.major?.length) {
            setMajorRows(
              d.education_background.major.map((v, i) => ({ id: i, isOther: false, value: v, isHistorical: true }))
            )
          }

          // Populate Occupation
          if (d.professional_role.occupation_area?.length) {
            setOccupationRows(
              d.professional_role.occupation_area.map((v, i) => ({
                id: i,
                isOther: false,
                value: v,
                isHistorical: true
              }))
            )
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile data:', err)
        message.error('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Initialize country options for both cascaders when baseData loads
  useEffect(() => {
    if (!baseData.country?.length) return
    const countryOpts: CascaderOption[] = baseData.country.map((c) => ({
      value: c.code,
      label: c.name,
      isLeaf: false
    }))
    setBirthOptions(countryOpts)
    setResidenceOptions(countryOpts)
  }, [baseData.country])

  // Async load states/cities for Cascader
  async function loadLocationChildren(
    selectedOptions: CascaderOption[],
    setter: React.Dispatch<React.SetStateAction<CascaderOption[]>>
  ) {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true
    setter((prev) => [...prev])

    const dataType = selectedOptions.length === 1 ? 'state' : 'city'
    const res = await userApi.getLocationDatas({ data_type: dataType, parent_code: targetOption.value })

    targetOption.loading = false
    if (res.success && res.data.length > 0) {
      targetOption.children = res.data.map((item) => ({
        value: item.code,
        label: item.name,
        isLeaf: dataType === 'city'
      }))
    } else {
      targetOption.children = [
        {
          value: '__empty__',
          label: dataType === 'state' ? 'No states available' : 'No cities available',
          isLeaf: true,
          disabled: true
        }
      ]
    }
    setter((prev) => [...prev])
  }

  const nativeLocked = (historicalProfile?.language_skills?.native_language?.length ?? 0) > 0
  const occupationLocked = (historicalProfile?.professional_role?.occupation_area?.length ?? 0) > 0

  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // Collect locked fields that have values filled in this session (not yet in historical profile)
  const lockedFieldsWithValues = useMemo(() => {
    const fields: { label: string; value: string }[] = []

    if (birthPlace[0] && !historicalProfile?.basic_info?.birth_place_country) {
      const parts = birthPlace.map((code, i) => {
        if (i === 0) return baseData.country?.find((c) => c.code === code)?.name || code
        return code
      })
      fields.push({ label: 'Place of Birth', value: parts.filter(Boolean).join(', ') })
    }

    if (birthYear && !historicalProfile?.basic_info?.birth_year) {
      fields.push({ label: 'Birth Year', value: birthYear })
    }

    if (gender && !historicalProfile?.basic_info?.gender) {
      const genderLabel = baseData.gender?.find((g) => g.code === gender)?.name || gender
      fields.push({ label: 'Gender', value: genderLabel })
    }

    const filledNative = nativeLangRows.filter((r) => r.value)
    if (filledNative.length > 0 && !nativeLocked) {
      const labels = filledNative
        .map((r) => baseData.language?.find((l) => l.code === r.value)?.name || r.value)
        .join(', ')
      fields.push({ label: 'Native Language', value: labels })
    }

    const filledOccupation = occupationRows.filter((r) => r.value)
    if (filledOccupation.length > 0 && !occupationLocked) {
      const labels = filledOccupation
        .map((r) => baseData.occupation_area?.find((o) => o.code === r.value)?.name || r.value)
        .join(', ')
      fields.push({ label: 'Occupation Area', value: labels })
    }

    // Only newly added (non-historical) majors appear in the confirmation modal
    if (!isPreBachelor) {
      const newMajors = majorRows.filter((r) => r.value && !r.isHistorical)
      if (newMajors.length > 0) {
        const labels = newMajors
          .map((r) => (r.isOther ? r.value : baseData.major?.find((m) => m.code === r.value)?.name || r.value))
          .join(', ')
        fields.push({ label: 'Major', value: labels })
      }
    }

    return fields
  }, [
    birthPlace,
    birthYear,
    gender,
    nativeLangRows,
    occupationRows,
    majorRows,
    historicalProfile,
    nativeLocked,
    occupationLocked,
    isPreBachelor,
    baseData
  ])

  async function handleSave() {
    // Clear previous errors
    setFormErrors({})
    const errors: typeof formErrors = {}

    // Validate required education fields when degree is not Pre-Bachelor's
    if (highestDegree && !isPreBachelor) {
      if (!universityRows.some((r) => r.value)) {
        errors.university = 'University is required'
      }
      if (!majorRows.some((r) => r.value)) {
        errors.major = 'Major is required'
      }
      if (!eduStatus) {
        errors.status = 'Graduation status is required'
      }
    }

    // Validate language skills: level is required when language is selected
    for (const row of otherLangRows) {
      if ((row.lang || row.customLang) && !row.level) {
        errors.languageLevel = 'Language level is required for all selected languages'
        break
      }
      // If 'other' is selected, custom language name must be filled
      if (row.isOther && !row.customLang.trim()) {
        errors.languageLevel = 'Please enter the language name or remove the empty row'
        break
      }
      // Check for validation errors
      if (row.error) {
        errors.languageLevel = row.error
        break
      }
    }

    // If there are validation errors, set them and return
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      message.error('Please fix the validation errors before submitting')
      return
    }

    // Show confirmation modal if locked fields have new values
    if (lockedFieldsWithValues.length > 0) {
      setShowConfirmModal(true)
    } else {
      await performSubmit()
    }
  }

  async function performSubmit() {
    // Validate review method requirements
    if (reviewMethod === 'email') {
      if (!schoolEmail.trim()) {
        message.error('Please provide your school email')
        return
      }
      if (!schoolEmailVerified) {
        message.error('Please verify your school email before submitting')
        return
      }
    } else if (reviewMethod === 'photo') {
      if (!certificatePhoto.trim()) {
        message.error('Please upload your certificate photo before submitting')
        return
      }
    }

    // Filter out empty form fields before submission and format as objects
    const nativeLangs = nativeLangRows
      .map((r) => r.value)
      .filter(Boolean)
      .map((value) => {
        // Check if this is a custom language (not in baseData.language)
        const isCustom = !baseData.language?.find((l) => l.code === value)
        return isCustom ? { code: value, source: 'other' as const } : { code: value }
      })

    const validOtherLangRows = otherLangRows.filter((r) => !r.error && (r.lang || r.customLang) && r.level)
    const otherLangs = validOtherLangRows.map((r) => {
      const code = r.isOther ? r.customLang : r.lang
      const langObj: { code: string; level: string; source?: 'other' } = {
        code,
        level: r.level
      }
      if (r.isOther) {
        langObj.source = 'other'
      }
      return langObj
    })

    // When Pre-Bachelor's, clear education sub-fields
    const submittedUniversity = isPreBachelor ? '' : universityRows.map((r) => r.value).filter(Boolean)[0] || ''
    const submittedMajors = isPreBachelor ? [] : majorRows.map((r) => r.value).filter(Boolean)
    const submittedEduStatus = isPreBachelor ? '' : eduStatus || ''

    const occupations = occupationRows.map((r) => r.value).filter(Boolean)

    // Check if education background has changed
    const isEduChanged =
      highestDegree !== historicalProfile?.education_background?.highest_degree ||
      submittedUniversity !== historicalProfile?.education_background?.university ||
      submittedEduStatus !== historicalProfile?.education_background?.status ||
      JSON.stringify(submittedMajors) !== JSON.stringify(historicalProfile?.education_background?.major || []) ||
      reviewMethod !== historicalProfile?.education_background?.review_method ||
      (reviewMethod === 'email' ? schoolEmail : undefined) !== historicalProfile?.education_background?.school_email ||
      (reviewMethod === 'photo' ? certificatePhoto : undefined) !==
        historicalProfile?.education_background?.certificate_photo

    // Build submission params with only non-empty values (all fields as strings)
    const params: UserQualification = {
      basic_info: {
        birth_place_country: birthPlace[0] ? String(birthPlace[0]) : '',
        birth_place_state: birthPlace[1] ? String(birthPlace[1]) : '',
        birth_place_city: birthPlace[2] ? String(birthPlace[2]) : '',
        current_residence_country: residencePlace[0] ? String(residencePlace[0]) : '',
        current_residence_state: residencePlace[1] ? String(residencePlace[1]) : '',
        current_residence_city: residencePlace[2] ? String(residencePlace[2]) : '',
        birth_year: birthYear ? String(birthYear) : '',
        gender: gender ? String(gender) : ''
      },
      language_skills: {
        native_language: nativeLangs,
        other_language: otherLangs
      },
      education_background: {
        highest_degree: highestDegree || '',
        university: submittedUniversity,
        major: submittedMajors,
        status: submittedEduStatus,
        review_method: reviewMethod,
        school_email: reviewMethod === 'email' ? schoolEmail : undefined,
        certificate_photo: reviewMethod === 'photo' ? certificatePhoto : undefined,
        // Set audit_status to PENDING when education background changes
        audit_status: isEduChanged ? 'PENDING' : null
      },
      professional_role: {
        occupation_area: occupations
      }
    }

    try {
      setLoading(true)
      const res = await userApi.submitUserQualification(params)
      if (res.success) {
        message.success('Profile updated successfully')
        const qualRes = await userApi.getUserQualification()
        if (qualRes.success) {
          setHistoricalProfile(qualRes.data)
        }
        // Show review modal if education background was changed
        if (isEduChanged) {
          setShowReviewModal(true)
        }
      } else {
        message.error(res.errorMessage || 'Failed to submit profile')
      }
    } catch {
      message.error('Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Spin spinning={loading} size="large">
      <div>
        <h3 className="mb-6 text-[32px] font-bold leading-[48px]">User Profile</h3>

        <div className="flex flex-col gap-12">
          {/* Warning notice */}
          <div className="flex items-center gap-2">
            <LightEmergencyIcon />
            <p className="text-sm text-[#BBBBBE]">
              Provide accurate information in all fields. Most details are{' '}
              <span className="text-[#FFA800]">permanent</span> and will determine your access to future{' '}
              <span className="text-[#FFA800]">high-reward tasks.</span>
            </p>
          </div>

          {/* Basic Info */}
          <div className="flex flex-col gap-4">
            <SectionHeader title="Basic Info" />
            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <FieldLabel label="Place of Birth" locked />
                {historicalProfile?.basic_info?.birth_place_country ? (
                  <LockedField
                    value={[
                      historicalProfile.basic_info.birth_place_country,
                      historicalProfile.basic_info.birth_place_state,
                      historicalProfile.basic_info.birth_place_city
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  />
                ) : (
                  <Cascader
                    className="h-[48px] w-full"
                    options={birthOptions}
                    loadData={(opts) => loadLocationChildren(opts as CascaderOption[], setBirthOptions)}
                    value={birthPlace}
                    onChange={(val) => setBirthPlace((val as string[]) || [])}
                    changeOnSelect
                    placeholder="Select Place of Birth"
                    suffixIcon={<DownOutlined className="text-white" />}
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <FieldLabel label="Current Residence" />
                {historicalProfile?.basic_info?.current_residence_country ? (
                  <LockedField
                    value={[
                      historicalProfile.basic_info.current_residence_country,
                      historicalProfile.basic_info.current_residence_state,
                      historicalProfile.basic_info.current_residence_city
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  />
                ) : (
                  <Cascader
                    className="h-[48px] w-full"
                    options={residenceOptions}
                    loadData={(opts) => loadLocationChildren(opts as CascaderOption[], setResidenceOptions)}
                    value={residencePlace}
                    onChange={(val) => setResidencePlace((val as string[]) || [])}
                    changeOnSelect
                    placeholder="Select Current Residence"
                    suffixIcon={<DownOutlined className="text-white" />}
                  />
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <FieldLabel label="Birth Year" locked />
                {birthYear && historicalProfile?.basic_info?.birth_year ? (
                  <LockedField value={birthYear} />
                ) : (
                  <SelectField
                    value={birthYear}
                    onChange={setBirthYear}
                    options={yearOptions}
                    placeholder="Select Birth Year"
                    suffixIcon={<CalendarIcon />}
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <FieldLabel label="Gender" locked />
                <SelectField
                  locked
                  placeholder="Select Gender"
                  isHistorical={!!historicalProfile?.basic_info?.gender}
                  options={baseData.gender?.map((g) => ({ label: g.name, value: g.code }))}
                  value={gender}
                  onChange={setGender}
                />
              </div>
            </div>
          </div>

          {/* Language Skills */}
          <div className="flex flex-col gap-4">
            <SectionHeader title="Language Skills" />
            <div className="flex flex-col gap-4">
              {/* Native Language */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <FieldLabel label="Native Language" locked />
                </div>
                <MultiSelectList
                  rows={nativeLangRows}
                  onChange={setNativeLangRows}
                  options={filterOtherOption(baseData.language)}
                  placeholder="Select Native Language"
                  otherInputPlaceholder="Enter Native Language"
                  showOther
                  max={2}
                  allLocked={nativeLocked}
                />
              </div>

              {/* Other Languages */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Other Languages</span>
                </div>
                {otherLangRows.map((row, i) => {
                  const selectedLangs = otherLangRows
                    .filter((_, idx) => idx !== i)
                    .map((r) => r.lang)
                    .filter(Boolean)
                  const customLangs = otherLangRows
                    .filter((r, idx) => idx !== i && r.isOther && r.customLang)
                    .map((r) => r.customLang.replace(/\s+/g, '').toLowerCase())
                  const allSelectedLangNames = otherLangRows
                    .filter((_r, idx) => idx !== i)
                    .map((r) => {
                      if (r.isOther && r.customLang) return r.customLang.replace(/\s+/g, '').toLowerCase()
                      return r.lang
                        ? baseData.language
                            ?.find((l) => l.code === r.lang)
                            ?.name.replace(/\s+/g, '')
                            .toLowerCase() || ''
                        : ''
                    })
                    .filter(Boolean)

                  const validateCustomLang = (value: string): string | undefined => {
                    const trimmed = value.trim()
                    if (!trimmed) return 'This field cannot be empty'
                    const normalized = trimmed.replace(/\s+/g, '').toLowerCase()

                    // Check if matches any option name
                    const matchedOption = baseData.language?.find(
                      (l) => l.name.replace(/\s+/g, '').toLowerCase() === normalized
                    )
                    if (matchedOption)
                      return `Please select "${matchedOption.name}" from the dropdown instead of entering it manually`

                    if (customLangs.includes(normalized)) return 'This value is already used'
                    if (allSelectedLangNames.includes(normalized)) return 'This value is already used'
                    return undefined
                  }

                  const languageOptions = [
                    ...(baseData.language
                      ?.filter((l) => !selectedLangs.includes(l.code))
                      .map((l) => ({ label: l.name, value: l.code })) || []),
                    { label: 'Other', value: 'other' }
                  ]

                  return (
                    <div key={row.id} className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className="w-[240px] shrink-0">
                          <SelectField
                            placeholder="Select a language"
                            options={languageOptions}
                            value={row.isOther ? 'other' : row.lang}
                            onChange={(val) => {
                              const newRows = [...otherLangRows]
                              if (val === 'other') {
                                newRows[i] = {
                                  ...newRows[i],
                                  lang: '',
                                  isOther: true,
                                  customLang: '',
                                  error: undefined
                                }
                              } else {
                                newRows[i] = {
                                  ...newRows[i],
                                  lang: val,
                                  isOther: false,
                                  customLang: '',
                                  error: undefined
                                }
                              }
                              setOtherLangRows(newRows)
                            }}
                          />
                        </div>
                        {row.isOther && (
                          <div className="min-w-0 flex-1">
                            <div
                              className={cn(
                                'flex h-[48px] items-center rounded-lg border px-4',
                                row.error ? 'border-red-500' : 'border-[rgba(255,255,255,0.12)]'
                              )}
                            >
                              <Input
                                placeholder="Enter language"
                                variant="borderless"
                                className="!bg-transparent !p-0 !text-white placeholder:!text-[#606067]"
                                value={row.customLang}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  const newRows = [...otherLangRows]
                                  const value = e.target.value
                                  const error = validateCustomLang(value)
                                  newRows[i] = { ...newRows[i], customLang: value, error }
                                  setOtherLangRows(newRows)
                                }}
                              />
                            </div>
                          </div>
                        )}

                        <div className={cn('min-w-0 flex-1', row.isOther && 'shrink-0')}>
                          <SelectField
                            placeholder="Select Level"
                            options={baseData.language_level?.map((l) => ({ label: l.name, value: l.code }))}
                            value={row.level}
                            onChange={(val) => {
                              const newRows = [...otherLangRows]
                              newRows[i].level = val
                              setOtherLangRows(newRows)
                              if (formErrors.languageLevel) {
                                setFormErrors((prev) => ({ ...prev, languageLevel: undefined }))
                              }
                            }}
                          />
                        </div>
                        <button
                          className="flex h-[48px] shrink-0 items-center justify-center text-[#606067] hover:text-white"
                          onClick={() => setOtherLangRows((prev) => prev.filter((_, idx) => idx !== i))}
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 2a1 1 0 0 0-1 1v1H3a1 1 0 0 0 0 2h.09l.81 10.55A2 2 0 0 0 5.9 18h8.2a2 2 0 0 0 1.99-1.45L16.91 6H17a1 1 0 0 0 0-2h-2V3a1 1 0 0 0-1-1H6zm1 2h6v1H7V4zm-2.09 2h10.18l-.79 10.32a.01.01 0 0 1-.01.01H5.9L5.09 6z" />
                          </svg>
                        </button>
                      </div>
                      {row.error && <p className="ml-[252px] text-xs text-red-500">{row.error}</p>}
                    </div>
                  )
                })}
                {otherLangRows.length < 3 && (
                  <button
                    onClick={() =>
                      setOtherLangRows((prev) => [
                        ...prev,
                        { id: Date.now(), lang: '', level: '', isOther: false, customLang: '' }
                      ])
                    }
                    className="flex items-center gap-2 text-sm text-white"
                  >
                    <PlusOutlined className="text-xs" />
                    <span>Add</span>
                  </button>
                )}
                {formErrors.languageLevel && <p className="text-xs text-red-500">{formErrors.languageLevel}</p>}
              </div>
            </div>
          </div>

          {/* Education Background */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <SectionHeader title="Education Background" />
            </div>
            <div className="flex flex-col gap-4">
              {/* Highest Degree */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-white">Highest Degree</span>
                <SelectField
                  placeholder="Select a degree"
                  value={highestDegree}
                  onChange={setHighestDegree}
                  options={baseData.highest_degree?.map((d) => ({ label: d.name, value: d.code }))}
                />
              </div>

              {/* Sub-fields hidden when Pre-Bachelor's is selected */}
              {highestDegree && !isPreBachelor && (
                <>
                  {/* Review method */}
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-white">Review method</span>

                    {/* Show audit status if pending or refused and not retrying */}
                    {isAuditPending && !isRetryingAudit ? (
                      <div className="flex items-center rounded-2xl bg-[#252532] px-4 py-[6px]">
                        <span className="text-sm text-[#FFA800]">
                          {reviewMethod === 'email'
                            ? 'Email information is under review'
                            : 'Certificate photo is under review'}
                        </span>
                      </div>
                    ) : isAuditRefused && !isRetryingAudit ? (
                      <div className="flex items-center gap-2 rounded-2xl bg-[#252532] px-4 py-[6px]">
                        <span className="text-sm text-[#D92B2B]">
                          {reviewMethod === 'email' ? 'Email verification failed' : 'Certificate verification failed'}
                        </span>
                        <button
                          onClick={() => setIsRetryingAudit(true)}
                          className="text-xs text-[#875DFF] hover:underline"
                        >
                          Try Again
                        </button>
                      </div>
                    ) : (
                      // Show normal review method selection when no audit or retrying
                      <>
                        <Radio.Group
                          value={reviewMethod}
                          onChange={(e) => {
                            setReviewMethod(e.target.value)
                            // Reset email verification status when switching methods
                            if (e.target.value === 'photo') {
                              setSchoolEmailVerified(false)
                            }
                          }}
                          className="flex items-center gap-4"
                        >
                          <Radio value="email" className="text-white">
                            School Email
                          </Radio>
                          <Radio value="photo" className="text-white">
                            Graduation Certificate Photo
                          </Radio>
                        </Radio.Group>

                        {reviewMethod === 'email' && (
                          <SchoolEmailVerify
                            initialEmail={schoolEmail}
                            onVerified={setSchoolEmail}
                            onVerificationStatusChange={setSchoolEmailVerified}
                          />
                        )}

                        {reviewMethod === 'photo' && (
                          <CertificateUpload value={certificatePhoto} onChange={setCertificatePhoto} />
                        )}
                      </>
                    )}
                  </div>

                  {/* University */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-white">University</span>
                      <span className="text-sm text-red-400">*</span>
                    </div>
                    <MultiSelectList
                      rows={universityRows}
                      onChange={(rows) => {
                        setUniversityRows(rows)
                        if (formErrors.university) {
                          setFormErrors((prev) => ({ ...prev, university: undefined }))
                        }
                      }}
                      options={filterOtherOption(baseData.university)}
                      placeholder="Select University"
                      otherInputPlaceholder="Enter University"
                      showOther
                      max={1}
                    />
                    {formErrors.university && <p className="text-xs text-red-500">{formErrors.university}</p>}
                  </div>

                  {/* Major */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-white">Major</span>
                      <span className="text-sm text-red-400">*</span>
                    </div>
                    <MultiSelectList
                      rows={majorRows}
                      onChange={(rows) => {
                        setMajorRows(rows)
                        if (formErrors.major) {
                          setFormErrors((prev) => ({ ...prev, major: undefined }))
                        }
                      }}
                      options={filterOtherOption(baseData.major)}
                      placeholder="Select Major"
                      otherInputPlaceholder="Enter Major"
                      showOther
                      max={3}
                    />
                    {formErrors.major && <p className="text-xs text-red-500">{formErrors.major}</p>}
                  </div>

                  {/* Status */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-white">Status</span>
                      <span className="text-sm text-red-400">*</span>
                    </div>
                    <SelectField
                      placeholder="Select Status"
                      value={eduStatus}
                      onChange={(val) => {
                        setEduStatus(val)
                        if (formErrors.status) {
                          setFormErrors((prev) => ({ ...prev, status: undefined }))
                        }
                      }}
                      options={baseData.education_background_status?.map((s) => ({ label: s.name, value: s.code }))}
                    />
                    {formErrors.status && <p className="text-xs text-red-500">{formErrors.status}</p>}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Professional Role */}
          <div className="flex flex-col gap-4">
            <SectionHeader title="Professional Role" />
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <FieldLabel label="Occupation Area" locked />
              </div>
              <MultiSelectList
                rows={occupationRows}
                onChange={setOccupationRows}
                options={filterOtherOption(baseData.occupation_area)}
                placeholder="Select occupation area"
                otherInputPlaceholder="Enter occupation area"
                showOther
                max={3}
                allLocked={occupationLocked}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSave}
              loading={loading}
              className="h-[48px] w-[240px] !rounded-full !border-none !bg-[#875DFF] !text-sm !font-medium !text-white"
            >
              Save Information
            </Button>
          </div>
        </div>

        {/* Confirm Modal */}
        <Modal
          open={showConfirmModal}
          footer={null}
          closable={false}
          centered
          width={480}
          styles={{ content: { background: '#252532', borderRadius: 24, padding: 0, overflow: 'hidden' } }}
        >
          {/* Warning banner */}
          <div className="flex items-center gap-3 bg-[rgba(217,43,43,0.08)] px-6 py-5">
            <span className="shrink-0 text-[#D92B2B]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#D92B2B" strokeWidth="1.5" />
                <path d="M12 8v4M12 16h.01" stroke="#D92B2B" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <p className="text-sm text-[#BBBBBE]">
              The content <span className="text-[#D92B2B]">cannot be modified</span> after submission. Please
              double-check before confirming.
            </p>
          </div>

          {/* Fields list */}
          <div className="flex flex-col gap-6 p-6">
            {lockedFieldsWithValues.map((field) => (
              <div key={field.label} className="flex items-center justify-between">
                <span className="text-base text-[#8D8D93]">{field.label}</span>
                <span className="text-base text-white">{field.value}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4 pb-6">
            <button className="text-sm text-white" onClick={() => setShowConfirmModal(false)}>
              Back
            </button>
            <Button
              className="h-[42px] min-w-[120px] !rounded-full !border-none !bg-[#875DFF] !text-sm !text-white"
              onClick={async () => {
                setShowConfirmModal(false)
                await performSubmit()
              }}
            >
              Confirm
            </Button>
          </div>
        </Modal>

        {/* Education Review Modal */}
        <EducationReviewModal open={showReviewModal} onClose={() => setShowReviewModal(false)} />
      </div>
    </Spin>
  )
}
