import { Button, Form, message, Upload, Input, Modal } from 'antd'
import { useState, ReactNode } from 'react'
import { cn } from '@udecode/cn'
import imagePlus from '@/assets/icons/image-plus.svg'
import commonApi from '@/api-v1/common.api'
import type { UploadRequestOption } from 'rc-upload/lib/interface'
import type { RcFile } from 'antd/es/upload'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
// import type { GetProp, UploadFile, UploadProps } from 'antd'

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
      Upload an NFT image (only one image allowed). Ensure the image is clear and without watermark.
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
      file.type === 'image/jpg' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/gif' ||
      file.type === 'image/webp'
    if (!isJpgOrPngOrGif) {
      message.error('Image format not supported. Please upload JPG, PNG, GIF, or WebP.')
    }
    const isLt10M = file.size / 1024 / 1024 <= 10
    if (!isLt10M) {
      message.error('File size exceeds limit. Please upload an image smaller than 10MB.')
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
          url: file.response.url
        }
      }
      return file
    })
    const imageUrls = updatedFileList
      .filter((file) => file.status === 'done')
      .map((file) => ({
        uid: file.uid,
        url: file.response?.url,
        name: file.response?.name
      }))
    form.setFieldsValue({ nft_image: imageUrls })
    setFileList(updatedFileList)
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
      <h2 className="mb-4 pr-6 text-xl font-semibold text-white">NFT Data Collection Platform</h2>

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
            label="NFT Image"
            name="nft_image"
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
                  '[&_.ant-upload-select]:!h-[142px] [&_.ant-upload-select]:!w-full',
                  fileList.length > 0
                    ? '[&_.ant-upload-list-item-container]:!h-[142px] [&_.ant-upload-list-item-container]:!w-full [&_.ant-upload-list-item-image]:!absolute [&_.ant-upload-list-item-image]:!left-1/2 [&_.ant-upload-list-item-image]:!top-1/2 [&_.ant-upload-list-item-image]:!h-full [&_.ant-upload-list-item-image]:!w-auto [&_.ant-upload-list-item-image]:!-translate-x-1/2 [&_.ant-upload-list-item-image]:!-translate-y-1/2 [&_.ant-upload-list-item-thumbnail]:!relative [&_.ant-upload-list-item-thumbnail]:!size-full [&_.ant-upload-list-picture-card]:!grid [&_.ant-upload-list-picture-card]:!grid-cols-3'
                    : ''
                )}
                accept=".jpg,.png,.gif,.webp,.jpeg"
                customRequest={uploadMedia}
              >
                {fileList.length < 1 && uploadButton}
              </Upload>
            </div>
          </Form.Item>
          <Form.Item
            label="NFT Description"
            name="nft_description"
            rules={[
              {
                required: true,
                message: 'Please enter nft description.'
              },
              {
                max: 1000,
                message: 'Text cannot exceed 1000 characters'
              }
            ]}
          >
            <TextArea
              placeholder="Describe the content, style, lines, colors, and other features of the NFT. Provide as much detail as possible to aid in AI recognition and classification."
              showCount
              maxLength={1000}
              autoSize={{ minRows: 4, maxRows: 4 }}
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
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="Preview" className="w-full" src={previewImage} />
      </Modal>
    </div>
  )
}
