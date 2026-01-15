import { Modal } from 'antd'
import { X } from 'lucide-react'
import { cn } from '@udecode/cn'
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
      width={340}
      styles={{
        content: {
          padding: 0,
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <div className="p-6">
        <div className="mb-6 text-center text-lg font-bold text-[#1C1C26]">About calculation</div>

        <div className="space-y-4">
          <CalculationRow
            label="Identity"
            weight={data?.identify?.percent}
            score={data?.identify?.score ?? 0}
            color="bg-[#58E6F3]/20 text-[#1C1C26]"
          />
          <CalculationRow
            label="Activity"
            weight={data?.login?.percent}
            score={data?.login?.score ?? 0}
            color="bg-[#79A5FC]/20 text-[#1C1C26]"
          />
          <CalculationRow
            label="Staking"
            weight={data?.staking?.percent}
            score={data?.staking?.score ?? 0}
            color="bg-[#58E6F3]/20 text-[#1C1C26]"
          />
          <CalculationRow
            label="Contribution"
            weight={data?.contribution?.percent}
            score={data?.contribution?.score ?? 0}
            color="bg-[#58E6F3]/20 text-[#1C1C26]"
          />

          <div className="flex items-center justify-between">
            <span className="font-medium text-[#1C1C26]">Malicious</span>
            <span className="font-bold text-[#FFA800]">{data?.malicious_behavior?.score ?? 0}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button onClick={onClose} className="rounded-full bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <X className="size-5 text-[#1C1C26]" />
          </button>
          <button onClick={onClose} className="h-10 rounded-full bg-[#1C1C26] px-8 font-medium text-white">
            Go
          </button>
        </div>
      </div>
    </Modal>
  )
}

interface CalculationRowProps {
  label: string
  weight?: string | null
  score: number
  color: string
}

function CalculationRow({ label, weight, score, color }: CalculationRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium text-[#1C1C26]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-bold text-[#1C1C26]">{score}*</span>
        <span className={cn('rounded px-1.5 py-0.5 text-xs font-bold', color)}>{weight || '0%'}</span>
      </div>
    </div>
  )
}
