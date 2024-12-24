import { message, Button } from 'antd'
import { useMemo } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ReactGA from 'react-ga4'

import { useUserStore } from '@/stores/user.store'

import SocialShare from '@/components/referral/social-share'
import cardImg from '@/assets/referral/card.png'

const Head = () => {
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
    <div className="mt-6 flex w-full rounded-3xl border border-solid border-[#300040]/5 bg-white/5 p-6">
      <div className="mr-4 h-[194px] shrink-0">
        <img src={cardImg} className="h-full w-auto" />
      </div>
      <div className="h-[194px] flex-1">
        <div>
          <h3 className="text-xl font-semibold">Earn rewards by referring friends</h3>
          <p className="mt-2 text-xs text-gray-700 text-opacity-50">
            Invite your friends to explore codatta together, and both you and your friends will earn bonus points as
            rewards.
          </p>
        </div>
        <div className="mt-6 box-border rounded-lg border-solid">
          <h4 className="text-sm font-medium">Share your unique invitation link</h4>
          <div className="mt-2 flex items-center">
            <div className="box-border h-[37px] w-[298px] rounded-lg border border-solid border-[#100033]/20 bg-white pl-3 text-xs leading-[35px] text-black text-opacity-85">
              {shareLink}
            </div>
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
              <Button type="primary" className="ml-[10px] h-[37px] w-[94px] bg-white text-black">
                Copy link
              </Button>
            </CopyToClipboard>
          </div>
          <SocialShare
            content={() => ({ link: shareLink })}
            onShare={(social) => {
              ReactGA.event('share', {
                method: social,
                content_type: 'referral'
              })
            }}
            className="mt-4 flex items-center gap-2"
          />
        </div>
      </div>
      {contextHolder}
    </div>
  )
}

export default Head
