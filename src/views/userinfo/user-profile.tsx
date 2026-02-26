import { useState } from 'react'
import { Select, Input, Button, Radio } from 'antd'
import { LockOutlined, DeleteOutlined, PlusOutlined, DownOutlined, CalendarOutlined } from '@ant-design/icons'
import { cn } from '@udecode/cn'

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex w-full items-center rounded-md border-l-4 border-[#875DFF] bg-[rgba(135,93,255,0.08)] px-4 py-[6px]">
      <span className="text-lg font-bold text-white">{title}</span>
    </div>
  )
}

function FieldLabel({ label, locked }: { label: string; locked?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-sm font-semibold text-white">{label}</span>
      {locked && <LockOutlined className="text-xs text-[#606067]" />}
    </div>
  )
}

function SelectField({
  placeholder,
  value,
  onChange,
  options,
  disabled,
  className
}: {
  placeholder?: string
  value?: string
  onChange?: (v: string) => void
  options?: { label: string; value: string }[]
  disabled?: boolean
  className?: string
}) {
  return (
    <Select
      className={cn('h-[48px] w-full', className)}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      options={options}
      disabled={disabled}
      suffixIcon={<DownOutlined className="text-white" />}
    />
  )
}

function DeleteBtn({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex shrink-0 items-center justify-center text-[#606067] hover:text-white">
      <DeleteOutlined className="text-base" />
    </button>
  )
}

export default function UserProfile() {
  const [reviewMethod, setReviewMethod] = useState<'email' | 'photo'>('email')
  const [schoolEmail, setSchoolEmail] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [highestDegree, setHighestDegree] = useState('postdoctoral')
  const [university, setUniversity] = useState<string>()
  const [status, setStatus] = useState<string>()
  const [otherLanguages] = useState([0, 1, 2])
  const [occupationAreas] = useState([0, 1, 2])
  const [majors] = useState([
    { id: 0, isOther: false },
    { id: 1, isOther: true }
  ])

  const degreeOptions = [
    { label: 'Postdoctoral', value: 'postdoctoral' },
    { label: 'PhD', value: 'phd' },
    { label: "Master's", value: 'master' },
    { label: "Bachelor's", value: 'bachelor' },
    { label: 'Associate', value: 'associate' },
    { label: 'High School', value: 'highschool' }
  ]

  return (
    <div>
      <h3 className="mb-6 text-[32px] font-bold leading-[48px]">User Profile</h3>

      <div className="flex flex-col gap-12">
        {/* Warning notice */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🚨</span>
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
              <SelectField placeholder="It cannot be modified after submission" disabled />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <FieldLabel label="Current Residence" />
              <SelectField placeholder="Select Residence" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <FieldLabel label="Birth Year" locked />
              <div className="flex h-[48px] items-center justify-between rounded-lg border border-[rgba(255,255,255,0.12)] px-4">
                <span className="text-sm text-[#606067]">It cannot be modified after submission</span>
                <CalendarOutlined className="text-[#606067]" />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <FieldLabel label="Gender" locked />
              <SelectField placeholder="It cannot be modified after submission" disabled />
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
              <div className="flex items-center gap-2">
                <div className="flex h-[48px] flex-1 items-center justify-between rounded-lg border border-[rgba(255,255,255,0.12)] px-4">
                  <span className="text-sm text-[#606067]">It cannot be modified after submission</span>
                  <DownOutlined className="text-xs text-[#606067]" />
                </div>
                <DeleteBtn />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-[48px] flex-1 items-center justify-between rounded-lg border border-[rgba(255,255,255,0.12)] px-4">
                  <span className="text-sm text-[#606067]">It cannot be modified after submission</span>
                  <DownOutlined className="text-xs text-[#606067]" />
                </div>
                <DeleteBtn />
              </div>
            </div>

            {/* Other Languages */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-white">Other Languages</span>
              {otherLanguages.map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-[240px]">
                    <SelectField placeholder="Select a language" />
                  </div>
                  <div className="flex-1">
                    <SelectField placeholder="Level" />
                  </div>
                  <DeleteBtn />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Education Background */}
        <div className="flex flex-col gap-4">
          <SectionHeader title="Education Background" />
          <div className="flex flex-col gap-4">
            {/* Highest Degree */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-white">Highest Degree</span>
              <SelectField value={highestDegree} onChange={setHighestDegree} options={degreeOptions} />
            </div>

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
            </div>

            {/* University */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-white">University</span>
              <SelectField placeholder="Select University" value={university} onChange={setUniversity} />
            </div>

            {/* Major */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-white">Major</span>
              {majors.map((major) => (
                <div key={major.id} className="flex items-center gap-2">
                  {major.isOther ? (
                    <>
                      <div className="w-[240px]">
                        <SelectField value="other" options={[{ label: 'Other', value: 'other' }]} />
                      </div>
                      <div className="flex h-[48px] flex-1 items-center rounded-lg border border-[rgba(255,255,255,0.12)] px-4">
                        <Input
                          placeholder="Enter Major"
                          variant="borderless"
                          className="!bg-transparent !p-0 !text-white placeholder:!text-[#606067]"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex-1">
                      <SelectField placeholder="Select Major" />
                    </div>
                  )}
                  <DeleteBtn />
                </div>
              ))}
              <button className="flex items-center gap-2 text-sm text-white">
                <PlusOutlined className="text-xs" />
                <span>Add</span>
              </button>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-white">Status</span>
              <SelectField placeholder="Select Status" value={status} onChange={setStatus} />
            </div>
          </div>
        </div>

        {/* Professional Role */}
        <div className="flex flex-col gap-4">
          <SectionHeader title="Professional Role" />
          <div className="flex flex-col gap-2">
            <FieldLabel label="Occupation Area" locked />
            {occupationAreas.map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex-1">
                  <SelectField placeholder="Select occupation area" />
                </div>
                <DeleteBtn />
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button className="h-[48px] w-[240px] !rounded-full !border-none !bg-[#875DFF] !text-sm !font-medium !text-white">
            Save Information
          </Button>
        </div>
      </div>
    </div>
  )
}
