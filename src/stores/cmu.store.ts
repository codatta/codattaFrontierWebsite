import { proxy } from 'valtio'
import { useSnapshot } from 'valtio'
import frontiterApi, { CMUDataRequirements } from '@/apis/frontiter.api'

type TCMUStore = {
  taskList: CMUDataRequirements[]
  taskStatus: number | string
}

export const cmuStore = proxy<TCMUStore>({
  taskList: [],
  taskStatus: 0
})

export const useCMUStore = () => useSnapshot(cmuStore)

async function getTaskList(taskId: string) {
  const res = await frontiterApi.getTaskDetail(taskId)
  cmuStore.taskList = res.data.questions || []
  cmuStore.taskStatus = res.data.status

  return res.data.questions || []
}

export const cmuStoreActions = {
  getTaskList
}
