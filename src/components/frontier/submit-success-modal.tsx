import { Button, Modal } from 'antd'
import TaskApproved from '@/assets/images/task-approved.svg'

export default function SubmissionSuccessModal(props: { open: boolean; onClose: () => void }) {
  const { open, onClose } = props

  return (
    <Modal open={open} onCancel={onClose} footer={null} centered className="max-w-[386px]">
      <div className="flex flex-col items-center justify-center text-white">
        <img className="mb-4 size-20" src={TaskApproved} alt="" />

        <h1 className="mb-3 text-lg font-bold">Submission Success!</h1>
        <Button type="primary" shape="round" size="large" onClick={onClose} className="min-w-40">
          Got it
        </Button>
      </div>
    </Modal>
  )
}
