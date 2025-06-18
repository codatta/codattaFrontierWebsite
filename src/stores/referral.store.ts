import { proxy } from 'valtio'
import { useSnapshot } from 'valtio'
import userApi, { InviteProgressItem, InviteRecord } from '@/apis/user.api'

type TReferralStore = {
  referralList: InviteRecord[]
  referralProgress: InviteProgressItem[]
}

export const referralStore = proxy<TReferralStore>({
  referralList: [],
  referralProgress: []
})

export const useReferralStore = () => useSnapshot(referralStore)

async function getReferralList() {
  const res = await userApi.getInviteRecords()
  referralStore.referralList = res.data
}

async function getReferralProgress() {
  const res = await userApi.getInviteDetail()
  referralStore.referralProgress = res.data.progress
  return res.data.progress
}

export const referralStoreActions = {
  getReferralList,
  getReferralProgress
}
