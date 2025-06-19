import { createRoot } from 'react-dom/client'
import { VITE_GA_TRACKING_ID } from '@/config/config'
import Router from '@/router'
import { ConfigProvider } from 'antd'
import { CodattaConnectContextProvider } from 'codatta-connect'
import '@/lab/telegram.sdk.js'

import AntdTheme from '@/styles/antd.theme'
import '@/styles/tailwind.css'
import '@/styles/global.css'
import 'codatta-connect/dist/style.css'

import ReactGA from 'react-ga4'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import isToday from 'dayjs/plugin/isToday'
import { defineChain } from 'viem'

dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isToday)

const container = document.getElementById('root')
if (!container) {
  throw new Error('root container not found')
}

const BSC_CHAIN = defineChain({
  id: 56,
  name: 'BNB Smart Chain Mainnet',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://bsc-dataseed1.bnbchain.org']
    }
  },
  blockExplorers: {
    default: {
      name: 'BSCScan',
      url: 'https://bscscan.com/'
    }
  }
})

initReactGA()

const root = createRoot(container)
root.render(
  <ConfigProvider theme={AntdTheme}>
    <CodattaConnectContextProvider singleWalletName="Binance Wallet" chains={[BSC_CHAIN]}>
      <Router></Router>
    </CodattaConnectContextProvider>
  </ConfigProvider>
)

function initReactGA() {
  ReactGA.initialize([
    {
      trackingId: VITE_GA_TRACKING_ID,
      gaOptions: {
        userId: localStorage.getItem('uid') || undefined
      }
    }
  ])
}
