import { Outlet } from 'react-router-dom'

import Header from './Header'
import { getChannelCode } from '@/utils/channel'

const Layout = () => {

  // 暂时临时加在这里
  getChannelCode()
  return (
    <div className="pb-46px min-h-screen m-auto max-w-1440px">
      <Header />
      <Outlet />
    </div>
  )
}

export default Layout
