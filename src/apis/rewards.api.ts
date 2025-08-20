import { AxiosInstance } from 'axios'
import request, { PaginationParam, PaginationResponse } from './request'

class RewardsApi {
  constructor(private request: AxiosInstance) {}

  async getRewards(pagination: PaginationParam = { page: 1, page_size: 20 }, asset_type = 'POINTS') {
    const res = await this.request.post<PaginationResponse<RewardsDesc[]>>('/v2/customer/asset/entries', {
      page_size: pagination.page_size,
      page_num: pagination.page,
      asset_type
    })
    return res.data
  }
}

const rewardsApi = new RewardsApi(request)
export default rewardsApi

export interface RewardsDesc {
  create_at: number
  user_id: string
  transaction_id: string
  asset_id: string
  amount: {
    currency: string
    amount: string
  }
  status: string
  transaction_txh: string | null
  stage: string
  task_id: string
}
