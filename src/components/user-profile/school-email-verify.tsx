import { useState, useEffect } from 'react'
import { Input, Button, message } from 'antd'
import { cn } from '@udecode/cn'

import userApi from '@/apis/user.api'
import { useCountdown } from '@/hooks/use-countdown'

interface SchoolEmailVerifyProps {
  /** Frontier task ID required by the verify endpoint; pass empty string if not applicable */
  taskId?: string
  /** Initial email value to display */
  initialEmail?: string
  onVerified?: (email: string) => void
  /** Callback when verification status changes */
  onVerificationStatusChange?: (verified: boolean) => void
}

export function SchoolEmailVerify({
  taskId = '',
  initialEmail = '',
  onVerified,
  onVerificationStatusChange
}: SchoolEmailVerifyProps) {
  const [email, setEmail] = useState(initialEmail)
  const [code, setCode] = useState('')
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [verified, setVerified] = useState(false)

  const [countdown, countdownEnded, restartCountdown] = useCountdown(60, null, false)

  // Sync initialEmail changes to internal state
  useEffect(() => {
    if (initialEmail && initialEmail !== email) {
      setEmail(initialEmail)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEmail])

  const canSendCode = !sending && countdownEnded && email.trim().length > 0
  const canVerify = !verified && codeSent && code.trim().length > 0

  function handleEmailChange(val: string) {
    setEmail(val)
    if (verified) {
      setVerified(false)
      onVerificationStatusChange?.(false)
    }
    if (codeSent) {
      setCodeSent(false)
      setCode('')
    }
  }

  async function handleSendCode() {
    if (!email.trim()) {
      message.error('Please enter your school email')
      return
    }
    setSending(true)
    try {
      await userApi.getVerificationCode({ account_type: 'email', email: email.trim(), opt: 'verify' })
      message.success('Verification code sent')
      setCodeSent(true)
      restartCountdown()
    } catch (err) {
      message.error((err as Error).message || 'Failed to send verification code')
    } finally {
      setSending(false)
    }
  }

  async function handleVerify() {
    if (!email.trim() || !code.trim()) return
    setVerifying(true)
    try {
      const result = await userApi.checkEmail({ email: email.trim(), code: code.trim(), task_id: taskId })
      if (result.flag) {
        message.success('Email verified successfully')
        setVerified(true)
        onVerified?.(email.trim())
        onVerificationStatusChange?.(true)
      } else {
        message.error(result.info || 'Verification failed')
      }
    } catch (err) {
      message.error((err as Error).message || 'Failed to verify code')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-[#252532] p-4">
      {/* School Email */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-white">
          School Email<span className="text-[#8D8D93]">*</span>
        </p>
        <div
          className={cn(
            'flex h-[48px] items-center justify-between rounded-lg border px-4',
            verified ? 'border-green-500/40 bg-green-500/5' : 'border-[rgba(255,255,255,0.12)]'
          )}
        >
          <Input
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            placeholder="Provide your school email"
            variant="borderless"
            className="flex-1 !bg-transparent !p-0 !text-white placeholder:!text-[#8D8D93]"
            disabled={verified}
          />
          <button
            onClick={handleSendCode}
            disabled={!canSendCode}
            className={cn(
              'shrink-0 text-sm font-semibold transition-colors',
              canSendCode ? 'cursor-pointer text-[#875DFF] hover:opacity-80' : 'cursor-not-allowed text-[#606067]'
            )}
          >
            {sending ? 'Sending...' : !countdownEnded ? `${countdown}s` : codeSent ? 'Resend' : 'Send Code'}
          </button>
        </div>
      </div>

      {/* Verification Code */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-white">
          Verification Code<span className="text-[#8D8D93]">*</span>
        </p>
        <div className="flex gap-3">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onPressEnter={canVerify ? handleVerify : undefined}
            placeholder="Enter verification code"
            className="h-[48px] flex-1 !rounded-lg !bg-transparent !text-white placeholder:!text-[#8D8D93]"
            disabled={verified}
          />
          <Button
            onClick={handleVerify}
            loading={verifying}
            disabled={!canVerify}
            className={cn(
              'h-[48px] !rounded-lg !border-none !px-8 !font-semibold !text-white',
              verified ? '!bg-green-600' : '!bg-[#875DFF] disabled:!opacity-40'
            )}
          >
            {verified ? 'Verified' : 'Verify'}
          </Button>
        </div>
      </div>
    </div>
  )
}
