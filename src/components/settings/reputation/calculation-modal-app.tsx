import { Modal } from 'antd'

import CloseBtn from '@/components/common/close-btn'
import { ReputationDetail } from '@/apis/reputation.api'

interface CalculationModalAppProps {
  open: boolean
  onClose: () => void
  data?: ReputationDetail
}

export default function CalculationModalApp({ open, onClose, data }: CalculationModalAppProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closeIcon={null}
      centered
      width={322}
      transitionName=""
      maskTransitionName=""
      zIndex={9999}
      classNames={{
        content: '!p-0 !bg-transparent',
        mask: '!bg-[#3333333B]'
      }}
    >
      <>
        <div className="rounded-[34px] border border-white/60 bg-[#F5F5F5]/60 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.1)] backdrop-blur-2xl">
          <div className="mb-6 text-center text-[20px] font-bold text-[#1C1C26]">About calculation</div>

          <div className="flex flex-col items-center">
            <CalculationRow label="Identity" weight={data?.identify?.percent} score={data?.identify?.value ?? 0} />
            <PlusSign />
            <CalculationRow label="Activity" weight={data?.login?.percent} score={data?.login?.value ?? 0} />
            <PlusSign />
            <CalculationRow label="Staking" weight={data?.staking?.percent} score={data?.staking?.value ?? 0} />
            <PlusSign />
            <CalculationRow
              label="Contribution"
              weight={data?.contribution?.percent}
              score={data?.contribution?.value ?? 0}
            />
            <MinusSign />

            <div className="flex h-[38px] w-full items-center justify-between rounded-[19px] bg-[#F5F5F5] px-5">
              <span className="font-medium text-[#1C1C26]">Malicious</span>
              <span className="font-bold text-[#FFA800]">{Math.abs(data?.malicious_behavior?.score ?? 0)}</span>
            </div>
          </div>
        </div>

        <CloseBtn onClick={onClose} className="mx-auto mt-3" />
      </>
    </Modal>
  )
}

function PlusSign() {
  return <div className="flex h-[26px] items-center justify-center text-lg font-bold text-[#1C1C26]">+</div>
}

function MinusSign() {
  return <div className="flex h-[26px] items-center justify-center text-lg font-bold text-[#1C1C26]">-</div>
}

interface CalculationRowProps {
  label: string
  weight?: string | null
  score: number
}

function CalculationRow({ label, weight, score }: CalculationRowProps) {
  return (
    <div className="flex w-full items-center justify-between rounded-full bg-[#F5F5F5] px-3 py-2">
      <span className="font-medium text-[#1C1C26]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-bold text-[#1C1C26]">{score} x </span>
        {weight && (
          <span className="flex h-[22px] min-w-[44px] items-center justify-center rounded-full bg-[rgba(64,225,239,0.12)] px-2 text-xs font-bold text-[#40E1EF]">
            {weight}
          </span>
        )}
      </div>
    </div>
  )
}
