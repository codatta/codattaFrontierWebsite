import { Modal } from 'antd'
import { Button } from '@/components/booster/button'

import { useCountdown } from '@/hooks/use-countdown'
import { useState } from 'react'

export default function PrivacyModel({ onClose }: { onClose: () => void }) {
  const [disabled, setDisabled] = useState(true)
  const [seconds] = useCountdown(6, () => {
    setDisabled(false)
  })

  return (
    <Modal footer={null} centered closeIcon={false} width={300} open={true}>
      <div className="py-1 text-center">
        <h2 className="text-xl font-bold">Data Privacy and Consent</h2>
        <div className="mt-5 max-h-[300px] overflow-y-auto text-sm leading-[22px] text-[#BBBBBE]">
          By joining the Codatta Booster Campaign, you consent to the collection and use of your personal information.
          Participation is voluntary, and your information will remain confidential. Your response will be used
          exclusively for internal purposes to enhance our services and better understand our users. We will not share
          your data with third parties without your consent.
        </div>
        <Button
          className="mt-8 w-full"
          onClick={onClose}
          text={disabled ? `Continue(${seconds}s)` : 'Continue'}
          disabled={disabled}
        />
      </div>
    </Modal>
  )
}
