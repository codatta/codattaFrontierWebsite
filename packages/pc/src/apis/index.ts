import { get } from './base'
import { DASH_BOARD } from './config'

class DashboardApi {
  async getCommonData(): Promise<B18A.Response<B18A.DashboardResponse>> {
    return get(DASH_BOARD.COMMON)
  }
}

export default new DashboardApi()
