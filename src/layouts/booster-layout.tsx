import { Outlet } from 'react-router-dom'
import AuthChecker from '@/components/app/auth-checker'

export default function BoosterLayout() {
  return (
    <AuthChecker>
      <div className="relative min-h-screen bg-[#1c1c26] px-6 pb-10 text-white">
        <Outlet />
      </div>
    </AuthChecker>
  )
}
