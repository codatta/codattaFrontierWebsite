import { Select, Input } from 'antd'
import PhoneInput from '@/components/common/phone-input'

const FormItem = ({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-white">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
)

const StyledInput = (props: React.ComponentProps<typeof Input>) => (
  <Input {...props} className={`h-11 w-full ${props.className}`} />
)

const StyledSelect = (props: React.ComponentProps<typeof Select>) => (
  <Select {...props} className={`h-11 ${props.className}`} />
)

interface BasicInformationSectionProps {
  errors: Record<string, string>
  phoneNumber: string
  titlePosition: string
  otherTitle: string
  institution: string
  major: string
  titlePositionOptions: { label: string; value: string }[]
  institutionOptions: { label: string; value: string }[]
  majorOptions: { label: string; value: string }[]
  setPhoneNumber: (value: string) => void
  setTitlePosition: (value: string) => void
  setOtherTitle: (value: string) => void
  setInstitution: (value: string) => void
  setMajor: (value: string) => void
}

export default function BasicInformationSection({
  errors,
  phoneNumber,
  titlePosition,
  otherTitle,
  institution,
  major,
  titlePositionOptions,
  institutionOptions,
  majorOptions,
  setPhoneNumber,
  setTitlePosition,
  setOtherTitle,
  setInstitution,
  setMajor
}: BasicInformationSectionProps) {
  return (
    <>
      <h2 className="mb-3 text-base font-semibold text-white">
        Basic Information <span className="text-red-400">*</span>
      </h2>
      <div className="!my-0 space-y-4">
        <FormItem label="Phone Number" required>
          <PhoneInput value={phoneNumber} onChange={setPhoneNumber} />
          {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
        </FormItem>
        <FormItem label="Title / Position" required>
          <div className="flex gap-2">
            <StyledSelect
              value={titlePosition}
              options={titlePositionOptions}
              placeholder="Other Equivalent Titles"
              onChange={(value) => setTitlePosition(value as string)}
              className="h-12 w-[200px]"
            />
            <StyledInput
              value={otherTitle}
              onChange={(e) => setOtherTitle(e.target.value)}
              placeholder="Please specify"
              className="h-12 flex-1"
            />
          </div>
          {errors.titlePosition && <p className="mt-1 text-sm text-red-500">{errors.titlePosition}</p>}
        </FormItem>
        <FormItem label="Institution" required>
          <StyledSelect
            value={institution}
            onChange={(value) => setInstitution(value as string)}
            options={institutionOptions}
            placeholder="Select Institution"
            className="h-12 w-full"
            showSearch
          />
          {errors.institution && <p className="mt-1 text-sm text-red-500">{errors.institution}</p>}
        </FormItem>
        <FormItem label="Major / Research Field" required>
          <StyledSelect
            value={major}
            onChange={(value) => setMajor(value as string)}
            options={majorOptions}
            placeholder="Select Major / Research Field"
            className="h-12 w-full"
            showSearch
          />
          {errors.major && <p className="mt-1 text-sm text-red-500">{errors.major}</p>}
        </FormItem>
      </div>
    </>
  )
}
