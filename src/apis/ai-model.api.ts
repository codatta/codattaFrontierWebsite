import { AxiosInstance } from 'axios'
import request from './request'

interface Response<T> {
  data: T
  success: true
  errorCode: 0
  errorMessage: string
}

export enum EvaluateValue {
  A = 1,
  B = 2,
  C = 3,
  D = 4
}

export interface AIModelItem {
  name: string
  show_name: string
  description: string
  org: string
}

export interface LeaderboardItem {
  name: string
  show_name: string
  image_url: string
  link: string
  arena_score: number
  ci: string
  votes: number
  correct_rate: number
  org: string
  org_name: string
  license: string
  rank?: number
}

class AIModelRequest {
  constructor(private request: AxiosInstance) {}

  async sendPrompt(data: { content: string; task_id?: string | null }) {
    const res = await this.request.post<
      Response<{
        task_id: string
        model_a: string
        model_b: string
        message: string
      }>
    >('/ct/model/chat', data)
    return res.data
  }

  async submitFeedback(data: { evaluate: EvaluateValue; task_id: string | null }) {
    const res = await this.request.post<
      Response<{ status: number; message: string; model_a: string; model_b: string }>
    >('/ct/model/evaluate', data)
    return res.data
  }

  async getModelList() {
    const res = await this.request.get<Response<AIModelItem[]>>('/ct/model/list')
    return res.data
  }

  async getLeaderboard() {
    const res =
      await this.request.get<
        Response<{ models: LeaderboardItem[]; total: number; total_votes: number; update_time: string }>
      >('/ct/model/leaderboard')
    return res.data
  }
}

export default new AIModelRequest(request)
