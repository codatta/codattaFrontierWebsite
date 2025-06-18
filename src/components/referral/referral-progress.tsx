import { useEffect, useRef, useState } from 'react'
import { referralStoreActions, useReferralStore } from '@/stores/referral.store'
import userApi from '@/apis/user.api'
import { cn } from '@udecode/cn'
import { InviteProgressItem } from '@/apis/user.api'
import checkinNeonIcon from '@/assets/checkin/check-in-neon.svg'
import claimIcon from '@/assets/referral/claim-icon.png'
import { message, Modal, Spin } from 'antd'
import { createPublicClient, http } from 'viem'

import PointRewardIcon from '@/assets/referral/point-reward.png'
import GrowthLeaderSBTIcon from '@/assets/referral/growth-leader-sbt.png'
import LinkStarterSBTIcon from '@/assets/referral/link-starter-sbt.png'
import { CodattaConnect, EmvWalletConnectInfo, useCodattaConnectContext, WalletItem } from 'codatta-connect'
import ContractCallView from '../common/wallet/contract-call-view'
import journeyContract from '@/contracts/codatta-new-journey.abi'
import WalletConfirmView from '../common/wallet/wallet-confirm-view'
import LockImage from '@/assets/referral/lock.png'
import RewardSquareBg from '@/assets/referral/reward-sqaure-bg.png'

function ReferralPointRewardItem(props: {
  item: InviteProgressItem
  index: number
  onClaim: (item: InviteProgressItem) => void
}) {
  const { item, index } = props

  return (
    <div className="flex items-center gap-3">
      <div
        className="relative size-[80px] overflow-hidden rounded-xl border-2 border-[#D5C7FF] p-3"
        style={{ backgroundImage: `url(${RewardSquareBg})`, backgroundSize: 'cover' }}
      >
        <div className="absolute bottom-0 right-0 rounded-tl-lg bg-[#5734BB] px-1 font-bold text-white/90">
          +{item.reward_value}
        </div>
        <img src={PointRewardIcon} className="relative" alt="" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span>Referral {index + 1}</span>
        {item.claim_status === 2 && (
          <div className="flex size-[60px] items-center justify-center">
            <img
              src={checkinNeonIcon}
              className="size-12 rounded-full border border-white/5 bg-[#353540] p-1.5"
              alt="claimed"
            />
          </div>
        )}
        {item.claim_status === 1 && (
          <img onClick={() => props.onClaim(item)} className="size-[60px] cursor-pointer" src={claimIcon} alt="claim" />
        )}
        {item.claim_status === 0 && (
          <div className="flex size-[60px] items-center justify-center">
            <img
              className="size-12 rounded-full border border-white/5 bg-[#353540] p-[14px]"
              src={LockImage}
              alt="locked"
            />
          </div>
        )}
      </div>
    </div>
  )
}

function ReferralNftRewardItem(props: {
  item: InviteProgressItem
  index: number
  onClaim: (item: InviteProgressItem) => void
}) {
  const { item, index } = props

  const getNFTImage = () => {
    console.log(item.soul_id)
    if (item.soul_id === 0) return LinkStarterSBTIcon
    if (item.soul_id === 1) return GrowthLeaderSBTIcon
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className="relative size-[80px] overflow-hidden rounded-xl border-2 border-[#D5C7FF] p-3"
        style={{ backgroundImage: `url(${RewardSquareBg})`, backgroundSize: 'cover' }}
      >
        <div className="absolute bottom-0 right-0 rounded-tl-lg bg-[#5734BB] px-1 font-bold text-white/90">SBT</div>
        <img src={getNFTImage()} className="relative" alt="" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span>Referral {index + 1}</span>
        {item.claim_status === 2 && (
          <div className="flex size-[60px] items-center justify-center">
            <img
              src={checkinNeonIcon}
              className="size-12 rounded-full border border-white/5 bg-[#353540] p-1.5"
              alt=""
            />
          </div>
        )}

        {item.claim_status === 1 && (
          <img onClick={() => props.onClaim(item)} className="size-[60px] cursor-pointer" src={claimIcon} alt="claim" />
        )}

        {item.claim_status === 0 && (
          <div className="flex size-[60px] items-center justify-center">
            <img
              className="size-12 rounded-full border border-white/5 bg-[#353540] p-[14px]"
              src={LockImage}
              alt="locked"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default function ReferralProgress() {
  const { referralProgress } = useReferralStore()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftGradient, setShowLeftGradient] = useState(false)
  const [showRightGradient, setShowRightGradient] = useState(true)
  const [_messageApi, contextHolder] = message.useMessage()
  const [levelClaiming, setLevelClaiming] = useState(false)
  const [showWalletConnect, setShowWalletConnect] = useState(false)
  const [showContractCallView, setShowContractCallView] = useState(false)
  const [connectedWalletItem, setConnectedWalletItem] = useState<WalletItem>()
  const [showWalletConfirmView, setShowWalletConfirmView] = useState(false)
  const [selectedInviteItem, setSelectedInviteItem] = useState<InviteProgressItem>()

  const { lastUsedWallet } = useCodattaConnectContext()

  useEffect(() => {
    referralStoreActions.getReferralProgress()
  }, [])

  useEffect(() => {
    if (referralProgress.length > 0 && scrollContainerRef.current) {
      const firstClaimableIndex = referralProgress.findIndex((item) => item.claim_status === 1)

      if (firstClaimableIndex !== -1) {
        setTimeout(() => {
          if (scrollContainerRef.current) {
            const containerWidth = scrollContainerRef.current.clientWidth
            const itemWidth = 155 + 40
            const targetPosition = firstClaimableIndex * itemWidth
            const scrollPosition = targetPosition - containerWidth / 3 + itemWidth / 2

            scrollContainerRef.current.scrollTo({
              left: Math.max(0, scrollPosition),
              behavior: 'smooth'
            })
          }
        }, 100)
      }
    }
  }, [referralProgress])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
        setShowLeftGradient(scrollLeft > 0)
        setShowRightGradient(scrollLeft + clientWidth < scrollWidth - 10)
      }
    }

    const handleWheel = (e: WheelEvent) => {
      if (scrollContainerRef.current && e.deltaY !== 0) {
        e.preventDefault()
        scrollContainerRef.current.scrollLeft += e.deltaY
      }
    }

    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll)
      scrollContainer.addEventListener('wheel', handleWheel, { passive: false })
      handleScroll()

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll)
        scrollContainer.removeEventListener('wheel', handleWheel)
      }
    }
  }, [referralProgress])

  async function onPointsClaim(item: InviteProgressItem) {
    setLevelClaiming(true)
    try {
      await userApi.claimInviteReward({ invite_id: item.invite_id })
      referralStoreActions.getReferralProgress()
    } catch (error) {
      message.error(error.message)
    }
    setLevelClaiming(false)
  }

  async function onNftClaim(item: InviteProgressItem) {
    setSelectedInviteItem(item)
    if (!lastUsedWallet) setShowWalletConnect(true)
    else {
      setConnectedWalletItem(lastUsedWallet)
      setShowWalletConfirmView(true)
    }
  }

  async function handleConnect(connectInfo: EmvWalletConnectInfo) {
    setConnectedWalletItem(connectInfo.wallet)
    setShowWalletConfirmView(true)
  }

  async function onCallContract() {
    if (!connectedWalletItem) return
    if (!selectedInviteItem) throw new Error('No invite item selected')

    const addresses = await connectedWalletItem.client?.getAddresses()
    if (!addresses) throw new Error('No address found')
    const address = addresses?.[0]

    const publicClient = createPublicClient({
      chain: journeyContract.chain,
      transport: http()
    })

    const inviteSignResponse = await userApi.getReferralNftSign(selectedInviteItem.invite_id, address)
    const inviteSign = inviteSignResponse.data

    const contract = {
      account: address,
      address: journeyContract.address as `0x${string}`,
      abi: journeyContract.abi,
      functionName: 'mint',
      chain: journeyContract.chain,
      args: [address, inviteSign.soul_id, inviteSign.expired_at, `0x${inviteSign.signature}`]
    }

    const { request } = await publicClient.simulateContract(contract)
    const tx = await connectedWalletItem.client?.writeContract(request)
    if (!tx) throw new Error('Transaction failed')
    const receipt = await publicClient.waitForTransactionReceipt({ hash: tx })

    const claimParams = {
      invite_id: selectedInviteItem?.invite_id,
      soul_id: inviteSign.soul_id,
      tx_hash: receipt?.transactionHash,
      block_number: receipt?.blockNumber?.toString(),
      address
    }
    await userApi.claimInviteReward(claimParams)
  }

  async function onSuccess() {}

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/5">
      <div
        className={cn(
          'pointer-events-none absolute left-0 top-0 z-10 h-full w-40 bg-gradient-to-r from-[#282831] to-transparent transition-opacity duration-500',
          showLeftGradient ? 'opacity-100' : 'opacity-0'
        )}
      />

      <div
        className={cn(
          'pointer-events-none absolute right-0 top-0 z-10 h-full w-40 bg-gradient-to-l from-[#282831] to-transparent transition-opacity duration-500',
          showRightGradient ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Scrollable container */}
      <Spin spinning={levelClaiming}>
        <div
          ref={scrollContainerRef}
          className="no-scrollbar cursor-grab select-none overflow-scroll p-6 active:cursor-grabbing"
        >
          <div className="absolute left-0 top-[84px] h-[2px] w-full px-10">
            <div className="h-full bg-primary/80"></div>
          </div>
          <div className="relative flex min-w-max items-center gap-10">
            {referralProgress.map((item, index) => {
              if (item.reward_type === 'score') {
                return (
                  <ReferralPointRewardItem key={item.invite_id} item={item} index={index} onClaim={onPointsClaim} />
                )
              } else {
                return <ReferralNftRewardItem key={item.invite_id} item={item} index={index} onClaim={onNftClaim} />
              }
            })}
          </div>
        </div>
      </Spin>
      {contextHolder}

      <Modal
        open={showWalletConnect}
        centered
        footer={null}
        onCancel={() => setShowWalletConnect(false)}
        className="[&_.ant-modal-content]:p-0"
        width={468}
      >
        <CodattaConnect
          onEvmWalletConnect={handleConnect}
          config={{ showTonConnect: false, showFeaturedWallets: true, showMoreWallets: true }}
        />
      </Modal>

      <Modal
        open={showContractCallView}
        centered
        footer={null}
        onCancel={() => setShowContractCallView(false)}
        className="[&_.ant-modal-content]:p-0"
        width={468}
      >
        <ContractCallView
          title="Claim"
          walletItem={connectedWalletItem!}
          contract={journeyContract}
          onCallContract={onCallContract}
          onBack={() => setShowContractCallView(false)}
          onSuccess={onSuccess}
        ></ContractCallView>
      </Modal>

      <Modal
        open={showWalletConfirmView}
        centered
        footer={null}
        onCancel={() => setShowWalletConfirmView(false)}
        className="[&_.ant-modal-content]:p-0"
        width={468}
      >
        <WalletConfirmView
          walletItem={connectedWalletItem!}
          onBack={() => setShowWalletConfirmView(false)}
          onContinue={() => {
            setShowContractCallView(true)
            setShowWalletConfirmView(false)
          }}
          onSwitchWallet={() => {
            setShowWalletConnect(true)
            setShowWalletConfirmView(false)
          }}
        ></WalletConfirmView>
      </Modal>
    </div>
  )
}
