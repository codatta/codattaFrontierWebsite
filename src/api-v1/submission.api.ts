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

interface TReward {
  current_point: number
  total_point: number
  estimate_point: number
  stage_1: TStage
  stage_2?: TStage
  stage_3?: TStage
  stage_4?: TStage
}

type TStage = {
  status: string
  point: number
  completed: number
  estimate_time?: number
}
