import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import { cn } from '@udecode/cn'

import SideNav from '@/components/app/app-sider'
import AuthChecker from '@/components/app/auth-checker'

import { userStoreActions } from '@/stores/user.store'
import { channelStoreActions, useChannelStore } from '@/stores/channel.store'
import { airdropActivityActions } from '@/stores/airdrop-activity.store'

export default function AppLayout({ className }: { className?: string }) {
  const { relatedInfo } = useChannelStore()

  useEffect(() => {
    if (relatedInfo) channelStoreActions.updateRelatedInfo(relatedInfo)
  }, [relatedInfo])

  useEffect(() => {
    userStoreActions.getUserInfo()
    airdropActivityActions.getAirdropNameList()
  }, [])

  return (
    <AuthChecker>
      <Layout className={cn('mx-auto h-screen max-w-[1168px] bg-transparent', className)}>
        <Layout.Sider className="bg-transparent" breakpoint="lg" width={248}>
          <SideNav />
        </Layout.Sider>
        <Layout.Content className="no-scrollbar min-w-0 flex-1 overflow-y-scroll py-7 pl-1 pr-4 lg:px-12 lg:py-8">
          <Outlet />
        </Layout.Content>
      </Layout>
    </AuthChecker>
  )
}
