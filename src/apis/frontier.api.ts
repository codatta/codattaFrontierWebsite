import { AxiosInstance } from 'axios'
import request, { PaginationResponse } from './request'

interface Response<T> {
  data: T
  success: true
  errorCode: number
  errorMessage: string
}

export interface TaskInfo {
  task_id: string
  status: 0 | 1 | 2 | 3 // 0 not start, 1 in progress, 2 done
  info?: string
}

export interface TaskRewardInfo {
  reward_icon: string
  reward_mode: string
  reward_type: string
  reward_value: number
}

export type RankingGrade = 'S' | 'A' | 'B' | 'C' | 'D'

export interface TaskDetail {
  frontier_id: string
  task_id: string
  name: string
  create_time: number
  submission_id: string
  task_type: string
  task_type_name: string
  data_display: {
    gif_resource: string
    template_id: string
    related_task_id?: string
    hide?: boolean
    link?: string
    bot_id?: string
    data_source?: string
  }
  questions?: CMUDataRequirements[]
  data_submission?: { [key: string]: unknown; lifelog_report?: string }
  question_status?: number // 1: available, 2: no more questions, 3. need to change question group
  data_requirements: unknown
  reward_info: readonly TaskRewardInfo[]
  qualification_datas: TaskInfo[]

  status: 'PENDING' | 'SUBMITTED' | 'REFUSED' | 'ADOPT'
  txHashUrl: string
  result: 'S' | 'A' | 'B' | 'C' | 'D'
  chain_status: 0 | 1 | 2 | 3 | 4
  qualification?: string
  qualification_flag: 0 | 1
  qualification_config?: Record<string, unknown>
  user_submit_flag?: 0 | 1 // 1 can submit, 0 cannot submit

  reputation: number
  reward_points: null | number

  user_reputation_flag: 0 | 1 | 2
  tags: string[]
  audit_reason?: string
}

export interface VideoItem {
  video_id: string
  desc?: string
  image_url?: string
  video_url: string
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

export interface SubmissionReward {
  reward_type: string
  reward_amount: number
}

export interface SubmissionStatics {
  total_submissions: number
  on_chained: number
}

export interface SubmissionRecord {
  submission_time: number
  frontier_name: string
  task_name: string
  result: number
  rating_name: 'S' | 'A' | 'B' | 'C' | 'D'
  status: 'ADOPT' | 'PENDING' | 'REFUSED'
  submission_id: string
  rewards: SubmissionReward[]
  data_submission?: {
    data: { [key: string]: unknown }
    taskId: string
    templateId: string
  }
}

export interface DataProfileListItem {
  submission_id: string
  submission_time: string
  data_submission: string
  result: number
  rating_name: RankingGrade
  status: string
  user_id: string
  frontier_id: string
  frontier_name: string
  task_id: string
  task_name: string
  chain_id: string
  chain_name: string
  fingerprint: string
  tx_hash: string
  chain_time: string
}

class FrontierApi {
  constructor(private request: AxiosInstance) {}

  async getFeedTaskDetail(uid: string) {
    const res = await this.request.post<Response<TaskDetail>>('/app/feed/task/info', { uid: uid })
    return res.data
  }

  async getTaskDetail(taskId: string) {
    const res = await this.request.post<Response<TaskDetail>>('/v2/frontier/task/detail', { task_id: taskId })
    return res.data
  }

  async submitTask(taskId: string, data: object): Promise<Response<TaskDetail>> {
    const res = await this.request.post<Response<TaskDetail>>('/v2/frontier/task/submit', {
      task_id: taskId,
      data_submission: data
    })

    return res.data
  }

  async getSubmissionStatics(): Promise<Response<SubmissionStatics>> {
    const res = await this.request.get('/v2/submission/user/statics')
    return res.data
  }

  async getSubmissionDetail(submission_id: string): Promise<Response<SubmissionRecord>> {
    const res = await this.request.get(`/v2/submission/user/detail`, { params: { submission_id } })
    return res.data
  }

  async getDataProfileList(page: number, page_size: number) {
    const res = await this.request.post<PaginationResponse<DataProfileListItem[]>>(
      '/v2/submission/user/data/profile/list',
      { page_num: page, page_size: page_size }
    )

    return res.data
  }
}

export default new FrontierApi(request)
