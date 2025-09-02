import { Button, Input } from 'antd'
import { cn } from '@udecode/cn'
import { Info } from 'lucide-react'

import { useCountdown } from '@/hooks/use-countdown'
import { useState } from 'react'

export function EmailTask({ className }: { className?: string }) {
  const [seconds, setSeconds] = useCountdown(60)
  const [loading, setLoading] = useState(false)

  const onSendCode = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }

  return (
    <div className={cn('text-sm leading-[22px]', className)}>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-[#875DFF33] px-3 py-[2px] text-sm font-semibold text-[#875DFF]">Task2</span>
        <span className="text-base font-bold">Sign up using your Google account *</span>
        <div className="flex flex-1 items-center justify-end gap-1 text-[#FFA800]">
          <Info className="mr-1" size={14} />
          The Google account must match your sign-up account.
        </div>
      </div>
      <Input
        placeholder="Provide your signup Google account"
        suffix={
          <Button
            className="text-[#875DFF] hover:!bg-none"
            onClick={onSendCode}
            disabled={loading}
            loading={loading}
            type="text"
          >
            Send Code
          </Button>
        }
        className="mt-3 h-[44px]"
      />

      <Button type="primary" className="mt-3 h-[48px] w-[240px] rounded-full">
        Submit
      </Button>
    </div>
  )
}
