import { proxy } from 'valtio'
import { useSnapshot } from 'valtio'
import userApi, { InviteDetail, InviteRecord } from '@/apis/user.api'

type TReferralStore = {
  referralList: InviteRecord[]
  referralInfo: InviteDetail
  chestProgress: number
}

export const referralStore = proxy<TReferralStore>({
  referralList: [],
  referralInfo: {
    user_count: 0,
    reward: 0,
    chest_total_count: 0,
    chest_claimed_count: 0,
    chest_available_count: 0
  },
  chestProgress: 0
})

export const useReferralStore = () => useSnapshot(referralStore)

async function getReferralList(page: number) {
  const res = await userApi.getInviteRecords({
    page_num: page,
    page_size: 10,
    start_time: undefined,
    end_time: undefined
  })
  referralStore.referralList = res.data?.list || []
  return res
}

async function getInviteInfo() {
  const res = await userApi.getInviteInfo()
  referralStore.referralInfo = res.data
  referralStore.chestProgress = res.data.user_count % 5
  return res.data
}

export const referralStoreActions = {
  getReferralList,
  getInviteInfo
}
