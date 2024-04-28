import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import {
  DynamicContextProps,
  DynamicContextProvider,
} from '@dynamic-labs/sdk-react-core'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  const settings: DynamicContextProps['settings'] = {
    environmentId: 'a55eb2b4-84ca-41ff-a369-fc52646ed585',
    walletConnectors: [EthereumWalletConnectors],
  }

  return (
    <div className="min-h-screen m-auto">
      <DynamicContextProvider settings={settings}>
        <Outlet />
      </DynamicContextProvider>
    </div>
  )
}

export default Layout
