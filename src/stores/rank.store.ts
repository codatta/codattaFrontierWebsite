import reputationApi, {
  type UserContribution,
  type UserReputation
} from '@/api-v1/reputation.api'
import { proxy, useSnapshot } from 'valtio'

type TRankStore = {
  top5Reputation: UserReputation[]
  top5Contributors: UserContribution[]
  reputationRank: UserReputation[]
  contributorsRank: UserContribution[]
  loading: boolean
  loaded: boolean
}

export const rankStore = proxy<TRankStore>({
  top5Reputation: [],
  top5Contributors: [],
  reputationRank: [],
  contributorsRank: [],
  loading: false,
  loaded: false
})

async function getReputationRank() {
  const res = await reputationApi.getTopReputations()
  rankStore.reputationRank = res?.data || []
  rankStore.top5Reputation = res?.data?.slice(0, 5) || []
}

async function getContributionRank() {
  const res = await reputationApi.getTopContributions()

  rankStore.contributorsRank = res.data || []
  rankStore.top5Contributors = res?.data?.slice(0, 5) || []
}

async function getRankData() {
  rankStore.loading = rankStore.loaded ? false : true

  return Promise.allSettled([getReputationRank(), getContributionRank()]).then(
    () => {
      rankStore.loading = false
      rankStore.loaded = true
    }
  )
}

const useTRankStore = () => {
  return useSnapshot(rankStore)
}

export default useTRankStore
export const rankStoreActions = {
  getRankData
}
