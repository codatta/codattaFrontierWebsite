import { AxiosInstance } from 'axios'
import request from './request'
import type { PaginationParam } from './common-interface'

interface TaskFinishNoticItem {
  task_config_id: string
  task_id: string
  task_name: string
  biz_type: string
  category: string
  reward: {
    type: string
    value: number
  }[]
}

interface Response<T> {
  data: T
  success: boolean
  errorCode: number
  errorMessage: string
  file_path?: string
  task_finish_notice?: TaskFinishNoticItem[]
}

interface PaginationResponse<T> extends Response<T> {
  data: T
  total_count: number
  total_page: number
  page: number
}

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
}

class RewardsApi {
  constructor(private request: AxiosInstance) {}

  async getRewards(
    pagination: PaginationParam = { page: 1, page_size: 20 },
    asset_type = 'POINTS'
  ) {
    const res = await this.request.post<PaginationResponse<RewardsDesc[]>>(
      '/customer/asset/entries',
      {
        page_size: pagination.page_size,
        page_num: pagination.page,
        asset_type
      }
    )
    return res.data
  }
}

const rewardsApi = new RewardsApi(request)
export default rewardsApi
