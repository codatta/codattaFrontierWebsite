// import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
// import {
//   DynamicContextProps,
//   DynamicContextProvider,
// } from '@dynamic-labs/sdk-react-core'
import { Outlet } from 'react-router-dom'

import Header from './Header'
// import { VITE_DYNAMIC_ENVIRONMENT_ID } from '@/config'

const Layout = () => {
  // const settings: DynamicContextProps['settings'] = {
  //   environmentId: VITE_DYNAMIC_ENVIRONMENT_ID,
  //   walletConnectors: [EthereumWalletConnectors],
  // }

  return (
    <div className="pb-46px min-h-screen m-auto">
      {/* <DynamicContextProvider settings={settings}> */}
      <Header />
      <Outlet />
      {/* <CopyRights /> */}
      {/* </DynamicContextProvider> */}
    </div>
  )
}

export default Layout
