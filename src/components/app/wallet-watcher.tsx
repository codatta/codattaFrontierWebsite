import { userStoreActions } from '@/stores/user.store'
import { useCodattaConnectContext } from 'codatta-connect'
import { useEffect } from 'react'

/**
 * This component is used to watch the wallet and logout the user if the wallet is changed or disconnected.
 */
export default function WalletWatcher(props: { children: React.ReactNode }) {
  const { lastUsedWallet } = useCodattaConnectContext()

  async function handleLogout() {
    if (lastUsedWallet?.client) {
      lastUsedWallet.client.request({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }]
      })
    }

    userStoreActions.logout()
  }

  useEffect(() => {
    if (!lastUsedWallet) return

    lastUsedWallet.provider?.on('accountsChanged', handleLogout)
    lastUsedWallet.provider?.on('disconnect', handleLogout)

    return () => {
      lastUsedWallet.provider?.removeListener('accountsChanged', handleLogout)
      lastUsedWallet.provider?.removeListener('disconnect', handleLogout)
    }
  }, [lastUsedWallet])

  return <>{props.children}</>
}
