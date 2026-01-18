import request, { Response } from '../request'
import { ReputationDetail } from '../reputation.api'

class ReputationApi {
  async getReputationDetail() {
    const { data } = await request.post<Response<ReputationDetail>>('/app/user/reputation/detail')
    return data
  }
}

const reputationApi = new ReputationApi()
export default reputationApi
