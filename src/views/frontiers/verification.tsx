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
    submissionSuccessful,
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
          {/* Important Notice Banner */}
          <div className="mb-6">
            <div className="rounded-lg border border-orange-400/30 bg-orange-500/10 p-3.5">
              <div className="flex items-center gap-2.5">
                <div className="shrink-0">
                  <svg className="size-4 text-[#FFA800]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed text-[#FFA800]/90">
                    <span className="font-semibold text-[#FFA800]">Notice:</span> You only have one submission
                    opportunity, please fill out carefully.
                  </p>
                </div>
              </div>
            </div>
          </div>
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
              disabled={isSubmitting || submissionSuccessful}
              loading={isSubmitting}
            >
              {submissionSuccessful ? 'Submitted Successfully' : 'Submit'}
            </Button>
          </Form>
        </div>
        {view === 'complete' && <TaskComplete />}
      </div>
    </Spin>
  )
}
