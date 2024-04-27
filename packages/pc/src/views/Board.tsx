import Footer from '@/components/Footer'
import CopyRights from '@/components/CopyRights'
import Header from '@/components/board/Header'
import Card1 from '@/components/board/Card1'
import Card2 from '@/components/board/Card2'
import Card3 from '@/components/board/Card3'
import Card4 from '@/components/board/Card4'
import Card5 from '@/components/board/Card5'

import './Board.scss'
import { useEffect } from 'react'
import { dashboardStore, getDashboardData } from '@/stores/dashboard.store'
import { useSnapshot } from 'valtio'

export const Component = () => {
  const dashboard = useSnapshot(dashboardStore)

  useEffect(() => {
    getDashboardData()
  }, [])
  return (
    <div className="w-1160px m-auto mt-57px text-#fff">
      <Header />
      <div className="flex mt-30px">
        <div className="w-774px mr-16px">
          <Card1
            networkNum={dashboard.networkNum}
            entityNum={dashboard.entityNum}
            addressNum={dashboard.addressNum}
            contributionAddressNum={dashboard.contributionAddressCount}
          />
          <Card2
            totalNum={dashboard.categoryNum}
            topCates={dashboard.topCates.slice(0)}
          />
        </div>
        <div className="w-370px">
          <Card3
            num={dashboard.rewardsCount}
            points={dashboard.points.slice(0)}
          />
          <Card4 num={dashboard.contributionUserCount} />
          <Card5 num={dashboard.validationUserCount} />
        </div>
      </div>

      <Footer />
      <CopyRights />
    </div>
  )
}
