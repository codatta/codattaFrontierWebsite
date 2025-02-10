import { useUserStore } from '@/stores/user.store'
import { Avatar, Tooltip } from 'antd'
import { LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { authRedirect } from '@/utils/auth-redirect'

export default function AppUser() {
  const { info, username } = useUserStore()

  const handleLogout: React.MouseEventHandler = (e) => {
    e.preventDefault()
    localStorage.removeItem('token')
    localStorage.removeItem('uid')
    localStorage.removeItem('auth')
    const url = authRedirect()
    window.location.href = url
  }

  return (
    <div className="py-0.5 pl-4 pr-2 lg:pr-0">
      <Link
        className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 hover:text-white"
        to="/app/settings/account"
      >
        <Avatar className="shrink-0" src={info?.user_data?.avatar} size={24}></Avatar>
        <div className="hidden flex-1 truncate lg:block">{username}</div>
        <Tooltip title="Log out" className="hidden lg:block">
          <div className="py-2 pl-2" onClick={handleLogout}>
            <LogOut size={16}></LogOut>
          </div>
        </Tooltip>
      </Link>
    </div>
  )
}
