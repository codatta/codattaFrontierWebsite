import React from 'react'
import { Modal } from 'antd'

interface VideoInt {
  img?: string
  url?: string
}

interface VideoModalProps {
  onClose: () => void
  video: VideoInt
}

const VideoModal: React.FC<VideoModalProps> = ({ onClose, video }) => {
  return (
    <Modal
      open={Boolean(video?.url)}
      onCancel={onClose}
      closeIcon={false}
      footer={false}
      width={800}
      className="[&_.ant-modal-content]:p-0"
      destroyOnClose
    >
      <div>
        <video controls className="w-full" poster={video?.img}>
          <source src={video?.url} type="video/mp4" />
        </video>
      </div>
    </Modal>
  )
}

export default VideoModal
