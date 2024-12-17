import { AxiosInstance } from 'axios'
import request from './request'
import type { UserInfo } from './user.api'

class TaskApi {
  constructor(private request: AxiosInstance) {}

  async getActivities() {
    const res = await this.request.post('/task/categories')
    console.log(res)
    return res.data.data
    return (await this.request.post<ActivityGroup[]>('/task/categories')).data
  }

  async getActivity(activityId: Activity['sub_cate_id']): Promise<Activity> {
    const { data } = await this.request.post('/task/sub_categories', {
      sub_cate_id: activityId
    })
    return data
  }

  async receiveReward(taskInstanceId: string) {
    return (
      await this.request.post<TaskReward[]>('/task/reward', {
        instance_id: taskInstanceId
      })
    ).data
  }

  async verify(taskId: string) {
    return (
      await this.request.post<{
        verify_result: 'PASSED' | 'FAILED'
        instance_id: Task_New['instance_id']
        rewards: TaskReward[]
        msg?: string
      }>('/task/verify', { task_id: taskId })
    ).data
  }

  // async getQuestDetail(questId: string) {
  //   const { data } = await this.request.post<any>('/quest/detail', {
  //     quest_id: questId
  //   })
  //   return data
  // }

  async finishTask(taskConfigId: string) {
    const { data } = await this.request.post('/task/finish', {
      task_config_id: taskConfigId
    })
    return data
  }

  async getCheckinInfo() {
    const { data } = await this.request.post<{
      check_in_days: number
      is_check_in: boolean
    }>('/check-in/consult')
    return data
  }

  async updateCheckin(params?: { chain: string; hash: string }) {
    const { data } = await this.request.post<{ check_in_days: number }>(
      '/check-in/check-in',
      params || {}
    )
    return data
  }

  async getCheckHistory(chain: string, year: number, month: number) {
    const { data } = await this.request.post('/task/chain/check/history', {
      chain,
      year,
      month
    })
    return data
  }
}

export default new TaskApi(request)

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
  Auto = 'AUTO'
}

export interface Task_New {
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
  tasks: Task_New[]
}

export type ActivitySummary = Pick<
  Activity,
  'sub_cate_id' | 'sub_cate_name' | 'sub_cate_description'
> & {
  award_icon: string
  completed_count: number
  avatars: UserInfo['user_data']['avatar']
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
