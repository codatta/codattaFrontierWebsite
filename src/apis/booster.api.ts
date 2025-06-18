import request, { type Response } from './request'

// const res = await request.post<Response<ActivityGroup[]>>('/v2/task/categories')
// return res.data

interface TaskInfo {
  task_id: string
  status: 0 | 1 | 2 // 0 not start, 1 in progress, 2 done
}

class BoosterApi {
  async getTaskInfo(task_id: string) {
    const res = await request.post<Response<TaskInfo>>('/v2/h5/quest/list', { task_id })
    return res.data
  }

  async submitTask(task_id: string, content?: string) {
    const res = await request.post<Response<TaskInfo>>('/v2/h5/quest/submit', { task_id, status: 2, content })
    return res.data
  }
}

export default new BoosterApi()
