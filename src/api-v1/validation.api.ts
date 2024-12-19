import request, { PaginationResponse, Response } from './request'

export interface TValidationDetail {
  adopt?: boolean
  submission_id: string
  validation_id: null
  user_id: string
  task_type: string
  basic_info: {
    address: string
    network: string
    category: string
    entity: string
    evidence: string
    source: string
    submit_time: string
  }
  decision?: {
    decision: string
    point: number
    reason: string
    send_point: number
  }
  explorer_link: {
    address_link: string
    base_link?: string
    hash_match?: string
  }
  existing_data: string[]
  submitter_info: {
    hunting_count: number
    hunting_s2_pass_count: number
    hunting_s2_pass_proportion: number
    hunting_s2_review_count: number
    points: number
    reputation: number
    s2_pass_count: number
    s2_pass_proportion: number
    s2_review_count: number
    s2_review_proportion: number
    submission_count: number
  }
}

export interface TEvidence {
  text: string
  date?: number
  data?: string
  link: string
  hash: string
  translation: string
  files: {
    filename: string
    path: string
  }[]
}

export type TaskType =
  | 'SUBMISSION_PRIVATE'
  | 'SUBMISSION_HASH_ADDRESS'
  | 'SUBMISSION_IMAGE_ADDRESS'
  | 'SUBMISSION_IMAGE_ENTITY'
  | 'SUBMISSION_ONLY_IMAGE'
  | null

export interface TValidationItem {
  id: number
  gmt_create: string
  gmt_modified: string
  submission_id: string
  stage: string
  current_stage: string
  address: string
  network: string
  category: string
  entity: string
  current_vote: number
  max_vote: number
  points_every_voter: number
  status: string
  task_type: TaskType | null
  ext_info: unknown
  point: number
  gmt_expiration: string
  send_point?: number
  submission_evidence: string
}

type RequestPageParams = {
  page: number
  page_size: number
}

type RequestValidationsParams = {
  status: string
  [key: string]: unknown
} & RequestPageParams

export interface TValidationReason {
  text: string
  files: { filename: string; path: string }[]
}

export interface TSubmitValidationParams {
  task_type?: string
  submission_id: string
  decision: string
  reason: TValidationReason
}

class ValidationApi {
  async getValidationList(params: RequestValidationsParams) {
    const res = await request.post<PaginationResponse<TValidationItem[]>>(
      '/meta/validation/search',
      params
    )
    return res.data
  }

  async getRewards(params: RequestPageParams = { page: 1, page_size: 5 }) {
    return request.post('/meta/validation/rewards', params)
  }

  async getValidationDetail(
    submission_id: string | number,
    task_type?: TaskType | number,
    current_stage?: string
  ): Promise<Response<TValidationDetail>> {
    if (current_stage && typeof current_stage === 'string') {
      const res = await request.post('/meta/validation/detail', {
        submission_id: submission_id,
        task_type,
        current_stage: parseInt(current_stage, 10)
      })
      return res.data
    }
    const res = await request.post('/meta/validation/detail', {
      submission_id: submission_id,
      task_type
    })
    return res.data
  }

  async validate(params: TSubmitValidationParams) {
    return request.post('/meta/validation/post', {
      submission_id: params.submission_id,
      task_type: params.task_type,
      reason: JSON.stringify(params.reason),
      decision: params.decision
    })
  }

  async holdValidation(
    validation_id: string | number,
    stage: string,
    task_type?: string
  ) {
    return request.post('/user/certificate/claim', {
      biz_type: `VALIDATION_S${stage}`,
      biz_id: validation_id,
      task_type
    })
  }
}

export default new ValidationApi()
