import AuthChecker from '@/components/app/auth-checker'
import PageHead from '@/components/common/page-head'
import { Outlet } from 'react-router-dom'

export default function CMULayout() {
  return (
    <AuthChecker>
      <div className="relative min-h-screen bg-[#1c1c26]">
        <PageHead></PageHead>
        <div className="no-scrollbar mx-auto flex h-[calc(100vh-84px)] max-w-[1272px] flex-1 flex-col gap-10 overflow-scroll p-6 text-white lg:flex-row">
          <Outlet />
        </div>
      </div>
    </AuthChecker>
  )
}
