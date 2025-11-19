import { Button, message } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

type LocationState = {
  link?: string
}

import frontiterApi from '@/apis/frontiter.api'

export default function TelegramJoinGroup(props: { templateId: string }) {
  const { templateId } = props
  const { taskId } = useParams<{ taskId?: string }>()
  const location = useLocation()
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [verifyError, setVerifyError] = useState('')

  const locationState = location.state as LocationState | null
  const [apiLink, setApiLink] = useState('')

  const [linkLoading, setLinkLoading] = useState(false)

  useEffect(() => {
    if (!taskId) return
    let cancelled = false

    const loadTaskLink = async () => {
      setLinkLoading(true)
      try {
        const taskDetail = await frontiterApi.getTaskDetail(taskId)
        const displayData = taskDetail?.data?.data_display
        const linkFromTask = displayData?.link
        if (!cancelled && linkFromTask) {
          setApiLink(linkFromTask)
        }
      } catch (err: unknown) {
        console.error('Failed to fetch task detail link', err)
      } finally {
        if (!cancelled) {
          setLinkLoading(false)
        }
      }
    }

    loadTaskLink()

    return () => {
      cancelled = true
    }
  }, [taskId])

  const linkUrl = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return locationState?.link || params.get('link') || apiLink || 'https://t.me/codatta_io/1'
  }, [location.search, locationState, apiLink])

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
          site: 'Telegram',
          opt: 'join',
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
          <h1 className="text-2xl font-bold">Join the Telegram Group</h1>
          <p className="text-sm text-white/70">
            Complete opens the invite link. After joining, click Verify to confirm.
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
            loading={linkLoading}
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
