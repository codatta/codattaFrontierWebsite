import { Button, Input, message } from 'antd'
import { useEffect, useState } from 'react'
import { Mail } from 'lucide-react'

import { useUserStore, userStoreActions } from '@/stores/user.store'
import { isValidEmail } from '@/utils/str'
import { cn } from '@udecode/cn'

export default function Task1({
  onNext,
  isMobile
}: {
  isMobile: boolean
  onNext: (data: { email: string; showResult: boolean }) => Promise<boolean>
}) {
  const { info } = useUserStore()
  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(true)

  const onVerify = async () => {
    if (email && validEmail) {
      return message
        .success({
          content: 'Email bound successfully!'
        })
        .then(() => onNext({ email: email, showResult: true }))
    }

    message.info({
      content: 'Please bind email first!'
    })
  }
  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value?.trim()
    setEmail(email)
    setValidEmail(isValidEmail(email))
  }

  useEffect(() => {
    userStoreActions.getUserInfo()
  }, [])

  useEffect(() => {
    const email = info?.accounts_data?.find((account) => account.account_type === 'email')?.account
    if (email) {
      setEmail(email)
      setValidEmail(true)
    }
  }, [info])

  return (
    <>
      <div>
        <h2 className="mt-4 text-center text-2xl font-bold">Connect Email</h2>
        <img
          src={isMobile ? '/codatta-banner.png' : '/codatta-banner-pc.png'}
          alt="high quality user task1 banner"
          className="mt-4 block aspect-[684/376] md:aspect-[1040/376]"
        />
        <p className="mt-4 rounded-xl bg-[#252532] px-4 py-[10px] text-center text-base text-white md:mt-6 md:border md:border-[#FFFFFF1F] md:bg-transparent md:text-left md:text-[#BBBBBE]">
          Bind your email to be the first to receive updates on upcoming high-reward tasks.
        </p>
        <div className="mt-4">
          <Input
            placeholder="Enter Your Email (e.g., your@gmail.com)"
            size="large"
            className="mt-2 !rounded-lg !bg-none !px-4 !py-3 !text-white placeholder:!text-[#606067]"
            onChange={onEmailChange}
            value={email}
            prefix={<Mail size={16}></Mail>}
          />
          {!validEmail ? (
            <p className={cn('mt-2 text-sm text-red-400', isMobile ? 'px-4' : 'px-0')}>
              Please enter a valid email address.
            </p>
          ) : null}
        </div>
        <Button type="primary" className="mt-8 h-[44px] w-full rounded-full text-base font-bold" onClick={onVerify}>
          Confirm
        </Button>
      </div>
    </>
  )
}
