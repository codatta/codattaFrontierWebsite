import reputationApiV1 from '@/api-v1/reputation.api'
import reputationApi, { type UserContribution, type UserReputation } from '@/apis/reputation.api'
import { proxy } from 'valtio'

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
  const { data } = await reputationApi.getTopReputations()
  rankStore.reputationRank = data || []
  rankStore.top5Reputation = data?.slice(0, 5) || []
}

async function getContributionRank() {
  const { data } = await reputationApiV1.getTopContributions()
  rankStore.contributorsRank = data || []
  rankStore.top5Contributors = data?.slice(0, 5) || []
}

export async function getRankData() {
  rankStore.loading = rankStore.loaded ? false : true

  return Promise.allSettled([getReputationRank(), getContributionRank()]).then(() => {
    rankStore.loading = false
    rankStore.loaded = true
  })
}
