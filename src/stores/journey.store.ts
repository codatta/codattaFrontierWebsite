import { proxy } from 'valtio'
import { useSnapshot } from 'valtio'
import { JourneyLevelItem } from '@/apis/user.api'

type TJourneyStore = {
  levels: JourneyLevelItem[]
}

export const journeyStore = proxy<TJourneyStore>({
  levels: []
})

export const useJourneyStore = () => useSnapshot(journeyStore)

async function getNewJourneyLevels() {
  // const res = await userApi.getNewJourneyLevels()
  // journeyStore.levels = res
}

async function getNewJourneyQuests() {}

async function getNewJourneyReferral() {}

async function getNewJourneyPoints() {}

export const journeyStoreActions = {
  getNewJourneyLevels,
  getNewJourneyQuests,
  getNewJourneyReferral,
  getNewJourneyPoints
}

export function useNewJourneyStore() {
  return useSnapshot(journeyStore)
}
