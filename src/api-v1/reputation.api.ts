import request, {
  type Response,
  PaginationParam
  // PaginatedResponse
} from './request'
// import { TourMock } from '@/api/tour-mock'
import type { SummaryUserInfo } from './user.api'

class ReputationApi {
  async getTopContributions(
    pagination: PaginationParam = { page: 1, page_size: 50 }
  ) {
    const { data } = await request.post<Response<UserContribution[]>>(
      '/user/contribution/top',
      pagination
    )
    return data
  }

  async getTopReputations(
    pagination: PaginationParam = { page: 1, page_size: 50 }
  ) {
    const { data } = await request.post<Response<UserReputation[]>>(
      '/user/reputation/top',
      pagination
    )
    return data
  }

  // @TourMock(() => import('@/api/mock/reputations.json'))
  // async getReputations(pagination: PaginationParam) {
  //   return await request.post<void, PaginatedResponse<Reputation[]>>(
  //     '/reputation/entry',
  //     pagination
  //   )
  // }
}

const reputationApi = new ReputationApi()
export default reputationApi

export type UserContribution = SummaryUserInfo & { contribute: string }
export type UserReputation = SummaryUserInfo & { reputation: string }

// export enum ReputationType {
//   Increase = 'INCREASE',
//   Decrease = 'DECREASE'
// }
// export interface Reputation {
//   type: ReputationType
//   memo: string
//   date: string
// }
