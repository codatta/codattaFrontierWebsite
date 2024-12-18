import { isEmpty } from 'lodash'
import type { TaskReward } from './task.api'
import type { UserInfo } from './user.api'
import request from './request'

class CampaignApi {
  async getConsult(revealed: CampaignRevealed, id: string = '') {
    const { data } = await request.post('/campaign/consult', {
      revealed,
      source_id: id
    })
    return isEmpty(data.data) ? null : data.data

    // const { data } = await request.post<Campaign>('/campaign/consult', {
    //   revealed,
    //   source_id: id
    // })
    // return isEmpty(data) ? null : data
  }

  async preSettle(id: Campaign['campaign_id']) {
    return (
      await request.post<CampaignSettled>('/campaign/pre_settle', {
        campaign_id: id
      })
    ).data
  }

  async settle(
    id: Campaign['campaign_id'],
    credential: CampaignSettled['credentials'][number]
  ) {
    return (
      await request.post<Omit<CampaignSettled, 'credentials'>>(
        '/campaign/settle',
        {
          campaign_id: id,
          credential
        }
      )
    ).data
  }

  async getLeaderBoard(id: Campaign['campaign_id']) {
    return (
      await request.post<LeaderBoard>('/campaign/leader_board', {
        campaign_id: id
      })
    ).data
  }
}

export default new CampaignApi()

export enum CampaignRevealed {
  Task = 'TASK'
}

export interface Campaign {
  campaign_id: string
  campaign_name: string
  campaign_type: CampaignType
  stage: CampaignStage
  icon: string
  points: string
  reward_date: string
  user_status: UserCampaignStatus
  ext_info: {
    settle_button: string
    finished_button: string
    timeline?: { title: string; description?: string; date?: string }[]
  }
}

export enum CampaignType {
  Point = 'POINT_RANK'
}

export enum CampaignStage {
  NotStart = 'NOTSTART',
  Progressing = 'PROGRESSING',
  Settling = 'SETTLING',
  Finished = 'FINISHED'
}

export enum UserCampaignStatus {
  Settled = 'SETTLED'
}

export interface CampaignSettled {
  ranking: number
  rewards: TaskReward[]
  description: string
  credentials: string[]
}

export interface LeaderBoard {
  leader_board: CampaignParticipant[]
  statement: string
  external_info: {
    description: string
    link: string
  }
}

export interface CampaignParticipant {
  rank: number
  username: UserInfo['user_data']['user_name']
  avatar: UserInfo['user_data']['avatar']
  rank_points: number
  reward_value: number
}
