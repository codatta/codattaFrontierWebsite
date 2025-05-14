import { Outlet } from 'react-router-dom'
import PageHead from '@/components/common/page-head'
import AuthChecker from '@/components/app/auth-checker'

export default function FrontierLayout() {
  return (
    <AuthChecker>
      <div className="relative min-h-screen bg-[#1c1c26]">
        <PageHead />
        <Outlet />
      </div>
    </AuthChecker>
  )
}
