import { Button, Form, message, Upload, Input, Modal } from 'antd'
import { PlusIcon } from 'lucide-react'
import { useState, ReactNode } from 'react'
import type { RcFile } from 'antd/es/upload'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { cn } from '@udecode/cn'
import imagePlus from '@/assets/icons/image-plus.svg'
import commonApi from '@/api-v1/common.api'
import type { UploadRequestOption } from 'rc-upload/lib/interface'

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
      Supports JPG, PNG, GIF, WebP formats (max 10MB each, up to 5 images)
    </div>
  </div>
)

export default function Component({ onSubmit }: { onSubmit: (data: object) => Promise<unknown> }) {
  const [form] = Form.useForm()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')

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
    const isJpgOrPngOrGif =
      file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/webp'
    if (!isJpgOrPngOrGif) {
      message.error('You can only upload JPG/PNG/GIF/WebP files!')
    }
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isLt10M) {
      message.error('Image must be smaller than 10MB!')
    }
    return isJpgOrPngOrGif && isLt10M
  }

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }
    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))
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
    const imageUrls = updatedFileList
      .filter((file) => file.status === 'done')
      .map((file) => ({
        uid: file.uid,
        url: file.response?.url,
        name: file.response?.name
      }))
    form.setFieldsValue({ images: imageUrls })
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
      <h2 className="mb-4 pr-6 text-xl font-semibold text-white">R6D9 Data Collection Platform</h2>

      <Form name="form4" layout="vertical" className="flex flex-col gap-6" form={form} requiredMark={FormRequireMask}>
        <div className="rounded-2xl bg-[#252532] p-6">
          <Form.Item
            label="R6D9 Images"
            name="images"
            rules={[
              {
                required: true,
                message: 'Please upload at least one image'
              }
            ]}
          >
            <div>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={beforeUpload}
                className={cn(
                  'text-center transition-all',
                  '[&_.ant-upload-list-picture-card]:!grid [&_.ant-upload-list-picture-card]:!grid-cols-1 [&_.ant-upload-list-picture-card]:!gap-4',
                  fileList.length > 0
                    ? '[&_.ant-upload-list-item-container]:!h-[180px] [&_.ant-upload-list-item-container]:!w-full [&_.ant-upload-list-picture-card]:!grid-cols-3 [&_.ant-upload-select]:!col-span-1 [&_.ant-upload-select]:!h-[180px] [&_.ant-upload-select]:!w-full'
                    : '[&_.ant-upload-select]:!h-[180px] [&_.ant-upload-select]:!w-full'
                )}
                maxCount={5}
                accept=".jpg,.png,.gif,.webp"
                customRequest={uploadMedia}
              >
                {fileList.length >= 5 ? null : uploadButton}
              </Upload>
            </div>
          </Form.Item>
          <Form.Item
            label="R6D9 Run Text"
            name="r6d9RunText"
            rules={[
              {
                required: true,
                message: 'Please enter R6D9 run text.'
              },
              {
                max: 400,
                message: 'Text cannot exceed 400 characters'
              }
            ]}
          >
            <TextArea
              placeholder="Enter R6D9 run text here..."
              showCount
              maxLength={400}
              autoSize={{ minRows: 3, maxRows: 6 }}
              className="resize-none rounded-lg border border-solid border-[#FFFFFF1F] bg-transparent"
            />
          </Form.Item>

          <Form.Item
            label="R6D9 User ID"
            name="userId"
            rules={[
              {
                required: false
              }
            ]}
          >
            <Input
              placeholder="Enter your R6D9 User ID (optional)"
              className="rounded-lg border border-solid border-[#FFFFFF1F] bg-transparent"
            />
          </Form.Item>
          <div className="flex justify-end">
            <Button
              className="w-[160px] rounded-full bg-primary"
              type="primary"
              onClick={handleSubmit}
              loading={isSubmitting}
            >
              Submit
            </Button>
          </div>
        </div>
      </Form>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="Preview" className="w-full" src={previewImage} />
      </Modal>
    </div>
  )
}
