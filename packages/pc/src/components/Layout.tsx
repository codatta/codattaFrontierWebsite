import { Outlet } from 'react-router-dom'

import { getChannelCode } from '@/utils/channel'

const Layout = () => {
  // 暂时临时加在这里
  getChannelCode()
  return (
    <Outlet />
  )
}

export default Layout
