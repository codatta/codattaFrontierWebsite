import { AxiosInstance } from 'axios'
import request, { type Response } from './request'

export interface UserAccount {
  id: string
  account: string
  account_type: 'block_chain' | 'email'
  current_account: boolean
  chain: string
  wallet_name?: string
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

export interface OldUserInfo {
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

export interface UserInfo {
  user_reputation: number | null
  user_data: {
    avatar: string
    referee_code: string
    user_id: string
    user_name: string
  }
  user_assets: {
    asset_type: 'POINTS'
    balance: {
      amount: string
      currency: string
    }
  }[]
  accounts_data: UserAccount[]
}

export interface UserUpdateParams {
  update_key: 'AVATAR' | 'USER_NAME'
  update_value: string
}

class UserApi {
  constructor(private request: AxiosInstance) {}

  async getUserInfo() {
    const res = await this.request.post<Response<UserInfo>>('/user/get/user_info')
    return res.data
  }

  async getDetail() {
    const { data } = await request.get<OldUserInfo>('/user/details')
    return data
  }

  async updateRelatedInfo(info: object) {
    return this.request.post('/user/update/related_info', info)
  }

  async updateUserInfo(info: UserUpdateParams) {
    const { data } = await this.request.post('/user/update/info', info)
    return data
  }
}

export default new UserApi(request)
