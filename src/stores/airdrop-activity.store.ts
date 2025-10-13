import { AirdropActivityInfo, AirdropFrontierItem, AirdropNameItem } from '@/apis/airdrop-actvitiy'
import { proxy, useSnapshot } from 'valtio'
import airdopApi from '@/apis/airdrop-actvitiy'

export interface ActivityStore {
  airdropNameList: AirdropNameItem[]
  hasAirdropActivity: boolean
  currentAirdropSeasonId: string | null
  currentAirdropInfo: AirdropActivityInfo | null
  currentAirdropFrontierList: AirdropFrontierItem[] | null
}

const activityStore = proxy<ActivityStore>({
  airdropNameList: [],
  hasAirdropActivity: false,
  currentAirdropSeasonId: null,
  currentAirdropInfo: null,
  currentAirdropFrontierList: []
})

export const useAirdropActivityStore = () => useSnapshot(activityStore)

async function getAirdropActivityInfo(seasonId: string) {
  const res = await airdopApi.getAirdropActivityInfo(seasonId)
  if (!res.data) throw new Error('Failed to get airdrop activity info')
  activityStore.currentAirdropInfo = res.data
}

async function getAirdropNameList() {
  const res = await airdopApi.getAirdropList()
  if (!res.data || res.data.length === 0) {
    activityStore.hasAirdropActivity = false
    activityStore.currentAirdropSeasonId = null
    activityStore.currentAirdropInfo = null
    return
  }

  activityStore.hasAirdropActivity = true
  activityStore.currentAirdropSeasonId = res.data[0].season_id
  getAirdropActivityInfo(activityStore.currentAirdropSeasonId)
  return res.data
}

async function getAirdropFrontierList(seasonId: string, page: number, pageSize: number) {
  const data = await airdopApi.getAirdropFrontierList({
    season_id: seasonId,
    page_num: page,
    page_size: pageSize
  })
  activityStore.currentAirdropFrontierList = data.data.list
  return data.data
}

async function getAirdropNames() {
  const res = await airdopApi.getAirdropNames()
  activityStore.airdropNameList = res.data
  return res.data
}

export const airdropActivityActions = {
  getAirdropActivityInfo,
  getAirdropNameList,
  getAirdropFrontierList,
  getAirdropNames
}
