import { proxy, useSnapshot } from 'valtio'

import boosterApi from '@/apis/booster.api'

export interface BoosterStore {
  loading: boolean
  status: 0 | 1 | 2 // 0 not start, 1 in progress, 2 done
}

const boosterStore = proxy<BoosterStore>({
  loading: false,
  status: 0
})

export const useBoosterStore = () => useSnapshot(boosterStore)

export async function getTaskInfo(task_id: string) {
  const { data } = await boosterApi.getTaskInfo(task_id)
  boosterStore.status = data.status
}

export async function submitTask(task_id: string, content?: string) {
  const { data } = await boosterApi.submitTask(task_id, content)
  boosterStore.status = data.status
}
