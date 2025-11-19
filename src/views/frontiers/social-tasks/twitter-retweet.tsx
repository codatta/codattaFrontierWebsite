import { Button, message } from 'antd'
import { useCallback, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import frontiterApi from '@/apis/frontiter.api'

type LocationState = {
  link?: string
}

export default function TwitterRetweet(props: { templateId: string }) {
  const { templateId } = props
  const { taskId } = useParams<{ taskId?: string }>()
  const location = useLocation()
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [verifyError, setVerifyError] = useState('')

  const locationState = location.state as LocationState | null
  const linkUrl = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return (
      locationState?.link || params.get('link') || 'https://twitter.com/intent/retweet?tweet_id=1956346473148526888'
    )
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
    if (!taskId) return
    if (!templateId) return
    try {
      await frontiterApi.submitTask(taskId, {
        templateId,
        taskId,
        data: {
          site: 'X',
          opt: 'retweet',
          link: linkUrl
        }
      })
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
  }, [taskId, linkUrl, templateId])

  return (
    <div className="min-h-screen bg-[#050011] text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-8">
        <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
          <h1 className="text-2xl font-bold">Retweet on Twitter</h1>
          <p className="text-sm text-white/70">
            Use Complete to open the post you need to retweet, then hit Verify after completing the retweet.
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
            Verify Retweet
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
