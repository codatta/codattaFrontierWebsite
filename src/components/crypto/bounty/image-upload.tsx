import commonApi from '@/api-v1/common.api'
import { PlusOutlined } from '@ant-design/icons'
import { cn } from '@udecode/cn'
import { Spin, message, Image, Button } from 'antd'
import { UploadChangeParam, UploadFile } from 'antd/es/upload'
import Dragger from 'antd/es/upload/Dragger'
import { Trash2, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'

interface FileItem {
  name: string
  path: string
  [key: string]: unknown
}

function FileUploadItem(props: {
  file: UploadFile<File>
  onUpload: (uid: string, file: FileItem) => void
  onRemove: (id: string) => void
  onPreview: (imageData: string) => void
}) {
  const { file, onUpload, onRemove, onPreview } = props
  const [uploading, setUploading] = useState(true)
  const [imageData, setImageData] = useState<string>()

  async function uploadFile(fileObject: File) {
    setUploading(true)
    try {
      const res = await commonApi.uploadFile(fileObject)
      const uploadFileItem = { name: file.name, path: res.file_path }
      onUpload(file.uid, uploadFileItem)
    } catch (err) {
      message.error(err.message)
    }
    setUploading(false)
  }

  async function showImage(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      setImageData(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (!file) return
    uploadFile(file.originFileObj!)
    showImage(file.originFileObj!)
  }, [file])

  return (
    <Spin spinning={uploading} className="">
      <div
        className="group aspect-[16/9] overflow-hidden rounded-xl border border-gray-100 bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${imageData})`, backgroundSize: 'contain' }}
      >
        <div className="flex size-full items-center justify-center bg-black/45 opacity-0 transition-all group-hover:opacity-100">
          <Button ghost type="text" onClick={() => onRemove(file.uid)}>
            <Trash2 className="cursor-pointer"></Trash2>
          </Button>
          <Button ghost type="text" onClick={() => onPreview(imageData!)}>
            <Eye className="cursor-pointer"></Eye>
          </Button>
        </div>
      </div>
    </Spin>
  )
}

export default function ImageUpload(props: { onChange: (fileList: FileItem[]) => void }) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [uploadImages, setUploadImages] = useState<FileItem[]>([])

  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewItem, setPreviewItem] = useState<{ src: string }>()
  const { onChange } = props

  useEffect(() => {
    if (!uploadImages) return
    onChange(
      uploadImages.map((item) => {
        return { name: item.name, path: item.path }
      })
    )
  }, [uploadImages, onChange])

  function handleUploadFileChange(uploadFile: UploadChangeParam<UploadFile<File>>) {
    if (uploadFiles.find((existFile) => existFile.uid === uploadFile.file.uid)) return
    setUploadFiles([...uploadFiles, uploadFile.file])
  }

  function beforeUpload(file: File) {
    const isImage = ['image/png', 'image/jpeg', 'image/webp'].includes(file.type)
    if (!isImage) {
      message.error('You can only upload Image file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isLt2M && isImage
  }

  function handleUploadFinish(uid: string, file: FileItem) {
    if (!uploadImages || uploadImages.length === 0) setUploadImages([{ ...file, uid }])
    else setUploadImages([...uploadImages, { ...file, uid }])
  }

  function handleRemoveImage(id: string) {
    const remainingFiles = uploadFiles.filter((f) => f.uid !== id)
    setUploadFiles(remainingFiles)

    const remainingUploadImages = uploadImages.filter((f) => f.uid !== id)
    setUploadImages(remainingUploadImages)
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      {uploadFiles.map((uploadFile) => (
        <FileUploadItem
          key={uploadFile.uid}
          file={uploadFile}
          onUpload={handleUploadFinish}
          onRemove={handleRemoveImage}
          onPreview={(imageData) => {
            setPreviewVisible(true)
            setPreviewItem({ src: imageData })
          }}
        />
      ))}

      <Dragger
        showUploadList={false}
        onChange={handleUploadFileChange}
        beforeUpload={beforeUpload}
        accept="image/png,image/jpeg,image/webp"
        className={cn('text-center transition-all', uploadFiles.length ? 'col-span-1 aspect-[16/9]' : 'col-span-4')}
      >
        <div className="flex flex-col items-center justify-center">
          <PlusOutlined className="block text-center text-sm" color="#25314C" />
          {!uploadFiles.length && (
            <div className="mt-3 flex text-sm text-gray-500">
              Images are important for data validation
              <br />
              We support PNG, JPG, JPEG and WEBP only.
            </div>
          )}
        </div>
      </Dragger>

      <Image.PreviewGroup
        preview={{
          visible: previewVisible,
          current: 0,
          onVisibleChange: (visible) => setPreviewVisible(visible)
        }}
        items={previewItem ? [previewItem] : undefined}
      ></Image.PreviewGroup>
    </div>
  )
}
