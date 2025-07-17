import { useEffect } from 'react'

import SocialLinkButtons from '@/components/account/social-link-buttons'
import UserSecurity from '@/components/account/user-security'

import { userStoreActions } from '@/stores/user.store'

export default function UserInfoPersonal() {
  useEffect(() => {
    userStoreActions.getUserInfo()
  }, [])

  return (
    <div>
      <h3 className="mb-6 text-[32px] font-bold leading-[40px]">Personal</h3>
      <div className="flex gap-12">
        <PersonalInfo />
        <ConnectAccount />
      </div>
    </div>
  )
}

function PersonalInfo() {
  return (
    <div className="flex-1">
      <h4 className="mb-3 text-base font-semibold">Personal Info</h4>
      <div className="overflow-hidden rounded-2xl bg-[#252532] p-6">
        <UserSecurity />
      </div>
    </div>
  )
}

function ConnectAccount() {
  return (
    <div className="flex-1">
      <h4 className="mb-3 text-base font-semibold">Connect Account</h4>
      <div className="overflow-hidden rounded-2xl bg-[#252532] p-6">
        <SocialLinkButtons />
      </div>
    </div>
  )
}
