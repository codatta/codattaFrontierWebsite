import dashboardApi from '@/apis/index'
import { proxy } from 'valtio'

export type TPoint = { userName: string; avatar: string; totalPoint: number }
export type TPoints = TPoint[]

type TDashboardStore = {
  contributionUserCount: number
  contributionAddressCount: number
  validationUserCount: number
  rewardsCount: number
  huntingCount: number
  networkNum: number
  categoryNum: number
  addressNum: number
  entityNum: number
  topCates: { name: string; num: number }[]
  points: TPoints
}

export const dashboardStore = proxy<TDashboardStore>({
  contributionUserCount: 0,
  contributionAddressCount: 0,
  validationUserCount: 0,
  rewardsCount: 0,
  huntingCount: 0,
  networkNum: 0,
  categoryNum: 0,
  addressNum: 0,
  entityNum: 0,
  topCates: [],
  points: [],
})

async function getCommonData() {
  try {
    const { data } = await dashboardApi.getCommonData()

    dashboardStore.contributionUserCount = data.contribution_user_count || 0
    dashboardStore.contributionAddressCount =
      data.contribution_address_count || 0
    dashboardStore.validationUserCount = data.validation_user_count || 0
    dashboardStore.rewardsCount = data.rewards_count || 0
    dashboardStore.huntingCount = data.hunting_count || 0
    dashboardStore.networkNum = data.network_num || 0
    dashboardStore.categoryNum = data.category_num || 0
    dashboardStore.addressNum = data.address_num || 0
    dashboardStore.entityNum = data.entity_num || 0
    dashboardStore.topCates = (data.top_cate_num || [])
      .slice(0, 5)
      .sort((a, b) => b.cnt - a.cnt)
      .map((item) => ({
        name: item.cat,
        num: item.cnt,
      }))
  } catch (e) {
    console.error('getCommonData error: ', e)
  }
}

async function getPoints() {
  try {
    const { data } = await dashboardApi.getPointsDistribution()

    dashboardStore.points = data.map((item) => {
      const userName = item.user_info?.user_name ?? ''

      return {
        userName:
          userName.length <= 12 ? userName : userName.slice(0, 12) + '*',
        avatar:
          item.user_info?.avatar ??
          'https://file.b18a.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png',
        totalPoint: item.total_point,
      }
    })
    // for (let i = 0; i < 50; i++) {
    //   const len = Math.round(5 + Math.random() * 6)
    //   let user = {
    //     userName: ('a_' + Math.random()).slice(-len),
    //     avatar:
    //       'https://file.b18a.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png',
    //     totalPoint: Math.round(Math.random() * 50),
    //   }

    //   dashboardStore.points.push(user)
    // }
  } catch (e) {
    console.error('getPoints error: ', e)
  }
}

export async function getDashboardData() {
  await getCommonData()
  await getPoints()
}
