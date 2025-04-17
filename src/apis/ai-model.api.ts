import { AxiosInstance } from 'axios'
import request from './request'

request.defaults.baseURL = '/api'

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
}

export default new AIModelRequest(request)
