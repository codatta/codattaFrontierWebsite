import { createRoot } from 'react-dom/client'
import Router from '@/router'
import '@/styles/tailwind.css'
import { ConfigProvider } from 'antd'
import AntdTheme from '@/styles/antd.theme'

const container = document.getElementById('root')
if (!container) {
  throw new Error('root container not found')
}
const root = createRoot(container)
root.render(
  <ConfigProvider theme={AntdTheme}>
    <Router></Router>
  </ConfigProvider>
)
