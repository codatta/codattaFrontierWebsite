import { AxiosInstance } from 'axios'
import request, { DataPaginationRes, Response } from './request'

export type ModelType = 'rank'
export type RewardType = 'USDT' | 'XnYCoin'
export type SubmissionStatus = 'ADOPT' | 'PENDING' | 'REFUSED'

export interface RankingItem {
  ranking: number
  points: number
  reward: number
  username: string
  avatar: string
}

export interface RewardItem {
  reward_type: RewardType
  reward_amount: number
}

export interface AirdropRewardInfo {
  total_ranking_positions: number
  name: string
  reward_type: string
  reward_amount: number
}

export interface AirdropActivityInfo {
  season_id: string
  name: string
  title: string
  start_time: string
  end_time: string
  total_rewards: RewardItem[]
  participants: number
  model: ModelType
  reward: AirdropRewardInfo
  description: string
  total_point_reward: number
  rules_link: string
  extra_desc: string
}

export interface AirdropNameItem {
  season_id: string
  name: string
  title: string
}

export interface AirdropFrontierItem {
  season_id: string
  frontier_id: string
  name: string
  title: string
  description: string
  duration_days: number
  participants: number
  reward_amount: number
  reward_type: RewardType
  tasks: readonly AirdropFrontierTaskItem[]
}

export interface AirdropFrontierTaskItem {
  task_id: string
  name: string
  template_id: string
  score: number
  status: 0 | 1 | 2 // 0-not started, 1-in progress, 2-completed
}

export interface AirdropSeasonRankItem {
  user_id: string
  rank: number
  image_url: string
  user_name: string
  score: number
  reward_type: RewardType
  reward_amount: number
  point_reward_type: 'POINTS'
  point_reward_amount: number
}

export interface AirdropRankHistoryItem {
  season_id: string
  name: string
  title: string
  description: string
  start_time: string
  end_time: string
  user_id: string
  user_rank: number
  score: number
  reward_type: RewardType
  reward_amount: number
  point_reward_type: 'POINTS'
  point_reward_amount: number
}

export interface AirdropActivityHistoryItem {
  season_id: string
  frontier_id: string
  task_id: string
  season_name: string
  frontier_name: string
  task_name: string
  score: number
  status: SubmissionStatus
  user_id: string
  submission_id: string
}

export interface AirdropActivityHistoryParams {
  season_id?: string
  frontier_id?: string
  submission_status?: SubmissionStatus | null
  page_num: number
  page_size: number
}

class AirdropActivityApi {
  constructor(private request: AxiosInstance) {}

  async getAirdropActivityInfo(airdropSeasonId: string) {
    const res = await this.request.get<Response<AirdropActivityInfo>>('/v2/airdrop/season/detail', {
      params: {
        season_id: airdropSeasonId
      }
    })
    return res.data
  }

  async getAirdropNames() {
    const res = await this.request.get('/v2/airdrop/season/names')
    return res.data
  }

  async getAirdropList() {
    const res = await this.request.post<Response<AirdropNameItem[]>>('/v2/airdrop/season/list')
    return res.data
  }

  async getAirdropFrontierList(params: { season_id: string; page_num: number; page_size: number }) {
    const res = await this.request.post<DataPaginationRes<AirdropFrontierItem>>('/v2/airdrop/frontier/list', params)
    return res.data
  }

  async getAirdropSeasonRanks(params: { season_id: string; page_num: number; page_size: number }) {
    const res = await this.request.post<
      DataPaginationRes<AirdropSeasonRankItem> & {
        data: { season_id: string; season_name: string; season_title: string; user_rank: number }
      }
    >('/v2/airdrop/season/ranks', params)
    return res.data
  }

  async getAirdropRankHistory(params: { page_num: number; page_size: number }) {
    const res = await this.request.post<DataPaginationRes<AirdropRankHistoryItem>>(
      '/v2/airdrop/season/rank/history',
      params
    )
    return res.data
  }

  async getAirdropActivityHistory(params: AirdropActivityHistoryParams) {
    const res = await this.request.post<DataPaginationRes<AirdropActivityHistoryItem>>(
      '/v2/airdrop/user/history/list',
      params
    )
    return res.data
  }

  async getUserAirdropActivityStatics(season_id: string) {
    const res = await this.request.post('/v2/airdrop/user/history/statistics', { season_id })
    return res.data
  }
}

const reputationApi = new AirdropActivityApi(request)
export default reputationApi
