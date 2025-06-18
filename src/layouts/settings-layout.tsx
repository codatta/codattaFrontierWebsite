import TransitionEffect from '@/components/common/transition-effect'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@udecode/cn'
import { useEffect } from 'react'
import { userStoreActions } from '@/stores/user.store'

interface AccountSubMenu {
  label: string
  key: string
}

function SettingsMenu() {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems: AccountSubMenu[] = [
    { label: 'Personal Info', key: '/app/settings/account' },
    { label: 'Reward', key: '/app/settings/reward' },
    { label: 'Reputation', key: '/app/settings/reputation' },
    { label: 'NFT', key: '/app/settings/nft' }
    // { label: 'SBT', key: '/app/settings/sbt' }
  ]

  function handleMenuClick(item: AccountSubMenu) {
    navigate(item.key)
  }

  return (
    <div className="no-scrollbar flex shrink-0 cursor-pointer overflow-scroll border-white/10 lg:block lg:w-[147px] lg:border-r">
      {menuItems.map((item) => (
        <div
          key={item.key}
          onClick={() => handleMenuClick(item)}
          className={cn(
            'whitespace-nowrap border-b-[3px] px-6 py-4 transition-all duration-300 lg:border-r-[3px]',
            location.pathname === item.key
              ? 'border-b-[3px] border-b-primary border-r-transparent bg-primary/25 lg:border-b-transparent lg:border-r-primary'
              : 'border-b-white/0 bg-white/5 lg:border-r-primary/0 lg:bg-transparent'
          )}
        >
          {item.label}
        </div>
      ))}
    </div>
  )
}

export default function SettingsLayout() {
  useEffect(() => {
    userStoreActions.getUserInfo()
  }, [])

  return (
    <TransitionEffect className="">
      <h1 className="mb-2 text-4xl font-semibold leading-8">User Settings</h1>
      <p className="mb-6">Manage your account settings and preferences</p>
      <div className="block rounded-2xl bg-transparent py-0 lg:flex lg:bg-white/5 lg:py-6">
        <div className="mb-6 hidden lg:mb-0 lg:block">
          <SettingsMenu />
        </div>
        <div className="w-full px-0 lg:px-6">
          <Outlet />
        </div>
      </div>
    </TransitionEffect>
  )
}
