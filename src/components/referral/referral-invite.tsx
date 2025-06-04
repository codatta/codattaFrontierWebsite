import { message, Button, Modal } from 'antd'
import { useMemo } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ReactGA from 'react-ga4'

import { useUserStore } from '@/stores/user.store'

import SocialShare from '@/components/referral/social-share'
import cardImg from '@/assets/referral/card.png'
import { InfoCircleOutlined } from '@ant-design/icons'
import { cn } from '@udecode/cn'

const ReferralInvite = (props: { className?: string }) => {
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
    <div
      className={cn(
        'mt-6 flex w-full flex-wrap rounded-3xl border border-solid border-[#300040]/5 bg-white/5 p-6',
        props.className
      )}
    >
      <div className="mr-4 h-[194px] shrink-0">
        <img src={cardImg} className="h-full w-auto" />
      </div>
      <div className="flex-1">
        <div>
          <h3 className="text-base font-semibold">Invite friends. Earn rewards. One step at a time.</h3>
          <p className="mt-2 text-xs text-gray-700 text-opacity-50">
            Invite your friends to explore Codatta together, and both you and your friends will earn bonus points as
            rewards.
          </p>
        </div>
        <div className="mt-6 box-border rounded-lg border-solid">
          <h4 className="text-base font-medium">Copy this link to share with friends</h4>
          <div className="mb-6 mt-2 flex flex-wrap items-center gap-3">
            <div className="box-border flex h-8 flex-1 items-center rounded-lg border border-solid border-[#100033]/20 bg-white pl-3 text-xs text-black text-opacity-85">
              {shareLink}
            </div>
            <div className="shrink-0">
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
                <Button type="primary" className="bg-white text-sm text-black">
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
              className="flex shrink-0 items-center gap-2"
            />
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[#FCC800]/5 p-2 text-[#FCC800]">
            <InfoCircleOutlined size={60} className="shrink-0" />
            **Important**: A referral becomes valid once your friend earns 400 points
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReferralInvite
