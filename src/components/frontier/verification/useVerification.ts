import { useState } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'

import frontiterApi from '@/apis/frontiter.api'
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
  const navigate = useNavigate()
  const [loading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [phoneCountryCode, setPhoneCountryCode] = useState('+86')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [titlePosition, setTitlePosition] = useState('')
  const [otherTitle, setOtherTitle] = useState('')
  const [institution, setInstitution] = useState('')
  const [major, setMajor] = useState('')
  const [academicEmail, setAcademicEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [academicCredentials, setAcademicCredentials] = useState<UploadedImage[]>([])
  const [cvFiles, setCvFiles] = useState<UploadedImage[]>([])
  const [sendingCode, setSendingCode] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!phoneNumber) newErrors.phoneNumber = 'Please enter phone number'
    if (!titlePosition) newErrors.titlePosition = 'Please select title/position'
    if (titlePosition === 'other' && !otherTitle) newErrors.otherTitle = 'Please specify title/position'
    if (!institution) newErrors.institution = 'Please select institution'
    if (!major) newErrors.major = 'Please select major/research field'
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
    setSendingCode(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      message.success('Verification code sent successfully')
    } catch {
      message.error('Failed to send verification code')
    } finally {
      setSendingCode(false)
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
        otherTitle,
        institution,
        major,
        academicEmail,
        verificationCode,
        academicCredentials: academicCredentials.map((img) => ({ url: img.url, hash: img.hash })),
        cvFiles
      }
    }

    try {
      await frontiterApi.submitTask(taskId!, submitData)
      message.success('Application submitted successfully!')
      setTimeout(() => navigate(-1), 1500)
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
    handleSubmit,
    validateForm
  }
}
