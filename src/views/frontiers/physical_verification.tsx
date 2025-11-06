import { useState } from 'react'
import { Form, Input, Button, message, Spin, Select } from 'antd'
import { Upload } from 'lucide-react'
import { useParams } from 'react-router-dom'

import UploadImg from '@/components/frontier/airdrop/UploadImg'
import FileUpload from '@/components/common/file-upload'
import frontiterApi from '@/apis/frontiter.api'

interface UploadedImage {
  url: string
  hash: string
  status?: 'uploading' | 'done' | 'error'
}

interface FileValue {
  name: string
  path: string
}

export default function PhysicalVerification({ templateId }: { templateId: string }) {
  const [form] = Form.useForm()
  const { taskId } = useParams()
  const [loading, setLoading] = useState(false)
  const [phoneCountryCode, setPhoneCountryCode] = useState('+86')
  const [titlePosition, setTitlePosition] = useState<string>('')
  const [phdYear, setPhdYear] = useState<string>('')
  const [otherTitle, setOtherTitle] = useState<string>('')
  const [institution, setInstitution] = useState<string>('')
  const [major, setMajor] = useState<string>('')
  const [academicEmail, setAcademicEmail] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [academicCredentials, setAcademicCredentials] = useState<UploadedImage[]>([])
  const [cvFiles, setCvFiles] = useState<FileValue[]>([])
  const [sendingCode, setSendingCode] = useState(false)

  const handleCvFilesChange = (files: FileValue[]) => {
    setCvFiles(files)
  }

  const countryCodeOptions = [
    { label: '🇨🇳 +86', value: '+86' },
    { label: '🇺🇸 +1', value: '+1' },
    { label: '🇬🇧 +44', value: '+44' },
    { label: '🇯🇵 +81', value: '+81' },
    { label: '🇰🇷 +82', value: '+82' },
    { label: '🇸🇬 +65', value: '+65' },
    { label: '🇭🇰 +852', value: '+852' }
  ]

  const titlePositionOptions = [
    { label: 'Professor / Principal Investigator', value: 'professor' },
    { label: 'Associate Professor / Associate Researcher', value: 'associate_professor' },
    { label: 'Lecturer', value: 'lecturer' },
    { label: 'Postdoctoral Researcher', value: 'postdoc' },
    { label: 'Ph.D. Student', value: 'phd_student' },
    { label: 'Other Equivalent Titles', value: 'other' }
  ]

  const phdYearOptions = Array.from({ length: 10 }, (_, i) => ({
    label: `Year ${i + 1}`,
    value: `year_${i + 1}`
  }))

  // Mock institution options - replace with actual data
  const institutionOptions = [
    { label: 'Massachusetts Institute of Technology', value: 'mit' },
    { label: 'Stanford University', value: 'stanford' },
    { label: 'Harvard University', value: 'harvard' },
    { label: 'University of Cambridge', value: 'cambridge' },
    { label: 'University of Oxford', value: 'oxford' },
    { label: 'Tsinghua University', value: 'tsinghua' },
    { label: 'Peking University', value: 'pku' }
  ]

  // Mock major options - replace with actual data (currently unused, for future implementation)
  // const majorOptions = [
  //   { label: 'Computer Science', value: 'cs' },
  //   { label: 'Artificial Intelligence', value: 'ai' },
  //   { label: 'Data Science', value: 'ds' },
  //   { label: 'Mathematics', value: 'math' },
  //   { label: 'Physics', value: 'physics' },
  //   { label: 'Biology', value: 'biology' },
  //   { label: 'Chemistry', value: 'chemistry' }
  // ]

  const handleSendVerificationCode = async () => {
    if (!academicEmail) {
      message.error('Please enter your academic email')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(academicEmail)) {
      message.error('Please enter a valid email address')
      return
    }

    setSendingCode(true)
    try {
      // TODO: Replace with actual API call
      // await api.sendVerificationCode(academicEmail)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      message.success('Verification code sent successfully')
    } catch {
      message.error('Failed to send verification code')
    } finally {
      setSendingCode(false)
    }
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()

      if (!academicEmail) {
        message.error('Please enter your academic email')
        return
      }

      if (!verificationCode) {
        message.error('Please enter verification code')
        return
      }

      if (academicCredentials.length === 0) {
        message.error('Please upload academic credential')
        return
      }

      setLoading(true)

      const submitData = {
        taskId,
        templateId,
        data: {
          phoneCountryCode,
          phoneNumber: form.getFieldValue('phoneNumber'),
          titlePosition,
          phdYear: titlePosition === 'phd_student' ? phdYear : undefined,
          otherTitle: titlePosition === 'other' ? otherTitle : undefined,
          institution,
          major,
          academicEmail,
          verificationCode,
          academicCredentials: academicCredentials.map((img) => ({
            url: img.url,
            hash: img.hash
          })),
          cvFiles
        }
      }

      await frontiterApi.submitTask(taskId!, submitData)
      message.success('Application submitted successfully!')

      // Redirect or show success modal
      setTimeout(() => {
        window.history.back()
      }, 1500)
    } catch (error) {
      message.error((error as Error).message || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Spin spinning={loading}>
      <div className="min-h-screen bg-gradient-to-br from-[#4A3F8F] via-[#6B5BAD] to-[#8B6FC9] py-8">
        <div className="mx-auto max-w-[600px] px-4">
          {/* Header */}
          <div className="mb-6 text-center text-white">
            <h1 className="text-2xl font-bold">Verification Application</h1>
            <p className="mt-2 text-sm opacity-90">
              Please fill in the following information to complete identity verification
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <Form form={form} layout="vertical">
              {/* Basic Information Section */}
              <div className="mb-6">
                <h2 className="mb-4 flex items-center text-base font-semibold text-gray-800">
                  <div className="mr-2 h-5 w-1 bg-[#6B5BAD]"></div>
                  Basic Information
                </h2>

                {/* Phone Number */}
                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </span>
                  }
                  name="phoneNumber"
                  rules={[{ required: true, message: 'Please enter phone number' }]}
                >
                  <div className="flex gap-2">
                    <Select
                      options={countryCodeOptions}
                      value={phoneCountryCode}
                      onChange={(value) => setPhoneCountryCode(value)}
                      placeholder="Select Region"
                      className="w-32"
                      size="large"
                    />
                    <Input placeholder="Please enter your phone number" className="flex-1" size="large" />
                  </div>
                </Form.Item>

                {/* Title/Position */}
                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700">
                      Title / Position <span className="text-red-500">*</span>
                    </span>
                  }
                  required
                >
                  <Select
                    options={titlePositionOptions}
                    value={titlePosition}
                    onChange={(value) => {
                      setTitlePosition(value)
                      if (value !== 'phd_student') setPhdYear('')
                      if (value !== 'other') setOtherTitle('')
                    }}
                    placeholder="Professor / Principal Investigator"
                    className="w-full"
                    size="large"
                  />

                  {titlePosition === 'phd_student' && (
                    <Select
                      options={phdYearOptions}
                      value={phdYear}
                      onChange={(value) => setPhdYear(value)}
                      placeholder="Please specify year"
                      className="mt-2 w-full"
                      size="large"
                    />
                  )}

                  {titlePosition === 'other' && (
                    <Input
                      placeholder="Please specify"
                      className="mt-2"
                      size="large"
                      value={otherTitle}
                      onChange={(e) => setOtherTitle(e.target.value)}
                    />
                  )}
                </Form.Item>

                {/* Institution */}
                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700">
                      Institution <span className="text-red-500">*</span>
                    </span>
                  }
                  required
                >
                  <Select
                    options={institutionOptions}
                    value={institution}
                    onChange={(value) => setInstitution(value)}
                    placeholder="Please select institution"
                    className="w-full"
                    size="large"
                    showSearch
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  />
                  <p className="mt-1 text-xs text-gray-500">See Appendix 1</p>
                </Form.Item>

                {/* Major/Research Field */}
                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700">
                      Major / Research Field <span className="text-red-500">*</span>
                    </span>
                  }
                  required
                >
                  <Input
                    placeholder="e.g., Computer Science and Technology"
                    size="large"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                  />
                </Form.Item>
              </div>

              {/* Identity Verification Section */}
              <div className="mb-6">
                <h2 className="mb-4 flex items-center text-base font-semibold text-gray-800">
                  <div className="mr-2 h-5 w-1 bg-[#6B5BAD]"></div>
                  Identity Verification
                </h2>

                {/* Academic Email */}
                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700">
                      Academic Email <span className="text-red-500">*</span>
                    </span>
                  }
                  required
                >
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., username@university.edu"
                      size="large"
                      className="flex-1"
                      value={academicEmail}
                      onChange={(e) => setAcademicEmail(e.target.value)}
                    />
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleSendVerificationCode}
                      loading={sendingCode}
                      className="bg-[#6B5BAD] hover:bg-[#5A4B9D]"
                    >
                      Send Code
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Automatic verification code sent upon email entry</p>
                </Form.Item>

                {/* Verification Code */}
                {academicEmail && (
                  <Form.Item
                    label={
                      <span className="text-sm font-medium text-gray-700">
                        Verification Code <span className="text-red-500">*</span>
                      </span>
                    }
                    required
                  >
                    <Input
                      placeholder="Please enter verification code"
                      size="large"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                  </Form.Item>
                )}

                {/* Academic Credential Upload */}
                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700">
                      Academic Credential <span className="text-red-500">*</span>
                    </span>
                  }
                  required
                >
                  <UploadImg
                    value={academicCredentials}
                    onChange={setAcademicCredentials}
                    maxCount={1}
                    description="Click to upload or drag and drop"
                  />
                  <p className="mt-2 text-xs text-gray-500">Supports image upload (one file sufficient)</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Note: Any document type acceptable (student ID, degree certificate, CHSI verification, etc.). Name
                    and photo may be redacted.
                  </p>
                </Form.Item>

                {/* CV Upload (Optional) */}
                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700">
                      CV Upload <span className="text-gray-400">(Optional)</span>
                    </span>
                  }
                >
                  <FileUpload
                    value={cvFiles}
                    // @ts-expect-error - FileUpload component has type intersection issue
                    onChange={handleCvFilesChange}
                    maxCount={1}
                    accept=".pdf,.doc,.docx,image/*"
                  >
                    <div className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-[#6B5BAD] hover:bg-gray-100">
                      <Upload className="mb-2 size-8 text-gray-400" />
                      <p className="text-sm text-gray-600">Click to upload CV or PDF file</p>
                      <p className="mt-1 text-xs text-gray-400">Supports PDF, Image upload</p>
                    </div>
                  </FileUpload>
                </Form.Item>
              </div>

              {/* Submit Button */}
              <Button
                type="primary"
                size="large"
                block
                onClick={handleSubmit}
                loading={loading}
                className="h-12 bg-gradient-to-r from-[#6B5BAD] to-[#8B6FC9] text-base font-semibold hover:from-[#5A4B9D] hover:to-[#7A5FB9]"
              >
                Submit Application
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </Spin>
  )
}
