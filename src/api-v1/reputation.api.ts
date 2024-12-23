import request, { PaginationParam, PaginationResponse } from './request'
import type { SummaryUserInfo } from './user.api'

class ReputationApi {
  async getTopContributions(pagination: PaginationParam = { page: 1, page_size: 50 }) {
    const { data } = await request.post<UserContribution[]>('/user/contribution/top', pagination)
    return data
  }

  async getTopReputations(pagination: PaginationParam = { page: 1, page_size: 50 }) {
    const { data } = await request.post<UserReputation[]>('/user/reputation/top', pagination)
    return data
  }

  async getReputations(pagination: PaginationParam) {
    const res = await request.post<PaginationResponse<Reputation[]>>('/reputation/entry', pagination)
    return res.data
  }
}

const reputationApi = new ReputationApi()
export default reputationApi

export type UserContribution = SummaryUserInfo & { contribute: string }
export type UserReputation = SummaryUserInfo & { reputation: string }

export enum ReputationType {
  Increase = 'INCREASE',
  Decrease = 'DECREASE'
}
export interface Reputation {
  type: ReputationType
  memo: string
  date: string
}
