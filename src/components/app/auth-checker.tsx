import { userStoreActions } from '@/stores/user.store'
import { authRedirect } from '@/utils/auth-redirect'
import { useCodattaConnectContext } from 'codatta-connect'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

export default function ExtensionChecker(props: { children: React.ReactNode }) {
  const isLogin = userStoreActions.checkLogin()
  const { lastUsedWallet } = useCodattaConnectContext()

  async function handleLogout() {
    if (!lastUsedWallet?.client) return

    await lastUsedWallet.client.request({
      method: 'wallet_revokePermissions',
      params: [{ eth_accounts: {} }]
    })

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

  if (isLogin) return <>{props.children}</>
  else {
    const url = authRedirect()
    return <Navigate to={url}></Navigate>
  }
}
