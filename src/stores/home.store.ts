import homeApi, { type IAnnouncement } from '@/api-v1/home.api'
import taskApi from '@/api-v1/task.api'
import { proxy, useSnapshot } from 'valtio'

export interface HomeStore {
  announcements: IAnnouncement[]
  // keyFeatures: Record<'validation' | 'submission' | 'hunting', IKeyFeatures>
  checkin: {
    days: number
    done: boolean
  }
  showCheckIn: boolean
}

export const homeStore = proxy<HomeStore>({
  announcements: [],
  // keyFeatures: {
  //   validation: null,
  //   submission: null,
  //   hunting: null,
  // },
  checkin: {
    days: 0,
    done: false
  },
  showCheckIn: false
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

export async function reloadCheckin() {
  try {
    const { check_in_days = 0, is_check_in = false } = await taskApi.getCheckinInfo()

    homeStore.checkin.days = check_in_days
    homeStore.checkin.done = is_check_in
  } catch (e) {
    console.error('getCheckinInfo: ', e.message)
  }
}

export async function updateCheckin() {
  const { check_in_days = 0 } = await taskApi.updateCheckin()

  homeStore.checkin.days = check_in_days
  homeStore.checkin.done = true
}

export async function showCheckInModal() {
  homeStore.showCheckIn = true
}

export async function closeCheckInModal() {
  homeStore.showCheckIn = false
}

const useHomeStore = () => {
  return useSnapshot(homeStore)
}

export default useHomeStore

export const homeStoreActions = {
  closeCheckInModal,
  showCheckInModal,
  updateCheckin,
  reloadCheckin,
  reloadAnnoucements
}
