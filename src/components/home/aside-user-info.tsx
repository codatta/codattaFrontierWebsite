import { useEffect } from 'react'

import ReputationRate from '@/components/common/reputation-rate'

import { useUserStore, userStoreActions } from '@/stores/user.store'

import defaultAvatar from '@/assets/home/default-avatar.png'
import ImageChrown from '@/assets/home/chrown.png'
import ImageLevel from '@/assets/home/level.png'
import gridTextureImage from '@/assets/home/grid-texture.svg'

export default function UserInfoSection() {
  const { info, username, reputation, points } = useUserStore()

  useEffect(() => {
    userStoreActions.getUserInfo()
  }, [])

  return (
    <div className="relative pt-6 text-center">
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
          {/* <img className="block size-20 rounded-full" src={info?.avatar_url} alt="" /> */}
          <img className="block size-20 rounded-full" src={info?.user_data?.avatar ?? defaultAvatar} alt="" />
        </div>
        <div className="mb-8 text-[16px] font-bold">{username}</div>

        <div>
          <div className="mb-2 flex items-center px-10 text-left text-sm">
            <img src={ImageChrown} className="mr-3 size-12" alt="" />
            <div>
              <p className="font-zendots text-lg">{Math.round(+points || 0)}</p>
              <p className="text-gray-500">Reward</p>
            </div>
          </div>
          <div className="flex items-center bg-[#252532] px-10 pb-6 pt-2 text-left text-sm">
            <img src={ImageLevel} className="mr-3 size-12" alt="" />
            <div>
              <ReputationRate rate={reputation} size={24} color={'rgba(255, 168, 0, 0.88)'}></ReputationRate>
              <p className="text-gray-500">Reputation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
