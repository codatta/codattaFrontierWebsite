import { Select, Input } from 'antd'
import PhoneInput from '@/components/common/phone-input'
import { cn } from '@udecode/cn'

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
  titlePositionSpecify: string
  titlePositionYear: string
  institution: string
  institutionSpecify: string
  major: string
  majorSpecify: string
  setPhoneNumber: (value: string) => void
  setTitlePosition: (value: string) => void
  setTitlePositionSpecify: (value: string) => void
  setTitlePositionYear: (value: string) => void
  setInstitution: (value: string) => void
  setInstitutionSpecify: (value: string) => void
  setMajor: (value: string) => void
  setMajorSpecify: (value: string) => void
}

const TITLE_POSITION_OPTIONS: { label: string; value: string; specify?: string }[] = [
  { label: 'Professor / Principal Investigator', value: 'professor' },
  { label: 'Associate Professor / Associate Researcher', value: 'associate_professor' },
  { label: 'Lecturer', value: 'lecturer' },
  { label: 'Postdoctoral Researcher', value: 'postdoctoral_researcher' },
  { label: 'Ph.D. Student', value: 'phd_student', specify: 'Please specify year' },
  { label: 'Other Equivalent Titles', value: 'other', specify: 'Please specify title/position' }
]

const INSTITUTION_OPTIONS: { label: string; value: string; specify?: string }[] = [
  { label: 'Peking University', value: 'peking_university' },
  { label: 'Tsinghua University', value: 'tsinghua_university' },
  { label: 'Institute of High Energy Physics', value: 'institute_of_high_energy_physics' },
  { label: 'Institute of Theoretical Physics', value: 'institute_of_theoretical_physics' },
  { label: 'Shanghai Jiao Tong University', value: 'shanghai_jiao_tong_university' },
  { label: 'Tsung-Dao Lee Institute', value: 'tsung_dao_lee_institute' },
  { label: 'Fudan University', value: 'fudan_university' },
  { label: 'Zhejiang University', value: 'zhejiang_university' },
  { label: 'Beihang University', value: 'beihang_university' },
  { label: 'University of Science and Technology of China', value: 'university_of_science_and_technology_of_china' },
  { label: 'Beijing Normal University', value: 'beijing_normal_university' },
  { label: 'Shandong University', value: 'shandong_university' },
  { label: 'Lanzhou University', value: 'lanzhou_university' },
  { label: 'Nankai University', value: 'nankai_university' },
  { label: 'Sun Yat-sen University', value: 'sun_yat_sen_university' },
  { label: 'Nanjing University', value: 'nanjing_university' },
  { label: 'Huazhong University of Science and Technology', value: 'huazhong_university_of_science_and_technology' },
  { label: 'Wuhan University', value: 'wuhan_university' },
  { label: 'Chongqing University', value: 'chongqing_university' },
  { label: "Xi'an Jiaotong University", value: 'xian_jiaotong_university' },
  { label: 'Northwest University', value: 'northwest_university' },
  { label: 'Sichuan University', value: 'sichuan_university' },
  { label: 'Harbin Institute of Technology', value: 'harbin_institute_of_technology' },
  { label: 'Tianjin University', value: 'tianjin_university' },
  { label: 'Central China Normal University', value: 'central_china_normal_university' },
  { label: 'South China Normal University', value: 'south_china_normal_university' },
  { label: 'Nanjing Normal University', value: 'nanjing_normal_university' },
  { label: 'Zhejiang Normal University', value: 'zhejiang_normal_university' },
  { label: 'Ningbo University', value: 'ningbo_university' },
  { label: 'Fuzhou University', value: 'fuzhou_university' },
  { label: 'Zhengzhou University', value: 'zhengzhou_university' },
  { label: 'Henan Normal University', value: 'henan_normal_university' },
  { label: 'Other QS Top 100 Universities', value: 'other', specify: 'Please specify institution' }
]

const MAJOR_OPTIONS: { label: string; value: string; specify?: string }[] = [
  { label: 'Particle Physics Theory', value: 'particle_physics_theory' },
  { label: 'Quantum Field Theory', value: 'quantum_field_theory' },
  { label: 'Gauge Field Theory', value: 'gauge_field_theory' },
  {
    label: 'Applications of Lie Groups and Lie Algebras in Particle Physics',
    value: 'applications_of_lie_groups_and_lie_algebras_in_particle_physics'
  },
  { label: 'Collider Phenomenology', value: 'collider_phenomenology' },
  {
    label: 'Standard Model of Particle Physics and New Physics',
    value: 'standard_model_of_particle_physics_and_new_physics'
  },
  {
    label: 'Other Related Physics Fields',
    value: 'other',
    specify: 'Please specify field'
  }
]

export default function BasicInformationSection({
  errors,
  phoneNumber,
  titlePosition,
  titlePositionSpecify,
  titlePositionYear,
  institution,
  institutionSpecify,
  major,
  majorSpecify,
  setPhoneNumber,
  setTitlePosition,
  setTitlePositionSpecify,
  setTitlePositionYear,
  setInstitution,
  setInstitutionSpecify,
  setMajor,
  setMajorSpecify
}: BasicInformationSectionProps) {
  const titleSpecifyPlaceholder = TITLE_POSITION_OPTIONS.find((option) => option.value === titlePosition)?.specify
  const institutionSpecifyPlaceholder = INSTITUTION_OPTIONS.find((option) => option.value === institution)?.specify
  const majorSpecifyPlaceholder = MAJOR_OPTIONS.find((option) => option.value === major)?.specify

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
              value={titlePosition || undefined}
              options={TITLE_POSITION_OPTIONS}
              placeholder="Select Title / Position"
              onChange={(value) => setTitlePosition(value as string)}
              className={cn(
                'h-12 w-full transition-all',
                (!!titleSpecifyPlaceholder || titlePosition === 'phd_student') && 'w-[200px]'
              )}
            />
            {titlePosition === 'phd_student' ? (
              <StyledInput
                value={titlePositionYear}
                onChange={(e) => setTitlePositionYear(e.target.value)}
                placeholder="Enter year (0-10)"
                className="h-12 flex-1 transition-all"
                type="number"
                min="0"
                max="10"
              />
            ) : (
              !!titleSpecifyPlaceholder && (
                <StyledInput
                  value={titlePositionSpecify}
                  onChange={(e) => setTitlePositionSpecify(e.target.value)}
                  placeholder={titleSpecifyPlaceholder}
                  className="h-12 flex-1 transition-all"
                />
              )
            )}
          </div>
          {errors.titlePosition && <p className="mt-1 text-sm text-red-500">{errors.titlePosition}</p>}
          {errors.otherTitlePosition && <p className="mt-1 text-sm text-red-500">{errors.otherTitlePosition}</p>}
          {errors.titlePositionYear && <p className="mt-1 text-sm text-red-500">{errors.titlePositionYear}</p>}
        </FormItem>
        <FormItem label="Institution" required>
          <div className="flex gap-2">
            <StyledSelect
              value={institution || undefined}
              onChange={(value) => setInstitution(value as string)}
              options={INSTITUTION_OPTIONS}
              placeholder="Select Institution"
              className={cn('h-12 w-full transition-all', !!institutionSpecifyPlaceholder && 'w-[200px]')}
              showSearch
            />
            {!!institutionSpecifyPlaceholder && (
              <StyledInput
                value={institutionSpecify}
                onChange={(e) => setInstitutionSpecify(e.target.value)}
                placeholder={institutionSpecifyPlaceholder}
                className="h-12 flex-1 transition-all"
              />
            )}
          </div>
          {errors.institution && <p className="mt-1 text-sm text-red-500">{errors.institution}</p>}
          {errors.institutionSpecify && <p className="mt-1 text-sm text-red-500">{errors.institutionSpecify}</p>}
        </FormItem>
        <FormItem label="Major / Research Field" required>
          <div className="flex gap-2">
            <StyledSelect
              value={major || undefined}
              onChange={(value) => setMajor(value as string)}
              options={MAJOR_OPTIONS}
              placeholder="Select Major / Research Field"
              className={cn('h-12 w-full transition-all', !!majorSpecifyPlaceholder && 'w-[200px]')}
              showSearch
            />
            {!!majorSpecifyPlaceholder && (
              <StyledInput
                value={majorSpecify}
                onChange={(e) => setMajorSpecify(e.target.value)}
                placeholder={majorSpecifyPlaceholder}
                className="h-12 flex-1 transition-all"
              />
            )}
          </div>
          {errors.major && <p className="mt-1 text-sm text-red-500">{errors.major}</p>}
          {errors.majorSpecify && <p className="mt-1 text-sm text-red-500">{errors.majorSpecify}</p>}
        </FormItem>
      </div>
    </>
  )
}
