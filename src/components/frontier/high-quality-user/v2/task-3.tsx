import { Button, message, Popover, QRCode } from 'antd'
import { Copy, Link } from 'lucide-react'
import { useMemo, useState } from 'react'
import { cn } from '@udecode/cn'
import { useSessionStorage } from '@uidotdev/usehooks'
import CopyToClipboard from 'react-copy-to-clipboard'

import { useCountdown } from '@/hooks/use-countdown'
import UserApi from '@/apis/user.api'

export default function Task({ onNext }: { onNext: () => void; isMobile?: boolean }) {
  const [joinLoading, setJoinLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [link, setLink] = useSessionStorage('tg_group_invite_link', '')
  const [verified, setVerified] = useState(false)
  const [count, _, restart] = useCountdown(30, null, false)
  const [isFirstJoin, setisFirstJoin] = useState(true)
  const isCounting = useMemo(() => {
    return count !== 0 && count !== 30
  }, [count])

  const handleJoinTelegram = async () => {
    if (isCounting) return

    setJoinLoading(true)

    try {
      const link = await UserApi.getTgGroupInviteLink('codatta')

      if (link) {
        restart()
        setisFirstJoin(false)
        setLink(link.link)
        window.open(link.link, '_blank')
      }
    } catch (error) {
      message.error(error.message ? error.message : 'Failed to get telegram group invite link')
      console.error(error)
    } finally {
      setJoinLoading(false)
    }
  }

  const onCopied = () => {
    message.success({
      content: 'Telegram group invite link copied to clipboard!'
    })
  }

  const handleVerifyTelegram = async () => {
    setVerifyLoading(true)
    try {
      const isJoined = await UserApi.isJoinedTgGroup()

      if (isJoined) {
        message.success('You have joined the telegram group')
        setVerified(true)
        onNext()
      } else {
        message.error('Telegram join not detected. Please try again or contact support.')
      }
    } catch (error) {
      message.error(error.message ? error.message : 'Telegram join not detected. Please try again or contact support.')
      console.error(error)
    } finally {
      setVerifyLoading(false)
    }
  }

  return (
    <>
      <h2 className="mt-4 text-center text-2xl font-bold md:mt-6">
        Join Codatta Telegram
        <br /> — Stay Ahead. Earn More.
      </h2>
      <div className="mt-4 rounded-xl bg-[#252532] p-4 text-lg text-[#BBBBBE] md:mt-6 md:border md:border-[#FFFFFF1F]">
        Get instant access to new earning opportunities, exclusive drops, and behind-the-scenes updates — only in the
        Codatta Telegram community.
      </div>

      <div className="mt-8 space-y-6 md:flex md:items-center md:justify-center md:gap-6 md:space-y-0">
        <>
          <div className="hidden md:block">
            <Popover content={<QRCode value={link} bordered={false} />}>
              <div>
                <Button
                  type="primary"
                  loading={joinLoading}
                  disabled={joinLoading || verified}
                  className={cn(
                    'h-[44px] w-full rounded-full text-base font-bold md:h-[40px] md:w-[240px] md:text-sm md:font-normal',
                    isCounting ? 'cursor-not-allowed opacity-25' : ''
                  )}
                  onClick={handleJoinTelegram}
                >
                  {isFirstJoin ? 'Join Now' : 'Try Again'}
                  {isCounting ? `(${count}s)` : ''}
                </Button>
              </div>
            </Popover>
          </div>
          <div className="block md:hidden">
            {!link ? (
              <Button
                type="primary"
                loading={joinLoading}
                disabled={joinLoading || verified || isCounting}
                className="h-[44px] w-full rounded-full text-base font-bold md:mx-auto md:h-[40px] md:w-[240px] md:text-sm md:font-normal"
                onClick={handleJoinTelegram}
              >
                {isFirstJoin ? 'Join Now' : 'Try Again'}
                {isCounting ? `(${count}s)` : ''}
              </Button>
            ) : (
              <div className="mt-4 rounded-xl bg-[#252532] p-4">
                <CopyToClipboard text={link} onCopy={onCopied}>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-[#FFFFFF1F] px-4 py-3">
                    <div className="flex flex-1 items-center gap-2 overflow-hidden text-base font-bold text-[#875DFF]">
                      <Link className="size-6 text-[#875DFF]" />
                      <span className="overflow-hidden text-ellipsis">{link}</span>
                    </div>
                    <Copy className="size-6 text-white" />
                  </div>
                </CopyToClipboard>
                <p className="mt-2 text-center text-base text-[#BBBBBE]">
                  If <span className="font-bold text-white">Join Now</span> doesn't work, copy the invite link above and
                  open it in your browser.
                </p>
              </div>
            )}
          </div>
        </>

        {link && (
          <Button
            type="primary"
            loading={verifyLoading}
            disabled={verifyLoading || verified}
            className="block h-[44px] w-full rounded-full text-base font-bold md:h-[40px] md:w-[240px] md:text-sm md:font-normal"
            onClick={handleVerifyTelegram}
          >
            Verify
          </Button>
        )}
      </div>
    </>
  )
}
