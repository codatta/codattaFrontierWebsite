import request, { PaginationParam, PaginationResponse } from './request'

class ReputationApi {
  async getReputations(pagination: PaginationParam) {
    const res = await request.post<PaginationResponse<Reputation[]>>('/customer/asset/reputation/entries', pagination)
    return res.data
  }
}

const reputationApi = new ReputationApi()
export default reputationApi

export enum ReputationType {
  Increase = 'INCREASE',
  Decrease = 'DECREASE'
}
export interface Reputation {
  type: ReputationType
  memo: string
  create_at: number
}
