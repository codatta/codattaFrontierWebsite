import { proxy } from 'valtio'
import { useSnapshot } from 'valtio'
// import userApi from '@/apis/user.api'

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

async function getNewJourneyLevels() {}

async function getNewJourneyQuests() {}

async function getNewJourneyReferral() {}

async function getNewJourneyPoints() {}

export const journeyStoreActions = {
  getNewJourneyLevels,
  getNewJourneyQuests,
  getNewJourneyReferral,
  getNewJourneyPoints
}
