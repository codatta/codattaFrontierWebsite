import { get } from './base'
import { DASH_BOARD } from './config'

class DashboardApi {
  async getCommonData(): Promise<B18A.Response<B18A.DashboardResponse>> {
    return get(DASH_BOARD.COMMON)
  }

  async getPointsDistribution(): Promise<
    B18A.Response<B18A.DashboardPointsResponse>
  > {
    return get(DASH_BOARD.POINTS)
  }
}

export default new DashboardApi()
