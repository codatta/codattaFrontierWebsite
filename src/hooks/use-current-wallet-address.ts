import { useEffect, useRef, useState } from 'react'
import { useCodattaConnectContext } from 'codatta-connect'

const MAX_POLL_COUNT = 6
const POLL_INTERVAL = 500

export function useCurrentWalletAddress() {
  const { lastUsedWallet } = useCodattaConnectContext()
  const [walletAddress, setWalletAddress] = useState<`0x${string}` | null>(null)
  const timer = useRef<NodeJS.Timeout>()
  const pollCount = useRef<number>(0)

  useEffect(() => {
    clearTimeout(timer.current)

    const checkAndPoll = () => {
      if (!lastUsedWallet?.address) {
        if (pollCount.current < MAX_POLL_COUNT) {
          pollCount.current += 1
          timer.current = setTimeout(checkAndPoll, POLL_INTERVAL)
        }
        return
      }

      if (lastUsedWallet.address !== walletAddress) {
        setWalletAddress(lastUsedWallet.address)
      }
      pollCount.current = 0
    }

    checkAndPoll()

    return () => {
      clearTimeout(timer.current)
    }
  }, [lastUsedWallet, walletAddress])

  return walletAddress
}
