import { Button, message } from 'antd'
import { Copy, FastForward, Info } from 'lucide-react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useEffect, useMemo } from 'react'

import { useUserStore, userStoreActions } from '@/stores/user.store'

// eslint-disable-next-line prettier/prettier
export default function Task1({ onNext, isMobile }: { isMobile: boolean; onNext: (data: { email: string }) => Promise<boolean> }) {
  const { info } = useUserStore()
  const email = useMemo(() => info?.accounts_data?.find((account) => account.account_type === 'email')?.account, [info])
  const link = `${window.location.protocol}//${window.location.host}/app/settings/personal`
  const onCopied = () => {
    message.success({
      content: 'Copied to clipboard!'
    })
  }
  const onVerify = async () => {
    let newEmail = email

    if (!newEmail) {
      const res = await userStoreActions.getUserInfo()
      newEmail = res.accounts_data?.find((account) => account.account_type === 'email')?.account
    }

    if (newEmail) {
      return message
        .success({
          content: 'Email bound successfully!'
        })
        .then(() => onNext({ email: newEmail }))
    }

    message.info({
      content: 'Please bind email first!'
    })
  }

  useEffect(() => {
    userStoreActions.getUserInfo()
  }, [])

  return (
    <div>
      <h2 className="mt-4 text-center text-2xl font-bold">Login & Bind Email</h2>
      <img
        src={isMobile ? '/codatta-banner.png' : '/codatta-banner-pc.png'}
        alt="high quality user task1 banner"
        className="mt-4 h-[188px]"
      />
      <p className="mt-4 rounded-xl bg-[#252532] px-4 py-[10px] text-center text-base text-white md:mt-6 md:border md:border-[#FFFFFF1F] md:bg-transparent md:text-left md:text-[#BBBBBE]">
        Bind your email to be the first to receive updates on upcoming high-reward tasks.
      </p>
      <div className="mt-4 rounded-xl bg-[#252532] px-4 py-[10px] md:mt-6 md:border md:border-[#FFFFFF1F] md:bg-transparent md:text-left md:text-[#BBBBBE]">
        <h2 className="flex items-center gap-1 text-base font-bold text-white">
          <FastForward />
          Steps to complete
        </h2>
        <ul className="mt-2 text-sm leading-[22px] text-[#BBBBBE]">
          <li className="flex items-start gap-2">
            <span className="mt-2 block size-[4px] shrink-0 rounded-full bg-[#BBBBBE]"></span>
            <span className="flex-1">Copy the link below and open it in your browser</span>
          </li>
          <li className="mt-2">
            <CopyToClipboard text={link} onCopy={onCopied}>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#FFFFFF1F] px-4 py-3">
                <div className="flex flex-1 items-center gap-2 overflow-hidden text-base font-bold text-[#875DFF]">
                  <span className="overflow-hidden text-ellipsis">{link}</span>
                </div>
                <Copy className="size-6 text-white" />
              </div>
            </CopyToClipboard>
          </li>
          <li className="mt-2 flex items-start gap-2">
            <span className="mt-2 block size-[4px] shrink-0 rounded-full bg-[#BBBBBE]"></span>
            <span className="flex-1">Login using your Binance wallet address from this event</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 block size-[4px] shrink-0 rounded-full bg-[#BBBBBE]"></span>
            <span className="flex-1">Bind your email (if not already bound)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 block size-[4px] shrink-0 rounded-full bg-[#BBBBBE]"></span>
            <span className="flex-1">Return here and click verify to confirm</span>
          </li>
        </ul>
      </div>
      <div className="mt-4 rounded-xl bg-[#252532] px-4 py-[10px] md:mt-6 md:border md:border-[#FFFFFF1F] md:bg-transparent md:text-left md:text-[#BBBBBE]">
        <h2 className="flex items-center gap-1 text-base font-bold text-white">
          <Info className="size-5" />
          Note
        </h2>
        <ul className="mt-2 list-inside list-disc text-sm leading-[22px] text-[#BBBBBE]">
          <li>Already bound? Just login and return to verify. </li>
          <li>Must use your event Binance wallet</li>
        </ul>
      </div>
      <Button type="primary" className="mt-8 h-[44px] w-full rounded-full text-base font-bold" onClick={onVerify}>
        Verify Now
      </Button>
    </div>
  )
}
