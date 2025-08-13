import { message, Button } from 'antd'
import { useMemo } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ReactGA from 'react-ga4'

import cardImg from '@/assets/referral/card.png'

import { useUserStore } from '@/stores/user.store'
import SocialShare from '@/components/referral/social-share'

export default function AsideReferral() {
  const [messageApi, contextHolder] = message.useMessage()
  const { info } = useUserStore()
  const onCopied = () => {
    messageApi.success({
      content: 'Link copied to clipboard!'
    })
  }

  const shareLink = useMemo(() => {
    const shareCode = info?.user_data.referee_code || ''
    return `${location.origin}/referral/${shareCode}`
  }, [info])

  return (
    <div className="relative px-4">
      <div className="flex items-center gap-[6px]">
        <div className="size-[90px] shrink-0">
          <img src={cardImg} className="h-full w-auto" />
        </div>
        <div className="flex-1 text-nowrap text-lg font-bold">
          <p>Copy this link to</p>
          <p>share with friends</p>
        </div>
      </div>
      <div className="box-border overflow-hidden text-ellipsis rounded-lg border border-solid border-[#FFFFFF1F] px-3 text-xs leading-[35px]">
        {shareLink}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <SocialShare
          iconSize={6}
          content={() => ({ link: shareLink })}
          onShare={(social) => {
            ReactGA.event('share', {
              method: social,
              content_type: 'referral'
            })
          }}
          className="flex items-center gap-2"
        />
        <CopyToClipboard
          text={shareLink}
          onCopy={() => {
            ReactGA.event('share', {
              method: 'copy_link',
              content_type: 'referral'
            })
            onCopied()
          }}
        >
          <Button type="primary" className="h-[37px] flex-1 bg-white text-black">
            Copy link
          </Button>
        </CopyToClipboard>
      </div>
      {contextHolder}
    </div>
  )
}
