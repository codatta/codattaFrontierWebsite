import { AxiosInstance } from 'axios'
import request from './request'

interface Response<T> {
  data: T
  success: true
  errorCode: 0
  errorMessage: string
}

interface TaskRewardInfo {
  reward_icon: string
  reward_mode: string
  reward_type: string
  reward_value: number
}

export interface TaskDetail {
  frontier_id: string
  task_id: string
  name: string
  data_display: {
    gif_resource: string
    template_id: string
  }
  data_requirements: {
    [key: string]: unknown
  }
  reward_info: TaskRewardInfo[]
  status: string
}

class frontier {
  constructor(private request: AxiosInstance) {}

  async getTaskDetail(taskId: string) {
    const res = await this.request.post<Response<TaskDetail>>(
      '/frontier/task/detail',
      { task_id: taskId }
    )
    return res.data
  }

  async submitTask(taskId: string, data: object) {
    const res = await this.request.post<Response<null>>(
      '/frontier/task/submit',
      { task_id: taskId, data_submission: data }
    )
    return res.data
  }
}

export default new frontier(request)
