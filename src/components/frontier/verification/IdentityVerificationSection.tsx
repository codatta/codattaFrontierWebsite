import { Button, Input } from 'antd'

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

interface IdentityVerificationSectionProps {
  errors: Record<string, string>
  academicEmail: string
  verificationCode: string
  sendingCode: boolean
  setAcademicEmail: (value: string) => void
  setVerificationCode: (value: string) => void
  handleSendVerificationCode: () => void
}

export default function IdentityVerificationSection({
  errors,
  academicEmail,
  verificationCode,
  sendingCode,
  setAcademicEmail,
  setVerificationCode,
  handleSendVerificationCode
}: IdentityVerificationSectionProps) {
  return (
    <>
      <h2 className="mt-12 text-base font-semibold text-white">Identity Verification *</h2>
      <div className="!mt-3 space-y-4 rounded-2xl border border-[#00000029] bg-[#252532] p-6">
        <FormItem label="Academic Email" required>
          <div className="flex gap-2">
            <StyledInput
              value={academicEmail}
              onChange={(e) => setAcademicEmail(e.target.value)}
              placeholder="Provide your Email"
              className="!h-12 flex-1"
              suffix={
                <span
                  className="cursor-pointer text-sm font-semibold text-[#875DFF]"
                  onClick={handleSendVerificationCode}
                >
                  Send Code
                </span>
              }
            />
          </div>
          {errors.academicEmail && <p className="mt-1 text-sm text-red-500">{errors.academicEmail}</p>}
        </FormItem>
        <FormItem label="Verification Code" required>
          <div className="flex gap-4">
            <StyledInput
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter Code"
              maxLength={6}
              className="!h-12 flex-1"
            />
            <Button type="primary" className="box-border h-12 w-[100px] text-sm" size="middle">
              Verify
            </Button>
          </div>
          {errors.verificationCode && <p className="mt-1 text-sm text-red-500">{errors.verificationCode}</p>}
        </FormItem>
      </div>
    </>
  )
}
