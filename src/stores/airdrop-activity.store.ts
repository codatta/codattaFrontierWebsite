import { RankingItem } from '@/apis/airdrop-actvitiy'
import { proxy, useSnapshot } from 'valtio'

export interface ActivityStore {
  rankingList: RankingItem[]
}

const activityStore = proxy<ActivityStore>({
  rankingList: []
})

export const useArenaStore = () => useSnapshot(activityStore)

function getAirdropActivity() {}

export const airdropActivityActions = {
  getAirdropActivity
}
