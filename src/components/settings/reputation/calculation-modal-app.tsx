import { Modal } from 'antd'
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
      classNames={{
        content: 'p-0 bg-transparent',
        mask: 'bg-[#3333333B]'
      }}
    >
      <>
        <div className="rounded-[34px] border border-white/60 bg-white/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.1)] backdrop-blur-2xl">
          <div className="mb-6 text-center text-[20px] font-bold text-[#1C1C26]">About calculation</div>

          <div className="flex flex-col items-center">
            <CalculationRow label="Identity" weight={data?.identify?.percent} score={data?.identify?.score ?? 0} />
            <PlusSign />
            <CalculationRow label="Activity" weight={data?.login?.percent} score={data?.login?.score ?? 0} />
            <PlusSign />
            <CalculationRow label="Staking" weight={data?.staking?.percent} score={data?.staking?.score ?? 0} />
            <PlusSign />
            <CalculationRow
              label="Contribution"
              weight={data?.contribution?.percent}
              score={data?.contribution?.score ?? 0}
            />
            <MinusSign />

            <div className="flex h-[38px] w-full items-center justify-between rounded-[19px] bg-[#F5F5F5] px-5">
              <span className="font-medium text-[#1C1C26]">Malicious</span>
              <span className="font-bold text-[#FFA800]">{Math.abs(data?.malicious_behavior?.score ?? 0)}</span>
            </div>
          </div>
        </div>
        <div className="mt-0 flex items-center justify-center">
          <CloseIcon onClick={onClose} />
        </div>
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

function CloseIcon({ onClick }: { onClick: () => void }) {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="white"
        style={{ mixBlendMode: 'multiply' }}
      />
      <g opacity={0.67}>
        <mask
          id="mask0_45161_61596"
          style={{ maskType: 'luminance' }}
          maskUnits="userSpaceOnUse"
          x="-50"
          y="-50"
          width="196"
          height="196"
        >
          <rect width="196" height="196" transform="translate(-50 -50)" fill="white" />
          <rect x="26" y="26" width="44" height="44" rx="22" fill="black" />
        </mask>
        <g mask="url(#mask0_45161_61596)">
          <foreignObject x="-14" y="-12" width="124" height="124">
            <div
              style={{
                backdropFilter: 'blur(20px)',
                clipPath: 'url(#bgblur_0_45161_61596_clip_path)',
                height: '100%',
                width: '100%'
              }}
            />
          </foreignObject>
          <g filter="url(#filter0_f_45161_61596)" data-figma-bg-blur-radius="40">
            <path
              d="M26 50C26 37.8497 35.8497 28 48 28C60.1503 28 70 37.8497 70 50C70 62.1503 60.1503 72 48 72C35.8497 72 26 62.1503 26 50Z"
              fill="black"
              fillOpacity={0.04}
              style={{ mixBlendMode: 'hard-light' }}
            />
          </g>
        </g>
      </g>
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="#333333"
        style={{ mixBlendMode: 'color-dodge' }}
      />
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="white"
        fillOpacity={0.5}
      />
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="#F7F7F7"
        style={{ mixBlendMode: 'plus-darker' as React.CSSProperties['mixBlendMode'] }}
      />
      <rect x="26" y="26" width="44" height="44" rx="22" fill="black" fillOpacity={0.01} />
      <g style={{ mixBlendMode: 'plus-darker' as React.CSSProperties['mixBlendMode'] }}>
        <path
          d="M39.7739 56.2495C39.6411 56.1167 39.5526 55.959 39.5083 55.7764C39.464 55.5993 39.464 55.4194 39.5083 55.2368C39.5526 55.0597 39.6383 54.9103 39.7656 54.7886L46.5308 48.0234L39.7656 41.2583C39.6383 41.1366 39.5526 40.9871 39.5083 40.8101C39.464 40.633 39.464 40.4531 39.5083 40.2705C39.5526 40.0879 39.6411 39.9302 39.7739 39.7974C39.9067 39.6646 40.0617 39.576 40.2388 39.5317C40.4214 39.4875 40.6012 39.4875 40.7783 39.5317C40.9554 39.576 41.1104 39.6618 41.2432 39.7891L48 46.5542L54.7568 39.7974C54.8896 39.6646 55.0446 39.576 55.2217 39.5317C55.3988 39.4875 55.5758 39.4875 55.7529 39.5317C55.93 39.576 56.085 39.6646 56.2178 39.7974C56.3561 39.9302 56.4474 40.0879 56.4917 40.2705C56.536 40.4476 56.536 40.6247 56.4917 40.8018C56.4474 40.9788 56.3589 41.1338 56.2261 41.2666L49.4692 48.0234L56.2261 54.7803C56.3589 54.9131 56.4447 55.0653 56.4834 55.2368C56.5277 55.4139 56.5277 55.591 56.4834 55.7681C56.4447 55.9507 56.3561 56.1112 56.2178 56.2495C56.085 56.3823 55.93 56.4709 55.7529 56.5151C55.5758 56.5594 55.3988 56.5594 55.2217 56.5151C55.0446 56.4709 54.8896 56.3823 54.7568 56.2495L48 49.4927L41.2432 56.2578C41.1104 56.3851 40.9554 56.4709 40.7783 56.5151C40.6012 56.5594 40.4242 56.5594 40.2471 56.5151C40.07 56.4709 39.9123 56.3823 39.7739 56.2495Z"
          fill="#404040"
          style={{ mixBlendMode: 'plus-darker' as React.CSSProperties['mixBlendMode'] }}
        />
      </g>
      <defs>
        <filter
          id="filter0_f_45161_61596"
          x="-14"
          y="-12"
          width="124"
          height="124"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur_45161_61596" />
        </filter>
        <clipPath id="bgblur_0_45161_61596_clip_path" transform="translate(14 12)">
          <path d="M26 50C26 37.8497 35.8497 28 48 28C60.1503 28 70 37.8497 70 50C70 62.1503 60.1503 72 48 72C35.8497 72 26 62.1503 26 50Z" />
        </clipPath>
      </defs>
    </svg>
  )
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
