import request from './request'
import type { SummaryUserInfo } from './user.api'
import type { PaginationParam, PaginationResponse } from './common-interface'

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

class ReputationApi {
  async getTopContributions(
    pagination: PaginationParam = { page: 1, page_size: 50 }
  ) {
    const { data } = await request.post<UserContribution[]>(
      '/user/contribution/top',
      pagination
    )
    return data
  }

  async getTopReputations(
    pagination: PaginationParam = { page: 1, page_size: 50 }
  ) {
    const { data } = await request.post<UserReputation[]>(
      '/user/reputation/top',
      pagination
    )
    return data
  }

  async getReputations(pagination: PaginationParam) {
    return await request.post<void, PaginationResponse<Reputation[]>>(
      '/reputation/entry',
      pagination
    )
  }
}

const reputationApi = new ReputationApi()
export default reputationApi
