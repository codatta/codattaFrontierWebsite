import { Modal } from 'antd'
import { CodattaSignin } from 'codatta-connect'
import { ILoginResponse } from 'codatta-connect/dist/api/account.api'
import { CodattaSigninConfig } from 'codatta-connect/dist/providers/codatta-signin-context-provider'
import { useChannelStore } from '@/stores/channel.store'

export function AuthModal(props: {
  onLogin?: (res: ILoginResponse) => void
  onError?: (e: Error) => void
  onClose?: () => void
  inviterCode?: string
  channel?: string
  open: boolean
}) {
  const { open } = props
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
      open={open}
      onCancel={handleClose}
      onClose={handleClose}
      footer={null}
      width={463}
      centered
      styles={{ content: { padding: 0 } }}
    >
      <CodattaSignin onLogin={handleLogin} config={config}></CodattaSignin>
    </Modal>
  )
}
