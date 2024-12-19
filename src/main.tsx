import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import Router from '@/router'
import { CodattaConnectContextProvider } from 'codatta-connect'

import AntdTheme from '@/styles/antd.theme'
import '@/styles/tailwind.css'
import 'codatta-connect/dist/style.css'

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
const root = createRoot(container)
root.render(
  <ConfigProvider theme={AntdTheme}>
    <CodattaConnectContextProvider>
      <Router></Router>
    </CodattaConnectContextProvider>
  </ConfigProvider>
)
