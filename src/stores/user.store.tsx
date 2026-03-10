import userApi, { UserInfo } from '@/apis/user.api'
import { shortenAddress } from '@/utils/format'
import { toUserFriendlyAddress } from '@tonconnect/sdk'
import { derive } from 'derive-valtio'
import { proxy, useSnapshot } from 'valtio'

export interface UserStore {
  info: UserInfo | null
}

const userStore = proxy<UserStore>({
  info: {
    user_data: {
      user_name: '',
      avatar: '',
      referee_code: '',
      user_id: '',
      did: '',
      channel: ''
    },
    user_reputation: 0,
    user_assets: [],
    accounts_data: [],
    social_account_info: []
  }
  // accounts: [],
  // username: '-'
})

const derived = derive({
  username: (get) => getUsername(get(userStore).info),
  reputation: (get) => get(userStore).info?.user_reputation ?? 0,
  points: (get) =>
    get(userStore).info?.user_assets?.filter((asset) => asset.asset_type === 'POINTS')?.[0]?.balance?.amount ?? ''
})

function getUsername(info: UserInfo | null) {
  if (!info) return '-'
  if (info.user_data?.user_name) return info.user_data?.user_name
  const currentAccount = info.accounts_data.find((item) => item.current_account)
  if (!currentAccount) return '-'
  if (['email'].includes(currentAccount.account_type)) {
    return currentAccount.account
  } else if (['blockchain', 'wallet', 'block_chain'].includes(currentAccount.account_type)) {
    if (['-239', '-3'].includes(currentAccount.chain)) {
      return shortenAddress(toUserFriendlyAddress(currentAccount.account), 12)
    } else {
      return shortenAddress(currentAccount.account, 12)
    }
  }
  return '-'
}

export function useUserStore() {
  return {
    ...useSnapshot(userStore),
    ...derived
  }
}

async function getUserInfo() {
  const { data } = await userApi.getUserInfo()
  userStore.info = data
  // userStore.info.user_data.did = ''
  return data
}

function checkLogin() {
  const userAgent = navigator.userAgent.toLowerCase()
  const token = localStorage.getItem('token')
  const uid = localStorage.getItem('uid')
  const auth = localStorage.getItem('auth')
  if (userAgent.includes('codatta')) {
    return !!auth && !!uid
  }
  return !!token && !!uid && !!auth
}

export const userStoreActions = {
  getUserInfo,
  checkLogin
}
