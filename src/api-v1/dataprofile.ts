import request, { Response } from './request'

class DataProfile {
  async getDataProfile(data: { network: string; address: string; count: number }) {
    const res = await request.post<Response<DataDetail>>(`/data/profile/query`, data)
    return res.data
  }
  async getDataProfileEvidence(data: { network: string; address: string; count: number }) {
    const res = await request.post<Response<ProfileEvidence[]>>(`/data/profile/query/evidence`, data)
    return res.data
  }
}

const dataProfile = new DataProfile()
export default dataProfile

export interface SubmissionAndValidationInfos {
  avatar: string
  email: string
  address?: string
}
export interface MetaInfoHistory {
  name: string
  type: number
  count: number
}
export interface UseOrg {
  name: string
  link: string
  type: 'name' | 'logo'
}
export interface DataDetail {
  submission_infos: SubmissionAndValidationInfos[]
  validation_infos: SubmissionAndValidationInfos[]
  profile: {
    _partial?: boolean
    _custom_generated_pk?: boolean
    _await_when_save?: unknown
    meta_info_history: MetaInfoHistory[][]
    use_org: UseOrg[]
    visit_count: number
    category: string[]
    entity: string
  }
}

export interface ProfileEvidence {
  url: string
  date: string
}
