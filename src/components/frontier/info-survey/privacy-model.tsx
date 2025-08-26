import { Modal } from 'antd'
import { Button } from '@/components/booster/button'

export default function PrivacyModel({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onCancel={onClose} footer={null} centered closeIcon={false} width={600}>
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold">Privacy Consent</h2>
        <div className="mt-4 overflow-y-auto px-4 text-left indent-4">
          <p>
            By joining the Codatta Booster Campaign, you consent to the collection and use of your personal information.
            Participation is voluntary, and your information will remain confidential.
          </p>
          <p>
            Your response will be used exclusively for internal purposes to enhance our services and better understand
            our users. We will not share your data with third parties without your consent.
          </p>
        </div>
        <Button className="mt-6 min-w-[120px] !px-6" onClick={onClose} text="Continue" />
      </div>
    </Modal>
  )
}
