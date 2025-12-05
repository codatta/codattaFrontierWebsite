import { AxiosInstance } from 'axios'
import request, { PaginationResponse, TPagination } from './request'
import { TaskInfo } from './booster.api'

interface Response<T> {
  data: T
  success: true
  errorCode: number
  errorMessage: string
}

export interface TaskRewardInfo {
  reward_icon: string
  reward_mode: string
  reward_type: string
  reward_value: number
}

export type ActiveStatus = 'ACTIVE' | 'INACTIVE' | 'COMPLETED'
export interface FrontierActivityInfoItem {
  activity_id: string
  start_time: string
  end_time: string
  reward_mode: 'EQUAL_SPLIT_ON_END' | 'FIRST_COME_FIRST_SERVE'
  min_ranking_grade: string
  days_left: number
  total_asset_amount: number
  max_reward_count: number
  reward_asset_type: string
  participants: number
  submissions: number
  status: ActiveStatus
  rules?: readonly string[]
  description?: string
}

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
  tags: string[]
}

export interface FrontierListItem {
  creator_id: string
  description: {
    frontier_desc: string
    hide?: boolean
  }
  frontier_id: string
  logo_url: string
  reputation_permission: number
  status: string
  title: string
  activities: FrontierActivityInfoItem[]
  // start
  // total_asset_amount: number
  // reward_asset_type: string
  // min_ranking_grade: string
  // days_left: number
  // end
  template_ext?: {
    template_id: string
    gif_resource?: string
    open_cum_dialog?: number
    hide?: boolean
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
  qualification?: string
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

export interface SubmissionReward {
  reward_type: string
  reward_amount: number
}

export interface SubmissionStatics {
  total_submissions: number
  total_rewards: SubmissionReward[]
  on_chained: number
  claimable_rewards: SubmissionReward[]
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

export interface SubmissionLifeLogReport {
  user_score: number
  content: string
}

export interface GenerateFingerprintParams {
  address: string
  quality: 'S' | 'A' | 'B' | 'C' | 'D'
  submit_data: unknown
}

class frontier {
  constructor(private request: AxiosInstance) {}

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
    const res = await this.request.post('/v2/frontier/list')
    return res.data
  }

  async getFrontierActivityInfo(data: {
    frontier_id: string
    status?: ActiveStatus
  }): Promise<Response<FrontierActivityInfoItem[]>> {
    const res = await this.request.post('/v2/frontier/activity/info', data)
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

  async getSubmissionLifeLogReport(submission_id: string): Promise<Response<SubmissionLifeLogReport>> {
    const res = await this.request.post(`/v2/submission/lifelog/report`, { submission_id })
    return res.data
  }

  // async getSubmissionDetail(submission_id: string): Promise<Response<TaskDetail>> {
  //   const res = await this.request.post(`/v2/submission/detail`, { submission_id })
  //   return res.data
  // }

  async getLastSubmission(frontierId: string, taskIds: string): Promise<TaskDetail> {
    const res = await this.getSubmissionList({
      page_num: 1,
      page_size: 1,
      frontier_id: frontierId,
      task_ids: taskIds
    })
    const lastSubmission = res.data[0]
    return lastSubmission
  }

  async getSubmissionDetail(submission_id: string): Promise<Response<SubmissionRecord>> {
    const res = await this.request.get(`/v2/submission/user/detail`, { params: { submission_id } })
    return res.data
  }

  async generateFingerprint(params: GenerateFingerprintParams): Promise<Response<{ fingerprint: string }>> {
    const res = await this.request.post('/v2/chain/gen/fingerprint', params)
    return res.data
  }

  async getSocailLink(params: { type: 'Discord' | 'X' | 'Telegram' }) {
    const res = await this.request.post<Response<{ link: string }>>('/v2/user/sm/task/connect', params)
    return res.data
  }

  async getXBindLink() {
    const res = await this.request.post<Response<{ link: string }>>('/v2/user/sm/twitter/link/get')
    return res.data
  }

  async verifyXBind(link: string) {
    const res = await this.request.post<Response<{ task_open_id: string; task_user_name: string }>>(
      '/v2/user/sm/twitter/link/verify',
      { link }
    )
    return res.data
  }

  async getSocialBindInfo(params: { type: 'Discord' | 'X'; value: { [key: string]: string } }) {
    const res = await this.request.post<
      Response<{
        id: null
        first_name: ''
        last_name: ''
        username: ''
        photo_url: ''
        auth_date: null
        hash: ''
        oauth_verifier: ''
        oauth_token: ''
        code: ''
      }>
    >('/v2/user/sm/task/bind', params)
    return res.data
  }
}

export default new frontier(request)
