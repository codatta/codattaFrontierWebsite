import { AxiosInstance } from 'axios'
import request, { PaginationResponse, TPagination } from './request'

interface Response<T> {
  data: T
  success: true
  errorCode: 0
  errorMessage: string
}

export interface TaskRewardInfo {
  reward_icon: string
  reward_mode: string
  reward_type: string
  reward_value: number
}

export interface TaskDetail {
  frontier_id: string
  task_id: string
  name: string
  create_time: number
  submission_id: string
  task_type: string
  data_display: {
    gif_resource: string
    template_id: string
  }
  questions?: CMUDataRequirements[]
  data_submission?: { [key: string]: unknown }
  question_status?: number // 1: available, 2: no more questions, 3. need to change question group
  data_requirements: unknown
  reward_info: readonly TaskRewardInfo[]
  status: 'PENDING' | 'SUBMITTED' | 'REFUSED' | 'ADOPT'
  txHashUrl: string
}

export interface FrontierListItem {
  creator_id: string
  description: {
    frontier_desc: string
  }
  frontier_id: string
  logo_url: string
  reputation_permission: number
  status: string
  title: string
  // start
  total_asset_amount: number
  reward_asset_type: string
  min_ranking_grade: string
  days_left: number
  // end
  template_ext?: {
    template_id: string
    gif_resource?: string
    open_cum_dialog?: number
  }
}

export enum MediaName {
  TWITTER = 'x',
  TELEGRAM = 'telegram',
  DISCORD = 'discord',
  WEBSITE = 'website',
  DOC = 'doc'
}

export interface VideoItem {
  video_id: string
  desc?: string
  image_url?: string
  video_url: string
}

export interface FrontierItemType {
  id?: number
  name: string
  description: string
  logo_url: string
  banner?: string
  media_link?: Array<{
    name: MediaName
    value: string
  }>
  videos?: Array<VideoItem>
  reputation_permission?: number
  frontier_id?: string
}

export interface CMUDataRequirements {
  num: string
  querytext: string
  status: number // 2: finished, other: not finished
  part1: {
    select?: string
    videos: Array<VideoItem>
  }
  part2: {
    videos: Array<VideoItem>
    questions: Array<{
      title: string
      select?: string
      options: Array<{
        value: string
        label: string
        content: string
      }>
    }>
  }
}

export interface SubmissionStatics {
  total_submissions: number
  total_rewards: number
  on_chained: number
  avg_score: number
}

export interface SubmissionRecord {
  submission_time: number
  frontier_name: string
  score: string
  reward: string
  status: 'PENDING' | 'SUBMITTED' | 'REFUSED' | 'ADOPT'
  on_chained: 0 | 1
  submission_id: string
}

class frontier {
  constructor(private request: AxiosInstance) {}

  async getTaskDetail(taskId: string) {
    const res = await this.request.post<Response<TaskDetail>>('/v2/frontier/task/detail', { task_id: taskId })
    return res.data
  }

  async submitTask(taskId: string, data: object) {
    const res = await this.request.post<Response<null>>('/v2/frontier/task/submit', {
      task_id: taskId,
      data_submission: data
    })
    return res.data
  }

  async getTaskList(params: {
    frontier_id: string
    page_num: number
    page_size: number
  }): Promise<PaginationResponse<TaskDetail[]>> {
    const res = await this.request.post('/v2/frontier/task/list', params)
    return res.data
  }

  async getSubmissionList(
    data: TPagination & {
      frontier_id?: string
      task_ids?: string
    }
  ): Promise<PaginationResponse<TaskDetail[]>> {
    const res = await this.request.post('/v2/submission/list', data)
    return res.data
  }

  async getFrontiers(): Promise<Response<FrontierListItem[]>> {
    const res = await this.request.post('/v2/frontier/list ')
    return res.data
  }

  async getFrontierInfo(frontier_id: string): Promise<Response<FrontierItemType>> {
    const res = await this.request.get(`/v2/frontier/info?frontier_id=${frontier_id}`)
    console.log(res)
    return res.data
  }

  async getSubmissionStatics(): Promise<Response<SubmissionStatics>> {
    const res = await this.request.get('/v2/submission/user/statics')
    return res.data
  }

  async getSubmissionRecords(params: TPagination): Promise<PaginationResponse<SubmissionRecord[]>> {
    const res = await this.request.post('/v2/submission/user/records', params)
    return res.data
  }
}

export default new frontier(request)
