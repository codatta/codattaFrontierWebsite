import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import SideNav from '@/components/app/app-sider'
// import { authRedirect } from '@/utils/auth-redirect'
import { channelStoreActions, useChannelStore } from '@/stores/channel.store'

export default function AppLayout() {
  const { relatedInfo } = useChannelStore()

  useEffect(() => {
    // notificationStoreActions.getUnread()
    if (relatedInfo) channelStoreActions.updateRelatedInfo(relatedInfo)
  }, [relatedInfo])

  // const result = checkLogin()
  // if (!result) {
  //   const url = authRedirect()
  //   return <Navigate to={url}></Navigate>
  // }

  return (
    <Layout className="mx-auto h-screen max-w-[1168px]">
      <Layout>
        <Layout.Sider
          style={{ backgroundColor: 'transparent' }}
          breakpoint="lg"
          width={248}
        >
          <SideNav />
        </Layout.Sider>
        <Layout.Content className="min-w-0 flex-1 overflow-y-scroll py-8 pl-2 pr-6 lg:px-12">
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  )
}
