import { useEffect, useState, useMemo } from 'react'
import { Select, Input, Button, Radio, Modal, Cascader, message, Tooltip } from 'antd'
import { PlusOutlined, DownOutlined } from '@ant-design/icons'
import { cn } from '@udecode/cn'

import userApi, { BaseDataResponse, UserQualification } from '@/apis/user.api'
import LightEmergencyIcon from '@/assets/userinfo/light-emergency-icon.svg?react'
import LockIcon from '@/assets/userinfo/lock-icon.svg?react'
import TrashIcon from '@/assets/userinfo/trash-icon.svg?react'
import CalendarIcon from '@/assets/userinfo/calendar-icon.svg?react'

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex w-full items-center rounded-md border-l-4 border-[#875DFF] bg-[rgba(135,93,255,0.08)] px-4 py-[6px]">
      <span className="text-lg font-bold text-white">{title}</span>
    </div>
  )
}

// Shown when a locked field has a submitted value and cannot be edited
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

// locked=true: show warning placeholder when empty, LockedField when has value
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

function AddBtn({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 text-sm text-white">
      <PlusOutlined className="text-xs" />
      <span>Add</span>
    </button>
  )
}

function DeleteBtn({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex shrink-0 items-center justify-center text-[#606067] hover:text-white">
      <TrashIcon />
    </button>
  )
}

interface HistoricalProfile {
  basic_info?: UserQualification['basic_info']
  language_skills?: UserQualification['language_skills']
  education_background?: UserQualification['education_background']
  professional_role?: UserQualification['professional_role']
}

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

  const [reviewMethod, setReviewMethod] = useState<'email' | 'photo'>('email')
  const [schoolEmail, setSchoolEmail] = useState('')
  const [verifyCode, setVerifyCode] = useState('')

  // Basic Info
  const [birthYear, setBirthYear] = useState<string>()
  const [gender, setGender] = useState<string>()

  // Language Skills
  const [nativeLangRows, setNativeLangRows] = useState<{ id: number; value: string }[]>([{ id: 0, value: '' }])
  const [otherLangRows, setOtherLangRows] = useState<{ id: number; lang: string; level: string }[]>([
    { id: 0, lang: '', level: '' }
  ])

  // Education Background
  const [highestDegree, setHighestDegree] = useState<string>()
  const [university, setUniversity] = useState<string>()
  const [majorRows, setMajorRows] = useState<{ id: number; isOther: boolean; value: string }[]>([
    { id: 0, isOther: false, value: '' }
  ])
  const [eduStatus, setEduStatus] = useState<string>()

  // Professional Role
  const [occupationRows, setOccupationRows] = useState<{ id: number; value: string }[]>([{ id: 0, value: '' }])

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
            setNativeLangRows(d.language_skills.native_language.map((v, i) => ({ id: i, value: v })))
          }
          if (d.language_skills.other_language?.length) {
            setOtherLangRows(
              d.language_skills.other_language.map((lang, i) => ({
                id: i,
                lang,
                level: d.language_skills.level[i] || ''
              }))
            )
          }

          // Populate Education
          setHighestDegree(d.education_background.highest_degree)
          setUniversity(d.education_background.university)
          setEduStatus(d.education_background.status)
          if (d.education_background.major?.length) {
            setMajorRows(d.education_background.major.map((v, i) => ({ id: i, isOther: false, value: v })))
          }

          // Populate Occupation
          if (d.professional_role.occupation_area?.length) {
            setOccupationRows(d.professional_role.occupation_area.map((v, i) => ({ id: i, value: v })))
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

    const filledMajors = majorRows.filter((r) => r.value)
    if (filledMajors.length > 0) {
      const labels = filledMajors
        .map((r) => (r.isOther ? r.value : baseData.major?.find((m) => m.code === r.value)?.name || r.value))
        .join(', ')
      fields.push({ label: 'Major', value: labels })
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
    baseData
  ])

  async function handleSave() {
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
    const validOtherLangRows = otherLangRows.filter((r) => r.lang)
    const otherLangs = validOtherLangRows.map((r) => r.lang)
    const levels = validOtherLangRows.map((r) => r.level)
    const majors = majorRows.map((r) => r.value).filter(Boolean)
    const occupations = occupationRows.map((r) => r.value).filter(Boolean)

    const isLangChanged =
      JSON.stringify(nativeLangs) !== JSON.stringify(historicalProfile?.language_skills?.native_language || []) ||
      JSON.stringify(otherLangs) !== JSON.stringify(historicalProfile?.language_skills?.other_language || []) ||
      JSON.stringify(levels) !== JSON.stringify(historicalProfile?.language_skills?.level || [])

    const isEduChanged =
      highestDegree !== historicalProfile?.education_background?.highest_degree ||
      university !== historicalProfile?.education_background?.university ||
      eduStatus !== historicalProfile?.education_background?.status ||
      JSON.stringify(majors) !== JSON.stringify(historicalProfile?.education_background?.major || [])

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
        university: university || '',
        major: majors,
        status: eduStatus || '',
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
        // Refresh qualification data
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
              <FieldLabel label="Native Language" locked />
              {nativeLocked ? (
                historicalProfile?.language_skills?.native_language?.map((lang, i) => {
                  const label = baseData.language?.find((l) => l.code === lang)?.name || lang
                  return <LockedField key={i} value={label} />
                })
              ) : (
                <>
                  {nativeLangRows.map((row, i) => (
                    <div key={row.id} className="flex items-center gap-2">
                      <SelectField
                        locked
                        placeholder="Select Native Language"
                        className="flex-1"
                        options={baseData.language?.map((l) => ({ label: l.name, value: l.code }))}
                        value={row.value}
                        onChange={(val) => {
                          const newRows = [...nativeLangRows]
                          newRows[i].value = val
                          setNativeLangRows(newRows)
                        }}
                      />
                      {nativeLangRows.length > 1 && (
                        <DeleteBtn onClick={() => setNativeLangRows((prev) => prev.filter((_, idx) => idx !== i))} />
                      )}
                    </div>
                  ))}
                  <AddBtn onClick={() => setNativeLangRows((prev) => [...prev, { id: Date.now(), value: '' }])} />
                </>
              )}
            </div>

            {/* Other Languages */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-white">Other Languages</span>
              {otherLangRows.map((row, i) => (
                <div key={row.id} className="flex items-center gap-2">
                  <div className="w-[240px]">
                    <SelectField
                      placeholder="Select a language"
                      options={baseData.language?.map((l) => ({ label: l.name, value: l.code }))}
                      value={row.lang}
                      onChange={(val) => {
                        const newRows = [...otherLangRows]
                        newRows[i].lang = val
                        setOtherLangRows(newRows)
                      }}
                    />
                  </div>
                  <div className="flex-1">
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
                  {otherLangRows.length > 1 && (
                    <DeleteBtn onClick={() => setOtherLangRows((prev) => prev.filter((_, idx) => idx !== i))} />
                  )}
                </div>
              ))}
              <AddBtn onClick={() => setOtherLangRows((prev) => [...prev, { id: Date.now(), lang: '', level: '' }])} />
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

            {/* Fields below only shown after degree is selected */}
            {highestDegree && (
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

                  {reviewMethod === 'email' && (
                    <div className="flex flex-col gap-4 rounded-2xl bg-[#252532] p-4">
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-semibold text-white">
                          School Email<span className="text-[#8D8D93]">*</span>
                        </p>
                        <div className="flex h-[48px] items-center justify-between rounded-lg border border-[rgba(255,255,255,0.12)] px-4">
                          <Input
                            value={schoolEmail}
                            onChange={(e) => setSchoolEmail(e.target.value)}
                            placeholder="Provide your Email"
                            variant="borderless"
                            className="flex-1 !bg-transparent !p-0 !text-white placeholder:!text-[#8D8D93]"
                          />
                          <button className="shrink-0 text-sm font-semibold text-[#875DFF]">Send Code</button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-semibold text-white">
                          Verification Code<span className="text-[#8D8D93]">*</span>
                        </p>
                        <div className="flex gap-4">
                          <Input
                            value={verifyCode}
                            onChange={(e) => setVerifyCode(e.target.value)}
                            placeholder="Enter Code"
                            className="h-[48px] flex-1 !rounded-lg !bg-transparent !text-white placeholder:!text-[#8D8D93]"
                          />
                          <Button className="h-[48px] !rounded-lg !border-none !bg-[#875DFF] !px-8 !text-white">
                            Verify
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {reviewMethod === 'photo' && (
                    <div className="flex h-[130px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-[rgba(255,255,255,0.12)] px-4 py-6 hover:border-[#875DFF]">
                      <PlusOutlined className="text-xl text-white" />
                      <div className="flex flex-col items-center text-sm text-[#606067]">
                        <span>Click to upload file or drag and drop</span>
                        <span>Supports Image upload</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* University */}
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-white">University</span>
                  <SelectField
                    placeholder="Select University"
                    value={university}
                    onChange={setUniversity}
                    options={baseData.university?.map((u) => ({ label: u.name, value: u.code }))}
                  />
                </div>

                {/* Major */}
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-white">Major</span>
                  {majorRows.map((major, i) => (
                    <div key={major.id} className="flex items-center gap-2">
                      {major.isOther ? (
                        <>
                          <div className="w-[240px]">
                            <SelectField
                              value="other"
                              options={[{ label: 'Other', value: 'other' }]}
                              onChange={() => {
                                const newRows = [...majorRows]
                                newRows[i].isOther = false
                                setMajorRows(newRows)
                              }}
                            />
                          </div>
                          <div className="flex h-[48px] flex-1 items-center rounded-lg border border-[rgba(255,255,255,0.12)] px-4">
                            <Input
                              placeholder="Enter Major"
                              variant="borderless"
                              className="!bg-transparent !p-0 !text-white placeholder:!text-[#606067]"
                              value={major.value}
                              onChange={(e) => {
                                const newRows = [...majorRows]
                                newRows[i].value = e.target.value
                                setMajorRows(newRows)
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="flex-1">
                          <SelectField
                            placeholder="Select Major"
                            value={major.value}
                            options={[
                              ...(baseData.major?.map((m) => ({ label: m.name, value: m.code })) || []),
                              { label: 'Other', value: 'other' }
                            ]}
                            onChange={(val) => {
                              const newRows = [...majorRows]
                              if (val === 'other') {
                                newRows[i].isOther = true
                                newRows[i].value = ''
                              } else {
                                newRows[i].value = val
                              }
                              setMajorRows(newRows)
                            }}
                          />
                        </div>
                      )}
                      {majorRows.length > 1 && (
                        <DeleteBtn onClick={() => setMajorRows((prev) => prev.filter((_, idx) => idx !== i))} />
                      )}
                    </div>
                  ))}
                  <AddBtn
                    onClick={() => setMajorRows((prev) => [...prev, { id: Date.now(), isOther: false, value: '' }])}
                  />
                </div>

                {/* Status */}
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-white">Status</span>
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
            <FieldLabel label="Occupation Area" locked />
            {occupationLocked ? (
              historicalProfile?.professional_role?.occupation_area?.map((area, i) => {
                const label = baseData.occupation_area?.find((o) => o.code === area)?.name || area
                return <LockedField key={i} value={label} />
              })
            ) : (
              <>
                {occupationRows.map((row, i) => (
                  <div key={row.id} className="flex items-center gap-2">
                    <div className="flex-1">
                      <SelectField
                        locked
                        placeholder="Select occupation area"
                        value={row.value}
                        options={baseData.occupation_area?.map((o) => ({ label: o.name, value: o.code }))}
                        onChange={(val) => {
                          const newRows = [...occupationRows]
                          newRows[i].value = val
                          setOccupationRows(newRows)
                        }}
                      />
                    </div>
                    {occupationRows.length > 1 && (
                      <DeleteBtn onClick={() => setOccupationRows((prev) => prev.filter((_, idx) => idx !== i))} />
                    )}
                  </div>
                ))}
                <AddBtn onClick={() => setOccupationRows((prev) => [...prev, { id: Date.now(), value: '' }])} />
              </>
            )}
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
