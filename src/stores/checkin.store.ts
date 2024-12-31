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
  show: true
})

export async function reloadCheckin() {
  try {
    checkinStore.loading = true
    const { check_in_days = 0, is_check_in = false } = await taskApi.getCheckinInfo()

    checkinStore.days = check_in_days
    checkinStore.done = is_check_in
  } catch (e) {
    console.error('getCheckinInfo: ', e.message)
  }
  checkinStore.loading = false
}

export function toggleCheckinModal(show: boolean) {
  checkinStore.show = show
}

export const useCheckinStore = () => useSnapshot(checkinStore)
