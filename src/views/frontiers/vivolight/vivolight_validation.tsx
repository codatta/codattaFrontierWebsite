import { useEffect, useRef, useState, useCallback } from 'react'
import { message, Input, Select } from 'antd'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import FrontierPageHeader from '@/components/common/frontier-page-header'
import boosterApi from '@/apis/booster.api'
import frontiterApi from '@/apis/frontiter.api'
import { Loader2 } from 'lucide-react'
import PendingIcon from '@/assets/images/task-pending.svg'
import ApprovedIcon from '@/assets/images/task-approved.svg'
import RejectedIcon from '@/assets/images/task-reject.svg'

const { Option } = Select

interface CountryIndex {
  name: string
  iso3: string
  emoji: string
}

type Point = [number, number]

interface Shape {
  label: string
  points: Point[]
  group_id: null | string
  shape_type: string
  flags: Record<string, unknown>
}

interface AnnotationData {
  version: string
  flags: Record<string, unknown>
  shapes: Shape[]
  imagePath: string
  imageData: string
  imageHeight: number
  imageWidth: number
}

interface ValidationAnswer {
  label: string
  answer: boolean | null
}

interface SignupFormData {
  doctorName: string
  hospital: string
  hospitalLevel: string
  title: string
  pciSurgeryVolume: string
  surgeryExperience: string
  countryRegion: string
}

interface FormErrors {
  doctorName?: string
  hospital?: string
  hospitalLevel?: string
  title?: string
  pciSurgeryVolume?: string
  surgeryExperience?: string
  countryRegion?: string
}

const SIGNUP_TASK_ID = 'vivolight-signup'

export default function VIVOLIGHT_VALIDATION({ templateId }: { templateId: string }) {
  const { taskId } = useParams()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const [annotationData, setAnnotationData] = useState<AnnotationData | null>(null)
  const [answers, setAnswers] = useState<ValidationAnswer[]>([])
  const [showShape, setShowShape] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null)
  const [reason, setReason] = useState('')
  const [isLoadingTask, setIsLoadingTask] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dataSource, setDataSource] = useState<string>('')

  // Submission status
  const [submissionStatus, setSubmissionStatus] = useState<'PENDING' | 'ADOPT' | 'REFUSED' | null>(null)
  const [lastSubmissionData, setLastSubmissionData] = useState<{
    data_source?: string
    shape_label: string
    answer: boolean
    reason: string | null
    timestamp: number
  } | null>(null)

  // Signup related states
  const [hasSignedUp, setHasSignedUp] = useState(false)
  const [_isCheckingSignup, setIsCheckingSignup] = useState(true)
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [countries, setCountries] = useState<CountryIndex[]>([])
  const [loadingCountries, setLoadingCountries] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<SignupFormData>({
    doctorName: '',
    hospital: '',
    hospitalLevel: '',
    title: '',
    pciSurgeryVolume: '',
    surgeryExperience: '',
    countryRegion: ''
  })

  // Step 1: Check if task has been submitted
  const checkTaskLastSubmission = useCallback(async () => {
    if (!taskId) return false

    try {
      const lastSubmission = await frontiterApi.getLastSubmission('', taskId)
      if (lastSubmission && lastSubmission.status) {
        const status = lastSubmission.status.toUpperCase()
        if (status === 'PENDING' || status === 'SUBMITTED') {
          setSubmissionStatus('PENDING')
        } else if (status === 'ADOPT') {
          setSubmissionStatus('ADOPT')
        } else if (status === 'REFUSED') {
          setSubmissionStatus('REFUSED')
        }

        // Save the submitted data
        if (lastSubmission.data_submission?.data) {
          setLastSubmissionData(
            lastSubmission.data_submission.data as {
              data_source?: string
              shape_label: string
              answer: boolean
              reason: string | null
              timestamp: number
            }
          )
        }

        return true // Has submission
      }
    } catch {
      console.log('No previous submission found')
    }
    return false // No submission
  }, [taskId])

  // Step 2: Check if doctor has signed up
  const checkDoctorSignup = useCallback(async () => {
    try {
      setIsCheckingSignup(true)
      const response = await boosterApi.getSpecTaskInfos(SIGNUP_TASK_ID)

      if (response.data && response.data.length > 0) {
        const taskInfo = response.data[0]
        // status === 2 means completed
        if (taskInfo.status === 2) {
          setHasSignedUp(true)
          return true
        }
      }
    } catch (error) {
      console.error('Failed to check signup status:', error)
    } finally {
      setIsCheckingSignup(false)
    }
    return false
  }, [])

  // Fetch countries for signup form
  const fetchCountries = useCallback(async () => {
    setLoadingCountries(true)
    try {
      const response = await axios.get<CountryIndex[]>('https://static.codatta.io/location/index.json')
      setCountries(response.data)
    } catch {
      message.error('Failed to load countries')
    } finally {
      setLoadingCountries(false)
    }
  }, [])

  // Step 3: Get task detail and load annotation data
  const getTaskDetailAndLoadData = useCallback(async () => {
    if (!taskId || !templateId) {
      message.error('Task ID or template ID is required!')
      return
    }

    setIsLoadingTask(true)

    try {
      const taskDetail = await frontiterApi.getTaskDetail(taskId)

      if (taskDetail.data.data_display.template_id !== templateId) {
        message.error('Template not match!')
        return
      }

      const dataSourceUrl = taskDetail.data.data_display.data_source

      if (!dataSourceUrl) {
        message.error('No data source URL found in task detail')
        return
      }

      // Save data source
      setDataSource(dataSourceUrl)

      // Fetch annotation data from URL
      const response = await axios.get<AnnotationData>(dataSourceUrl)
      setAnnotationData(response.data)
      setAnswers(response.data.shapes.map((shape) => ({ label: shape.label, answer: null })))
    } catch (err) {
      console.error('Failed to load task data:', err)
      message.error('Failed to load task data')
    } finally {
      setIsLoadingTask(false)
    }
  }, [taskId, templateId])

  // Main initialization flow
  useEffect(() => {
    const initializeTask = async () => {
      if (!taskId || !templateId) return

      // Step 1: Check if task has been submitted
      const hasSubmission = await checkTaskLastSubmission()
      if (hasSubmission) {
        setIsLoadingTask(false)
        setIsCheckingSignup(false) // Also stop checking signup
        return // Stop here if already submitted
      }

      // Step 2: Check if doctor has signed up
      const isSignedUp = await checkDoctorSignup()

      if (!isSignedUp) {
        // If not signed up, fetch countries for the signup form
        await fetchCountries()
        setIsLoadingTask(false)
        return // Stop here, show signup form
      }

      // Step 3: Load task detail and annotation data
      await getTaskDetailAndLoadData()
    }

    initializeTask()
  }, [taskId, templateId, checkTaskLastSubmission, checkDoctorSignup, fetchCountries, getTaskDetailAndLoadData])

  // Load image once
  useEffect(() => {
    if (!annotationData) return

    const img = new Image()
    img.onload = () => {
      imageRef.current = img
      setImageLoaded(true)
    }

    if (annotationData.imageData && annotationData.imageData.trim() !== '') {
      img.src = annotationData.imageData.startsWith('data:')
        ? annotationData.imageData
        : `data:image/jpeg;base64,${annotationData.imageData}`
    } else {
      setImageLoaded(true)
    }
  }, [annotationData])

  // Redraw canvas when shape visibility changes
  useEffect(() => {
    if (!annotationData || !canvasRef.current || !imageLoaded) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = annotationData.imageWidth
    canvas.height = annotationData.imageHeight

    // Draw image or placeholder
    if (imageRef.current) {
      ctx.drawImage(imageRef.current, 0, 0)
    } else {
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = '#ccc'
      ctx.strokeRect(0, 0, canvas.width, canvas.height)
    }

    // Draw first shape if visible
    if (showShape && annotationData.shapes.length > 0) {
      const shape = annotationData.shapes[0]
      drawShape(ctx, shape, 0)
    }
  }, [annotationData, showShape, imageLoaded])

  const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape, index: number) => {
    if (shape.points.length === 0) return

    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']
    const color = colors[index % colors.length]

    ctx.beginPath()
    ctx.moveTo(shape.points[0][0], shape.points[0][1])

    for (let i = 1; i < shape.points.length; i++) {
      ctx.lineTo(shape.points[i][0], shape.points[i][1])
    }

    ctx.closePath()

    ctx.fillStyle = color + '40'
    ctx.fill()

    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = color
    ctx.font = 'bold 16px Arial'
    ctx.fillText(shape.label, shape.points[0][0], shape.points[0][1] - 5)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Doctor Name validation
    if (!formData.doctorName.trim()) {
      newErrors.doctorName = 'Doctor name is required'
    } else if (formData.doctorName.trim().length < 2) {
      newErrors.doctorName = 'Doctor name must be at least 2 characters'
    } else if (formData.doctorName.trim().length > 50) {
      newErrors.doctorName = 'Doctor name must not exceed 50 characters'
    }

    // Hospital validation
    if (!formData.hospital.trim()) {
      newErrors.hospital = 'Hospital name is required'
    } else if (formData.hospital.trim().length < 2) {
      newErrors.hospital = 'Hospital name must be at least 2 characters'
    } else if (formData.hospital.trim().length > 100) {
      newErrors.hospital = 'Hospital name must not exceed 100 characters'
    }

    // Hospital Level validation
    if (!formData.hospitalLevel.trim()) {
      newErrors.hospitalLevel = 'Hospital level is required'
    }

    // Professional Title validation
    if (!formData.title) {
      newErrors.title = 'Professional title is required'
    }

    // PCI Surgery Volume validation (accepts number or range like "50-100")
    if (!formData.pciSurgeryVolume.trim()) {
      newErrors.pciSurgeryVolume = 'Annual PCI surgery volume is required'
    } else {
      const volumePattern = /^(\d+(-\d+)?|\d+\+?)$/
      if (!volumePattern.test(formData.pciSurgeryVolume.trim())) {
        newErrors.pciSurgeryVolume = 'Please enter a valid number or range (e.g., 50, 50-100, 100+)'
      }
    }

    // Surgery Experience validation (must be a number)
    if (!formData.surgeryExperience.trim()) {
      newErrors.surgeryExperience = 'Years of surgical experience is required'
    } else {
      const yearsPattern = /^\d+(\.\d+)?$/
      if (!yearsPattern.test(formData.surgeryExperience.trim())) {
        newErrors.surgeryExperience = 'Please enter a valid number (e.g., 5, 10, 5.5)'
      } else {
        const years = parseFloat(formData.surgeryExperience.trim())
        if (years < 0) {
          newErrors.surgeryExperience = 'Years cannot be negative'
        } else if (years > 60) {
          newErrors.surgeryExperience = 'Please enter a reasonable number of years'
        }
      }
    }

    // Country/Region validation
    if (!formData.countryRegion) {
      newErrors.countryRegion = 'Country/Region is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      message.error('Please fill in all required fields correctly.')
      return
    }

    try {
      setIsSubmittingForm(true)
      const content = JSON.stringify(formData)
      await boosterApi.submitSpecTask(SIGNUP_TASK_ID, content, 2)

      message.success('Registration successful!')
      setHasSignedUp(true)
      // After signup, load task detail and data
      await getTaskDetailAndLoadData()
    } catch (error) {
      console.error('Failed to submit form:', error)
      message.error('Failed to submit registration')
    } finally {
      setIsSubmittingForm(false)
    }
  }

  const handleValidationSubmit = async () => {
    if (selectedAnswer === null || !taskId || !annotationData) return

    setIsSubmitting(true)

    try {
      // Prepare submission data with standard structure
      const submissionData = {
        taskId,
        templateId,
        data: {
          data_source: dataSource,
          shape_label: annotationData.shapes[0].label,
          answer: selectedAnswer,
          reason: reason.trim() || null,
          timestamp: Date.now()
        }
      }

      await frontiterApi.submitTask(taskId, submissionData)

      message.success('Validation submitted successfully!')

      // Update local state
      const newAnswers = [...answers]
      newAnswers[0].answer = selectedAnswer
      setAnswers(newAnswers)

      // Set submission status to PENDING
      setSubmissionStatus('PENDING')
    } catch (error) {
      console.error('Submission error:', error)
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (error as Error)?.message ||
        'Failed to submit validation. Please try again.'
      message.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state
  if (isLoadingTask) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FrontierPageHeader title="Image Annotation Validation" />
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 flex items-center gap-2 text-lg text-gray-600">
              <Loader2 className="size-6 animate-spin" />
              <span>Loading</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If task has been submitted, show submission status
  if (submissionStatus) {
    const getStatusConfig = () => {
      switch (submissionStatus) {
        case 'ADOPT':
          return {
            title: 'Submission approved!',
            description:
              'Thank you for your data annotation. Your submission will help us improve our data quality and services.',
            icon: ApprovedIcon
          }
        case 'PENDING':
          return {
            title: 'Under Review',
            description: "We're processing your submission. Please check back later for an update.",
            icon: PendingIcon
          }
        case 'REFUSED':
          return {
            title: 'Audit Failed',
            description:
              'Unfortunately, your submission did not pass our audit. Please review the requirements and resubmit.',
            icon: RejectedIcon
          }
      }
    }

    const statusConfig = getStatusConfig()

    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Status Card */}
          <div className="rounded-2xl">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className={`rounded-full p-8`}>
                <img src={statusConfig.icon}></img>
              </div>
            </div>

            {/* Title */}
            <h2 className="mb-4 text-center text-3xl font-bold text-white">{statusConfig.title}</h2>

            {/* Description */}
            <p className="mb-8 text-center text-base leading-relaxed text-gray-300">{statusConfig.description}</p>

            {/* Submitted Data Details */}
            {lastSubmissionData && (
              <div className="mt-6 rounded-xl bg-black/30 p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">Submission Details</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start justify-between">
                    <span className="text-gray-400">Lesion Type:</span>
                    <span className="font-medium text-white">{lastSubmissionData.shape_label}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-gray-400">Your Answer:</span>
                    <span className={`font-semibold ${lastSubmissionData.answer ? 'text-green-400' : 'text-red-400'}`}>
                      {lastSubmissionData.answer ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {lastSubmissionData.reason && (
                    <div className="flex flex-col gap-2">
                      <span className="text-gray-400">Reason:</span>
                      <p className="rounded bg-black/40 p-3 text-gray-300">{lastSubmissionData.reason}</p>
                    </div>
                  )}
                  <div className="flex items-start justify-between border-t border-white/5 pt-4">
                    <span className="text-gray-400">Submitted At:</span>
                    <span className="text-gray-300">{new Date(lastSubmissionData.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Show signup form if user hasn't signed up
  if (!hasSignedUp) {
    return (
      <div className="min-h-screen">
        <FrontierPageHeader title="Doctor Registration" />
        <div className="mx-auto max-w-3xl px-6 py-8">
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-2xl font-semibold">Please complete your registration</h2>
            <p className="text-sm text-gray-400">
              Before you can start validation tasks, please provide your information.
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Doctor Name */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Doctor Name<span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                value={formData.doctorName}
                onChange={(e) => {
                  setFormData({ ...formData, doctorName: e.target.value })
                  if (errors.doctorName) setErrors({ ...errors, doctorName: undefined })
                }}
                placeholder="Enter your name"
                className="w-full rounded-lg bg-white/5 px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:border-primary focus:outline-none"
                size="large"
                status={errors.doctorName ? 'error' : ''}
              />
              {errors.doctorName && <p className="mt-1 text-sm text-red-400">{errors.doctorName}</p>}
            </div>

            {/* Hospital */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Hospital<span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                value={formData.hospital}
                onChange={(e) => {
                  setFormData({ ...formData, hospital: e.target.value })
                  if (errors.hospital) setErrors({ ...errors, hospital: undefined })
                }}
                placeholder="Enter hospital name (real name required)"
                className="w-full rounded-lg bg-white/5 px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:border-primary focus:outline-none"
                size="large"
                status={errors.hospital ? 'error' : ''}
              />
              {errors.hospital && <p className="mt-1 text-sm text-red-400">{errors.hospital}</p>}
            </div>

            {/* Hospital Level */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Hospital Level<span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                value={formData.hospitalLevel}
                onChange={(e) => {
                  setFormData({ ...formData, hospitalLevel: e.target.value })
                  if (errors.hospitalLevel) setErrors({ ...errors, hospitalLevel: undefined })
                }}
                placeholder="e.g., Tertiary, Secondary"
                className="w-full rounded-lg bg-white/5 px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:border-primary focus:outline-none"
                size="large"
                status={errors.hospitalLevel ? 'error' : ''}
              />
              {errors.hospitalLevel && <p className="mt-1 text-sm text-red-400">{errors.hospitalLevel}</p>}
            </div>

            {/* Professional Title */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Professional Title<span className="text-red-400">*</span>
              </label>
              <Select
                value={formData.title || undefined}
                onChange={(value) => {
                  setFormData({ ...formData, title: value })
                  if (errors.title) setErrors({ ...errors, title: undefined })
                }}
                placeholder="Select title"
                className="w-full [&_.ant-select-selection-placeholder]:!text-gray-500 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!bg-white/5 [&_.ant-select-selector]:!py-2"
                size="large"
                status={errors.title ? 'error' : ''}
              >
                <Option value="resident">Resident Physician</Option>
                <Option value="attending">Attending Physician</Option>
                <Option value="associate">Associate Chief Physician</Option>
                <Option value="chief">Chief Physician</Option>
              </Select>
              {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
            </div>

            {/* Annual PCI Surgery Volume */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Annual PCI Surgery Volume<span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                value={formData.pciSurgeryVolume}
                onChange={(e) => {
                  setFormData({ ...formData, pciSurgeryVolume: e.target.value })
                  if (errors.pciSurgeryVolume) setErrors({ ...errors, pciSurgeryVolume: undefined })
                }}
                placeholder="e.g., 50-100 cases"
                className="w-full rounded-lg bg-white/5 px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:border-primary focus:outline-none"
                size="large"
                status={errors.pciSurgeryVolume ? 'error' : ''}
              />
              {errors.pciSurgeryVolume && <p className="mt-1 text-sm text-red-400">{errors.pciSurgeryVolume}</p>}
            </div>

            {/* Years of Surgical Experience */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Years of Surgical Experience<span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                value={formData.surgeryExperience}
                onChange={(e) => {
                  setFormData({ ...formData, surgeryExperience: e.target.value })
                  if (errors.surgeryExperience) setErrors({ ...errors, surgeryExperience: undefined })
                }}
                placeholder="e.g., 5 years"
                className="w-full rounded-lg bg-white/5 px-4 py-3 text-white transition-colors placeholder:text-gray-500 focus:border-primary focus:outline-none"
                size="large"
                status={errors.surgeryExperience ? 'error' : ''}
              />
              {errors.surgeryExperience && <p className="mt-1 text-sm text-red-400">{errors.surgeryExperience}</p>}
            </div>

            {/* Country/Region */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Country/Region<span className="text-red-400">*</span>
              </label>
              <Select
                value={formData.countryRegion || undefined}
                onChange={(value) => {
                  setFormData({ ...formData, countryRegion: value })
                  if (errors.countryRegion) setErrors({ ...errors, countryRegion: undefined })
                }}
                placeholder={loadingCountries ? 'Loading countries...' : 'Select your country'}
                loading={loadingCountries}
                showSearch
                filterOption={(input, option) =>
                  (option?.children?.toString().toLowerCase() ?? '').includes(input.toLowerCase())
                }
                className="w-full [&_.ant-select-selection-placeholder]:!text-gray-500 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!bg-white/5 [&_.ant-select-selector]:!py-2"
                size="large"
                status={errors.countryRegion ? 'error' : ''}
              >
                {countries.map((country) => (
                  <Option key={country.iso3} value={country.name}>
                    {country.emoji} {country.name}
                  </Option>
                ))}
              </Select>
              {errors.countryRegion && <p className="mt-1 text-sm text-red-400">{errors.countryRegion}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmittingForm}
                className="w-full rounded-full bg-primary py-3 text-base font-semibold text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmittingForm ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Check if annotation data is available
  if (!annotationData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FrontierPageHeader title="Image Annotation Validation" />
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-lg text-gray-600">Loading annotation data...</div>
          </div>
        </div>
      </div>
    )
  }

  const currentShape = annotationData.shapes[0]

  // Show validation interface
  return (
    <div className="min-h-screen bg-gray-50">
      <FrontierPageHeader title="Image Annotation Validation" />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 rounded-2xl bg-white/5 p-6">
          <div className="mb-4 flex justify-center">
            <canvas ref={canvasRef} className="h-auto max-w-full rounded" />
          </div>

          <div className="flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">Show Annotation</span>
            <button
              onClick={() => setShowShape(!showShape)}
              className={`relative ml-3 inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                showShape ? 'bg-primary' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={showShape}
            >
              <span
                className={`inline-block size-4 rounded-full bg-white transition-transform duration-200 ${
                  showShape ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-2xl bg-white/5 p-6">
          <h2 className="mb-10 text-center text-2xl font-medium tracking-tight text-white/90">
            Is the lesion in the image <span className="mx-1 font-bold text-primary">"{currentShape.label}"</span>?
          </h2>

          <div className="flex flex-col items-center gap-10">
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={() => setSelectedAnswer(true)}
                className={`group relative h-16 w-44 overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                  selectedAnswer === true
                    ? 'border-white bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                    : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:bg-white/10'
                }`}
              >
                <span className="relative z-10 text-lg font-semibold">Yes</span>
              </button>

              <button
                onClick={() => setSelectedAnswer(false)}
                className={`group relative h-16 w-44 overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                  selectedAnswer === false
                    ? 'border-white bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                    : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:bg-white/10'
                }`}
              >
                <span className="relative z-10 text-lg font-semibold">No</span>
              </button>
            </div>

            <div className="w-full space-y-3">
              <label className="text-sm font-medium uppercase tracking-wide text-white/40">Reason (Optional)</label>
              <Input.TextArea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Share your clinical reasoning or feedback..."
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-white transition-all placeholder:text-gray-600 focus:border-primary/50 focus:bg-black/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <button
              onClick={handleValidationSubmit}
              disabled={selectedAnswer === null || isSubmitting}
              className="shadow-lg group relative h-14 w-60 overflow-hidden rounded-full bg-primary text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
