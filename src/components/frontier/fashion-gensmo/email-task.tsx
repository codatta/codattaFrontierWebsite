import { Button, Input, message } from 'antd'
import { cn } from '@udecode/cn'
import { Info } from 'lucide-react'
import { useState } from 'react'

import { useCountdown } from '@/hooks/use-countdown'
import { isValidGoogleEmail } from '@/utils/str'
import userApi from '@/apis/user.api'

export function EmailTask({ className, taskId }: { className?: string; taskId: string }) {
  const [loading, setLoading] = useState(false)
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [seconds, , restart, stop] = useCountdown(60, {
    onTimeout: () => {
      setLoading(false)
    },
    autoStart: false
  })
  const disabled = seconds > 0 && seconds < 60

  const onSendCode = async () => {
    if (!isValidEmail) {
      message.error('Please enter a valid Google email')
      return
    }
    setLoading(true)
    try {
      const res = await userApi.getVerificationCode({ email })
      console.log('res', res)
      message.success('Verification code sent successfully!')
      restart()
    } catch (error) {
      message.error(error.message || 'An unexpected error occurred')
      stop()
    }
    setLoading(false)
  }

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value?.trim()
    setEmail(email)
    setIsValidEmail(isValidGoogleEmail(email))
  }

  const onCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value?.trim())
  }

  const canSubmit = isValidEmail && code.length === 6

  const onSubmit = async () => {
    try {
      const res = await userApi.checkEmail({ email, code, task_id: taskId })
      console.log('res', res)
      message.success('Verification code sent successfully!')
      restart()
    } catch (error) {
      message.error(error.message || 'An unexpected error occurred')
      stop()
    }
    setLoading(false)
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
        placeholder="Enter your Google account"
        size="large"
        className="mt-2"
        onChange={onEmailChange}
        value={email}
        suffix={
          <Button type="text" ghost disabled={disabled || !isValidEmail} loading={loading} onClick={onSendCode}>
            {disabled ? `${seconds}s` : 'Send Code'}
          </Button>
        }
      />
      <h3 className="mt-3 text-base font-bold">Verification Code*</h3>
      <Input placeholder="Enter the 6-digit code" size="large" onChange={onCodeChange} value={code} className="mt-2" />

      <Button
        size="large"
        className={cn('mt-3 h-[48px] w-[240px] rounded-full', !canSubmit && 'opacity-30')}
        type="primary"
        onClick={onSubmit}
      >
        Submit
      </Button>
    </div>
  )
}
