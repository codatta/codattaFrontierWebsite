import { Button, Modal } from 'antd'
import { CameraIcon, MinusCircle, PlusCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import AvatarEditor from 'react-avatar-editor'

import { userStoreActions, useUserStore } from '@/stores/user.store'

import commonApi from '@/api-v1/common.api'
import TaskTarget from '../common/task-target'

async function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    })
  })
}

export default function UserAvatarEditor() {
  const { info } = useUserStore()

  const defaultAvatar = 'https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_855028_default-avatar-1.png'
  const [avatar, setAvatar] = useState(info?.user_data?.avatar)
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
    <>
      <div className="relative size-[108px] cursor-pointer overflow-hidden rounded-full" onClick={handleUploadImage}>
        <img src={avatar || defaultAvatar} alt="" className="size-full object-contain" />
        <TaskTarget match={['target', 'avatar']}>
          <div className="absolute left-0 top-0 flex size-full scale-0 items-center justify-center bg-[#00000099] transition-all group-hover:scale-100">
            <CameraIcon />
          </div>
        </TaskTarget>
      </div>
      <Modal
        open={showAvatarEditor}
        title="Edit avatar"
        onOk={updateAvatar}
        onCancel={() => setShowAvatarEditor(false)}
        confirmLoading={uploading}
        className="[.ant-modal-header]:!bg-transparent"
      >
        <div className="flex flex-col items-center gap-6">
          <AvatarEditor ref={editor} image={imageDataUrl} width={250} height={250} border={20} scale={scale} />
          <Button.Group size="large">
            <Button onClick={() => setScale(scale + 0.2)}>
              <PlusCircle></PlusCircle>
            </Button>
            <Button onClick={() => setScale(scale - 0.2)}>
              <MinusCircle></MinusCircle>
            </Button>
          </Button.Group>
        </div>
      </Modal>
    </>
  )
}
