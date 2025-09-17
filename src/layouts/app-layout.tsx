import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import { cn } from '@udecode/cn'

import SideNav, { MenuItem } from '@/components/app/app-sider'
import AuthChecker from '@/components/app/auth-checker'
import AirdropIcon from '@/assets/icons/app-nav/airdrop.svg'

import { userStoreActions } from '@/stores/user.store'
import { channelStoreActions, useChannelStore } from '@/stores/channel.store'

export default function AppLayout({ className }: { className?: string }) {
  const { relatedInfo } = useChannelStore()
  const [extraAppMenuItems, setExtraAppMenuItems] = useState<MenuItem[]>([])

  useEffect(() => {
    if (relatedInfo) channelStoreActions.updateRelatedInfo(relatedInfo)
  }, [relatedInfo])

  useEffect(() => {
    userStoreActions.getUserInfo()

    setTimeout(() => {
      setExtraAppMenuItems([
        {
          icon: <AirdropIcon color="white" />,
          label: 'Airdrop',
          isDynamic: true,
          key: '/app/airdrop',
          priority: 2.5
        }
      ])
    }, 1000)
  }, [])

  return (
    <AuthChecker>
      <Layout className={cn('mx-auto h-screen max-w-[1168px] bg-transparent', className)}>
        <Layout.Sider className="bg-transparent" breakpoint="lg" width={248}>
          <SideNav dynamicMenuItems={extraAppMenuItems} />
        </Layout.Sider>
        <Layout.Content className="no-scrollbar min-w-0 flex-1 overflow-y-scroll py-7 pl-1 pr-4 lg:px-12 lg:py-8">
          <Outlet />
        </Layout.Content>
      </Layout>
    </AuthChecker>
  )
}
