import { proxy } from 'valtio'
import { useSnapshot } from 'valtio'
import userApi from '@/apis/user.api'

interface ILevel {
  points: number
}

type TJourneyStore = {
  levels: ILevel[]
}

export const journeyStore = proxy<TJourneyStore>({
  levels: []
})

export const useJourneyStore = () => useSnapshot(journeyStore)

async function getNewJourneyInfo() {
  const res = await userApi.getNewJourneyInfo()
}

export const journeyStoreActions = {
  getNewJourneyInfo
}
