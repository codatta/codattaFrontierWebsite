import { useEffect, useState, useMemo } from 'react'
import { Select, Button, Radio, Modal, Cascader, message, Tooltip, Input } from 'antd'
import { PlusOutlined, DownOutlined } from '@ant-design/icons'
import { cn } from '@udecode/cn'

import userApi, { BaseDataResponse, UserQualification } from '@/apis/user.api'
import { MultiSelectList, MultiSelectRow } from '@/components/user-profile/multi-select-list'
import { SchoolEmailVerify } from '@/components/user-profile/school-email-verify'
import { CertificateUpload } from '@/components/user-profile/certificate-upload'
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

  // Whether the selected highest degree is Pre-Bachelor's (hides sub-fields)
  const isPreBachelor = useMemo(() => {
    if (!highestDegree || !baseData.highest_degree) return false
    const selected = baseData.highest_degree.find((d) => d.code === highestDegree)
    const name = selected?.name?.toLowerCase().replace(/[-'\s]/g, '') ?? ''
    return name.includes('prebachelor')
  }, [highestDegree, baseData.highest_degree])

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
              d.language_skills.native_language.map((v, i) => ({
                id: i,
                isOther: false,
                value: v,
                isHistorical: false
              }))
            )
          }
          if (d.language_skills.other_language?.length) {
            setOtherLangRows(
              d.language_skills.other_language.map((lang, i) => ({
                id: i,
                lang,
                level: d.language_skills.level[i] || '',
                isOther: false,
                customLang: ''
              }))
            )
          }

          // Populate Education
          setHighestDegree(d.education_background.highest_degree)
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
                isHistorical: false
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
    // Validate required education fields when not Pre-Bachelor's
    if (highestDegree && !isPreBachelor) {
      if (!universityRows.some((r) => r.value)) {
        message.error('University is required')
        return
      }
      if (!majorRows.some((r) => r.value)) {
        message.error('Major is required')
        return
      }
      if (!eduStatus) {
        message.error('Graduation status is required')
        return
      }
    }

    if (lockedFieldsWithValues.length > 0) {
      setShowConfirmModal(true)
    } else {
      await performSubmit()
    }
  }

  async function performSubmit() {
    const isBasicChanged =
      birthPlace[0] !== historicalProfile?.basic_info?.birth_place_country ||
      birthPlace[1] !== historicalProfile?.basic_info?.birth_place_state ||
      birthPlace[2] !== historicalProfile?.basic_info?.birth_place_city ||
      residencePlace[0] !== historicalProfile?.basic_info?.current_residence_country ||
      residencePlace[1] !== historicalProfile?.basic_info?.current_residence_state ||
      residencePlace[2] !== historicalProfile?.basic_info?.current_residence_city ||
      Number(birthYear) !== historicalProfile?.basic_info?.birth_year ||
      gender !== historicalProfile?.basic_info?.gender

    const nativeLangs = nativeLangRows.map((r) => r.value).filter(Boolean)
    const validOtherLangRows = otherLangRows.filter((r) => !r.error && (r.lang || r.customLang))
    const otherLangs = validOtherLangRows.map((r) => (r.isOther ? r.customLang : r.lang))
    const levels = validOtherLangRows.map((r) => r.level)

    // When Pre-Bachelor's, clear education sub-fields
    const submittedUniversity = isPreBachelor ? '' : universityRows.map((r) => r.value).filter(Boolean)[0] || ''
    const submittedMajors = isPreBachelor ? [] : majorRows.map((r) => r.value).filter(Boolean)
    const submittedEduStatus = isPreBachelor ? '' : eduStatus || ''

    const occupations = occupationRows.map((r) => r.value).filter(Boolean)

    const isLangChanged =
      JSON.stringify(nativeLangs) !== JSON.stringify(historicalProfile?.language_skills?.native_language || []) ||
      JSON.stringify(otherLangs) !== JSON.stringify(historicalProfile?.language_skills?.other_language || []) ||
      JSON.stringify(levels) !== JSON.stringify(historicalProfile?.language_skills?.level || [])

    const isEduChanged =
      highestDegree !== historicalProfile?.education_background?.highest_degree ||
      submittedUniversity !== historicalProfile?.education_background?.university ||
      submittedEduStatus !== historicalProfile?.education_background?.status ||
      JSON.stringify(submittedMajors) !== JSON.stringify(historicalProfile?.education_background?.major || [])

    const isProfChanged =
      JSON.stringify(occupations) !== JSON.stringify(historicalProfile?.professional_role?.occupation_area || [])

    const hasChanged = isBasicChanged || isLangChanged || isEduChanged || isProfChanged

    const params: UserQualification = {
      basic_info: {
        birth_place_country: birthPlace[0] || '',
        birth_place_state: birthPlace[1] || '',
        birth_place_city: birthPlace[2] || '',
        current_residence_country: residencePlace[0] || '',
        current_residence_state: residencePlace[1] || '',
        current_residence_city: residencePlace[2] || '',
        birth_year: Number(birthYear),
        gender: gender || ''
      },
      language_skills: {
        native_language: nativeLangs,
        other_language: otherLangs,
        level: levels
      },
      education_background: {
        highest_degree: highestDegree || '',
        university: submittedUniversity,
        major: submittedMajors,
        status: submittedEduStatus,
        audit_status: hasChanged ? 'PENDING' : null
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
                <div className="flex items-center gap-1">
                  <FieldLabel label="Native Language" locked />
                  <span className="text-sm text-red-400">*</span>
                </div>
                <span className="text-xs text-[#8D8D93]">{nativeLangRows.length}/2</span>
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
                <span className="text-xs text-[#8D8D93]">
                  {otherLangRows.filter((r) => r.lang || r.customLang).length}/3
                </span>
              </div>
              {otherLangRows.map((row, i) => {
                const selectedLangs = otherLangRows
                  .filter((_, idx) => idx !== i)
                  .map((r) => r.lang)
                  .filter(Boolean)
                const customLangs = otherLangRows
                  .filter((r, idx) => idx !== i && r.isOther && r.customLang)
                  .map((r) => r.customLang.replace(/\s+/g, '').toLowerCase())
                const allOptionNames = baseData.language?.map((l) => l.name.replace(/\s+/g, '').toLowerCase()) || []
                const allSelectedLangNames = otherLangRows
                  .filter((r, idx) => idx !== i)
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
                              newRows[i] = { ...newRows[i], lang: '', isOther: true, customLang: '', error: undefined }
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
            </div>
          </div>
        </div>

        {/* Education Background */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <SectionHeader title="Education Background" />
            {historicalProfile?.education_background?.audit_status && (
              <div className="flex items-center gap-2 px-4">
                <span
                  className={cn(
                    'rounded px-2 py-1 text-xs font-bold',
                    historicalProfile.education_background.audit_status === 'AUDIT'
                      ? 'bg-green-500/20 text-green-500'
                      : historicalProfile.education_background.audit_status === 'REFUSED'
                        ? 'bg-red-500/20 text-red-500'
                        : 'bg-yellow-500/20 text-yellow-500'
                  )}
                >
                  {historicalProfile.education_background.audit_status}
                </span>
                {historicalProfile.education_background.audit_reason && (
                  <span className="text-xs text-red-400">{historicalProfile.education_background.audit_reason}</span>
                )}
              </div>
            )}
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
                  <Radio.Group
                    value={reviewMethod}
                    onChange={(e) => setReviewMethod(e.target.value)}
                    className="flex items-center gap-4"
                  >
                    <Radio value="email" className="text-white">
                      School Email
                    </Radio>
                    <Radio value="photo" className="text-white">
                      Graduation Certificate Photo
                    </Radio>
                  </Radio.Group>

                  {reviewMethod === 'email' && <SchoolEmailVerify />}

                  {reviewMethod === 'photo' && <CertificateUpload />}
                </div>

                {/* University */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-white">University</span>
                    <span className="text-sm text-red-400">*</span>
                  </div>
                  <MultiSelectList
                    rows={universityRows}
                    onChange={setUniversityRows}
                    options={filterOtherOption(baseData.university)}
                    placeholder="Select University"
                    otherInputPlaceholder="Enter University"
                    showOther
                    max={1}
                  />
                </div>

                {/* Major */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-white">Major</span>
                      <span className="text-sm text-red-400">*</span>
                    </div>
                    <span className="text-xs text-[#8D8D93]">{majorRows.length}/3</span>
                  </div>
                  <MultiSelectList
                    rows={majorRows}
                    onChange={setMajorRows}
                    options={filterOtherOption(baseData.major)}
                    placeholder="Select Major"
                    otherInputPlaceholder="Enter Major"
                    showOther
                    max={3}
                  />
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
                    onChange={setEduStatus}
                    options={baseData.education_background_status?.map((s) => ({ label: s.name, value: s.code }))}
                  />
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
              <span className="text-xs text-[#8D8D93]">{occupationRows.length}/3</span>
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
            The content <span className="text-[#D92B2B]">cannot be modified</span> after submission. Please double-check
            before confirming.
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
    </div>
  )
}
