import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo } from 'react'

import ReputationRate from '@/components/common/reputation-rate'
import UsernameEditor from '@/components/account/username-editor'
import UserAvatarEditor from '@/components/account/useravatar-editor'

import card1Bg from '@/assets/userinfo/card-1-bg.png'
import card2Bg from '@/assets/userinfo/card-2-bg.png'
import card3Bg from '@/assets/userinfo/card-3-bg.png'

import USDTIcon from '@/assets/userinfo/usdt-icon.svg?react'
import XnyIcon from '@/assets/userinfo/xny-icon.svg?react'
import ReputationIcon from '@/assets/userinfo/reputation-icon.svg?react'
import RewardIcon from '@/assets/userinfo/reward-icon.svg?react'
import PersonalIcon from '@/assets/userinfo/personal-icon.svg?react'
import NftIcon from '@/assets/userinfo/nft-icon.svg?react'
import DataIcon from '@/assets/userinfo/data-icon.svg?react'
import ChainIcon from '@/assets/userinfo/chain-icon.svg?react'
import ArrowRightIcon from '@/assets/userinfo/arrow-right.svg?react'

import { useUserStore } from '@/stores/user.store'

import { UserAsset } from '@/apis/user.api'

export default function UserInfo() {
  const { info } = useUserStore()

  useEffect(() => {
    console.log('info', info)
  }, [info])

  return (
    <div className="">
      <h2 className="mb-6 text-[32px] font-semibold leading-[48px]">User Info</h2>
      <Asset assets={info?.user_assets || []} reputation={info?.user_reputation || 0} />
      <div className="mt-12 flex items-stretch gap-6">
        <div>
          <h3 className="mb-3 text-lg font-bold">Name & Avatar</h3>
          <div
            className="group flex h-[280px] w-[347px] flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${card3Bg})` }}
          >
            <UserAvatarEditor />
            <UsernameEditor />
          </div>
        </div>
        <InfoList />
      </div>
    </div>
  )
}

function Asset({ assets, reputation = 0 }: { assets: readonly UserAsset[]; reputation: number }) {
  const reward = useMemo(
    () => Math.round(Number(assets.find((asset) => asset.asset_type === 'POINTS')?.balance.amount ?? 0)),
    [assets]
  )
  const xyn = useMemo(
    () => Number(assets.find((asset) => asset.asset_type === 'XNYCoin')?.balance.amount ?? '0').toFixed(2),
    [assets]
  )
  const usdt = useMemo(
    () => Number(assets.find((asset) => asset.asset_type === 'USDT')?.balance.amount ?? '0').toFixed(2),
    [assets]
  )

  const navigate = useNavigate()

  const handleClick = (pathname: string) => {
    navigate(pathname)
  }

  return (
    <div>
      <h3 className="mb-3 text-lg font-bold">Asset</h3>
      <ul className="flex gap-6">
        <AssetCard title="Data Assets" bg={card1Bg} onClick={() => handleClick('/app/userinfo/data')}>
          <div className="flex size-full items-center justify-between">
            <div className="flex flex-1 flex-col items-center justify-center">
              <USDTIcon />
              <span className="text-lg font-bold">{usdt}</span>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center">
              <XnyIcon />
              <span className="text-lg font-bold">{xyn}</span>
            </div>
          </div>
        </AssetCard>
        <AssetCard title="Reputation" bg={card2Bg} onClick={() => handleClick('/app/userinfo/reputation')}>
          <div className="flex size-full items-center justify-center gap-[14px]">
            <ReputationIcon />
            <div className="flex-1">
              <ReputationRate rate={reputation} size={24} color={'rgba(255, 168, 0, 0.88)'}></ReputationRate>
              <div className="mt-[6px] text-sm font-semibold">Reputation</div>
            </div>
          </div>
        </AssetCard>
        <AssetCard title="Reward" bg={card2Bg} onClick={() => handleClick('/app/userinfo/reward')}>
          <div className="flex size-full items-center justify-center gap-[14px]">
            <RewardIcon />
            <div className="flex-1">
              <div className="font-zendots text-2xl">{reward}</div>
              <div className="mt-[6px] text-sm font-semibold">Reward</div>
            </div>
          </div>
        </AssetCard>
      </ul>
    </div>
  )
}

interface AssetCardProps {
  title: string
  bg: string
  children: React.ReactNode
  onClick?: () => void
}

function AssetCard({ title, bg, children, onClick }: AssetCardProps) {
  return (
    <li
      className="group shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-[#FFFFFF1F] bg-[#252532] p-6 transition-all hover:border-[#875DFF] hover:[filter:drop-shadow(0_4px_8px_rgba(135,93,255,0.1))_drop-shadow(0_14px_14px_rgba(135,93,255,0.09))_drop-shadow(0_32px_19px_rgba(135,93,255,0.05))_drop-shadow(0_58px_23px_rgba(135,93,255,0.01))_drop-shadow(0_90px_25px_rgba(135,93,255,0))]"
      onClick={onClick}
    >
      <div
        className="h-[148px] w-[298px] overflow-hidden rounded-xl bg-cover bg-center bg-no-repeat p-4"
        style={{ backgroundImage: `url(${bg})` }}
      >
        {children}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold">{title}</span>
        <ArrowRightIcon className="opacity-0 transition-all group-hover:opacity-100" />
      </div>
    </li>
  )
}

function InfoList() {
  const navigate = useNavigate()

  const infoList = [
    {
      title: 'Personal',
      icon: <PersonalIcon />,
      link: '/app/userinfo/personal'
    },
    {
      title: 'NFT',
      icon: <NftIcon />,
      link: '/app/userinfo/nft'
    },
    {
      title: 'Data Profile',
      icon: <DataIcon />,
      link: '/app/userinfo/data'
    },
    {
      title: 'Data on Chain',
      icon: <ChainIcon />,
      link: '/app/userinfo/onchain'
    }
  ]

  const handleClick = (link: string) => {
    navigate(link)
  }

  return (
    <div>
      <h3 className="mb-3 text-lg font-bold">Information</h3>
      <ul className="grid h-[280px] w-[717px] grid-cols-2 gap-6 text-lg font-bold">
        {infoList.map((item, index) => (
          <li
            key={item.title + index}
            className="flex cursor-pointer items-center gap-4 rounded-2xl border border-transparent bg-[#252532] p-6 transition-all hover:border-[#875DFF] hover:[filter:drop-shadow(0_4px_8px_rgba(135,93,255,0.1))_drop-shadow(0_14px_14px_rgba(135,93,255,0.09))_drop-shadow(0_32px_19px_rgba(135,93,255,0.05))_drop-shadow(0_58px_23px_rgba(135,93,255,0.01))_drop-shadow(0_90px_25px_rgba(135,93,255,0))]"
            onClick={() => handleClick(item.link)}
          >
            {item.icon}
            <span>{item.title}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
