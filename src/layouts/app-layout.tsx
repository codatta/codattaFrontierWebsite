import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import SideNav from '@/components/app/app-sider'
import { channelStoreActions, useChannelStore } from '@/stores/channel.store'
import { userStoreActions } from '@/stores/user.store'
import AuthChecker from '@/components/app/auth-checker'

export default function AppLayout() {
  const { relatedInfo } = useChannelStore()

  useEffect(() => {
    if (relatedInfo) channelStoreActions.updateRelatedInfo(relatedInfo)
  }, [relatedInfo])

  useEffect(() => {
    userStoreActions.getUserInfo()
  }, [])

  return (
    <AuthChecker>
      <Layout className="mx-auto h-screen max-w-[1168px] bg-transparent">
        <Layout.Sider className="bg-transparent" breakpoint="lg" width={248}>
          <SideNav />
        </Layout.Sider>
        <Layout.Content className="no-scrollbar min-w-0 flex-1 overflow-y-scroll py-8 pl-2 pr-6 lg:px-12">
          <Outlet />
        </Layout.Content>
      </Layout>
    </AuthChecker>
  )
}
