// import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
// import {
//   DynamicContextProps,
//   DynamicContextProvider,
// } from '@dynamic-labs/sdk-react-core'
import { Outlet } from 'react-router-dom'
// import { VITE_DYNAMIC_ENVIRONMENT_ID } from '@/config'

const Layout = () => {
  // const settings: DynamicContextProps['settings'] = {
  //   environmentId: VITE_DYNAMIC_ENVIRONMENT_ID,
  //   walletConnectors: [EthereumWalletConnectors],
  // }

  return (
    <div className="min-h-screen m-auto">
      {/* <DynamicContextProvider settings={settings}> */}
      <Outlet />
      {/* </DynamicContextProvider> */}
    </div>
  )
}

export default Layout
