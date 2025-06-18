import { proxy, useSnapshot } from 'valtio'

import boosterApi from '@/apis/booster.api'

export interface BoosterStore {
  pageLoading: boolean
  loading: boolean
  status: 0 | 1 | 2 // 0 not start, 1 in progress, 2 done
}

const boosterStore = proxy<BoosterStore>({
  pageLoading: false,
  loading: false,
  status: 0
})

export const useBoosterStore = () => useSnapshot(boosterStore)

export async function getTaskInfo(task_id: string) {
  boosterStore.pageLoading = true
  const { data } = await boosterApi.getTaskInfo(task_id)
  boosterStore.status = data.status
  boosterStore.pageLoading = false
}

export async function submitTask(task_id: string, content?: string) {
  boosterStore.loading = true
  const { data } = await boosterApi.submitTask(task_id, content)
  boosterStore.loading = false
  boosterStore.status = data.status === 1 ? 2 : boosterStore.status
}
