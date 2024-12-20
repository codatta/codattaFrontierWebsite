import { useUserStore } from '@/stores/user.store'
import { Tooltip } from 'antd'
import { LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { logout } from '@/stores/auth.store'

export default function AppUser() {
  const { info } = useUserStore()
  const handleLogout: React.MouseEventHandler = (e) => {
    e.preventDefault()
    logout()
  }

  return (
    <div className="mt-2 pl-4">
      <Link
        className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 hover:text-white"
        to="/settings/account"
      >
        {info?.user_data?.avatar && (
          <img src={info?.user_data?.avatar} className="size-6 rounded-full" />
        )}
        <div className="hidden flex-1 truncate lg:block">
          {info?.user_data?.user_name}
        </div>
        <Tooltip title="Log out">
          <div className="py-2 pl-2" onClick={handleLogout}>
            <LogOut size={16} className="hidden lg:block"></LogOut>
          </div>
        </Tooltip>
      </Link>
    </div>
  )
}
