import { message, Typography } from 'antd'
import { useEffect, useState } from 'react'
import ReactGA from 'react-ga4'

import { SoundButton } from '@/components/common/sound-btn'

import { useUserStore } from '@/stores/user.store'

import SocialShare from '@/components/invite/social-share'
import cardImg from '@/assets/refferal/card.png'

const { Text } = Typography

const Head = () => {
  const [link, setLink] = useState(``)
  const [messageApi, contextHolder] = message.useMessage()
  const { info } = useUserStore()

  const onCopied = () => {
    messageApi.success({
      content: 'Link copied to clipboard!'
    })
  }

  useEffect(() => {
    setLink(`${location.origin}/referral/${info?.user_data?.referee_code}`)
  }, [info?.user_data?.referee_code])

  return (
    <div className="mt-6 flex w-full rounded-3xl border border-solid border-[#300040]/[0.06] bg-white/10 p-6">
      <div className="mr-4 h-[194px]">
        <img src={cardImg} className="h-full w-auto" />
      </div>
      <div className="h-[194px] flex-1">
        <div>
          <h3 className="text-xl font-semibold">
            Earn rewards by referring friends
          </h3>
          <p className="mt-2 text-xs font-normal text-white/50 text-opacity-50">
            Invite your friends to explore codatta together, and both you and
            your friends will earn bonus points as rewards.
          </p>
        </div>
        <div className="mt-6 box-border rounded-lg border-solid">
          <h4 className="text-sm font-medium">
            Share your unique invitation link
          </h4>
          <div className="mt-2 flex items-center">
            <div className="box-border h-[37px] w-[298px] rounded-lg border border-solid border-[#100033]/20 bg-white pl-3 text-xs leading-[35px] text-black/90">
              {link}
            </div>
            <Text
              copyable={{
                text: link,
                tooltips: false,
                onCopy: () => {
                  ReactGA.event('share', {
                    method: 'copy_link',
                    content_type: 'referral'
                  })
                  onCopied()
                },
                icon: [
                  <SoundButton
                    type="primary"
                    className="ml-[10px] h-[37px] w-[94px] bg-white text-black"
                  >
                    Copy link
                  </SoundButton>,
                  <SoundButton
                    type="primary"
                    className="ml-[10px] h-[37px] w-[94px] bg-white text-black"
                  >
                    Copy link
                  </SoundButton>
                ]
              }}
            />
          </div>
          <SocialShare
            content={() => ({
              link
            })}
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
