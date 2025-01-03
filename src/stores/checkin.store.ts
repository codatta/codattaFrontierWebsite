import { proxy } from 'valtio'
import { useSnapshot } from 'valtio'

import taskApi from '@/apis/task.api'

type TCheckinStore = {
  days: number
  loading: boolean
  done: boolean
  show: boolean
}

export const checkinStore = proxy<TCheckinStore>({
  days: 0,
  loading: false,
  done: false,
  show: false
})

export async function reloadCheckin() {
  try {
    checkinStore.loading = true
    const res = await taskApi.getCheckinInfo()

    checkinStore.days = res.data?.check_in_days ?? 0
    checkinStore.done = res.data?.is_check_in ?? false
  } catch (e) {
    console.error('getCheckinInfo: ', e.message)
  }
  checkinStore.loading = false
}

export async function checkin() {
  try {
    checkinStore.loading = true
    const res = await taskApi.updateCheckin()

    checkinStore.loading = false
    console.log('res', res)
  } catch (e) {
    checkinStore.loading = false
    console.error('checkin error: ', e.message)
    throw new Error(e.message)
  }
}

export function toggleCheckinModal(show: boolean) {
  checkinStore.show = show
}

export const useCheckinStore = () => useSnapshot(checkinStore)

export const checkinStoreActions = {
  checkin,
  reloadCheckin
}
