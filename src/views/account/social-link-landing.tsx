import { useParams } from 'react-router-dom'
import querystring from 'query-string'
import { useEffect } from 'react'
import accountApi from '@/apis/account.api'
import { Loader2 } from 'lucide-react'
import ImageLogo from '@/assets/images/logo-white.png'
import { userStoreActions } from '@/stores/user.store'
import frontiterApi from '@/apis/frontiter.api'

const channel = new BroadcastChannel('codatta:social-link')

export default function Component() {
  const params = useParams()
  const socialMedia = params.social_media
  const query = querystring.parse(window.location.search)

  function onClose() {
    sendBroadcastMessage()
    window.close()
  }

  function sendBroadcastMessage() {
    channel.postMessage('update')
  }

  useEffect(() => {
    window.addEventListener('close', sendBroadcastMessage)
    return () => {
      window.removeEventListener('close', sendBroadcastMessage)
      userStoreActions.closeLinkSuccess()
      userStoreActions.closeLinkError()
    }
  }, [])

  async function accountLink(type: string, params: Record<string, string> | null) {
    try {
      if (type == 'discord-link') {
        if (!query.code) throw new Error('The account connect has been cancelled.')
        await accountApi.linkSocialAccount('Discord', { code: query.code })
        userStoreActions.showLinkSuccess(onClose)
      } else if (type == 'x-link') {
        if (!query.oauth_token) throw new Error('The account connect has been cancelled.')
        await accountApi.linkSocialAccount('X', {
          oauth_verifier: query.oauth_verifier,
          oauth_token: query.oauth_token
        })
        userStoreActions.showLinkSuccess(onClose)
      } else if (type === 'telegram-link') {
        const data = new URLSearchParams(window.location.search)
        await accountApi.linkSocialAccount('Telegram', data)
        userStoreActions.showLinkSuccess(onClose)
      } else if (type === 'discord-bind-task') {
        if (!query.code) throw new Error('The account connect has been bind.')
        const data = await frontiterApi.getSocialBindInfo({ type: 'DISCORD', value: { code: query.code as string } })
        await frontiterApi.submitTask(params?.taskId as string, {
          templateId: params?.templateId as string,
          taskId: params?.taskId as string,
          data: {
            site: 'Discord',
            opt: 'bind',
            ...data
          }
        })
      } else {
        throw new Error(`No supported social media type [${type}].`)
      }
    } catch (err) {
      userStoreActions.showLinkError(err.message, onClose)
    }
  }

  function getTaskType() {
    const url = new URL(window.location.href)
    const state = url.searchParams.get('state')
    if (!state) return { key: `${socialMedia}-link`, params: null }
    const decodedState = atob(state)
    const parsedState = JSON.parse(decodedState)
    return { key: `${parsedState.key}`, params: parsedState.params }
  }

  useEffect(() => {
    if (socialMedia) {
      const { key, params } = getTaskType()
      accountLink(key, params)
    }
  }, [socialMedia])

  return (
    <div className="flex size-full flex-col items-center justify-center gap-3 p-6">
      <header className="mb-4 flex w-full justify-center border-b p-4">
        <img src={ImageLogo} className="h-6" alt="" />
      </header>
      <Loader2 className="animate-spin"></Loader2>
    </div>
  )
}
