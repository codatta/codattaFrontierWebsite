import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import TransitionEffect from '@/components/common/transition-effect'
import ArrowLeftIcon from '@/assets/userinfo/arrow-left.svg?react'
import { cn } from '@udecode/cn'

export default function SettingsLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const hasBackButton = /userinfo\/.+$/.test(location.pathname)

  const onBack = () => {
    navigate('/app/userinfo')
  }

  useEffect(() => {
    console.log(location.pathname, location)
  }, [location])

  return (
    <TransitionEffect className="px-6 py-3">
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
