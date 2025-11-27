import { Button, Modal } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useState } from 'react'
import SuccessIcon from '@/assets/frontier/food-tpl-m2/approved-icon.svg'
import { ExternalLink } from 'lucide-react'

interface TokenSettleClaimModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function TokenSettleClaimModal({ open, onClose, onSuccess }: TokenSettleClaimModalProps) {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'confirm' | 'success'>('confirm')
  const [hasInsufficientBalance, setHasInsufficientBalance] = useState(false)

  const mockData = {
    network: 'BNB Chain',
    address: '0x134256...abcd',
    balance: '0.0037 BNB',
    gasFee: '0.0037 BNB',
    lockAmount: '50',
    lockToken: 'USDT',
    txHash: '0x9fa1...1234'
  }

  const handleConfirm = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setStep('success')
    }, 2000)
  }

  const handleClose = () => {
    setStep('confirm')
    onClose()
  }

  const handleGoToHistory = () => {
    if (onSuccess) {
      onSuccess()
    }
    handleClose()
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      width={480}
      footer={null}
      styles={{ content: { padding: 0, backgroundColor: '#252532', color: 'white' } }}
      centered
      closeIcon={<span className="text-white/60 hover:text-white">✕</span>}
    >
      {step === 'confirm' ? (
        <div className="p-6">
          <div className="mb-6 text-lg font-bold text-white">Claim all</div>

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
              These rewards will be locked in a 3-month lock-up contract (T+90). After they unlock, you can claim them
              on the "Lock-up" page and they will be sent directly to your wallet.
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
            <Button
              type="text"
              className="h-10 w-[120px] rounded-full text-white hover:text-white/80"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              className="h-10 w-[140px] rounded-full bg-[#875DFF] hover:bg-[#754DEB] disabled:opacity-50"
              onClick={handleConfirm}
              loading={loading}
              disabled={hasInsufficientBalance}
            >
              Confirm Claim
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center p-8 text-center">
          <img src={SuccessIcon} alt="Success" className="mb-6 size-16" />

          <p className="mb-4 max-w-[340px] text-base text-white">
            All unlocked rewards have been claimed from the lock-up contract and sent to your wallet. You can check the
            details anytime in Claim History
          </p>

          <a
            href={`https://etherscan.io/tx/${mockData.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-8 flex items-center gap-1 text-[#875DFF] hover:text-[#A78BFA]"
          >
            TX:{mockData.txHash} <ExternalLink className="size-4" />
          </a>

          <Button
            className="h-10 rounded-full border-none bg-white px-8 text-[#1C1C26] hover:!bg-white/90"
            onClick={handleGoToHistory}
          >
            Go to Claim History
          </Button>
        </div>
      )}
    </Modal>
  )
}
