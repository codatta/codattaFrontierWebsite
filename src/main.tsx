import { createRoot } from 'react-dom/client'
import Router from '@/router'
import { ConfigProvider } from 'antd'
import { CodattaConnectContextProvider } from 'codatta-connect'
import '@/lab/telegram.sdk.js'

import AntdTheme from '@/styles/antd.theme'
import '@/styles/tailwind.css'
import '@/styles/global.css'
import 'codatta-connect/dist/codatta-connect.css'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import isToday from 'dayjs/plugin/isToday'
import { defineChain } from 'viem'

import { initGA } from './utils/track'

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

initGA()

const userAgent = navigator.userAgent
const isInBinanceApp = userAgent.includes('BNC/') && userAgent.includes('BMP/')

const root = createRoot(container)
root.render(
  <ConfigProvider theme={AntdTheme}>
    <CodattaConnectContextProvider
      singleWalletName={isInBinanceApp ? 'Binance Wallet' : undefined}
      chains={[BSC_CHAIN]}
    >
      <Router></Router>
    </CodattaConnectContextProvider>
  </ConfigProvider>
)
