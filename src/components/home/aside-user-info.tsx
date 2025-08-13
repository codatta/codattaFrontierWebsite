import { useEffect, useMemo } from 'react'
import { cn } from '@udecode/cn'
import { ChevronRight } from 'lucide-react'

import ReputationRate from '@/components/common/reputation-rate'

import defaultAvatar from '@/assets/home/default-avatar.png'
import ImageChrown from '@/assets/home/chrown.png'
import ImageLevel from '@/assets/home/level.png'
import gridTextureImage from '@/assets/home/grid-texture.svg'
import USDTIcon from '@/assets/userinfo/usdt-icon.svg'
import XnyIcon from '@/assets/userinfo/xny-icon.svg'

import { useUserStore, userStoreActions } from '@/stores/user.store'
import { formatNumber } from '@/utils/str'

export default function UserInfoSection() {
  const { info, username, reputation } = useUserStore()
  const assets = useMemo(() => {
    const xyn = info?.user_assets?.find((asset) => asset.asset_type === 'XnYCoin')?.balance
    const usdt = info?.user_assets?.find((asset) => asset.asset_type === 'USDT')?.balance
    const points = info?.user_assets?.find((asset) => asset.asset_type === 'POINTS')?.balance
    const xynAmount = formatNumber(Number(xyn?.amount ?? 0))
    const usdtAmount = formatNumber(Number(usdt?.amount ?? 0))
    const pointsAmount = formatNumber(Number(points?.amount || 0))

    return [
      {
        amount: usdtAmount === '0' ? '0.00' : usdtAmount,
        currency: 'USDT',
        icon: USDTIcon,
        hasBg: false
      },
      {
        amount: xynAmount === '0' ? '0.00' : xynAmount,
        currency: 'XNY',
        icon: XnyIcon,
        hasBg: true
      },
      {
        amount: pointsAmount === '0' ? '0.00' : pointsAmount,
        currency: 'Reward',
        icon: ImageChrown,
        hasBg: true
      }
    ]
  }, [info])

  useEffect(() => {
    userStoreActions.getUserInfo()
  }, [])

  useEffect(() => {
    console.log(info, info)
  }, [info])

  return (
    <div className="relative bg-[#252532] pt-6 text-center">
      <div
        className="absolute top-0 w-full"
        style={{
          background: 'radial-gradient(at 0% 0%, #4C3F76 10%, #2E2E37 70%)'
        }}
      >
        <object data={gridTextureImage} type="image/svg+xml"></object>
      </div>
      <div className="relative">
        <div className="mb-2 flex justify-center">
          <img className="block size-20 rounded-full" src={info?.user_data?.avatar ?? defaultAvatar} alt="" />
        </div>
        <div className="mb-8 text-[16px] font-bold">{username}</div>

        <ul className="text-left text-sm leading-[22px] text-white">
          {assets.map((asset) => (
            <AssetItem
              key={asset.currency}
              icon={asset.icon}
              name={asset.currency}
              balance={asset.amount}
              className={asset.hasBg ? 'bg-[#252532] px-4' : 'px-4'}
            />
          ))}
          <ReputationItem reputation={reputation} className="bg-[#252532] px-4" />
        </ul>
      </div>
    </div>
  )
}

function AssetItem({
  icon,
  name,
  balance,
  className
}: {
  icon: string
  name: string
  balance: number | string
  className?: string
}) {
  return (
    <li className={cn('flex items-center justify-between border-b border-[#FFFFFF1F] pb-3 pt-4', className)}>
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

function ReputationItem({ reputation, className }: { reputation: number; className?: string }) {
  return (
    <li className={cn('flex items-center justify-between border-b border-[#FFFFFF1F] pb-3 pt-4', className)}>
      <div className="flex items-center gap-3">
        <img src={ImageLevel} className="size-12" alt="" />
        <div>
          <ReputationRate rate={reputation} size={20} color="#FCC800"></ReputationRate>
          <p>Reputation</p>
        </div>
      </div>
      <ChevronRight size={18} />
    </li>
  )
}
