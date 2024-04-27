import React from 'react'
import ReactDOM from 'react-dom/client'

import { RouterProvider } from 'react-router-dom'
import router from './router.tsx'
import {
  DynamicContextProps,
  DynamicContextProvider,
} from '@dynamic-labs/sdk-react-core'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'

import './index.scss'
import 'virtual:uno.css'

const settings: DynamicContextProps['settings'] = {
  environmentId: 'a55eb2b4-84ca-41ff-a369-fc52646ed585',
  walletConnectors: [EthereumWalletConnectors],
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DynamicContextProvider settings={settings}>
      <RouterProvider router={router} />
    </DynamicContextProvider>
  </React.StrictMode>
)
