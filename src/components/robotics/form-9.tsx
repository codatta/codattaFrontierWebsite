import { Button, Form, message, Upload, Input, Select } from 'antd'
import { useState, ReactNode } from 'react'
import type { RcFile } from 'antd/es/upload'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { cn } from '@udecode/cn'
import imagePlus from '@/assets/icons/image-plus.svg'
import commonApi from '@/api-v1/common.api'
import type { UploadRequestOption } from 'rc-upload/lib/interface'
import langs from '@/components/common/langs'

const { TextArea } = Input

const FormRequireMask = (label: ReactNode, info: { required: boolean }) => {
  const { required } = info
  return (
    <>
      <span className="font-bold text-white">{label}</span>
      {required && <span className="ml-1 text-base text-gray-700">*</span>}
    </>
  )
}

const uploadButton = (
  <div className="flex size-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#FFFFFF1F] bg-transparent hover:border-blue-500">
    <img src={imagePlus} alt="Upload" />
    <div className="mt-3 flex text-sm text-white">
      Upload a clear recording of the entered text (only one file allowed), size must not exceed 20MB.
    </div>
  </div>
)

export default function Component({ onSubmit }: { onSubmit: (data: object) => Promise<unknown> }) {
  const [form] = Form.useForm()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const values = await form.validateFields()
      console.log(values)
      await onSubmit(values)
      form.resetFields()
    } catch (e) {
      if ('errorFields' in e) message.error(e.errorFields[0].errors[0])
      else message.error(e.message)
    }
    setIsSubmitting(false)
  }

  const beforeUpload = (file: RcFile) => {
    console.log(file.type)
    const isJpgOrPngOrGif =
      file.type === 'audio/mpeg' ||
      file.type === 'audio/wav' ||
      file.type === 'audio/mp4' ||
      file.type === 'audio/x-m4a'
    if (!isJpgOrPngOrGif) {
      message.error('You can only upload mp3/m4a/wav files!')
    }
    const isLt10M = file.size / 1024 / 1024 <= 20
    if (!isLt10M) {
      message.error('File must be smaller than 10MB!')
    }
    return isJpgOrPngOrGif && isLt10M
  }

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    const updatedFileList = newFileList.map((file) => {
      console.log(file)
      if (file.status === 'done' && file.response) {
        return {
          ...file,
          url: file.response.file_path
        }
      }
      return file
    })
    setFileList(updatedFileList)
    const fileUrls = updatedFileList
      .filter((file) => file.status === 'done')
      .map((file) => ({
        uid: file.uid,
        url: file.response?.url,
        name: file.response?.name
      }))
    form.setFieldsValue({ speech_audio: fileUrls })
  }

  const uploadMedia: UploadProps['customRequest'] = async (options: UploadRequestOption) => {
    const { file, onSuccess } = options
    const res = await commonApi.uploadFile(file as File)
    console.log(res)
    onSuccess?.(
      {
        name: res.original_name,
        status: 'done',
        url: res.file_path
      },
      file
    )
  }

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })

  const handleCancel = () => setPreviewOpen(false)

  return (
    <div className="flex-1">
      <h2 className="mb-4 pr-6 text-xl font-semibold text-white">Speech Data Collection Platform</h2>

      <Form
        name="form4"
        layout="vertical"
        className="flex flex-col gap-6"
        form={form}
        requiredMark={FormRequireMask}
        initialValues={{ satisfaction: true }}
      >
        <div className="rounded-2xl bg-[#252532] p-6">
          <Form.Item
            label="Speech Language"
            name="language"
            rules={[
              {
                required: true,
                message: 'Please select the language for reading.'
              }
            ]}
          >
            <Select
              showSearch
              allowClear
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              placeholder="Please select the language for reading."
              options={langs}
            >
              {/* <Select.Option value="demo">Demo</Select.Option> */}
            </Select>
          </Form.Item>
          <Form.Item
            label="Speech Audio"
            name="speech_audio"
            rules={[
              {
                required: true,
                message: 'Please upload at least one audio'
              }
            ]}
          >
            <div>
              <Upload
                onChange={handleChange}
                beforeUpload={beforeUpload}
                className={cn(
                  'text-left transition-all [&_.ant-upload-select]:!h-[180px] [&_.ant-upload-select]:!w-full',
                  fileList.length > 0
                    ? '[&_.ant-upload-list-item-container]:!col-start-1 [&_.ant-upload-list-item-container]:!w-full [&_.ant-upload-list-text]:!grid [&_.ant-upload-list-text]:!grid-cols-3'
                    : ''
                )}
                accept=".wav,.mp3,.m4a"
                customRequest={uploadMedia}
              >
                {fileList.length === 0 && uploadButton}
              </Upload>
            </div>
          </Form.Item>
          <Form.Item
            label="Speech Text"
            name="speech_text"
            rules={[
              {
                required: true,
                message: 'Please enter the text to be read aloud, up to 400 characters, matching the selected language.'
              },
              {
                max: 400,
                message: 'Text cannot exceed 400 characters'
              }
            ]}
          >
            <TextArea
              placeholder="Enter speech text here..."
              showCount
              maxLength={400}
              autoSize={{ minRows: 3, maxRows: 4 }}
              className="resize-none rounded-lg border border-solid border-[#FFFFFF1F] bg-transparent"
            />
          </Form.Item>

          <div className="flex justify-center">
            <Button
              className="h-[42px] w-[240px] rounded-full bg-primary"
              type="primary"
              onClick={handleSubmit}
              loading={isSubmitting}
            >
              Submit
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}
