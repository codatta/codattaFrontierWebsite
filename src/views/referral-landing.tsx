import { AuthModal } from '@/components/account/auth-modal'
import { Button, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import logoImg from '@/assets/common/logo-white-notext.svg'
import logoTextImg from '@/assets/common/logo-white.svg'
import cardImg from '@/assets/referral/referral-card.png'
import { ArrowRight } from 'lucide-react'
import { ILoginResponse } from 'codatta-connect/dist/api/account.api'
import { channelStoreActions } from '@/stores/channel.store'

export const Component = () => {
  const { code } = useParams()
  const [messageApi, contextHolder] = message.useMessage()
  const [username, setUsername] = useState('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const navigate = useNavigate()

  const showMessage = (message: string) => {
    messageApi.success({
      content: message,
      style: {},
      duration: 5,
      onClose: () => navigate('/app')
    })
  }

  const handleLoginClick = () => {
    setShowModal(true)
  }

  const onLogin = async (user: ILoginResponse) => {
    if (user.new_user) {
      showMessage('Congratulations, you have successfully signed up, and your rewards will be issued to your account.')
    } else {
      showMessage(
        'You have successfully signed in! Unfortunately, our invitation rewards are only applicable to new users.'
      )
    }
  }

  const getUsername = (code: string) => {
    fetch('/api/user/username?' + new URLSearchParams({ code }), {})
      .then((res) => res.json())
      .then(({ data: username }) => {
        setUsername(username)
      })
  }

  useEffect(() => {
    if (!code) {
      navigate('/app')
      return
    }
    getUsername(code)
    channelStoreActions.setChannelCode('referral-landing')
    channelStoreActions.setInviterCode(code)
  }, [code, navigate])

  return (
    <div className="flex min-h-screen flex-col rounded-lg">
      <div className="flex h-[88px] items-center justify-between border-b border-b-[#FFFFFF1F] px-12">
        <a href="https://codatta.io">
          <object data={logoTextImg} type="image/svg+xml" className="pointer-events-none h-8"></object>
        </a>
        <Button
          size="large"
          className="rounded-full border-gray-900 px-6 py-[10px] text-sm"
          onClick={() => handleLoginClick()}
        >
          Sign in
        </Button>
      </div>
      <div className="flex max-w-full flex-1 items-center justify-center px-[100px] pb-[110px] pt-[30px]">
        <div className="flex max-w-[1200px] overflow-hidden rounded-3xl bg-[#2E2E37]">
          <div className="flex flex-1 items-center">
            <img src={cardImg} className="h-auto w-full rounded-3xl" />
          </div>
          <div className="flex w-[520px] items-center p-10 text-center">
            <div>
              <object data={logoImg} type="image/svg+xml" className="pointer-events-none m-auto h-14"></object>
              <h3 className="my-2 mt-6 text-3xl font-bold">Welcome to codatta! </h3>
              <div className="mt-2 text-base">
                {username ? <strong className="font-normal text-[#9E85FF]">{username}</strong> : 'Your friend'} invites
                you to explore together! The world's leading AI-powered collaboration protocol for blockchain metadata.
              </div>
              <div className="mt-16 flex justify-center">
                <Button
                  type="primary"
                  size="large"
                  className="rounded-full px-10 py-3 text-sm font-semibold"
                  onClick={() => handleLoginClick()}
                >
                  Sign up <ArrowRight strokeWidth={1.25} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {contextHolder}
      <AuthModal open={showModal} onClose={() => setShowModal(false)} onLogin={onLogin} />
    </div>
  )
}

export default Component
