import { Button, Modal } from 'antd'
import { Upload, UserCircleIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import AvatarEditor from 'react-avatar-editor'

import TaskTarget from '@/components/common/task-target'

import { userStoreActions, useUserStore } from '@/stores/user.store'

import commonApi from '@/api-v1/common.api'

async function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    })
  })
}

export default function EditAvatarModal({ open, onClose }: { open: boolean; onClose?: () => void }) {
  const { info } = useUserStore()

  const [avatar, setAvatar] = useState(info?.user_data?.avatar || '')
  const [showAvatarEditor, setShowAvatarEditor] = useState(false)
  const editor = useRef<AvatarEditor>(null)
  const [imageDataUrl, setImageDataUrl] = useState('')
  const [scale, setScale] = useState(1)
  const [uploading, setUploading] = useState(false)

  function handleUploadImage() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        editAvatar(file)
      }
    }
    input.click()
  }

  function editAvatar(file: File) {
    setShowAvatarEditor(true)
    setScale(1)
    const reader = new FileReader()
    reader.onload = (e) => {
      const DataURL = e.target!.result as string
      setImageDataUrl(DataURL)
    }
    reader.readAsDataURL(file)
  }

  async function updateAvatar() {
    if (editor.current) {
      setUploading(true)
      const canvas = editor.current.getImage()
      const blob = await canvasToBlob(canvas)
      if (!blob) return
      const file = new File([blob], 'avatar.png', { type: 'image/png' })
      const res = await commonApi.uploadFile(file)
      if (res.file_path) {
        setAvatar(res.file_path)
        setShowAvatarEditor(false)
        setUploading(false)
      }
    }
  }

  useEffect(() => {
    console.log('avatar', avatar, info?.user_data?.avatar, '-')
    if (avatar && avatar !== info?.user_data?.avatar) {
      userStoreActions.updateUserInfo({ update_key: 'AVATAR', update_value: avatar })
    }
  }, [avatar, info])
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={4}
      centered
      styles={{ content: { padding: '16px' } }}
      title="Edit avatar"
    >
      <div className="flex items-start gap-6">
        <div className="block">
          {info?.user_data?.avatar ? (
            <img className="block rounded-full" src={info?.user_data?.avatar} height={80} width={80} />
          ) : null}
          {!info?.user_data?.avatar ? (
            <div className="flex size-[80px] items-center justify-center rounded-full border border-[rgba(48,0,64,0.06)] bg-[rgba(237,233,239,1)]">
              <UserCircleIcon size={40} className="text-[rgba(0,0,0,0.24)]"></UserCircleIcon>
            </div>
          ) : null}
        </div>
        <div className="">
          <div className="mb-4 flex items-start justify-start gap-2">
            <img
              src="https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_855028_default-avatar-1.png"
              alt=""
              className="size-8 cursor-pointer rounded-full border-4 border-[rgba(48,0,64,0.06)]"
              onClick={() =>
                setAvatar('https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_855028_default-avatar-1.png')
              }
            />
            <img
              src="https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png"
              alt=""
              className="size-8 cursor-pointer rounded-full border-4 border-[rgba(48,0,64,0.06)]"
              onClick={() =>
                setAvatar('https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png')
              }
            />
          </div>
          <TaskTarget match={['target', 'avatar']}>
            <Button className="flex items-center gap-2 bg-white text-black" onClick={handleUploadImage}>
              <Upload size={14}></Upload>
              Change avatar
            </Button>
          </TaskTarget>
        </div>
      </div>
    </Modal>
  )
}
