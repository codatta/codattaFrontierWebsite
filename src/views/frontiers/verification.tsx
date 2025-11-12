import { Button, Form, Spin } from 'antd'
import { useParams } from 'react-router-dom'

import PageHeader from '@/components/common/frontier-page-header'
import BasicInformationSection from '@/components/frontier/verification/basic-information-section'
import IdentityVerificationSection from '@/components/frontier/verification/identity-verification-section'
import CredentialUploadSection from '@/components/frontier/verification/credential-upload-section'
import TaskComplete from '@/components/frontier/verification/task-complete'

import { useVerification } from '@/components/frontier/verification/use-verification'

// Custom styled components to match the design

export default function Verification({ templateId }: { templateId: string }) {
  const [form] = Form.useForm()
  const { questId } = useParams()

  const {
    pageLoading,
    view,
    isSubmitting,
    errors,
    phoneNumber,
    titlePosition,
    titlePositionSpecify,
    titlePositionYear,
    institution,
    institutionSpecify,
    major,
    majorSpecify,
    academicEmail,
    verificationCode,
    academicCredentials,
    cvFiles,
    sendingCode,
    codeSent,
    emailVerified,
    countdown,
    countdownEnded,
    canSendCode,
    canVerify,
    setPhoneNumber,
    setTitlePosition,
    setTitlePositionSpecify,
    setTitlePositionYear,
    setInstitution,
    setInstitutionSpecify,
    setMajor,
    setMajorSpecify,
    setAcademicEmail,
    setVerificationCode,
    setAcademicCredentials,
    setCvFiles,
    handleSendVerificationCode,
    handleVerifyCode,
    handleSubmit
  } = useVerification(questId, templateId)

  return (
    <Spin spinning={pageLoading || isSubmitting} className="min-h-screen">
      <div className="min-h-screen bg-[#1a1625]">
        <PageHeader title="Verification Application" />
        <div className="mx-auto max-w-[1352px] px-10 pb-12">
          <Form form={form} onFinish={handleSubmit} layout="vertical" className="space-y-8">
            <BasicInformationSection
              errors={errors}
              phoneNumber={phoneNumber}
              titlePosition={titlePosition}
              titlePositionSpecify={titlePositionSpecify}
              titlePositionYear={titlePositionYear}
              institution={institution}
              institutionSpecify={institutionSpecify}
              major={major}
              majorSpecify={majorSpecify}
              setPhoneNumber={setPhoneNumber}
              setTitlePosition={setTitlePosition}
              setTitlePositionSpecify={setTitlePositionSpecify}
              setTitlePositionYear={setTitlePositionYear}
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
              codeSent={codeSent}
              emailVerified={emailVerified}
              countdown={countdown}
              countdownEnded={countdownEnded}
              canSendCode={canSendCode}
              canVerify={canVerify}
              setAcademicEmail={setAcademicEmail}
              setVerificationCode={setVerificationCode}
              handleSendVerificationCode={handleSendVerificationCode}
              handleVerifyCode={handleVerifyCode}
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
              htmlType="submit"
              className="mx-auto block h-10 w-[240px] rounded-full disabled:opacity-50"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Submit
            </Button>
          </Form>
        </div>
        {view === 'complete' && <TaskComplete />}
      </div>
    </Spin>
  )
}
