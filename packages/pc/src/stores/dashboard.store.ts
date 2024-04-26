import dashboardApi from '@/apis/index'
import { proxy } from 'valtio'

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

export async function getDashboardData() {
  await getCommonData()
}
