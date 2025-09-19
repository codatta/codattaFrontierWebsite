import { Button, message, Modal } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { CodattaConnect } from 'codatta-connect'
import { Mail } from 'lucide-react'

import { useUserStore, userStoreActions } from '@/stores/user.store'
import { shortenAddress } from '@/utils/wallet-address'
import accountApi from '@/apis/account.api'

import CodattaLogoWhite from '@/assets/common/logo-white.svg'

export default function Task1({
  onNext,
  isMobile
}: {
  isMobile: boolean
  onNext: (data: { email: string }) => Promise<boolean>
}) {
  const [showWalletConnectModal, setShowWalletConnectModal] = useState(false)
  const { info } = useUserStore()
  const email = useMemo(() => info?.accounts_data?.find((account) => account.account_type === 'email')?.account, [info])
  const [newEmail, setNewEmail] = useState('')
  const onVerify = async () => {
    let newEmail: string | undefined = email

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
  async function handleEmailConnect(email: string, code: string) {
    console.log(email, code)
    await accountApi.bindEmail({
      connector: 'codatta_email',
      account_type: 'email',
      account_enum: 'C',
      email: email,
      email_code: code
    })
    message.success('Email bind success.').then(() => {
      setNewEmail(email)
      userStoreActions.getUserInfo()
      setShowWalletConnectModal(false)
    })
  }

  useEffect(() => {
    userStoreActions.getUserInfo()
  }, [])

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
        {!email && !newEmail ? (
          <>
            <Button
              type="primary"
              className="mt-8 h-[44px] w-full rounded-full text-base font-bold"
              onClick={() => setShowWalletConnectModal(true)}
            >
              <Mail size={16} className="mr-2"></Mail> Collect Email
            </Button>
          </>
        ) : (
          <>
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 p-4">
              <Mail size={16}></Mail>
              <div className="truncate">{shortenAddress(email || newEmail, 16)}</div>
            </div>
            <Button type="primary" className="mt-8 h-[44px] w-full rounded-full text-base font-bold" onClick={onVerify}>
              Confirm
            </Button>
          </>
        )}
      </div>
      <Modal
        className="[&_.xc-box-content]:!w-auto"
        open={showWalletConnectModal}
        onCancel={() => setShowWalletConnectModal(false)}
        footer={null}
        width={360}
        centered
        styles={{ content: { padding: 0 } }}
        destroyOnClose
      >
        <CodattaConnect
          onEmailConnect={handleEmailConnect}
          config={{
            showEmailSignIn: true,
            showFeaturedWallets: false,
            showMoreWallets: false,
            showTonConnect: false
          }}
          header={
            <div>
              <img src={CodattaLogoWhite} className="mb-3 h-8" alt="" />
              <h1 className="mb-8 text-lg font-bold">Collect Email</h1>
            </div>
          }
        ></CodattaConnect>
      </Modal>
    </>
  )
}
