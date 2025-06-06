import request, { type Response } from './request'
import type { UserInfo } from '@/apis/user.api'

export interface QuestOption {
  key: string
  statement: string
  anwer?: boolean
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
    const res = await request.post<Response<ActivityGroup[]>>('/v2/task/categories')
    return res.data
  }

  async getActivity(activityId: Activity['sub_cate_id'] = '') {
    const res = await request.post<Response<Activity>>('/v2/task/sub_categories', { sub_cate_id: activityId })
    return res.data
  }

  async receiveReward(taskInstanceId: string) {
    const res = await request.post<Response<TaskReward[] | RewardErrorData>>('/v2/task/reward', {
      instance_id: taskInstanceId
    })
    return res.data
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
      >('/v2/task/verify', { task_id: taskId })
    ).data
  }

  // async getQuestDetail(questId: string) {
  //   const { data } = await request.post<Response<Quest[]>>('/quest/detail', {
  //     quest_id: questId
  //   })
  //   return data
  // }

  async finishTask(taskConfigId: string) {
    const { data } = await request.post('/v2/task/finish', {
      task_config_id: taskConfigId
    })
    return data
  }

  async getCheckinInfo() {
    const { data } =
      await request.post<Response<{ check_in_days: number; is_check_in: boolean }>>('/v2/check-in/consult')

    return data
  }

  async updateCheckin(params?: { chain: string; hash: string }) {
    const { data } = await request.post<{ check_in_days: number }>('/v2/check-in/check-in', params || {})
    return data
  }

  async getCheckinHistory(year: number, month: number) {
    const { data } = await request.post<
      Response<{
        total_count: number
        check_in_history: { check_in_day: string; check_in_month: string; check_in_date: string }[]
      }>
    >('/v2/check-in/query', {
      data: {
        year,
        month
      }
    })
    return data
  }
}

export default new TaskApi()

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

export type RewardErrorData = Pick<Response<unknown>, 'errorCode' | 'errorMessage' | 'success'>
