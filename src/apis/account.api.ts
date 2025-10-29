import { AxiosInstance } from 'axios'
import request from './request'
import { TonProofItemReply } from '@tonconnect/sdk'

type TAccountType = 'email' | 'block_chain'
export type TAccountRole = 'B' | 'C'
export type TDeviceType = 'WEB' | 'TG' | 'PLUG'

export interface ILoginResponse {
  token: string
  old_token: string
  user_id: string
  new_user: boolean
}

interface ILoginParamsBase {
  account_type: string
  connector: 'codatta_email' | 'codatta_wallet' | 'codatta_ton'
  account_enum: TAccountRole
  inviter_code: string
  source: {
    device: TDeviceType
    channel: string
    app: string
    [key: string]: unknown
  }
  related_info?: {
    [key: string]: unknown
  }
}

interface IConnectParamsBase {
  account_type: string
  connector: 'codatta_email' | 'codatta_wallet' | 'codatta_ton'
  account_enum: TAccountRole
}

interface IEmailLoginParams extends ILoginParamsBase {
  connector: 'codatta_email'
  account_type: 'email'
  email: string
  email_code: string
}

interface IEmailConnectParams extends IConnectParamsBase {
  connector: 'codatta_email'
  account_type: 'email'
  email: string
  email_code: string
}

interface IWalletLoginParams extends ILoginParamsBase {
  connector: 'codatta_wallet'
  account_type: 'block_chain'
  address: string
  wallet_name: string
  chain: string
  nonce: string
  signature: string
  message: string
}

interface IWalletConnectParams extends IConnectParamsBase {
  connector: 'codatta_wallet'
  account_type: 'block_chain'
  address: string
  wallet_name: string
  chain: string
  nonce: string
  signature: string
  message: string
}

interface ITonLoginParams extends ILoginParamsBase {
  connector: 'codatta_ton'
  account_type: 'block_chain'
  wallet_name: string
  address: string
  chain: string
  connect_info: [{ [key: string]: string }, TonProofItemReply]
}

interface ITonConnectParams extends IConnectParamsBase {
  connector: 'codatta_ton'
  account_type: 'block_chain'
  wallet_name: string
  address: string
  chain: string
  connect_info: [{ [key: string]: string }, TonProofItemReply]
}

class AccountApi {
  constructor(private request: AxiosInstance) {}

  public async getNonce(props: { account_type: TAccountType }) {
    const { data } = await this.request.post<{ data: string }>(`/v2/user/nonce`, props)
    return data.data
  }

  public async getEmailCode(props: { account_type: TAccountType; email: string }) {
    const { data } = await this.request.post<{ data: string }>(`/v2/user/get_code`, props)
    return data.data
  }

  public async emailLogin(props: IEmailLoginParams) {
    const res = await this.request.post<{ data: ILoginResponse }>(`/v2/user/login`, props)
    return res.data
  }

  public async walletLogin(props: IWalletLoginParams) {
    const res = await this.request.post<{ data: ILoginResponse }>(`/v2/user/login`, props)
    return res.data
  }

  public async tonLogin(props: ITonLoginParams) {
    const res = await this.request.post<{ data: ILoginResponse }>(`/v2/user/login`, props)
    return res.data
  }

  public async bindEmail(props: IEmailConnectParams) {
    const res = await this.request.post('/v2/user/account/bind', props)
    return res.data
  }

  public async bindTonWallet(props: ITonConnectParams) {
    const res = await this.request.post('/v2/user/account/bind', props)
    return res.data
  }

  public async bindEvmWallet(props: IWalletConnectParams) {
    const res = await this.request.post('/v2/user/account/bind', props)
    return res.data
  }

  public async unbindAccount(account: string) {
    const res = await this.request.post('/v2/user/account/unbind', { account })
    return res.data
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

  async getAccountInfoForDidRegister() {
    const { data } = await request.post<{ data: { type: string; value: string }[] }>('/v2/user/did/accounts')
    return data
  }

  async getDidChallenge() {
    const { data } = await request.post<{ data: { challenge: string } }>('/v2/user/did/challenge')
    return data
  }

  async bindDidAccount({ did, signature, account }: { did: string; signature: string; account: string }) {
    const { data } = await request.post<{ data: { flag: 0 | 1 } }>('/v2/user/did/bind', { did, signature, account })
    return data
  }
}

export default new AccountApi(request)
