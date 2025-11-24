import { Button, Modal } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useState } from 'react'

interface TokenLockModalProps {
  open: boolean
  onClose: () => void
}

export default function TokenLockModal({ open, onClose }: TokenLockModalProps) {
  // Mock data state
  const [loading, setLoading] = useState(false)

  // Toggle this to see error state (simulated for now)
  const [hasInsufficientBalance, setHasInsufficientBalance] = useState(false)

  const mockData = {
    network: 'BNB Chain',
    address: '0x134256...abcd',
    balance: '0.0037 BNB',
    gasFee: '0.0037 BNB',
    lockAmount: '50',
    lockToken: 'USDT'
  }

  const handleConfirm = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      onClose()
    }, 2000)
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={480}
      footer={null}
      styles={{ content: { padding: 0, backgroundColor: '#252532', color: 'white' } }}
      centered
      closeIcon={<span className="text-white/60 hover:text-white">✕</span>}
    >
      <div className="p-6">
        <div className="mb-6 text-lg font-bold text-white">Lock now</div>

        {/* Details List */}
        <div className="mb-6 space-y-6 text-base text-[#8D8D93]">
          <div className="flex items-center justify-between">
            <span>Network</span>
            <span className="text-white">{mockData.network}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Receiving Wallet Address</span>
            <span className="text-white">{mockData.address}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Balance(for gas)</span>
            <span className={hasInsufficientBalance ? 'text-[#D92B2B]' : 'text-white'}>{mockData.balance}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Gas Fee</span>
            <span className={hasInsufficientBalance ? 'text-[#D92B2B]' : 'text-white'}>{mockData.gasFee}</span>
          </div>
        </div>

        {/* Lock Amount Box */}
        <div className="mb-6 rounded-2xl bg-[#1C1C26] p-4">
          <div className="mb-3 flex items-center justify-between border-b border-[#FFFFFF1F] pb-2 text-lg font-bold">
            <span className="text-white">To lock</span>
            <span className="text-[#FFA800]">
              {mockData.lockAmount} <span className="font-normal">{mockData.lockToken}</span>
            </span>
          </div>
          <p className="text-sm leading-5 text-[#77777D]">
            These rewards will be locked in a 3-month lock-up contract (T+90). After they unlock, you can claim them on
            the "Lock-up" page and they will be sent directly to your wallet.
          </p>
        </div>

        {/* Error Alert */}
        {hasInsufficientBalance && (
          <div className="mb-6 flex gap-3 rounded-xl border border-[#D92B2B]/20 bg-[#D92B2B]/10 p-3 text-sm text-[#D92B2B]">
            <InfoCircleOutlined className="mt-0.5 text-lg" />
            <p>BNB balance insufficient to cover gas. Please top up and try again.</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="text" className="h-10 w-[120px] rounded-full text-white hover:text-white/80" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="primary"
            className="h-10 w-[140px] rounded-full bg-[#875DFF] hover:bg-[#754DEB] disabled:opacity-50"
            onClick={handleConfirm}
            loading={loading}
            disabled={hasInsufficientBalance}
          >
            Confirm Lock
          </Button>
        </div>
      </div>
    </Modal>
  )
}
