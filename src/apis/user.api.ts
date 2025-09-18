import { AxiosInstance } from 'axios'
import request, { PaginationResponse, type Response } from '@/apis/request'

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

export interface SocialAccountInfoItem {
  channel: string
  composure_time: null | string
  name: string
  status: number
}

export interface UserAsset {
  asset_type: 'POINTS' | 'XnYCoin' | 'USDT'
  balance: {
    amount: string
    currency: string
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
  user_assets: UserAsset[]
  accounts_data: UserAccount[]
  social_account_info: SocialAccountInfoItem[]
}

export interface UserUpdateParams {
  update_key: 'AVATAR' | 'USER_NAME'
  update_value: string
}

export interface InviteRecord {
  user_id: string
  name: string
  reward: string
  reward_value: number
  reward_type: 'score' | 'nft'
  time: string
  soul_id?: number
}

export interface InviteDetail {
  total_invite_count: number
  total_available_count: number
  progress: InviteProgressItem[]
}

export interface InviteProgressItem {
  num: number
  invite_id: string
  reward: string
  reward_value: string
  reward_type: 'score' | 'nft'
  claim_status: number
  soul_id?: number
}

export interface InvitePointClaimParams {
  invite_id: string
  soul_id?: number
  tx_hash?: string
  block_number?: string
  address?: string
}

export interface InviteNFTClaimParams {
  invite_id: string
  soul_id?: number
  tx_hash?: string
  block_number?: string
  address?: string
}

export interface JourneyLevelItem {
  levelId: number
  reward_type: 'score' | 'reputation' | 'nft'
  reward_value: number | string
  soul_id?: number
  status: number
}

export interface RewardClaimSignParams {
  reward_type: 'USDT' | 'XnYCoin'
  chain_id: string
  amount: string
  address: string
  token: string
}

export interface RewardClaimSignResponse {
  signature: string
  token: string
  amount: number | string
  expired_at: string
  uid: string
}

export interface RewardRecordHistoryParams {
  page_num: number
  page_size: number
}

export interface RewardRecordHistoryItem {
  uid: string
  gmt_create: string
  claim_time: string
  tx_hash: string
  from_address: string
  to_address: string
  asset_type: string
  balance: number
  status: number
  status_name: string
}

export interface FrontierTokenRewardTokenItem {
  frontier_id: string
  reward_type: string
  reward_amount: number
}

export interface FrontierTokenRewardItem {
  frontier_id: string
  frontier_name: string
  total_submission: number
  average_rating_name: string
  average_result: number
  tokens: FrontierTokenRewardTokenItem[]
}
export interface TokenClaimItem {
  id: number
  uid: number
  status_name: string
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

  async updateUserInfo(info: UserUpdateParams) {
    const { data } = await this.request.post('/v2/user/update/info', info)
    return data
  }

  async getSocialAccountLinkUrl(type: string) {
    const { data } = await request.post('/v2/user/sm/connect', { type })
    return data
  }

  async unlinkSocialAccount(type: string) {
    const { data } = await request.post('/v2/user/sm/unbind', { type })
    return data
  }

  async linkSocialAccount(type: string, param: unknown) {
    const { data } = await request.post('/v2/user/sm/bind', {
      type,
      value: param
    })
    return data
  }

  async getInviteDetail() {
    const { data } = await request.get<Response<InviteDetail>>('/v2/invite/detail')
    return data
  }

  async claimInviteReward(params: InvitePointClaimParams | InviteNFTClaimParams) {
    const { data } = await request.post<Response<{ status: number; info: string }>>('/v2/invite/reward/claim', params)
    if (data.data.status !== 1) throw new Error(data.data.info)
    return data
  }

  async getInviteRecords() {
    const { data } = await request.post<PaginationResponse<InviteRecord[]>>('/v2/invite/history', {})
    return data
  }

  async getReferralNftSign(invite_id: string, address: string) {
    const { data } = await request.post<
      Response<{
        expired_at: number
        signature: string
        soul_id: number
      }>
    >('/v2/invite/chain/sign', {
      invite_id,
      address
    })
    return data
  }

  async getTokenClaimRecords(page: number, pageSize: number) {
    const { data } = await request.post<
      Response<{
        page_num: number
        page_size: number
        count: number
        list: TokenClaimItem[]
      }>
    >('/api/v2/user/reward/record/list', {
      page_num: page,
      page_size: pageSize
    })
    return data
  }

  async getRewardClaimSign(params: RewardClaimSignParams) {
    const { data } = await request.post<Response<RewardClaimSignResponse>>('/v2/user/reward/signature', params)
    return data.data
  }

  async createRewardRecord(uid: string, gas: string) {
    const { data } = await request.post('/v2/user/reward/record/create', {
      uid,
      gas
    })
    return data
  }

  async getFrontierTokenReward(page: number, pageSize: number) {
    const { data } = await request.post<
      Response<{
        page_num: number
        page_size: number
        count: number
        list: FrontierTokenRewardItem[]
      }>
    >('/v2/submission/user/token/rewards', {
      page_num: page,
      page_size: pageSize
    })

    return data
  }
  async updateRewardRecord(uid: string, tx_hash: string) {
    const { data } = await request.post<Response<{ flag: number; message: string }>>('/v2/user/reward/record/update', {
      uid,
      tx_hash
    })
    return data.data
  }

  async finishRewardRecord(uid: string, status: 2 | 3 | 4) {
    // 2 - success
    // 3 - finish
    // 4 - cancel
    const { data } = await request.post<Response<{ flag: number; message: string }>>('/v2/user/reward/record/finish', {
      uid,
      status
    })
    return data.data
  }

  async getRewardRecordHistory(page: number, pageSize: number) {
    const { data } = await request.post<
      Response<{
        page_num: number
        page_size: number
        count: number
        list: RewardRecordHistoryItem[]
      }>
    >('/v2/user/reward/record/list', { page_num: page, page_size: pageSize })

    return data.data
  }

  async isHighQualityUser(): Promise<boolean> {
    const { data } = await request.get<Response<{ quality_type: number }>>('/v2/h5/quest/user/quality')
    return data.data.quality_type === 1
  }

  async getTgGroupInviteLink(group_type: string = '') {
    // codatta | ''
    const { data } = await request.get<Response<{ link: string }>>('/v2/h5/tg/group/link', { params: { group_type } })
    return data.data
  }

  async isJoinedTgGroup(group_type: string = ''): Promise<boolean> {
    const { data } = await request.get<Response<{ flag: number }>>('/v2/h5/tg/group/status', { params: { group_type } })
    return data.data.flag === 1
  }
  async getVerificationCode({ account_type, email, opt }: { account_type?: string; email?: string; opt?: string }) {
    const { data } = await request.post<Response<string>>('/v2/user/get_code', {
      account_type: account_type ?? 'email',
      email: email ?? '',
      opt: opt ?? 'verify'
    })
    return data.data
  }

  async checkEmail({ email, code, task_id }: { email: string; code: string; task_id: string }) {
    const { data } = await request.post<Response<{ flag: boolean; info: string }>>('/v2/frontier/email/check', {
      email,
      code,
      task_id
    })
    return data.data
  }
}

export default new UserApi(request)
