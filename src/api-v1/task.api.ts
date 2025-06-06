import request, { type Response } from './request'
import type { UserInfo } from '@/apis/user.api'

export interface QuestOption {
  key: string
  statement: string
  answer?: boolean
  correct?: boolean
  errorMessage?: string
}

export interface Quest {
  title: string
  type: string
  content?: string
  answer?: string[]
  errorMessage?: string
  options: QuestOption[]
}

class TaskApi {
  async getActivities() {
    const res = await request.post<Response<ActivityGroup[]>>('/task/categories')
    return res.data
  }

  async getActivity(activityId: Activity['sub_cate_id'] = '') {
    const { data } = await request.post<Response<Activity>>('/task/sub_categories', { sub_cate_id: activityId })
    return data
  }

  async receiveReward(taskInstanceId: string) {
    return (
      await request.post<Response<TaskReward[]>>('/task/reward', {
        instance_id: taskInstanceId
      })
    ).data
  }

  async verify(taskId: string) {
    return (
      await request.post<
        Response<{
          verify_result: 'PASSED' | 'FAILED'
          instance_id: TaskItem['instance_id']
          rewards: TaskReward[]
          msg?: string
        }>
      >('/task/verify', { task_id: taskId })
    ).data
  }

  async getQuestDetail(questId: string) {
    const { data } = await request.post<Response<Quest[]>>('/quest/detail', {
      quest_id: questId
    })
    return data
  }

  async finishTask(taskConfigId: string) {
    const { data } = await request.post('/task/finish', {
      task_config_id: taskConfigId
    })
    return data
  }

  async getCheckinInfo() {
    const { data } = await request.post<{
      check_in_days: number
      is_check_in: boolean
    }>('/check-in/consult')
    return data
  }

  async updateCheckin(params?: { chain: string; hash: string }) {
    const { data } = await request.post<{ check_in_days: number }>('/check-in/check-in', params || {})
    return data
  }

  async getCheckHistory(chain: string, year: number, month: number) {
    const { data } = await request.post('/task/chain/check/history', {
      chain,
      year,
      month
    })
    return data
  }
}

export default new TaskApi()

export enum TaskCategory {
  CompleteProfile = 'COMPELTE_PROFILE',
  Tutorial = 'TUTORIAL',
  Contribution = 'CONTRIBUTION'
}

export enum TaskStatus {
  NotStart = 'NOTSTART',
  Pending = 'PENDING',
  Finished = 'FINISHED',
  Rewarded = 'REWARDED'
}

export enum TaskType {
  Manual = 'MANUAL',
  Auto = 'AUTO',
  Redeem = 'REDEEM'
}

export interface TaskItem {
  task_id: string
  name: string
  description: string
  type: TaskType
  expire_time?: number
  status: TaskStatus
  max_count?: number
  current_count?: number
  completed_times: number
  start_time?: number
  instance_id?: string
  ext_info: null
  schema: string
  rewards: TaskReward[]
  exhcange?: TaskReward[]
  locked: boolean
  how_to_unlock: string
  refresh_time: number
  duration: number
}

export interface Activity {
  sub_cate_id: string
  sub_cate_name: string
  sub_cate_description: string
  help_info: { name: string; icon: string; link: string; content: string }[]
  tasks: TaskItem[]
}

export type ActivitySummary = Pick<Activity, 'sub_cate_id' | 'sub_cate_name' | 'sub_cate_description'> & {
  award_icon: string
  completed_count: number
  avatars: UserInfo['user_data']['avatar'][]
  finished_count: number
  locked: boolean
  how_to_unlock: string
  all_finished: boolean
}

export interface ActivityGroup {
  cate_name: string
  cate_id: string
  cate_icon: string
  sub: ActivitySummary[]
}

export interface TaskReward {
  reward_type: string
  reward_icon: string
  reward_value: number
}
