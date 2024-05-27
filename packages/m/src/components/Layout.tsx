import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="min-h-screen m-auto tracking-tight">
      <Outlet />
    </div>
  )
}

export default Layout
