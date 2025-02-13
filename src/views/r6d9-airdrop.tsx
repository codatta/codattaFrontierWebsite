import { AuthModal } from '@/components/account/auth-modal'
import PageHead from '@/components/common/page-head'
import { userStoreActions } from '@/stores/user.store'
import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import SolanaConnectProvider from '@/components/r6d9/solana-connect-provider'
import { useWallet } from '@solana/wallet-adapter-react'
import { shortenAddress } from '@/utils/wallet-address'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import LogoLightSvgImage from '@/assets/common/logo-light.svg'
import R6D9AirdropApi from '@/apis/r6d9-airdrop.api'
import { Spin } from 'antd'

import { Buffer } from 'buffer'
window.Buffer = Buffer

interface StepConfig {
  status: null | 'wait' | 'finish'
  text: string
}

function LinkSolanaAction(props: { onConfirm: (address: string) => void }) {
  const { publicKey, disconnect } = useWallet()
  const { setVisible } = useWalletModal()

  function handleConfirm() {
    props.onConfirm(publicKey?.toString() || '')
  }

  async function handleDisconnect() {
    await disconnect()
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {publicKey ? (
        <>
          <p className="mb-10 text-white/40">
            wallet address:{' '}
            <strong className="text-2xl font-bold text-white">{shortenAddress(publicKey.toString(), 12)}</strong>
          </p>
          <div className="flex flex-col gap-4">
            <button className="w-56 rounded-full bg-primary px-6 py-2 text-white" onClick={handleConfirm}>
              Confirm
            </button>
            <button className="" onClick={handleDisconnect}>
              Disconnect
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mb-10">Link the claim wallet address to Claim.</p>
          <button className="rounded-full bg-white px-6 py-2 text-black" onClick={() => setVisible(true)}>
            Link Solana Wallet
          </button>
        </>
      )}
    </div>
  )
}

function StepItem(props: { config: StepConfig }) {
  const { config } = props
  return (
    <div className="relative">
      <div
        className={`flex size-6 items-center justify-center rounded-full border-2 transition-all ${config.status === 'finish' ? 'border-primary bg-primary' : 'border-white/15 bg-white/10'}`}
      >
        {config.status === 'finish' && <Check className="text-black" size={18}></Check>}
      </div>
      <div
        className={`absolute left-1/2 top-[48px] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-bold transition-all ${config.status !== null ? 'text-white' : 'text-white/50'}`}
      >
        {config.text}
      </div>
    </div>
  )
}

function Step(props: { step: StepConfig[] }) {
  const { step } = props
  return (
    <div className="flex w-full items-center">
      {step.map((item, index) => {
        return (
          <>
            {index !== 0 && (
              <div className={`flex-1 border-t-2 border-white/15 ${item.status !== null && 'bg-primary'}`}></div>
            )}
            <StepItem config={item} />
          </>
        )
      })}
    </div>
  )
}

const STEP_CONFIG: Record<string, StepConfig[]> = {
  auth: [
    { status: 'wait', text: 'Connect Wallet' },
    { status: null, text: 'Link Claim Wallet' }
  ],
  'link-solana': [
    { status: 'finish', text: 'Connect Wallet' },
    { status: 'wait', text: 'Link Claim Wallet' }
  ],
  'wait-claim': [
    { status: 'finish', text: 'Connect Wallet' },
    { status: 'finish', text: 'Link Claim Wallet' }
  ]
}

export default function R6D9Airdrop() {
  const isLogin = userStoreActions.checkLogin()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [stepConfig, setStepConfig] = useState<StepConfig[]>(STEP_CONFIG.auth)
  const [action, setAction] = useState('auth')
  const [loading, setLoading] = useState(false)

  function onLogin() {
    setShowAuthModal(false)
  }

  const checkUserClaimStatus = async () => {
    setLoading(true)
    const { data } = await R6D9AirdropApi.getAirdropInfo()

    if (data.register_flag !== 1) {
      setStepConfig(STEP_CONFIG['link-solana'])
      setAction('sorry')
    } else {
      if (data.sol_address) {
        setStepConfig(STEP_CONFIG['wait-claim'])
        setAction('wait-claim')
      } else {
        setStepConfig(STEP_CONFIG['link-solana'])
        setAction('link-solana')
      }
    }
    setLoading(false)
  }

  async function handleSolanaAddressConfirmed(address: string) {
    setLoading(true)
    await R6D9AirdropApi.linkSolAddress(address)
    setStepConfig(STEP_CONFIG['wait-claim'])
    setAction('wait-claim')
    setLoading(false)
  }

  useEffect(() => {
    if (!isLogin) {
      setStepConfig(STEP_CONFIG.auth)
      setAction('auth')
      setShowAuthModal(true)
    } else {
      setStepConfig(STEP_CONFIG['link-solana'])
      setAction('link-solana')
      checkUserClaimStatus()
    }
  }, [isLogin])

  return (
    <SolanaConnectProvider>
      <PageHead />
      <div className="mx-auto max-w-screen-xl px-5">
        <h1 className="mx-auto my-12 max-w-[520px] text-center text-4xl font-bold leading-normal">
          Link Your Codatta wallet and Solana Wallet for Airdrop
        </h1>
        <Spin spinning={loading}>
          <div className="rounded-2xl bg-[#252532] py-12">
            <div className="mx-auto max-w-[480px]">
              <Step step={stepConfig}></Step>
            </div>
            <div className="flex h-[400px] items-center justify-center">
              {action === 'auth' && (
                <div className="flex flex-col items-center justify-center">
                  <p className="mb-10">Please connect the wallet you used on Codatta</p>
                  <button className="rounded-full bg-white px-6 py-2 text-black">Connect Wallet</button>
                </div>
              )}

              {action === 'link-solana' && (
                <LinkSolanaAction onConfirm={handleSolanaAddressConfirmed}></LinkSolanaAction>
              )}

              {action === 'wait-claim' && (
                <div className="mx-auto flex max-w-[560px] flex-col items-center justify-center">
                  <img className="mb-9 h-16" src={LogoLightSvgImage} alt="" />
                  <p className="mb-10 text-center">
                    We have received your Solana address. Please wait the claim link to claim. The Claim link will be
                    post on our official twitter.
                  </p>
                </div>
              )}

              {action === 'sorry' && (
                <div className="mx-auto flex max-w-[560px] flex-col items-center justify-center">
                  <p className="mb-10 text-center">
                    You're not eligible to claim, please come back to participate next time.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Spin>
      </div>
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} onLogin={onLogin} closable={false} />
    </SolanaConnectProvider>
  )
}
