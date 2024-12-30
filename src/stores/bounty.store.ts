import bountyApi, { BountyActivity, BountyFeature, BountyListFilter, BountyType, TBounty } from '@/api-v1/bounty.api'
import { TPagination } from '@/api-v1/request'
import { proxy, useSnapshot } from 'valtio'

export interface BountyStore {
  features: BountyFeature[]
  activities: BountyActivity[]
  bountyList: TBounty[]
  total: number
  bounty_has_new: number
}

export const bountyStore = proxy<BountyStore>({
  activities: [],
  features: [],
  bountyList: [],
  total: 0,
  bounty_has_new: 0
})

const getFeatures = async () => {
  const { data } = await bountyApi.getFeatures()
  bountyStore.features = data.features
  bountyStore.activities = data.ordinary_list
  return data
}

const tempParams = {
  type: '' as BountyType,
  filter: {} as BountyListFilter,
  pagination: {} as TPagination
}

async function getBountyList(filter: BountyListFilter, pagination: TPagination) {
  tempParams.filter = filter
  tempParams.pagination = pagination

  const data = await bountyApi.getBountyList(filter, pagination)
  bountyStore.bountyList = data.data
  bountyStore.total = data.total_count
  return data
}

async function loadMoreBounty() {
  tempParams.pagination.current += 1
  const data = await bountyApi.getBountyList(tempParams.filter, tempParams.pagination)
  bountyStore.total = data.total_count
  bountyStore.bountyList.push(...data.data)
}

async function reloadBountyList() {
  await getBountyList(tempParams.filter, tempParams.pagination)
}

export function useBountyStore() {
  return useSnapshot(bountyStore)
}

async function cilckMenu() {
  await bountyApi.menuClick()
}

export const bountyStoreActions = {
  getFeatures,
  loadMoreBounty,
  getBountyList,
  reloadBountyList,
  cilckMenu
}
