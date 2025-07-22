import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@udecode/cn'

import TransitionEffect from '@/components/common/transition-effect'

import ArrowLeftIcon from '@/assets/userinfo/arrow-left.svg?react'

import { userStoreActions } from '@/stores/user.store'

export default function SettingsLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const hasBackButton = /settings\/.+$/.test(location.pathname)

  const onBack = () => {
    navigate('/app/settings')
  }

  useEffect(() => {
    userStoreActions.getUserInfo()
  }, [])

  return (
    <TransitionEffect className="flex min-h-full max-w-[1232px] flex-col px-6 py-3">
      <header className={cn('mb-12 flex text-sm', !hasBackButton && 'hidden')}>
        <div className="flex cursor-pointer items-center gap-2" onClick={onBack}>
          <ArrowLeftIcon />
          <span>Back</span>
        </div>
      </header>
      <Outlet />
    </TransitionEffect>
  )
}
