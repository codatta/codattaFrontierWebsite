import { useCallback, useEffect, useState } from 'react'
import { message, Modal } from 'antd'

import userApi from '@/apis/user.api'
import boosterApi from '@/apis/booster.api'
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
  const [pageLoading, setPageLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [view, setView] = useState<'form' | 'complete'>('form')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [phoneCountryCode, setPhoneCountryCodeState] = useState('+86')
  const [phoneNumber, setPhoneNumberState] = useState('')
  const [titlePosition, setTitlePositionState] = useState('')
  const [titlePositionSpecify, setTitlePositionSpecifyState] = useState('')
  const [titlePositionYear, setTitlePositionYearState] = useState('')
  const [institution, setInstitutionState] = useState('')
  const [institutionSpecify, setInstitutionSpecifyState] = useState('')
  const [major, setMajorState] = useState('')
  const [majorSpecify, setMajorSpecifyState] = useState('')
  const [academicEmail, setAcademicEmailState] = useState('')
  const [verificationCode, setVerificationCodeState] = useState('')
  const [academicCredentials, setAcademicCredentialsState] = useState<UploadedImage[]>([])
  const [cvFiles, setCvFilesState] = useState<UploadedImage[]>([])
  const [sendingCode, setSendingCode] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)

  // Helper function to clear field errors when values change
  const clearFieldError = (fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
  }

  // Helper function to remove duplicates based on hash
  const removeDuplicatesByHash = (files: UploadedImage[]): UploadedImage[] => {
    const seen = new Set<string>()
    return files.filter((file) => {
      if (file.hash && seen.has(file.hash)) {
        console.log(`Duplicate file detected and removed: ${file.url} (hash: ${file.hash})`)
        return false
      }
      if (file.hash) {
        seen.add(file.hash)
      }
      return true
    })
  }

  // Enhanced setters that clear errors on value change
  const setPhoneCountryCode = (value: string) => {
    setPhoneCountryCodeState(value)
    clearFieldError('phoneNumber')
  }

  const setPhoneNumber = (value: string) => {
    setPhoneNumberState(value)
    clearFieldError('phoneNumber')

    // Extract and update country code from phone number
    const match = value.match(/^\+(\d+)\s*(.*)$/)
    if (match) {
      const dialCode = match[1]
      setPhoneCountryCodeState(`+${dialCode}`)
    }
  }

  const setTitlePosition = (value: string) => {
    setTitlePositionState(value)
    clearFieldError('titlePosition')
    clearFieldError('otherTitlePosition')
    clearFieldError('titlePositionYear')
  }

  const setTitlePositionSpecify = (value: string) => {
    setTitlePositionSpecifyState(value)
    clearFieldError('otherTitlePosition')
  }

  const setTitlePositionYear = (value: string) => {
    setTitlePositionYearState(value)
    clearFieldError('titlePositionYear')
  }

  const setInstitution = (value: string) => {
    setInstitutionState(value)
    clearFieldError('institution')
    clearFieldError('institutionSpecify')
  }

  const setInstitutionSpecify = (value: string) => {
    setInstitutionSpecifyState(value)
    clearFieldError('institutionSpecify')
  }

  const setMajor = (value: string) => {
    setMajorState(value)
    clearFieldError('major')
    clearFieldError('majorSpecify')
  }

  const setMajorSpecify = (value: string) => {
    setMajorSpecifyState(value)
    clearFieldError('majorSpecify')
  }

  const setAcademicEmail = (value: string) => {
    setAcademicEmailState(value)
    clearFieldError('academicEmail')
    // Reset email verification status when email changes
    setEmailVerified(false)
    setCodeSent(false)
  }

  const setVerificationCode = (value: string) => {
    setVerificationCodeState(value)
    clearFieldError('verificationCode')
  }

  const setAcademicCredentials = (value: UploadedImage[]) => {
    const deduplicatedValue = removeDuplicatesByHash(value)
    setAcademicCredentialsState(deduplicatedValue)
    clearFieldError('academicCredentials')
  }

  const setCvFiles = (value: UploadedImage[]) => {
    const deduplicatedValue = removeDuplicatesByHash(value)
    setCvFilesState(deduplicatedValue)
    clearFieldError('cvFiles')
  }

  // 60-second countdown for verification code
  const [countdown, countdownEnded, restartCountdown] = useCountdown(60, null, false)

  // Computed properties for button states
  const canSendCode = !sendingCode && countdownEnded && !!academicEmail && isValidEmail(academicEmail)
  const canVerify = codeSent && verificationCode.trim().length > 0

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Phone number validation
    if (!phoneNumber) {
      newErrors.phoneNumber = 'Please enter phone number'
    } else if (!/^\+\d+\s*\d{4,15}$/.test(phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid phone number.'
    }

    // Title/Position validation
    if (!titlePosition) {
      newErrors.titlePosition = 'Please select title/position'
    } else if (titlePosition === 'other' && !titlePositionSpecify.trim()) {
      newErrors.otherTitlePosition = 'Please specify your title/position'
    } else if (titlePosition === 'phd_student') {
      if (!titlePositionYear.trim()) {
        newErrors.titlePositionYear = 'Please enter your PhD year'
      } else {
        const year = parseInt(titlePositionYear.trim(), 10)
        if (isNaN(year) || year < 0 || year > 10) {
          newErrors.titlePositionYear = 'Please enter a valid year (0-10)'
        }
      }
    }

    // Institution validation
    if (!institution) {
      newErrors.institution = 'Please select institution'
    } else if (institution === 'other' && !institutionSpecify.trim()) {
      newErrors.institutionSpecify = 'Please specify your institution'
    }

    // Major/Research field validation
    if (!major) {
      newErrors.major = 'Please select major/research field'
    } else if (major === 'other' && !majorSpecify.trim()) {
      newErrors.majorSpecify = 'Please specify your field'
    }

    // Academic email validation
    if (!academicEmail) {
      newErrors.academicEmail = 'Please enter academic email'
    } else if (!isValidEmail(academicEmail)) {
      newErrors.academicEmail = 'Please enter a valid email address'
    } else if (!emailVerified) {
      newErrors.academicEmail = 'Please verify your email address'
    }

    // Academic credentials validation (optional)
    // Academic credentials are now optional, no validation needed

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
        // Clear email-related errors when verification succeeds
        clearFieldError('academicEmail')
        clearFieldError('verificationCode')
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
    // Validate all form fields (this will set errors internally)
    const isValid = validateForm()

    if (!isValid) {
      message.error('Please correct the errors and fill in all required fields')
      return
    }

    // Additional pre-submission checks
    if (!taskId) {
      message.error('Task ID is missing. Please refresh the page and try again.')
      return
    }

    if (!emailVerified) {
      message.error('Please verify your email address before submitting')
      setErrors((prev) => ({ ...prev, academicEmail: 'Email verification required' }))
      return
    }

    setIsSubmitting(true)

    try {
      // Format and clean data before submission
      const cleanPhoneNumber = phoneNumber.trim()
      const formattedCredentials = academicCredentials
        .filter((cred) => cred.url && cred.hash)
        .map((cred) => ({
          url: cred.url,
          hash: cred.hash
        }))

      const formattedCvFiles = cvFiles
        .filter((file) => file.url && file.hash)
        .map((file) => ({
          url: file.url,
          hash: file.hash
        }))

      const submitData = {
        phoneCountryCode: phoneCountryCode || '+86',
        phoneNumber: cleanPhoneNumber,
        titlePosition: titlePosition,
        titlePositionSpecify: titlePosition === 'other' ? titlePositionSpecify.trim() : '',
        titlePositionYear: titlePosition === 'phd_student' ? titlePositionYear.trim() : '',
        institution: institution,
        institutionSpecify: institution === 'other' ? institutionSpecify.trim() : '',
        major: major,
        majorSpecify: major === 'other' ? majorSpecify.trim() : '',
        academicEmail: academicEmail.toLowerCase().trim(),
        academicCredentials: formattedCredentials,
        cvFiles: formattedCvFiles
      }

      console.log('Submitting verification data:', submitData)
      const res = await boosterApi.submitSpecTask(taskId, JSON.stringify(submitData), 1)

      if (res.data?.status === 1) {
        message.success('Submit successfully!')
      } else {
        message.error(res.data?.info || 'Failed to submit!')
      }
    } catch (error) {
      console.error('Submission error:', error)
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (error as Error)?.message ||
        'Failed to submit. Please try again.'
      message.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const checkTaskStatus = useCallback(async () => {
    if (!taskId || !templateId) {
      message.error('Task ID or template ID is required!')
      return
    }

    setPageLoading(true)

    try {
      const taskInfo = await boosterApi.getSpecTaskInfo(taskId!)
      if (taskInfo.data?.status) {
        setView('complete')
      }
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: error.message ? error.message : 'Failed to get task detail!',
        okText: 'Try Again',
        className: '[&_.ant-btn]:!bg-[#875DFF]',
        onOk: () => {
          checkTaskStatus()
        }
      })
    } finally {
      setPageLoading(false)
    }
  }, [taskId, templateId])

  useEffect(() => {
    checkTaskStatus()
  }, [checkTaskStatus])

  return {
    pageLoading,
    isSubmitting,
    view,
    errors,
    phoneCountryCode,
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
    setPhoneCountryCode,
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
    handleSubmit,
    validateForm
  }
}
