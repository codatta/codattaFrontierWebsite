import { proxy } from 'valtio'
import { useSnapshot } from 'valtio'

import aiModelApi, { AIModelItem } from '@/apis/ai-model.api'

type ArenaStore = {
  modelList: AIModelItem[]
  loadingModelList: boolean
}

export const arenaStore = proxy<ArenaStore>({
  modelList: [],
  loadingModelList: false
})

export async function getModelList() {
  try {
    arenaStore.loadingModelList = true
    const res = await aiModelApi.getModelList()
    arenaStore.modelList = res.data.sort((a, b) => a.show_name.localeCompare(b.show_name))
  } catch (e) {
    console.error('getModelList: ', e.message)
  }
  arenaStore.loadingModelList = false
}

export const useArenaStore = () => useSnapshot(arenaStore)

export const arenaStoreActions = {
  getModelList
}
