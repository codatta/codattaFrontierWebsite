import request, { type Response } from './request'

// const res = await request.post<Response<ActivityGroup[]>>('/v2/task/categories')
// return res.data

interface TaskInfo {
  task_id: string
  status: 0 | 1 | 2 // 0 not start, 1 in progress, 2 done
  info?: string
}

class BoosterApi {
  async getTaskInfo(task_id: string) {
    const res = await request.get<Response<TaskInfo>>(`/v2/h5/quest/info?task_id=${task_id}`)
    return res.data
  }

  async submitTask(task_id: string, content?: string) {
    const res = await request.post<Response<TaskInfo>>('/v2/h5/quest/submit', { task_id, status: 2, content })
    return res.data
  }

  async getFoodAnnotationDays(bn_task_name: string) {
    const res = await request.get<
      Response<{
        day_count: number
        has_current_date: boolean
        days: string[]
        question_result?: {
          num: string
          image_url: string
          items: [
            {
              model_name: string
              model_type: string
            },
            {
              model_name: string
              model_type: string
            }
          ]
        }
      }>
    >('/v2/binance/v1/task/days', { params: { task_id: bn_task_name } })
    return res.data
  }
}

export default new BoosterApi()
