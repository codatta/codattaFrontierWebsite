import request, { PaginationResponse, Response } from './request'

export type NotificationItem = {
  msg_id: string
  user_id: string
  client_id: string
  event_type: string
  msg_content: string
  have_read: string
  create_time: number
  notify_type: string
}

type NotificationProfile = {
  main_switch: boolean
  data_submission_switch: {
    main_switch: boolean
    s1_switch: boolean
    s2_switch: boolean
    s3_switch: boolean
    s4_switch: boolean
  }
  bounty_switch: {
    main_switch: boolean
    bounty_submission: boolean
    bounty_approved: boolean
  }
  validation_switch: {
    main_switch: boolean
    validation_submission: boolean
    validation_approved: boolean
  }
}

class NotificationApi {
  async getNotificationList(page: number, pageSize: number, type?: string) {
    const data = await request.post<PaginationResponse<NotificationItem[]>>('/msg/entry', {
      page_num: page,
      page_size: pageSize,
      notify_type: type
    })
    return data.data
  }

  async getNotificationProfile() {
    const data = await request.post<Response<NotificationProfile>>('/msg/profile')
    return data.data
  }

  async updateNotificationProfile(data: NotificationProfile) {
    const res = await request.post('/msg/edit', data)
    return res.data
  }

  async getNotificationUnread() {
    const res = await request.post<
      Response<{
        finished_task_count: number
        msg_unread_count: number
        unlocked_functions: string[]
        bounty_has_new: number
      }>
    >('/msg/unread')
    return res.data
  }
}

const notificationApi = new NotificationApi()
export default notificationApi
