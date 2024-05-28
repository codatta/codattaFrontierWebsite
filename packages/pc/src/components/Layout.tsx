import { Outlet } from 'react-router-dom'

import Header from './Header'

const Layout = () => {
  return (
    <div className="pb-46px min-h-screen m-auto max-w-1440px">
      <Header />
      <Outlet />
    </div>
  )
}

export default Layout
