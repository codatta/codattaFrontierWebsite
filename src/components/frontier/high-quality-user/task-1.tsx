import { Button, message, Popover, QRCode } from 'antd'
import UserApi from '@/apis/user.api'
import { useMemo, useState } from 'react'
import { useCountdown } from '@/hooks/use-countdown'
import { cn } from '@udecode/cn'

export default function Task1({ onNext, isMobile }: { onNext: () => void; isMobile: boolean }) {
  const [joinLoading, setJoinLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [link, setLink] = useState('')
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
      const link = await UserApi.getTgGroupInviteLink()

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

  const handleVerifyTelegram = async () => {
    setVerifyLoading(true)
    try {
      const isJoined = await UserApi.isJoinedTgGroup()

      if (isJoined) {
        message.success('You have joined the telegram group')
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

  const handleNext = () => {
    setVerified(true)
  }

  return (
    <>
      <h2 className="mt-4 text-center text-2xl font-bold md:mt-6">
        Your Gateway to <br />
        Premium Annotation Tasks and Rewards
      </h2>
      <div className="mt-4 rounded-xl bg-[#252532] p-4 text-lg text-[#BBBBBE] md:mt-6 md:border md:border-[#FFFFFF1F]">
        <p>The journey to becoming a High-Value Annotator begins here.</p>
        <p className="mt-2">
          Exclusive, higher-reward projects for your professional skills are announced first in this telegram community.
        </p>
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
          <Button
            type="primary"
            loading={joinLoading}
            disabled={joinLoading || verified || isCounting}
            className="block h-[44px] w-full rounded-full text-base font-bold md:mx-auto md:hidden md:h-[40px] md:w-[240px] md:text-sm md:font-normal"
            onClick={handleJoinTelegram}
          >
            {isFirstJoin ? 'Join Now' : 'Try Again'}
            {isCounting ? `(${count}s)` : ''}
          </Button>
        </>

        {link &&
          (verified ? (
            <Button
              type="primary"
              loading={verifyLoading}
              disabled={verifyLoading}
              className="block h-[44px] w-full rounded-full text-base font-bold md:h-[40px] md:w-[240px] md:text-sm md:font-normal"
              onClick={handleNext}
            >
              Next
            </Button>
          ) : (
            <Button
              type="primary"
              loading={verifyLoading}
              disabled={verifyLoading}
              className="block h-[44px] w-full rounded-full text-base font-bold md:h-[40px] md:w-[240px] md:text-sm md:font-normal"
              onClick={handleVerifyTelegram}
            >
              Verify
            </Button>
          ))}
      </div>
    </>
  )
}
