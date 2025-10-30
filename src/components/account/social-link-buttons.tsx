import { cn } from '@udecode/cn'
import React, { useEffect, useRef, useState } from 'react'
import { XOutlined, DiscordOutlined } from '@ant-design/icons'
import { userStoreActions, useUserStore } from '@/stores/user.store'
import { Button, message } from 'antd'
import CustomAlert from './custom-alert'
import TelegramIcon from '@/assets/icons/telegram-icon'
import type { SocialAccountInfoItem } from '@/apis/user.api'

const channel = new BroadcastChannel('codatta:social-link')

function SocialAccountButton(props: {
  title: string
  icon: React.ReactNode
  linked: boolean
  disabled?: boolean
  onLink: () => void
  onUnlink: () => void
}) {
  function handleButtonClick() {
    if (props.linked) {
      props.onUnlink()
    } else {
      props.onLink()
    }
  }

  return (
    <button
      className={cn(
        'flex w-full cursor-pointer items-center rounded-xl px-4 py-3 text-white disabled:cursor-not-allowed disabled:bg-gray-300',
        props.linked ? 'bg-gray-300' : 'bg-primary'
      )}
      disabled={props.disabled}
      onClick={handleButtonClick}
    >
      <div>{props.title}</div>
      <div className="ml-auto">{props.icon}</div>
    </button>
  )
}

export default function SocialLink({ disabled = true }: { disabled?: boolean }) {
  const { info } = useUserStore()
  const [showDisconnectAlert, setShowDisconnectAlert] = useState(false)
  const selectedSocialMedia = useRef<string>()
  const [unbinding, setUnbinding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState('')
  const [xLinkInfo, setXLinkInfo] = useState<SocialAccountInfoItem | null>(null)
  const [discordLinkInfo, setDiscordLinkInfo] = useState<SocialAccountInfoItem | null>(null)
  const [telegramLinkInfo, setTelegramLinkInfo] = useState<SocialAccountInfoItem | null>(null)

  useEffect(() => {
    if (!info?.social_account_info) return
    const xLinkInfo = info?.social_account_info.find((item) => item.channel === 'X')
    const discordLinkInfo = info?.social_account_info.find((item) => item.channel === 'Discord')
    const telegramLinkInfo = info?.social_account_info.find((item) => item.channel === 'Telegram')

    setXLinkInfo(xLinkInfo ?? null)
    setDiscordLinkInfo(discordLinkInfo ?? null)
    setTelegramLinkInfo(telegramLinkInfo ?? null)
  }, [info?.social_account_info])

  function handleBroacastMessage(message: MessageEvent) {
    if (message.data === 'update') {
      userStoreActions.getUserInfo()
    }
  }

  useEffect(() => {
    userStoreActions.getUserInfo()
    channel.onmessage = handleBroacastMessage
    return () => {
      channel.onmessage = null
    }
  }, [])

  async function linkAccount(type: string) {
    try {
      if (type === 'x') {
        await userStoreActions.linkX()
      } else if (type === 'telegram') {
        await userStoreActions.linkTelegram()
      } else if (type === 'discord') {
        await userStoreActions.linkDiscord()
      }
      userStoreActions.getUserInfo()
    } catch (err) {
      console.log(err)
    }
  }

  function handleUnlinkAccount(type: string) {
    selectedSocialMedia.current = type
    setShowDisconnectAlert(true)
  }

  async function unlinkAccount(type: string) {
    setUnbinding(true)
    try {
      if (type === 'x') {
        await userStoreActions.unlinkSocialAccount('X')
      } else if (type === 'telegram') {
        await userStoreActions.unlinkSocialAccount('Telegram')
      } else if (type === 'discord') {
        await userStoreActions.unlinkSocialAccount('Discord')
      }
      userStoreActions.getUserInfo()
      message.success('Unlink success')
    } catch (err) {
      setShowErrorAlert(err?.message)
    }
    setShowDisconnectAlert(false)
    setUnbinding(false)
  }

  return (
    <div className="">
      <div className="flex flex-col gap-4">
        <SocialAccountButton
          title={xLinkInfo?.name || 'Connect With X'}
          icon={<XOutlined className="text-5" />}
          linked={!!xLinkInfo}
          disabled={disabled}
          onLink={() => linkAccount('x')}
          onUnlink={() => handleUnlinkAccount('x')}
        ></SocialAccountButton>

        <SocialAccountButton
          title={discordLinkInfo?.name || 'Connect With Discord'}
          icon={<DiscordOutlined className="text-5" />}
          linked={!!discordLinkInfo}
          disabled={disabled}
          onLink={() => linkAccount('discord')}
          onUnlink={() => handleUnlinkAccount('discord')}
        ></SocialAccountButton>

        <SocialAccountButton
          title={telegramLinkInfo?.name || 'Connect With Telegram'}
          icon={<TelegramIcon className="text-5" />}
          linked={!!telegramLinkInfo}
          disabled={disabled}
          onLink={() => linkAccount('telegram')}
          onUnlink={() => handleUnlinkAccount('telegram')}
        ></SocialAccountButton>
      </div>

      <CustomAlert
        open={showDisconnectAlert}
        title={'Disconnect'}
        onClose={() => {
          setShowDisconnectAlert(false)
        }}
      >
        <div className="mb-4">
          After unbinding and rebinding, there will be a 7-day cooldown period for unbinding. Please choose carefully.
        </div>
        <Button
          loading={unbinding}
          shape="round"
          className="bg-danger font-700 border-none py-5 shadow-none"
          block
          onClick={() => {
            unlinkAccount(selectedSocialMedia.current!)
          }}
        >
          Still to disconnect
        </Button>
      </CustomAlert>

      <CustomAlert
        title={'Success'}
        open={showSuccess}
        onClose={() => {
          setShowSuccess(false)
        }}
      >
        <div className="mb-4">{'Congratulations, your account has been successfully connected.'}</div>
        <Button
          shape="round"
          block
          type="primary"
          className="font-700 py-5"
          onClick={() => {
            setShowSuccess(false)
          }}
        >
          Got it
        </Button>
      </CustomAlert>

      <CustomAlert
        title={'😵Oops!'}
        open={!!showErrorAlert}
        onClose={() => {
          setShowErrorAlert('')
        }}
      >
        <div className="mb-4">{showErrorAlert}</div>
        <Button
          shape="round"
          block
          type="primary"
          className="font-700 py-5"
          onClick={() => {
            setShowErrorAlert('')
          }}
        >
          Got it
        </Button>
      </CustomAlert>
    </div>
  )
}
