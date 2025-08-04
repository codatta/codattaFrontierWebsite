import AuthChecker from '@/components/app/auth-checker'
import WalletWatcher from '@/components/app/wallet-watcher'
import { Outlet } from 'react-router-dom'

export default function BinanceActivityLayout() {
  return (
    <AuthChecker>
      <WalletWatcher>
        <Outlet />
      </WalletWatcher>
    </AuthChecker>
  )
}
