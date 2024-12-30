import { AxiosInstance } from 'axios'
import request, { PaginationResponse, Response } from './request'
import { TEvidence } from './validation.api'

export type TSubmitResult = {
  submission_id: string
  s1_valid_result: boolean
  s1_fail_msg?: string
  fail_reason: string
  current_bonus_point: number
  total_bonus_point: number
  error?: boolean
}

export interface TSubmissionBasicInfo {
  address: string
  network: string
  category: string
  entity: string
  evidence: string
  source: string
}

export interface TSubmissionDetail {
  submission_id: string
  user_id: string
  basic_info: TSubmissionBasicInfo
  reward: TReward
  status: string
  time: string
}

export interface TAICheckResult {
  success: boolean
  type: string
}

export interface TReward {
  current_point: number
  total_point: number
  estimate_point: number
  stage_1: TStage
  stage_2?: TStage
  stage_3?: TStage
  stage_4?: TStage
  ai_check_reason: string
}

type TStage = {
  status: string
  point: number
  completed: number
  estimate_time?: number
}

export interface TSubmissionItem {
  submission_id: string
  user_id: string
  address: string
  network: string
  gmt_create: number
  category: string
  entity: string
  status: string
  estimate_time: number
  total_point: number
  send_point: number
  hunting_id: string
  reward: TReward
}

interface RequestPageParams {
  page: number
  page_size: number
}

type RequestSubmissionsParams = {
  filter: string
} & RequestPageParams

export interface CreateSubmissionParams {
  network: string
  address: string
  category: string
  entity: string
  evidence: {
    text: string
    hash: string
    link: string
    files: { filename: string; path: string }[]
  }
}

export interface TCreateSubmissionResponse {
  current_bonus_point: number
  fail_reason: string
  s1_valid_result: boolean
  submission_id: string
  total_bonus_point: number
}

class SubmissionApi {
  constructor(private request: AxiosInstance) {}

  async createSubmission(params: CreateSubmissionParams) {
    const res = await this.request.post<Response<TCreateSubmissionResponse>>('/meta/submission/post', {
      ...params,
      evidence: JSON.stringify(params.evidence)
    })
    return res.data
  }

  async getSubmissions(params: RequestSubmissionsParams) {
    const res = await this.request.post<PaginationResponse<TSubmissionItem[]>>('/meta/submission/query', params)
    return res.data
  }

  async getRewards(params: RequestPageParams = { page: 1, page_size: 5 }) {
    const res = await this.request.post('/api/meta/submission/rewards', params)
    return res
  }

  async getSubmissionDetail(id: string) {
    const res = await this.request.post<Response<TSubmissionDetail>>('/meta/submission/detail', { submission_id: id })
    return res.data
  }

  async preCheckSubmission(submission: CreateSubmissionParams, skipEvidence = false) {
    const res = await this.request.post('/meta/submission/pre_check', { ...submission, no_evidence: skipEvidence })
    return res.data
  }

  async appendEvidence(submission_id: string, evidence: TEvidence[]) {
    const res = await this.request.post<Response<void>>('/meta/submission/modify', {
      submission_id,
      evidence: JSON.stringify(evidence)
    })
    return res.data
  }
  async getRecentEntity(count = 3) {
    const res = await this.request.post<Response<string[]>>('/meta/submission/recent_entity', { count })
    return res.data
  }

  async getRecentCategory(count = 3) {
    const res = await this.request.post<Response<string[]>>('/meta/submission/recent_category', { count })
    return res.data
  }

  async getSubmissionHomeCategories() {
    const res = await this.request.post('/submission/home')
    return res
  }
}

const submissionApi = new SubmissionApi(request)
export default submissionApi
