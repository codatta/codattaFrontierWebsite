import React, { useState, useRef, useMemo, useEffect } from 'react'
import { Button, Form, Input, Select, Radio, message } from 'antd'
import { Edit, Loader2, Plus, Trash2 } from 'lucide-react'
import MobileBirthPicker from '@/components/common/mobile-birth-picker'
import MobileLocationPicker from '@/components/common/mobile-location-picker'
import { BirthDateTime, LocationValue, LifeEvent, EventListRow, EventCategory } from '../../types/common'
import frontiterApi from '@/apis/frontiter.api'
import { useParams } from 'react-router-dom'
import CustomEmpty from '@/components/common/empty'
import SubmitSuccessModal from '@/components/frontier/submit-success-modal'

const { Option } = Select

const FateForm: React.FC<{ templateId: string }> = ({ templateId }) => {
  const [form] = Form.useForm()

  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingEvent, setEditingEvent] = useState<LifeEvent | null>(null)
  const [currentLifeStage, setCurrentLifeStage] = useState('')
  const [eventListRows, setEventListRows] = useState<EventListRow[]>([
    { id: 'row_1', category: null, description: '', occurrenceYear: undefined }
  ])
  const eventListRowCountRef = useRef(1)
  const [birthDateTime, setBirthDateTime] = useState<BirthDateTime | undefined>()
  const [birthLocation, setBirthLocation] = useState<LocationValue | undefined>()
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const { taskId } = useParams()

  const eventCountRef = useRef(0)

  // Sync lifeEvents to form
  useEffect(() => {
    form.setFieldValue('lifeEvents', lifeEvents)
    // Remove automatic validation trigger, only sync state
  }, [lifeEvents, form])

  // Custom validator for life events
  const validateLifeEvents = (_: unknown, value: LifeEvent[]) => {
    if (!value || value.length === 0) {
      return Promise.reject(new Error('Please add at least one life event'))
    }

    // Collect all event categories
    const allCategories = new Set<string>()
    value.forEach((event) => {
      event.lifeEvents?.forEach((lifeEvent) => {
        if (lifeEvent.category) {
          allCategories.add(lifeEvent.category)
        }
      })
    })

    if (allCategories.size < 2) {
      return Promise.reject(new Error('Life events must include at least 2 different event categories'))
    }

    return Promise.resolve()
  }

  // Life stages options
  const lifeStagesOptions = [
    { label: '1-10 Years Old', value: '1-10 Years Old' },
    { label: '11-20 Years Old', value: '11-20 Years Old' },
    { label: '21-30 Years Old', value: '21-30 Years Old' },
    { label: '31-40 Years Old', value: '31-40 Years Old' },
    { label: '41-50 Years Old', value: '41-50 Years Old' },
    { label: '51-60 Years Old', value: '51-60 Years Old' },
    { label: '61-70 Years Old', value: '61-70 Years Old' },
    { label: '71-80 Years Old', value: '71-80 Years Old' },
    { label: '81-90 Years Old', value: '81-90 Years Old' },
    { label: '91-100 Years Old', value: '91-100 Years Old' }
  ]

  const eventCategories: EventCategory[] = [
    {
      label: 'Educational Background',
      value: 'Educational Background',
      placeholder: 'State your degree and institution'
    },
    {
      label: 'Career Development',
      value: 'Career Development',
      placeholder: 'List key milestones (promotions, role changes, or career shifts)'
    },
    {
      label: 'Health Status',
      value: 'Health Status',
      placeholder: "List any serious illnesses you've experienced."
    },
    {
      label: 'Emotional Relationships',
      value: 'Emotional Relationships',
      placeholder: 'Record relationship milestones such as marriage, childbirth, or significant partnerships.'
    },
    {
      label: 'Financial Status',
      value: 'Financial Status',
      placeholder: 'List your income sources or significant financial events.'
    },
    {
      label: 'Others',
      value: 'Others',
      placeholder: 'Please share any other significant life events not listed above'
    }
  ]

  // Calculate year options function
  const calculateYearOptions = useMemo(() => {
    if (!birthDateTime || !currentLifeStage) return []

    const birthYear = birthDateTime.year
    const currentYear = new Date().getFullYear()

    // Parse life stage range
    const stageMatch = currentLifeStage.match(/(\d+)-(\d+)/)
    if (!stageMatch) return []

    const startAge = parseInt(stageMatch[1])
    const endAge = parseInt(stageMatch[2])

    // Calculate corresponding year range
    const startYear = birthYear + startAge - 1
    const endYear = Math.min(birthYear + endAge - 1, currentYear)

    const years = []
    for (let year = startYear; year <= endYear; year++) {
      if (year > 0) {
        years.push(year)
      }
    }

    return years.reverse() // Recent years first
  }, [birthDateTime, currentLifeStage])

  // Occupation options for parents and children
  const occupationOptions = [
    { label: 'Public sector employment', value: 'Public sector employment' },
    { label: 'Private sector employment', value: 'Private sector employment' }
  ]

  // Health options for parents and children
  const healthOptions = [
    { label: 'Excellent health', value: 'Excellent health' },
    { label: 'Stable health condition', value: 'Stable health condition' },
    { label: 'Poor health', value: 'Poor health' },
    { label: 'Chronic illness/health issues', value: 'Chronic illness/health issues' }
  ]

  const handleBirthDateTimeChange = (value: BirthDateTime) => {
    setBirthDateTime(value)
    form.setFieldValue('birthTime', value)
  }

  const handleBirthLocationChange = (value: LocationValue) => {
    if (!value) return
    setBirthLocation(value)
    form.setFieldValue('birthLocation', value)
  }

  const handleAddEventListRow = () => {
    const newRow: EventListRow = {
      id: `row_${++eventListRowCountRef.current}`,
      category: '',
      description: '',
      occurrenceYear: undefined
    }
    setEventListRows((prev) => [...prev, newRow])
  }

  const handleDeleteEventListRow = (rowId: string) => {
    if (eventListRows.length <= 1) {
      message.warning('At least one event list row is required')
      return
    }
    setEventListRows((prev) => prev.filter((row) => row.id !== rowId))
  }

  const handleUpdateEventListRow = (
    rowId: string,
    field: 'category' | 'description' | 'occurrenceYear',
    value: string | number
  ) => {
    setEventListRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)))
  }

  const handleAddEvent = () => {
    if (!currentLifeStage) {
      message.error('Please select life stages')
      return
    }

    // Check if all event list rows have both category and description
    const incompleteRows = eventListRows.filter(
      (row) => !row.category || !row.description.trim() || !row.occurrenceYear
    )
    if (incompleteRows.length > 0) {
      message.error('Please fill in all event list rows')
      return
    }

    // Create events from all rows
    const newEvent: LifeEvent = {
      id: `event_${eventCountRef.current++}`,
      lifeStage: currentLifeStage,
      lifeEvents: eventListRows.map((row) => ({
        category: row.category || '',
        description: row.description,
        occurrenceYear: row.occurrenceYear || undefined
      }))
    }

    setLifeEvents((prev) => [...prev, newEvent])
    setCurrentLifeStage('')
    // Reset event list rows to single empty row
    setEventListRows([{ id: 'row_1', category: '', description: '', occurrenceYear: undefined }])
    eventListRowCountRef.current = 1
    message.success('Events added successfully')
  }

  const handleEditEvent = (event: LifeEvent) => {
    setEditingEvent(event)
    setCurrentLifeStage(event.lifeStage || '')
    // Set event list rows to the event being edited
    setEventListRows(
      event.lifeEvents?.map((lifeEvent, index) => ({
        id: `edit_row_${index + 1}`,
        category: lifeEvent.category,
        description: lifeEvent.description,
        occurrenceYear: lifeEvent.occurrenceYear
      })) || [{ id: 'edit_row_1', category: '', description: '', occurrenceYear: undefined }]
    )
  }

  const handleUpdateEvent = () => {
    if (!editingEvent || !currentLifeStage) {
      message.error('Please select life stages')
      return
    }

    // Check if all event list rows have both category and description
    const incompleteRows = eventListRows.filter((row) => !row.category || !row.description.trim())
    if (incompleteRows.length > 0) {
      message.error('Please fill in all event list rows')
      return
    }

    setLifeEvents((prev) =>
      prev.map((event) =>
        event.id === editingEvent.id
          ? {
              ...event,
              lifeStage: currentLifeStage,
              lifeEvents: eventListRows.map((row) => ({
                category: row.category || '',
                description: row.description || '',
                occurrenceYear: row.occurrenceYear || undefined
              }))
            }
          : event
      )
    )
    setEditingEvent(null)
    setCurrentLifeStage('')
    // Reset event list rows to single empty row
    setEventListRows([{ id: 'row_1', category: '', description: '', occurrenceYear: undefined }])
    eventListRowCountRef.current = 1
    message.success('Event updated successfully')
  }

  const handleDeleteEvent = (eventId: string) => {
    if (editingEvent && editingEvent.id === eventId) {
      setEditingEvent(null)
      setCurrentLifeStage('')
      setEventListRows([{ id: 'row_1', category: '', description: '', occurrenceYear: undefined }])
      eventListRowCountRef.current = 1
    }
    setLifeEvents((prev) => prev.filter((event) => event.id !== eventId))
    message.success('Event deleted successfully')
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      if (!taskId) throw new Error('Task ID is required')

      const values = await form.validateFields()

      const submitData = {
        taskId,
        templateId,
        data: values
      }

      await frontiterApi.submitTask(taskId, submitData)
      setShowSuccessModal(true)
    } catch (error) {
      message.error('Please check all required fields')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get placeholder for selected category
  const getCategoryPlaceholder = (categoryValue: string) => {
    const category = eventCategories.find((cat) => cat.value === categoryValue)
    return category?.placeholder || 'Please enter description'
  }

  return (
    <div className="min-h-screen bg-[#1C1C26] text-white">
      <div>
        <div className="mx-auto mt-9 flex max-w-5xl items-center px-6 py-3 text-xs text-[#b0b0b0]">
          <svg
            className="mr-2"
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ minWidth: 14, minHeight: 14 }}
          >
            <circle cx="8" cy="8" r="7" stroke="#b0b0b0" strokeWidth="1.2" fill="none" />
            <rect x="7.25" y="3.5" width="1.5" height="6" rx="0.75" fill="#b0b0b0" />
            <circle cx="8" cy="11.5" r="1" fill="#b0b0b0" />
          </svg>
          Your use of this service constitutes consent to process data per our Privacy Policy.
        </div>
      </div>

      <div className="mx-auto max-w-5xl p-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-8"
          size="large"
          scrollToFirstError={true}
        >
          {/* Personal Data Section */}
          <div className="">
            <h2 className="mb-3 text-lg font-semibold">Personal Data</h2>

            <div className="grid grid-cols-1 gap-0 md:grid-cols-3 md:gap-6">
              <div>
                <Form.Item
                  name="birthLocation"
                  label="Birth Location"
                  validateTrigger={false}
                  rules={[{ required: true, message: 'Please select birth location' }]}
                >
                  <MobileLocationPicker
                    value={birthLocation}
                    onChange={handleBirthLocationChange}
                    placeholder="Select Birth Location"
                  />
                </Form.Item>
              </div>

              <div>
                <Form.Item
                  name="birthTime"
                  label="Birth Time"
                  rules={[{ required: true, message: 'Please select birth time' }]}
                >
                  <MobileBirthPicker
                    value={birthDateTime}
                    onChange={handleBirthDateTimeChange}
                    placeholder="Select Birth Time"
                  />
                </Form.Item>
              </div>

              <div>
                <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Please select gender' }]}>
                  <Radio.Group className="flex gap-6">
                    <Radio value="male" className="text-white">
                      <span className="text-white">Male</span>
                    </Radio>
                    <Radio value="female" className="text-white">
                      <span className="text-white">Female</span>
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>

            {/* Life Event Section */}
            <div className="">
              <div className="mb-6">
                <label className="text-sm font-medium">Life Event</label>
              </div>

              <div className="mb-6 rounded-2xl bg-[#252532] p-4">
                {/* Life Stages Selection */}
                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium">
                    <span className="text-red-400">*</span> Life Stages
                  </label>
                  <Select
                    placeholder="Life Stages"
                    value={currentLifeStage}
                    onChange={setCurrentLifeStage}
                    className="w-full"
                    dropdownClassName="bg-[#252532]"
                  >
                    {lifeStagesOptions.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </div>

                {/* Event List Form */}
                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium">
                    <span className="text-red-400">*</span> Event List
                  </label>
                  <div className="space-y-3">
                    {eventListRows.map((row) => (
                      <div key={row.id} className="flex gap-3">
                        <div className="flex-1">
                          <Select
                            placeholder="Occurrence Year"
                            value={row.category}
                            onChange={(value) => handleUpdateEventListRow(row.id, 'category', value)}
                            className="w-full"
                            dropdownClassName="bg-[#252532]"
                          >
                            {eventCategories.map((category) => (
                              <Option key={category.value} value={category.value}>
                                {category.label}
                              </Option>
                            ))}
                          </Select>
                        </div>
                        <div className="flex-1">
                          <Select
                            placeholder="Occurrence Year"
                            value={row.occurrenceYear}
                            onChange={(value) => handleUpdateEventListRow(row.id, 'occurrenceYear', value)}
                            className="w-full"
                            dropdownClassName="bg-[#252532]"
                            disabled={!birthDateTime || !currentLifeStage}
                          >
                            {calculateYearOptions.map((year) => (
                              <Option key={year} value={year}>
                                {year}
                              </Option>
                            ))}
                          </Select>
                        </div>
                        <div className="flex-[2]">
                          <Input
                            placeholder={getCategoryPlaceholder(row.category!)}
                            value={row.description}
                            onChange={(e) => handleUpdateEventListRow(row.id, 'description', e.target.value)}
                            className="w-full"
                          />
                        </div>

                        <Button
                          type="text"
                          icon={<Trash2 className="size-4" />}
                          onClick={() => handleDeleteEventListRow(row.id)}
                          disabled={eventListRows.length === 1}
                        />
                      </div>
                    ))}

                    <Button
                      type="link"
                      icon={<Plus className="size-4" />}
                      onClick={handleAddEventListRow}
                      className="px-0 text-white"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Add Button */}
                <div className="flex gap-3">
                  <Button
                    onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
                    shape="round"
                    className="border border-white bg-transparent"
                  >
                    <Plus className="size-4" /> {editingEvent ? 'Update Event' : 'Add Event'}
                  </Button>
                </div>
              </div>

              <Form.Item
                className="mb-0"
                label="Added Events"
                name="lifeEvents"
                rules={[
                  {
                    validator: validateLifeEvents
                  }
                ]}
              >
                {/* Added Events */}
                <div className="space-y-3">
                  {lifeEvents.length === 0 && (
                    <div className="rounded-lg bg-[#252532]">
                      <CustomEmpty />
                    </div>
                  )}

                  {lifeEvents.map((event) => (
                    <div key={event.id} className="rounded-lg bg-[#252532] p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-primary/20 px-2 py-1 text-xs text-primary">Life Stages</span>
                          <span className="text-sm text-white">{event.lifeStage || '1 - 10 Years Old'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="text"
                            size="small"
                            icon={<Edit className="size-3" />}
                            onClick={() => handleEditEvent(event)}
                            className="text-white hover:bg-white/10"
                          ></Button>
                          <Button
                            type="text"
                            size="small"
                            icon={<Trash2 className="size-3" />}
                            onClick={() => handleDeleteEvent(event.id)}
                            className="hover:bg-red-500/10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        {event.lifeEvents?.map((lifeEvent, index) => (
                          <div key={`${lifeEvent.category}-${index}`}>
                            <div className="mb-1 flex items-center gap-2">
                              <span className="text-sm font-medium text-white">
                                <span className="mr-2 rounded bg-primary/20 px-2 py-1 text-xs text-primary">
                                  {lifeEvent.occurrenceYear}
                                </span>
                                Event List: {lifeEvent.category}
                              </span>
                            </div>
                            <div className="text-sm text-gray-300">{lifeEvent.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Form.Item>
            </div>
          </div>

          {/* Parental Data Section */}
          <div className="">
            <h2 className="mb-4 text-lg font-semibold">Parental Data</h2>

            <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-6">
              <div>
                <Form.Item name="parentalOccupations" label="Occupations">
                  <Select placeholder="Occupations" className="w-full" dropdownClassName="bg-[#252532]">
                    {occupationOptions.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div>
                <Form.Item name="parentalHealth" label="Health">
                  <Select placeholder="Health" className="w-full" dropdownClassName="bg-[#252532]">
                    {healthOptions.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div>
              <div className="mb-4 text-sm font-medium">Emotional Relationship</div>
              <div className="grid grid-cols-1 gap-4 rounded-2xl bg-[#252532] p-4 md:grid-cols-2">
                <div>
                  <div className="text-sm">Biological Father</div>
                  <Form.Item name="biologicalFatherClose" valuePropName="checked" className="mb-0">
                    <Radio.Group className="flex gap-6">
                      <Radio value={true} className="text-white">
                        <span className="text-white">Close</span>
                      </Radio>
                      <Radio value={false} className="text-white">
                        <span className="text-white">Not Close</span>
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>

                <div>
                  <div className="text-sm">Biological Mother</div>
                  <Form.Item name="biologicalMotherClose" valuePropName="checked" className="mb-0">
                    <Radio.Group className="flex gap-6">
                      <Radio value={true} className="text-white">
                        <span className="text-white">Close</span>
                      </Radio>
                      <Radio value={false} className="text-white">
                        <span className="text-white">Not Close</span>
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>

          {/* Child Data Section */}
          <div className="">
            <h2 className="mb-3 text-lg font-semibold">Child Data</h2>

            <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-6">
              <div>
                <Form.Item name="childOccupations" label="Occupations">
                  <Select placeholder="Occupations" className="w-full" dropdownClassName="bg-[#252532]">
                    {occupationOptions.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div>
                <Form.Item name="childHealth" label="Health">
                  <Select placeholder="Health" className="w-full" dropdownClassName="bg-[#252532]">
                    {healthOptions.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-4 text-sm font-medium">Emotional Relationship</div>

              <div className="rounded-2xl bg-[#252532] p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm">First Child</div>
                    <Form.Item name="firstChildClose" valuePropName="checked" className="mb-0">
                      <Radio.Group className="flex gap-6">
                        <Radio value={true} className="text-white">
                          <span className="text-white">Close</span>
                        </Radio>
                        <Radio value={false} className="text-white">
                          <span className="text-white">Not Close</span>
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>

                  <div>
                    <div className="text-sm">Second Child</div>
                    <Form.Item name="secondChildClose" valuePropName="checked" className="mb-0">
                      <Radio.Group className="flex gap-6">
                        <Radio value={true} className="text-white">
                          <span className="text-white">Close</span>
                        </Radio>
                        <Radio value={false} className="text-white">
                          <span className="text-white">Not Close</span>
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </div>
                <div>
                  <Form.Item name="moreChildInfo" label="More child data you want to share with us" className="mb-0">
                    <Input placeholder="More Info" />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="primary"
              shape="round"
              className="min-w-40"
              htmlType="submit"
              disabled={isSubmitting}
              size="large"
            >
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : 'Submit'}
            </Button>
          </div>
        </Form>
      </div>
      <SubmitSuccessModal open={showSuccessModal} onClose={() => window.history.back()} />
    </div>
  )
}

export default FateForm
