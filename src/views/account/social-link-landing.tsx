import { useParams } from 'react-router-dom'
import querystring from 'query-string'
import { useEffect } from 'react'
import accountApi from '@/apis/account.api'
import { Loader2 } from 'lucide-react'
import ImageLogo from '@/assets/images/logo-white.png'
import { userStoreActions } from '@/stores/user.store'

const channel = new BroadcastChannel('codatta:social-link')

export function Component() {
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

  async function accountLink(type: string) {
    try {
      if (type == 'discord') {
        if (!query.code) throw new Error('The account connect has been cancelled.')
        await accountApi.linkSocialAccount('Discord', { code: query.code })
        userStoreActions.showLinkSuccess(onClose)
      } else if (type == 'x') {
        if (!query.oauth_token) throw new Error('The account connect has been cancelled.')
        await accountApi.linkSocialAccount('X', {
          oauth_verifier: query.oauth_verifier,
          oauth_token: query.oauth_token
        })
        userStoreActions.showLinkSuccess(onClose)
      } else if (type === 'telegram') {
        const data = new URLSearchParams(window.location.search)
        await accountApi.linkSocialAccount('Telegram', data)
        userStoreActions.showLinkSuccess(onClose)
      } else {
        throw new Error(`No supported social media type [${type}].`)
      }
    } catch (err) {
      userStoreActions.showLinkError(err.message, onClose)
    }
  }

  useEffect(() => {
    if (socialMedia) {
      accountLink(socialMedia?.toLocaleLowerCase())
    }
  }, [socialMedia])

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6">
      <header className="boder-b border-gray-6 mb-4 flex w-full justify-center p-4">
        <img src={ImageLogo} className="h-24px" alt="" />
      </header>
      <Loader2 className="animate-spin"></Loader2>
    </div>
  )
}
