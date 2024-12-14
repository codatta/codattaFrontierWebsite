import { Outlet } from 'react-router-dom'
import { ConfigProvider, ThemeConfig, theme } from 'antd'
import PageHead from '@/components/common/page-head'

const themeConfig: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#875DFF'
  },
  components: {
    Modal: {
      contentBg: '#1C1C26',
      colorBgMask: 'rgba(0,0, 0, 0.8)',
      borderRadiusLG: 24
    }
  }
}

export default function AppLayout() {
  return (
    <ConfigProvider theme={themeConfig}>
      <div className="relative min-h-screen bg-[#1c1c26]">
        <PageHead />
        <Outlet />
      </div>
    </ConfigProvider>
  )
}
