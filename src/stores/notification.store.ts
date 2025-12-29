import notificationApi, { NotificationListItem, NotificationType } from '@/apis/notification.api'
import notificationApiV1 from '@/api-v1/notification.api'
import { message } from 'antd'
import { proxy, useSnapshot } from 'valtio'

type NotificationStore = {
  listLoading: boolean
  list: NotificationListItem[]
  unread: boolean
  total: number
  unRewardedTask: number
  unlockFunctions: string[]
}

export const notificationStore = proxy<NotificationStore>({
  listLoading: false,
  total: 0,
  list: [],
  unread: false,
  unRewardedTask: 0,
  unlockFunctions: []
})

async function getUnread() {
  const { data } = await notificationApiV1.getNotificationUnread().catch((err) => {
    message.error(err.message)
    return { data: { finished_task_count: 0, msg_unread_count: 0, unlocked_functions: [] } }
  })
  notificationStore.unread = data.msg_unread_count > 0
  notificationStore.unRewardedTask = data.finished_task_count ?? 0
  notificationStore.unlockFunctions = data.unlocked_functions ?? []
}

async function getMessageList(page: number, pageSize: number, type?: NotificationType) {
  notificationStore.listLoading = true
  const res = await notificationApi.getNotificationList(page, pageSize, type)
  notificationStore.total = res.data.total_count
  notificationStore.list = res.data.list
  notificationStore.listLoading = false
}

export function useNotificationStore() {
  return useSnapshot(notificationStore)
}

export const notificationStoreActions = {
  getUnread,
  getMessageList
}
