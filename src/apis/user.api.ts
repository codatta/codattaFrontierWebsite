import { AxiosInstance } from 'axios'
import request, { type Response } from './request'

export interface UserAccount {
  id: string
  account: string
  account_type: 'block_chain' | 'email'
  current_account: boolean
  connector: 'codatta_ton' | 'codatta_wallet' | 'codatta_email'
  wallet_name?: string
}

export interface UserInfo {
  user_reputation: string
  user_data: {
    avatar: string
    referee_code: string
    user_id: string
    user_name: string
  }
  user_assets: {
    asset: string
  }[]
  accounts_data: UserAccount[]
}

class UserApi {
  constructor(private request: AxiosInstance) {}

  async getUserInfo() {
    const res = await this.request.post<Response<UserInfo>>(
      '/user/get/user_info'
    )
    return res.data
  }

  async updateRelatedInfo(info: object) {
    return this.request.post('/user/update/related_info', info)
  }
}

export default new UserApi(request)
