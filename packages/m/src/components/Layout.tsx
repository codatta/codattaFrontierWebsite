import { getChannelCode } from '@/utils/channel'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  // 临时加在这里
  getChannelCode()
  return (
    <div className="min-h-screen m-auto tracking-tight">
      <Outlet />
    </div>
  )
}

export default Layout
