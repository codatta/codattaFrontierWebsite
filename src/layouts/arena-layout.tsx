import TransitionEffect from '@/components/common/transition-effect'
import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { userStoreActions, useUserStore } from '@/stores/user.store'
import PageHead from '@/components/common/page-head'
import { arenaStoreActions } from '@/stores/arena.store'
import ArenaNav from '@/components/arena/arena-nav'
import cookies from 'js-cookie'

export default function ArenaLayout() {
  useEffect(() => {
    const token = cookies.get('auth') || localStorage.getItem('auth')
    if (token) userStoreActions.getUserInfo()
    arenaStoreActions.getModelList()
  }, [])

  const { info } = useUserStore()
  const navigate = useNavigate()

  return (
    <TransitionEffect className="bg-[#1a1a1f]">
      <PageHead>
        {info?.user_data.avatar && (
          <div className="flex cursor-pointer items-center" onClick={() => navigate('/app/settings/account')}>
            <img src={info?.user_data.avatar || ''} alt="" className="size-8 rounded-full" />
          </div>
        )}
      </PageHead>
      <div className="mx-auto flex max-w-[1400px] gap-6 px-6">
        <div className="w-[200px]">
          <ArenaNav></ArenaNav>
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </TransitionEffect>
  )
}
