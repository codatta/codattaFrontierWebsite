import { Outlet } from 'react-router-dom'
import AuthChecker from './auth-checker'

export default function AuthLayout() {
  console.log('AuthLayout')

  return (
    <AuthChecker>
      <Outlet />
    </AuthChecker>
  )
}
