import { useEffect, useRef, useState } from 'react'
import { referralStoreActions, useReferralStore } from '@/stores/referral.store'
import userApi, { JourneyLevelItem } from '@/apis/user.api'
import { cn } from '@udecode/cn'
import { InviteProgressItem } from '@/apis/user.api'
import checkinNeonIcon from '@/assets/checkin/check-in-neon.svg'
import claimIcon from '@/assets/referral/claim-icon.png'
import { message, Modal, Spin } from 'antd'
import { createPublicClient, http } from 'viem'

import PointRewardIcon from '@/assets/journey/point-icon.png'
import CodattaKnowledgeNavigatorIcon from '@/assets/journey/codatta-knowledge-navigator.png'
import CodattaFrontierConquerorIcon from '@/assets/journey/codatta-frontier-conqueror.png'
import { CodattaConnect, EmvWalletConnectInfo, useCodattaConnectContext, WalletItem } from 'codatta-connect'
import ContractCallView from '../common/wallet/contract-call-view'
import journeyContract from '@/contracts/codatta-new-journey.abi'
import WalletConfirmView from '../common/wallet/wallet-confirm-view'
import { journeyStoreActions, useNewJourneyStore } from '@/stores/journey.store'
import ReputationIcon from '@/assets/journey/reputation-icon.png'

function LevelItemIcon({ item }: { item: JourneyLevelItem }) {
  const LevelTypeIconMap = {
    score: PointRewardIcon,
    reputation: ReputationIcon
  }

  const nftIconMap = {
    2: CodattaKnowledgeNavigatorIcon,
    3: CodattaFrontierConquerorIcon
  } as { [key: number]: string }

  return (
    <div className="mb-1">
      {item.reward_type === 'nft' ? (
        <img src={nftIconMap[item.soul_id!]} alt="" className="size-12" />
      ) : (
        <img src={LevelTypeIconMap[item.reward_type]} alt="" className="size-12" />
      )}
    </div>
  )
}

function LevelText({ item }: { item: JourneyLevelItem }) {
  const text = {
    score: `${item.reward_value} Points`,
    reputation: `${item.reward_value} Reputation`,
    nft: `SBT`
  }

  return <div className="mb-3 text-base font-bold">{text[item.reward_type]}</div>
}

function LevelStatus({ item, level }: { item: JourneyLevelItem; level: number }) {
  if (item.status === 1) {
    return (
      <div className="flex size-[50px] w-[180px] items-center justify-center">
        <div className="flex size-10 items-center justify-center rounded-full border border-white/5 bg-[#353540] p-2 text-base font-bold">
          <img src={checkinNeonIcon} />
        </div>
      </div>
    )
  } else if (item.status === 0) {
    return (
      <div className="flex size-[50px] w-[180px] items-center justify-center">
        <img src={claimIcon} alt="" className="size-[50px]" />
      </div>
    )
  } else if (item.status === 2) {
    return (
      <div className="flex size-[50px] w-[180px] items-center justify-center">
        <div className="flex size-10 items-center justify-center rounded-full border border-white/5 bg-[#353540] p-2 text-base font-bold">
          {level}
        </div>
      </div>
    )
  }
}

export default function ReferralProgress() {
  const { levels } = useNewJourneyStore()
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
    journeyStoreActions.getNewJourneyLevels()
  }, [])

  useEffect(() => {
    if (levels.length > 0 && scrollContainerRef.current) {
      const firstClaimableIndex = levels.findIndex((item) => item.status === 0)

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
  }, [levels])

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
  }, [levels])

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

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#252532]">
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
          className="no-scrollbar cursor-grab select-none overflow-x-scroll pb-5 pt-8 active:cursor-grabbing"
        >
          <div className="relative flex min-w-max items-center">
            {levels.map((item, index) => {
              return (
                <div className="relative">
                  <div className="absolute left-0 top-[113px] h-[2px] w-full">
                    <div className="h-full bg-primary/80"></div>
                  </div>
                  <div className="relative flex flex-col items-center">
                    <LevelItemIcon item={item}></LevelItemIcon>
                    <LevelText item={item}></LevelText>
                    <LevelStatus item={item} level={index + 1}></LevelStatus>
                  </div>
                </div>
              )
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
          onSuccess={() => {}}
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
