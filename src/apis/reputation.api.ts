import { SummaryUserInfo } from '@/api-v1/user.api'
import request, { PaginationParam, PaginationResponse, Response } from './request'

class ReputationApi {
  async getReputations(pagination: PaginationParam) {
    const res = await request.post<PaginationResponse<Reputation[]>>(
      '/v2/customer/asset/reputation/entries',
      pagination
    )
    return res.data
  }

  async getTopReputations(pagination: PaginationParam = { page: 1, page_size: 50 }) {
    const { data } = await request.post<Response<UserReputation[]>>('/v2/user/reputation/top', pagination)
    return data
  }

  // TODO to repcale url
  // async getTopContributions(pagination: PaginationParam = { page: 1, page_size: 50 }) {
  //   const { data } = await request.post<Response<UserContribution[]>>('/user/contribution/top', pagination)
  //   return data
  // }
}

const reputationApi = new ReputationApi()
export default reputationApi

export type UserContribution = SummaryUserInfo & { contribute: string }
export type UserReputation = SummaryUserInfo & { reputation: number | null }
export enum ReputationType {
  Increase = 'INCREASE',
  Decrease = 'DECREASE'
}
export interface Reputation {
  type: ReputationType
  memo: string
  create_at: number // timestamp seconds
}
