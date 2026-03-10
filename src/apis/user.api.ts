import { AxiosInstance } from 'axios'
import request, { type Response } from '@/apis/request'

export interface UserAccount {
  id: string
  account: string
  account_type: 'block_chain' | 'email'
  current_account: boolean
  chain: string
  wallet_name?: string
}

export interface SocialAccountInfoItem {
  channel: string
  composure_time: null | string
  name: string
  status: number
}

export interface UserAsset {
  asset_id: string
  asset_type: 'POINTS' | 'XnYCoin' | 'USDT'
  balance: {
    amount: string
    currency: string
  }

  stake_amount: number
  lock_amount: number
  available_amount: number
  status: string
}

export interface UserInfo {
  user_reputation: number | null
  user_data: {
    avatar: string
    referee_code: string
    user_id: string
    user_name: string
    did: string
    channel: string
  }
  user_assets: UserAsset[]
  accounts_data: UserAccount[]
  social_account_info: SocialAccountInfoItem[]
}

export interface InviteRecord {
  user_id: string
  user_name: string
  avatar: string
  gmt_create: number
  reward: number
  chest_count: number
}

export interface InviteRecordResponse {
  list: InviteRecord[]
  page_num: 1
  page_size: 10
  total_count: 0
}

export interface InviteDetail {
  user_count: number
  reward: number
  chest_total_count: number
  chest_claimed_count: number
  chest_available_count: number
}

class UserApi {
  constructor(private request: AxiosInstance) {}

  async getUserInfo() {
    console.log(this.request.defaults)
    const res = await this.request.post<Response<UserInfo>>('/v2/user/get/user_info')
    return res.data
  }

  async updateRelatedInfo(info: object) {
    return this.request.post('/v2/user/update/related_info', info)
  }

  async getInviteInfo() {
    const { data } = await request.get<Response<InviteDetail>>('/v2/inviter/info')
    return data
  }

  async openReferralChest() {
    const { data } =
      await request.post<Response<{ status: number; reward_value: number; reward_type: 'POINTS' }>>(
        '/v2/inviter/chest/claim'
      )
    return data
  }

  async getInviteRecords(params: { page_num: number; page_size: number; start_time?: Date; end_time?: Date }) {
    const { page_num, page_size, start_time, end_time } = params
    const start_time_unix = start_time ? start_time.getTime() / 1000 : undefined
    const end_time_unix = end_time ? end_time.getTime() / 1000 : undefined
    const { data } = await request.post<Response<InviteRecordResponse>>('/v2/inviter/list', {
      page_num,
      page_size,
      start_time: start_time_unix,
      end_time: end_time_unix
    })
    return data
  }
}

export default new UserApi(request)
