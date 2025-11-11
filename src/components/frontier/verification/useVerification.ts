import { useState } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'

import frontiterApi from '@/apis/frontiter.api'
import userApi from '@/apis/user.api'
import { useCountdown } from '@/hooks/use-countdown'
import { isValidEmail } from '@/utils/str'

export interface UploadedImage {
  url: string
  hash: string
  status?: 'uploading' | 'done' | 'error'
}

export interface FileValue {
  name: string
  path: string
}

export function useVerification(taskId?: string, templateId?: string) {
  const [loading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [phoneCountryCode, setPhoneCountryCode] = useState('+86')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [titlePosition, setTitlePosition] = useState('')
  const [titlePositionSpecify, setTitlePositionSpecify] = useState('')
  const [institution, setInstitution] = useState('')
  const [institutionSpecify, setInstitutionSpecify] = useState('')
  const [major, setMajor] = useState('')
  const [majorSpecify, setMajorSpecify] = useState('')
  const [academicEmail, setAcademicEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [academicCredentials, setAcademicCredentials] = useState<UploadedImage[]>([])
  const [cvFiles, setCvFiles] = useState<UploadedImage[]>([])
  const [sendingCode, setSendingCode] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)

  // 60-second countdown for verification code
  const [countdown, countdownEnded, restartCountdown] = useCountdown(60, null, false)

  // Computed properties for button states
  const canSendCode = !sendingCode && countdownEnded && !!academicEmail && isValidEmail(academicEmail)
  const canVerify = codeSent && verificationCode.trim().length > 0

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!phoneNumber) newErrors.phoneNumber = 'Please enter phone number'
    if (!titlePosition) newErrors.titlePosition = 'Please select title/position'
    if (titlePosition === 'other' && !titlePositionSpecify)
      newErrors.otherTitlePosition = 'Please specify title/position'
    if (!institution) newErrors.institution = 'Please select institution'
    if (institution === 'other' && !institutionSpecify) newErrors.institutionSpecify = 'Please specify institution'
    if (!major) newErrors.major = 'Please select major/research field'
    if (major === 'other' && !majorSpecify) newErrors.majorSpecify = 'Please specify field'
    if (!academicEmail) newErrors.academicEmail = 'Please enter academic email'
    if (!verificationCode) newErrors.verificationCode = 'Please enter verification code'
    if (academicCredentials.length === 0) newErrors.academicCredentials = 'Please upload academic credential'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSendVerificationCode = async () => {
    if (!academicEmail) {
      setErrors((prev) => ({ ...prev, academicEmail: 'Please enter your academic email' }))
      return
    }
    if (!isValidEmail(academicEmail)) {
      setErrors((prev) => ({ ...prev, academicEmail: 'Please enter a valid academic email' }))
      return
    }

    setSendingCode(true)
    try {
      await userApi.getVerificationCode({
        account_type: 'email',
        email: academicEmail,
        opt: 'verify'
      })
      message.success('Verification code sent successfully')
      setCodeSent(true)
      restartCountdown() // Start 60-second countdown
    } catch (error) {
      message.error('Failed to send verification code')
      console.error('Verification code send error:', error)
    } finally {
      setSendingCode(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!taskId) {
      message.error('Task ID is required for verification')
      return
    }
    if (!academicEmail || !verificationCode) {
      message.error('Email and verification code are required')
      return
    }

    try {
      const result = await userApi.checkEmail({
        email: academicEmail,
        code: verificationCode,
        task_id: taskId
      })

      if (result.flag) {
        message.success('Email verified successfully')
        setEmailVerified(true)
        return true
      } else {
        message.error(result.info || 'Verification failed')
        return false
      }
    } catch (error) {
      message.error('Failed to verify email')
      console.error('Email verification error:', error)
      return false
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      message.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    const submitData = {
      taskId,
      templateId,
      data: {
        phoneCountryCode,
        phoneNumber,
        titlePosition,
        titlePositionSpecify,
        institution,
        institutionSpecify,
        major,
        majorSpecify,
        academicEmail,
        verificationCode,
        academicCredentials: academicCredentials.map((img) => ({ url: img.url, hash: img.hash })),
        cvFiles
      }
    }

    try {
      await frontiterApi.submitTask(taskId!, submitData)
      message.success('Application submitted successfully!')
    } catch (error) {
      message.error((error as Error).message || 'Failed to submit application')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    loading,
    isSubmitting,
    errors,
    phoneCountryCode,
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
    codeSent,
    emailVerified,
    countdown,
    countdownEnded,
    canSendCode,
    canVerify,
    setPhoneCountryCode,
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
    handleVerifyCode,
    handleSubmit,
    validateForm
  }
}
