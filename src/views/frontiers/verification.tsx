import { Form, Spin } from 'antd'
import { useParams } from 'react-router-dom'

import PageHeader from '@/components/common/frontier-page-header'
import BasicInformationSection from '@/components/frontier/verification/BasicInformationSection'
import IdentityVerificationSection from '@/components/frontier/verification/IdentityVerificationSection'
import CredentialUploadSection from '@/components/frontier/verification/CredentialUploadSection'

import { useVerification } from '@/components/frontier/verification/useVerification'

// Custom styled components to match the design

export default function Verification({ templateId }: { templateId: string }) {
  const [form] = Form.useForm()
  const { taskId } = useParams()

  const {
    loading,
    isSubmitting,
    errors,
    phoneCountryCode,
    phoneNumber,
    titlePosition,
    otherTitle,
    institution,
    major,
    academicEmail,
    verificationCode,
    academicCredentials,
    cvFiles,
    sendingCode,
    setPhoneCountryCode,
    setPhoneNumber,
    setTitlePosition,
    setOtherTitle,
    setInstitution,
    setMajor,
    setAcademicEmail,
    setVerificationCode,
    setAcademicCredentials,
    setCvFiles,
    handleSendVerificationCode,
    handleSubmit
  } = useVerification(taskId, templateId)

  const countryCodeOptions = [
    { label: '🇨🇳 +86', value: '+86' },
    { label: '🇺🇸 +1', value: '+1' }
  ]

  const titlePositionOptions = [
    { label: 'Professor / Principal Investigator', value: 'professor' },
    { label: 'Other Equivalent Titles', value: 'other' }
  ]

  const institutionOptions = [
    { label: 'Massachusetts Institute of Technology', value: 'mit' },
    { label: 'Stanford University', value: 'stanford' }
  ]

  const majorOptions = [
    { label: 'Computer Science', value: 'cs' },
    { label: 'Artificial Intelligence', value: 'ai' }
  ]

  return (
    <Spin spinning={loading || isSubmitting} className="min-h-screen">
      <div className="min-h-screen bg-[#1a1625]">
        <PageHeader title="Verification Application" />
        <div className="mx-auto max-w-[1352px] px-10 pb-12">
          <Form form={form} onFinish={handleSubmit} layout="vertical" className="space-y-8">
            <BasicInformationSection
              errors={errors}
              phoneCountryCode={phoneCountryCode}
              phoneNumber={phoneNumber}
              titlePosition={titlePosition}
              otherTitle={otherTitle}
              institution={institution}
              major={major}
              countryCodeOptions={countryCodeOptions}
              titlePositionOptions={titlePositionOptions}
              institutionOptions={institutionOptions}
              majorOptions={majorOptions}
              setPhoneCountryCode={setPhoneCountryCode}
              setPhoneNumber={setPhoneNumber}
              setTitlePosition={setTitlePosition}
              setOtherTitle={setOtherTitle}
              setInstitution={setInstitution}
              setMajor={setMajor}
            />

            <IdentityVerificationSection
              errors={errors}
              academicEmail={academicEmail}
              verificationCode={verificationCode}
              sendingCode={sendingCode}
              setAcademicEmail={setAcademicEmail}
              setVerificationCode={setVerificationCode}
              handleSendVerificationCode={handleSendVerificationCode}
            />

            <CredentialUploadSection
              academicCredentials={academicCredentials}
              cvFiles={cvFiles}
              errors={errors}
              setAcademicCredentials={setAcademicCredentials}
              setCvFiles={setCvFiles}
            />

            <div className="flex justify-center pt-8">
              <button
                type="submit"
                className="h-10 w-40 rounded-full bg-purple-600 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                Submit
              </button>
            </div>
          </Form>
        </div>
      </div>
    </Spin>
  )
}
