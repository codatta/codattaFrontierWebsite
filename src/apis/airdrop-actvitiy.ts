import { AxiosInstance } from 'axios'
import request from './request'

export interface RankingItem {
  ranking: number
  points: number
  reward: number
  username: string
  avatar: string
}

class AirdropActivityApi {
  constructor(private request: AxiosInstance) {}

  async getRankingList() {
    return []
  }
}

const reputationApi = new AirdropActivityApi(request)
export default reputationApi
