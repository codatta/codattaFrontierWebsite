import { cn } from '@udecode/cn'
import { Info } from 'lucide-react'
import { Modal } from 'antd'
import { useState } from 'react'

export default function Tips({ isMobile }: { isMobile: boolean }) {
  const tips = [
    'Clear real photo (no blur/AI/internet downloads).',
    'Only one knob per image.(no multiple knobs).',
    'Scale markings: Chinese/English/Arabic numerals only (no icons).',
    'Pointer must clearly point to one scale (no obstruction or in-between positions).'
  ]

  return isMobile ? <MobileTips tips={tips} /> : <PcTips tips={tips} />
}

function MobileTips({ tips }: { tips: string[] }) {
  const [showTips, setShowTips] = useState(false)

  return (
    <div className="relative">
      <Info size={16} color="#77777D" onClick={() => setShowTips(!showTips)} />
      <Modal
        open={showTips}
        onCancel={() => setShowTips(false)}
        footer={null}
        centered
        closeIcon={false}
        className="p-10 [&_.ant-modal-content]:bg-[#252532] [&_.ant-modal-content]:bg-none [&_.ant-modal-content]:p-6"
      >
        <ul className={cn('ml-2 list-outside list-disc text-xs text-[#BBBBBE]')}>
          {tips.map((tip, index) => (
            <li key={index} className="mb-2">
              {tip}
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  )
}

function PcTips({ tips }: { tips: string[] }) {
  const [showTips, setShowTips] = useState(false)

  return (
    <div className="relative">
      <Info
        size={16}
        color="#77777D"
        className="cursor-pointer"
        onMouseEnter={() => setShowTips(true)}
        onMouseLeave={() => setShowTips(false)}
      />
      <ul
        className={cn(
          'pointer-events-none absolute left-0 top-5 z-10 origin-top-left list-inside list-disc text-nowrap rounded-lg bg-[#252532] p-2 pl-4 text-xs text-[#77777D] transition-all duration-300',
          showTips ? 'opacity-100' : 'opacity-0'
        )}
      >
        {tips.map((tip, index) => (
          <li key={index} className="mb-2">
            {tip}
          </li>
        ))}
      </ul>
    </div>
  )
}
