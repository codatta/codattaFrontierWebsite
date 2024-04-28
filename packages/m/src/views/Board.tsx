import Footer from '@/components/Footer'
import CopyRights from '@/components/CopyRights'
import Head from '@/components/Head'
import Header from '@/components/board/Header'
import Card1 from '@/components/board/Card1'
import Card2 from '@/components/board/Card2'
import Card3 from '@/components/board/Card3'
import Card4 from '@/components/board/Card4'
import Card5 from '@/components/board/Card5'

import { useEffect } from 'react'
import { dashboardStore, getDashboardData } from '@/stores/dashboard.store'
import { useSnapshot } from 'valtio'

export const Component = () => {
  const dashboard = useSnapshot(dashboardStore)

  useEffect(() => {
    getDashboardData()
  }, [])
  return (
    <div className="text-#fff bg-#000 px-18px">
      <Head />
      <Header />
      <Card3 num={dashboard.rewardsCount} points={dashboard.points.slice(0)} />
      <Card1
        networkNum={dashboard.networkNum}
        entityNum={dashboard.entityNum}
        addressNum={dashboard.addressNum}
        contributionAddressNum={dashboard.contributionAddressCount}
      />
      <Card4 num={dashboard.contributionUserCount} />
      <Card5 num={dashboard.validationUserCount} />
      <Card2
        totalNum={dashboard.categoryNum}
        topCates={dashboard.topCates.slice(0)}
      />
      <Footer />
      <CopyRights />
    </div>
  )
}
