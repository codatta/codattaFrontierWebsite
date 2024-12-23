import type { ActivityGroup, ActivitySummary } from '@/api-v1/task.api'
import taskApi from '@/api-v1/task.api'
import { proxy } from 'valtio'

export interface ActivityStore {
  groups: ActivityGroup[] | null
}

export const activity = proxy<ActivityStore>({
  groups: null
})

export async function reloadActivities() {
  const res = await taskApi.getActivities()
  console.log('reload actifviti', res)

  const groups = res.data
  let sinkGroups: ActivitySummary[] = []
  activity.groups = groups.filter((category: ActivityGroup) => {
    sinkGroups = sinkGroups.concat(category.sub.filter((quest: ActivitySummary) => quest.all_finished === true))
    category.sub = category.sub.filter((quest: ActivitySummary) => quest.all_finished !== true)
    return category.sub.length > 0
  })
  if (activity.groups) {
    activity.groups.push({
      cate_name: '',
      cate_id: '',
      cate_icon: '',
      sub: sinkGroups
    })
  }
  return activity.groups
}

reloadActivities()
