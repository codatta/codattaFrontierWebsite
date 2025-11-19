import { Button, message } from 'antd'
import { useCallback, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

type LocationState = {
  link?: string
}

async function mockDiscordVerify({ taskId }: { taskId?: string }) {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return { success: true, taskId, action: 'discord-join' }
}

export default function DiscordJoinServer() {
  const { taskId } = useParams<{ taskId?: string }>()
  const location = useLocation()
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [verifyError, setVerifyError] = useState('')

  const locationState = location.state as LocationState | null
  const linkUrl = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return locationState?.link || params.get('link') || 'https://discord.com/invite/YCESVmHEYv'
  }, [location.search, locationState])

  const handleComplete = useCallback(() => {
    if (!linkUrl) {
      message.info('Link not provided. Please follow the instructions.')
      return
    }
    window.open(linkUrl, '_blank')
  }, [linkUrl])

  const handleVerify = useCallback(async () => {
    setVerifyLoading(true)
    setVerifyStatus('idle')
    setVerifyError('')
    try {
      await mockDiscordVerify({ taskId })
      setVerifyStatus('success')
      message.success('Verification request sent. Please wait for confirmation.')
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Verification failed'
      setVerifyStatus('error')
      setVerifyError(errMsg)
      message.error(errMsg)
    } finally {
      setVerifyLoading(false)
    }
  }, [taskId])

  return (
    <div className="min-h-screen bg-[#050011] text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-8">
        <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
          <h1 className="text-2xl font-bold">Join the Discord Server</h1>
          <p className="text-sm text-white/70">
            Click Complete to open the community server. After joining, click Verify.
          </p>
          {linkUrl && (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-white/70">
              {linkUrl}
            </div>
          )}
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <Button
            type="primary"
            block
            className="rounded-[32px] border-none py-4 text-base font-semibold"
            onClick={handleComplete}
          >
            Complete
          </Button>
          <Button
            type="default"
            block
            loading={verifyLoading}
            className="rounded-[32px] border border-white/30 py-4 text-base font-semibold text-white"
            onClick={handleVerify}
          >
            Verify Join
          </Button>
        </div>
        {verifyStatus === 'success' && (
          <p className="mt-4 text-center text-sm text-emerald-400">Verification request sent.</p>
        )}
        {verifyStatus === 'error' && verifyError && (
          <p className="mt-4 text-center text-sm text-rose-400">{verifyError}</p>
        )}
      </div>
    </div>
  )
}
