import { proxy } from 'valtio'
import { useSnapshot } from 'valtio'

import aiModelApi, { AIModelItem, LeaderboardItem } from '@/apis/ai-model.api'

type ArenaStore = {
  modelList: AIModelItem[]
  loadingModelList: boolean
  leaderboard: LeaderboardItem[]
  leaderboardSummary: { total: number; total_votes: number; update_time: string }
}

export const arenaStore = proxy<ArenaStore>({
  modelList: [],
  loadingModelList: false,
  leaderboard: [],
  leaderboardSummary: { total: 0, total_votes: 0, update_time: '' }
})

export async function getModelList() {
  const res = await aiModelApi.getModelList()
  arenaStore.modelList = res.data
}

export async function getLeaderboard() {
  const res = await aiModelApi.getLeaderboard()
  arenaStore.leaderboard = res.data.models.map((item, index) => {
    return {
      ...item,
      rank: index + 1
    }
  })
  arenaStore.leaderboardSummary.total = res.data.total
  arenaStore.leaderboardSummary.total_votes = res.data.total_votes
  arenaStore.leaderboardSummary.update_time = res.data.update_time
}

export const useArenaStore = () => useSnapshot(arenaStore)

export const arenaStoreActions = {
  getModelList,
  getLeaderboard
}
