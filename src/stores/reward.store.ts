import rewardsApi, { RewardsDesc } from '@/apis/rewards.api'
import { proxy } from 'valtio'

export interface RewardStore {
  rewards: RewardsDesc[]
  total_count: number
  pageSize: number
  loading: boolean
}

export const rewardStore = proxy<RewardStore>({
  rewards: [],
  total_count: 0,
  pageSize: 5,
  loading: false
})

export async function reloadRewards(page: number = 1) {
  rewardStore.loading = true
  try {
    const res = await rewardsApi.getRewards({
      page,
      page_size: rewardStore.pageSize
    })
    rewardStore.rewards = res.data
    rewardStore.total_count = res.total_count
    rewardStore.loading = false
    return res
  } catch (error) {
    console.log(error)
  }
  rewardStore.loading = false
}

export const RewardStoreActions = {
  reloadRewards
}
