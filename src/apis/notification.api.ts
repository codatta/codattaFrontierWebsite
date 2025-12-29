import { AxiosInstance } from 'axios'
import request, { Response } from './request'

export type NotificationType = 'validation' | 'submission' | 'system'

type NotifyTypeItem = {
  name: string
  value: string
}

export interface NotificationListItem {
  msg_id: string
  user_id: string
  msg_title: string
  msg_content: string
  have_read: number
  create_time: number
  notify_type: string
}

interface NotificationListResponse {
  notify_types: NotifyTypeItem[]
  total_count: number
  page_num: number
  page_size: number
  list: NotificationListItem[]
}

class NotificationApi {
  constructor(private request: AxiosInstance) {}

  async getNotificationList(page: number, pageSize: number, type?: NotificationType) {
    const res = await this.request.post<Response<NotificationListResponse>>('/v2/msg/list', {
      page_num: page,
      page_size: pageSize,
      notify_type: type
    })
    return res.data
  }

  async setNotificationRead(msg_id: string) {
    const res = await this.request.post<Response<'ok'>>('/v2/msg/read/set', {
      msg_id
    })
    return res.data
  }
}

export default new NotificationApi(request)
