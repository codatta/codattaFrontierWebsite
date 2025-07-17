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
  asset_type: 'POINTS' | 'XNYCoin' | 'USDT'
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

  async getNewJourneyLevels() {
    const data: JourneyLevelItem[] = [
      {
        levelId: 1,
        reward_type: 'score',
        reward_value: 100,
        status: 1
      },
      {
        levelId: 1,
        reward_type: 'reputation',
        reward_value: 100,
        status: 0
      },
      {
        levelId: 1,
        reward_type: 'nft',
        reward_value: 'nft_1',
        soul_id: 2,
        status: 2
      },
      {
        levelId: 1,
        reward_type: 'score',
        reward_value: 100,
        status: 1
      },
      {
        levelId: 1,
        reward_type: 'reputation',
        reward_value: 100,
        status: 0
      },
      {
        levelId: 1,
        reward_type: 'nft',
        reward_value: 'nft_1',
        soul_id: 2,
        status: 2
      },
      {
        levelId: 1,
        reward_type: 'score',
        reward_value: 100,
        status: 1
      },
      {
        levelId: 1,
        reward_type: 'reputation',
        reward_value: 100,
        status: 0
      },
      {
        levelId: 1,
        reward_type: 'nft',
        reward_value: 'nft_1',
        soul_id: 2,
        status: 2
      },
      {
        levelId: 1,
        reward_type: 'score',
        reward_value: 100,
        status: 1
      },
      {
        levelId: 1,
        reward_type: 'reputation',
        reward_value: 100,
        status: 0
      },
      {
        levelId: 1,
        reward_type: 'nft',
        reward_value: 'nft_1',
        soul_id: 2,
        status: 2
      },
      {
        levelId: 1,
        reward_type: 'score',
        reward_value: 100,
        status: 1
      },
      {
        levelId: 1,
        reward_type: 'reputation',
        reward_value: 100,
        status: 0
      },
      {
        levelId: 1,
        reward_type: 'nft',
        reward_value: 'nft_1',
        soul_id: 2,
        status: 2
      }
    ]
    return data
  }

  async getNewJourneyQuests() {}

  async getNewJourneyReferral() {}

  async getNewJourneyPoints() {}
}

export default new UserApi(request)
