import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import ExtensionChecker from '@/components/account/extension-checker'
import { Spin } from 'antd'
import { LoaderCircle } from 'lucide-react'
import { CodattaSignin } from 'codatta-connect'
import { ILoginResponse } from 'codatta-connect/dist/api/account.api'
import { CodattaSigninConfig } from 'codatta-connect/dist/providers/codatta-signin-context-provider'
import { useChannelStore } from '@/stores/channel.store'
import CodattaLogoWhite from '@/assets/common/logo-white.svg'

function CodattaSigninHead() {
  return (
    <div>
      <img src={CodattaLogoWhite} className="mb-3 h-8" alt="" />
      <h1 className="mb-8 text-lg font-bold">Log in to Codatta</h1>
    </div>
  )
}

export default function AccountSignin() {
  const appToken = localStorage.getItem('token')
  const [sarechParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading] = useState(false)

  const from = sarechParams.get('from') || '/app'
  const source = from === 'extension' ? 'PLUG' : 'WEB'
  const redirectUrl =
    from === 'extension' ? '/account/extension/signin' : from || '/app'
  const channelInfo = useChannelStore()

  if (appToken && from !== 'extension') {
    return <Navigate to={redirectUrl}></Navigate>
  }

  async function handleLogin(res: ILoginResponse) {
    localStorage.setItem('token', res.old_token)
    localStorage.setItem('uid', res.user_id)
    localStorage.setItem('auth', res.token)
    navigate(redirectUrl)
  }

  const config: CodattaSigninConfig = {
    channel: channelInfo.channel,
    device: source,
    app: 'codatta-platform-website',
    inviterCode: channelInfo.inviterCode
  }

  return (
    <ExtensionChecker check={from === 'extension'}>
      <Spin
        spinning={loading}
        fullscreen={true}
        size="large"
        indicator={
          <LoaderCircle className="animate-spin text-white" size={18} />
        }
      ></Spin>
      <div className="flex h-screen w-full items-center justify-center bg-black p-4">
        <CodattaSignin
          onLogin={handleLogin}
          config={config}
          showMoreWallets
          header={<CodattaSigninHead />}
        ></CodattaSignin>
      </div>
    </ExtensionChecker>
  )
}
