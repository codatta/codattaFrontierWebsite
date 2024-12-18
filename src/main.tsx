import { createRoot } from 'react-dom/client'
import { VITE_GA_TRACKING_ID } from '@/configs/config'
import Router from '@/router'
import '@/styles/tailwind.css'
import { ConfigProvider } from 'antd'
import AntdTheme from '@/styles/antd.theme'
import '@/styles/global.css'
import ReactGA from 'react-ga4'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import isToday from 'dayjs/plugin/isToday'
dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isToday)

const container = document.getElementById('root')
if (!container) {
  throw new Error('root container not found')
}

initReactGA()

const root = createRoot(container)
root.render(
  <ConfigProvider theme={AntdTheme}>
    <Router></Router>
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
