import { Button, Form, Spin } from 'antd'
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
    phoneNumber,
    titlePosition,
    titlePositionSpecify,
    institution,
    institutionSpecify,
    major,
    majorSpecify,
    academicEmail,
    verificationCode,
    academicCredentials,
    cvFiles,
    sendingCode,
    setPhoneNumber,
    setTitlePosition,
    setTitlePositionSpecify,
    setInstitution,
    setInstitutionSpecify,
    setMajor,
    setMajorSpecify,
    setAcademicEmail,
    setVerificationCode,
    setAcademicCredentials,
    setCvFiles,
    handleSendVerificationCode,
    handleSubmit
  } = useVerification(taskId, templateId)

  return (
    <Spin spinning={loading || isSubmitting} className="min-h-screen">
      <div className="min-h-screen bg-[#1a1625]">
        <PageHeader title="Verification Application" />
        <div className="mx-auto max-w-[1352px] px-10 pb-12">
          <Form form={form} onFinish={handleSubmit} layout="vertical" className="space-y-8">
            <BasicInformationSection
              errors={errors}
              phoneNumber={phoneNumber}
              titlePosition={titlePosition}
              titlePositionSpecify={titlePositionSpecify}
              institution={institution}
              institutionSpecify={institutionSpecify}
              major={major}
              majorSpecify={majorSpecify}
              setPhoneNumber={setPhoneNumber}
              setTitlePosition={setTitlePosition}
              setTitlePositionSpecify={setTitlePositionSpecify}
              setInstitution={setInstitution}
              setInstitutionSpecify={setInstitutionSpecify}
              setMajor={setMajor}
              setMajorSpecify={setMajorSpecify}
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

            <Button
              type="primary"
              className="mx-auto block h-10 w-[240px] rounded-full disabled:opacity-50"
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </Spin>
  )
}
