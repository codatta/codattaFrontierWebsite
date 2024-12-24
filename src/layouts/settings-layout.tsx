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
    { label: 'Reputation', key: '/app/settings/reputation' }
  ]

  function handleMenuClick(item: AccountSubMenu) {
    navigate(item.key)
  }

  return (
    <div className="w-[147px] shrink-0 cursor-pointer border-r border-white/10">
      {menuItems.map((item) => (
        <div
          key={item.key}
          onClick={() => handleMenuClick(item)}
          className={cn(
            'border-r-[3px] px-6 py-4 transition-all duration-300',
            location.pathname === item.key ? 'border-r-primary bg-primary/25' : 'border-r-primary/0'
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
      <div className="flex rounded-2xl bg-white/5 py-6">
        <SettingsMenu />
        <Outlet />
      </div>
    </TransitionEffect>
  )
}
