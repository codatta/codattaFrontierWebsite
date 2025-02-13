import { Modal } from 'antd'
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

export function AuthModal(props: {
  onLogin?: (res: ILoginResponse) => void
  onError?: (e: Error) => void
  onClose?: () => void
  inviterCode?: string
  channel?: string
  open: boolean
  closable?: boolean
}) {
  const { open, closable = true } = props
  const channelInfo = useChannelStore()
  async function handleLogin(res: ILoginResponse) {
    localStorage.setItem('token', res.old_token)
    localStorage.setItem('uid', res.user_id)
    localStorage.setItem('auth', res.token)
    props.onLogin?.(res)
  }

  function handleClose() {
    props.onClose?.()
  }

  const config: CodattaSigninConfig = {
    channel: channelInfo.channel,
    device: 'WEB',
    app: 'codatta-platform-website',
    inviterCode: channelInfo.inviterCode
  }

  return (
    <Modal
      closable={closable}
      open={open}
      maskClosable={closable}
      onCancel={handleClose}
      onClose={handleClose}
      footer={null}
      width={463}
      centered
      styles={{ content: { padding: 0 } }}
    >
      <CodattaSignin onLogin={handleLogin} config={config} header={<CodattaSigninHead />}></CodattaSignin>
    </Modal>
  )
}
