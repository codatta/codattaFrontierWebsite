import request, { Response } from './request'

class ReputationApi {
  async getReputationDetail() {
    const { data } = await request.post<Response<ReputationDetail>>('/v2/user/reputation/detail')
    return data
  }
}

const reputationApi = new ReputationApi()
export default reputationApi

interface BaseReputation {
  opt: string
  percent: string | null
  score: number
  value: number
  unit: string
}

export interface StandardReputation extends BaseReputation {
  total: number | null
  complete: number | null
}

export interface ContributionReputation extends BaseReputation {
  adopt_cnt: number
  refuse_cnt: number
}

export interface ReputationDetail {
  reputation: number
  identify: StandardReputation
  login: StandardReputation
  staking: StandardReputation
  contribution: ContributionReputation
  malicious_behavior: StandardReputation
}
