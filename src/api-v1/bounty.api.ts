import request, { Response, TPagination } from './request'
import { TSubmissionDetail } from './submission.api'

type PageParam = {
  page: number
  page_size: number
}

export enum BountyType {
  Address = 'address',
  Entity = 'entity'
}

export enum BountyStatus {
  NotStart = 'NotStart',
  OnHold = 'OnHold',
  InProgress = 'InProgress',
  Completed = 'Completed'
}

export interface TBountyDetail {
  basic_info: {
    entity: string
    entity_config_id: string
    gmt_expiration: string
  }
  ext_info: {
    [key: string]: number | string
  }
  is_submit: boolean
  list: TSubmissionDetail[]
}

export interface TBounty {
  hunting_entity_task_id?: string
  hunting_address_task_id?: string
  address?: string
  network?: string
  entity: string
  current_vote: number
  max_vote: number
  points_every_voter: number
  status: string
  submission_id?: string
  ext_info?: string
  gmt_expiration?: string
}

export interface BountyFeature {
  title: string
  level: string
  type: string
  image: string
  points: string
  desc: string
  current_count: string
}

export interface BountyActivity {
  desc: string
  activity_id: string
  image: string
  title: string
  schema: string
  type: BountyType
  start_time: string
  end_time: string
  show_count: number
  points: string
  count: number

  ext_info: {
    query_key: string
    query_value: object
  }
}

export type BountySubmitProp = {
  entity: string
  category: string
  evidence: string
  network: string
}

export type TSubmitResult = {
  submission_id: string
  s1_valid_result: boolean
  fail_reason: string
  current_bonus_point: number
  total_bonus_point: number
  error?: boolean
}

export interface BountyListFilter {
  listType: BountyType
  status: string
  address?: string
  points_sort: string
  entity?: string
  network?: string
  level?: string
  category?: string
}

class BountyApi {
  async getFeatures() {
    const res =
      await request.post<Response<{ features: BountyFeature[]; ordinary_list: BountyActivity[] }>>(
        '/meta/hunting/activity/list'
      )
    return res.data
  }

  async getBountyDetail(taskId: string, type: BountyType, pagination: PageParam = { page: 1, page_size: 24 }) {
    const res = await request.post<Response<TBountyDetail>>(`/meta/hunting/${type}/detail`, {
      task_id: taskId,
      ...pagination
    })
    return res.data
  }

  async getBountyList(
    filters: BountyListFilter,
    pagination: TPagination
  ): Promise<{ total_count: number; data: TBounty[] }> {
    const res = await request.post(`/hunting/${filters.listType}/query`, {
      ...filters,
      page: pagination.current,
      page_size: pagination.pageSize
    })
    return res.data
  }

  async getRecentEntity(count = 3) {
    const res = await request.post<string[]>('/meta/submission/recent_entity', { count })
    return res.data
  }

  async getRecentCategory(count = 3) {
    const res = await request.post<string[]>('/meta/submission/recent_category', { count })
    return res.data
  }

  async submitBounty(type: BountyType, id: string, props: BountySubmitProp) {
    const res = await request.post<Response<TSubmitResult>>(`/hunting/${type}/submission/post`, {
      [type === BountyType.Address ? 'hunting_address_task_id' : 'hunting_entity_task_id']: id,
      ...props
    })
    return res.data
  }

  async holdBounty(taskId: string, bountyType: BountyType) {
    return request.post('/user/certificate/claim', {
      biz_type: bountyType === BountyType.Address ? 'BOUNTY_ADDRESS' : 'BOUNTY_ENTITY',
      biz_id: taskId
    })
  }

  async menuClick(notify_type = 'bounty_hunting') {
    return request.post(`/menu/click?notify_type=${notify_type}`)
  }
}

const bountyApi = new BountyApi()
export default bountyApi
