import TransitionEffect from '@/components/common/transition-effect'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { userStoreActions } from '@/stores/user.store'
import { arenaStoreActions } from '@/stores/arena.store'
// import ArenaNav from '@/components/arena/arena-nav'
import cookies from 'js-cookie'
import ArenaHeader from '@/components/arena/arena-header'

export default function ArenaLayout() {
  useEffect(() => {
    const token = cookies.get('auth') || localStorage.getItem('auth')
    if (token) userStoreActions.getUserInfo()
    arenaStoreActions.getModelList()
    userStoreActions.getUserInfo()
  }, [])

  return (
    <TransitionEffect className="">
      <div className="sticky top-0 z-[100]">
        <ArenaHeader />
      </div>
      <div className="mx-auto max-w-[1400px] px-6 py-10">
        <Outlet />
      </div>
    </TransitionEffect>
  )
}
