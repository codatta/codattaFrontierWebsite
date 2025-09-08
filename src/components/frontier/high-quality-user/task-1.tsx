import { Button, message, Popover, QRCode } from 'antd'
import UserApi from '@/apis/user.api'
import { useState } from 'react'

export default function Task1({ onNext, isMobile }: { onNext: () => void; isMobile: boolean }) {
  const [joinLoading, setJoinLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [link, setLink] = useState('')
  const [verified, setVerified] = useState(false)

  const handleJoinTelegram = async () => {
    setJoinLoading(true)

    try {
      const link = await UserApi.getTgGroupInviteLink()

      if (link) {
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

      {link && !isMobile ? (
        <Popover content={<QRCode value={link} bordered={false} />}>
          <Button
            type="primary"
            loading={joinLoading}
            disabled={joinLoading || verified}
            className="mt-8 block h-[44px] w-full rounded-full text-base font-bold md:mx-auto md:mt-12 md:h-[40px] md:w-[240px] md:text-sm md:font-normal"
            onClick={handleJoinTelegram}
          >
            Join Now
          </Button>
        </Popover>
      ) : (
        <Button
          type="primary"
          loading={joinLoading}
          disabled={joinLoading || verified}
          className="mt-8 block h-[44px] w-full rounded-full text-base font-bold md:mx-auto md:mt-12 md:h-[40px] md:w-[240px] md:text-sm md:font-normal"
          onClick={handleJoinTelegram}
        >
          Join Now
        </Button>
      )}

      {link &&
        (verified ? (
          <Button
            type="primary"
            loading={verifyLoading}
            disabled={verifyLoading}
            className="mt-3 block h-[44px] w-full rounded-full text-base font-bold md:mx-auto md:mt-6 md:h-[40px] md:w-[240px] md:text-sm md:font-normal"
            onClick={handleNext}
          >
            Next
          </Button>
        ) : (
          <Button
            type="primary"
            loading={verifyLoading}
            disabled={verifyLoading}
            className="mt-3 block h-[44px] w-full rounded-full text-base font-bold md:mx-auto md:mt-6 md:h-[40px] md:w-[240px] md:text-sm md:font-normal"
            onClick={handleVerifyTelegram}
          >
            Verify
          </Button>
        ))}
    </>
  )
}
