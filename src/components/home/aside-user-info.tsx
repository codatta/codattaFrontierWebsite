import { useEffect, useMemo } from 'react'
import { cn } from '@udecode/cn'
import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import ReputationRate from '@/components/common/reputation-rate'
import CheckinBtn from './aside-checkin'
import Copy from '@/components/common/copy'

import defaultAvatar from '@/assets/home/default-avatar.png'
import ImageLevel from '@/assets/home/level.png'
import gridTextureImage from '@/assets/home/grid-texture.svg'
import USDTIcon from '@/assets/userinfo/usdt-icon.svg'
import XnyIcon from '@/assets/userinfo/xny-icon.svg'
// import SettingsIcon from '@/assets/icons/settings.svg?react'
import ArrowRightIcon from '@/assets/icons/arrow-right.svg?react'

import { userStoreActions, useUserStore } from '@/stores/user.store'

import { formatNumber } from '@/utils/str'
import { shortenAddress } from '@/utils/wallet-address'

export default function UserInfoSection() {
  const navigate = useNavigate()
  const { info, username, reputation } = useUserStore()
  const assets = useMemo(() => {
    const xyn = info?.user_assets?.find((asset) => asset.asset_type === 'XnYCoin')?.balance
    const usdt = info?.user_assets?.find((asset) => asset.asset_type === 'USDT')?.balance
    const points = info?.user_assets?.find((asset) => asset.asset_type === 'POINTS')?.balance
    const xynAmount = formatNumber(Number(xyn?.amount ?? 0))
    const usdtAmount = formatNumber(Number(usdt?.amount ?? 0))
    const pointsAmount = formatNumber(parseInt(String(points?.amount ?? '0')))

    return [
      {
        amount: usdtAmount === '0' ? '0.00' : usdtAmount,
        currency: 'USDT',
        icon: USDTIcon,
        hasBg: false,
        link: '/app/settings/data-assets'
      },
      {
        amount: xynAmount === '0' ? '0.00' : xynAmount,
        currency: 'XNY',
        icon: XnyIcon,
        hasBg: true,
        link: '/app/settings/data-assets'
      },
      {
        amount: pointsAmount === '0' ? '0.00' : pointsAmount,
        currency: 'Reward',
        icon: 'https://static.codatta.io/static/images/e6a4ecb424540bf69b1f59db166f15159b7af523.png',
        hasBg: true,
        link: '/app/settings/reward'
      }
    ]
  }, [info])

  useEffect(() => {
    userStoreActions.getUserInfo()
  }, [])

  return (
    <div className="relative bg-[#252532] pt-6 text-center">
      <div
        className="absolute top-0 w-full"
        style={{
          background: 'radial-gradient(at 0% 0%, #4C3F76 10%, #252532 70%)'
        }}
      >
        <object data={gridTextureImage} type="image/svg+xml"></object>
      </div>
      <div className="relative">
        <div className="mb-2 flex justify-center">
          <img className="block size-20 rounded-full" src={info?.user_data?.avatar ?? defaultAvatar} alt="" />
        </div>
        <div className="text-[16px] font-bold">{username}</div>
        <DidItem did={info?.user_data?.did} className="mt-7" />
        <CheckinBtn className="my-4" />
        <ul className="text-left text-sm leading-[22px] text-white">
          {assets.map((asset) => (
            <AssetItem
              key={asset.currency}
              icon={asset.icon}
              name={asset.currency}
              balance={asset.amount}
              className={asset.hasBg ? 'bg-[#252532] px-4' : 'px-4'}
              onClick={() => navigate(asset.link)}
            />
          ))}
          <ReputationItem
            reputation={reputation}
            className="bg-[#252532] px-4"
            onClick={() => navigate('/app/settings/reputation')}
          />
        </ul>
      </div>
    </div>
  )
}

function AssetItem({
  icon,
  name,
  balance,
  className,
  onClick
}: {
  icon: string
  name: string
  balance: number | string
  className?: string
  onClick?: () => void
}) {
  return (
    <li
      className={cn(
        'flex items-center justify-between border-b border-[#FFFFFF1F] pb-3 pt-4 hover:cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <img src={icon} className="size-12" alt="" />
        <div>
          <p className="font-zendots text-lg">{balance}</p>
          <p>{name}</p>
        </div>
      </div>
      <ChevronRight size={18} />
    </li>
  )
}

function ReputationItem({
  reputation,
  className,
  onClick
}: {
  reputation: number
  className?: string
  onClick?: () => void
}) {
  return (
    <li
      className={cn(
        'flex items-center justify-between border-b border-[#FFFFFF1F] pb-3 pt-4 hover:cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <img src={ImageLevel} className="size-12" alt="" />
        <div>
          <ReputationRate rate={reputation} className="font-zendots text-lg"></ReputationRate>
          <p>Reputation</p>
        </div>
      </div>
      <ChevronRight size={18} />
    </li>
  )
}

function DidItem({ className, did }: { className?: string; did?: string }) {
  const navigate = useNavigate()

  return did ? (
    <div
      className={cn(
        'mx-4 flex items-center justify-between rounded-full border border-[#FFFFFF1F] bg-[#1C1C26] px-4 text-sm font-semibold leading-[44px] text-white',
        className
      )}
    >
      <div className="flex items-center gap-3">
        DID
        {/* <SettingsIcon className="size-4" /> */}
      </div>
      <div className="flex items-center gap-3">
        {shortenAddress(did, 8)}
        <Copy content={did} size={18} />
      </div>
    </div>
  ) : (
    <div
      className={cn(
        'mx-4 flex cursor-pointer items-center justify-between rounded-full border border-[#875DFF] px-4 text-sm font-semibold leading-[44px] text-[#875DFF]',
        className
      )}
      onClick={() => navigate('/app/settings/did')}
    >
      Upgrade DID <ArrowRightIcon className="size-[18px]" />
    </div>
  )
}
