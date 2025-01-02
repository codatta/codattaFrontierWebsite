// import { TourMock } from '@/api/tour-mock'
// import { updateUserInfo } from '@/store/user.store'
import request, { type PaginationParam, PaginationResponse, Response } from './request'

class UserApi {
  async getInfo() {
    const res = await request.get<UserInfo>('/user/info')
    return res.data
  }

  async getDetail() {
    const { data } = await request.get<UserInfo>('/user/details')
    // updateUserInfo(data)
    return data
  }

  async getBalance() {
    const {
      data: { balance }
    } = await request.post<{ balance: number }>('/user/token/info')
    return balance
  }

  async updateInfo(userFields: Partial<EditableUserInfo>) {
    const { data } = await request.post<boolean>('/user/update', userFields)
    return data
  }

  async getInviteRecords(pagination: PaginationParam = { page: 1, page_size: 20 }) {
    const res = await request.post<
      Response<{
        total_count: number
        total_reward: number
        result: InviteRecord[]
      }>
    >('/user/inviter/entry', pagination)
    return res.data
  }

  async getReputation() {
    const res = await request.post<Response<{ reputation: string }>>('/user/reputation/info')
    console.log(res)
    return res.data.data.reputation ?? '0'
  }

  async getRewards(
    pagination: PaginationParam = { page: 1, page_size: 20 }
  ): Promise<PaginationResponse<UserReword[]>> {
    return request.post('/user/rewards', pagination)
  }
}

const userApi = new UserApi()
export default userApi

export enum Role {
  S3 = 'S3_CHECK'
}

export interface AccountItem {
  id: number
  user_id: string
  account_out_code: string
  account: string
  account_type: string
  chain: 'eip155'
  connector: 'dynamic' | 'ton'
  wallet_name: string
  public_identifier: string
}

export interface UserInfo {
  avatar_url: string
  username: string | null
  email: string | null
  user_id: string
  code: string
  roles: string | null
  inviter_code: string | null
  status: string
  wallet_address: string | null
  new_user: boolean
  accounts: AccountItem[]
  social_account_info: { channel: string; name: string }[]
  current_account_info: {
    account: string
    account_type: 'email' | 'blockchain' | 'wallet' | null
    connector: 'dynamic' | 'ton' | null
  }
}

export type SummaryUserInfo = {
  avatar: UserInfo['avatar_url']
  flag: boolean
  rank: number
} & Pick<UserInfo, 'email' | 'user_id'>

export type EditableUserInfo = Pick<UserInfo, 'username' | 'avatar_url' | 'inviter_code'>

export interface InviteRecord {
  date: string
  user_id: string
  email: string
  reward: number
  address?: string
}

export interface UserReword {
  address: string
  amount: number
  award_stage: string
  category: string
  entity: string
  network: string
  transaction_id: string
}
