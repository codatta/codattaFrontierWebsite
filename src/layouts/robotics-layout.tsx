import { Outlet } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import PageHead from '@/components/common/page-head'
import AntdTheme from '@/styles/antd.theme'

export default function AppLayout() {
  return (
    <ConfigProvider theme={AntdTheme}>
      <div className="relative min-h-screen bg-[#1c1c26]">
        <PageHead />
        <Outlet />
      </div>
    </ConfigProvider>
  )
}
