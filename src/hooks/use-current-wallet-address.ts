import { useMemo } from 'react'
import { useCodattaConnectContext } from 'codatta-connect'

import { useUserStore } from '@/stores/user.store'

export function useCurrentWalletAddress() {
  const { lastUsedWallet } = useCodattaConnectContext()
  const { info } = useUserStore()

  const walletAddress = useMemo(() => {
    // 1. Priority: Connected Wallet (active session)
    if (lastUsedWallet?.address) {
      return lastUsedWallet.address
    }

    // 2. Fallback: User Store (bound account)
    if (info?.accounts_data) {
      const currentAccount = info.accounts_data.find((item) => item.current_account)
      if (currentAccount && ['blockchain', 'wallet', 'block_chain'].includes(currentAccount.account_type)) {
        return currentAccount.account
      }
    }

    return undefined
  }, [lastUsedWallet?.address, info?.accounts_data])

  return walletAddress
}
