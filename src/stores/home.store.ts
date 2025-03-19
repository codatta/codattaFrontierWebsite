import homeApi, { type IAnnouncement } from '@/api-v1/home.api'
import frontierApi from '@/apis/frontiter.api'
import { proxy, useSnapshot } from 'valtio'

export interface HomeStore {
  announcements: IAnnouncement[]
  // keyFeatures: Record<'validation' | 'submission' | 'hunting', IKeyFeatures>
}

export const homeStore = proxy<HomeStore>({
  announcements: []
  // keyFeatures: {
  //   validation: null,
  //   submission: null,
  //   hunting: null,
  // }
})

export async function reloadAnnoucements() {
  const data = await homeApi.getAnnouncement()
  homeStore.announcements = data.data

  return data
}

// export async function reloadKeyFeatures() {
//   const data = await homeApi.getKeyFeatures()
//   const map = keyBy(data, 'name')

//   homeStore.keyFeatures = {
//     validation: map.key_features_validation,
//     submission: map.key_features_submission,
//     hunting: map.key_features_bounty,
//   }

//   return data
// }

const useHomeStore = () => {
  return useSnapshot(homeStore)
}

export default useHomeStore

export const homeStoreActions = {
  reloadAnnoucements
}
