import submissionApi, { TSubmissionItem } from '@/api-v1/submission.api'
import { proxy, useSnapshot } from 'valtio'

type SubmissionStore = {
  list: TSubmissionItem[]
  homeList: TSubmissionItem[]

  total: number
  listLoading: boolean
  inCreation: boolean
  isShowSubmissionModel: boolean
  isShowDetailModel: boolean
  selectedItem: TSubmissionItem | null
  // initialValue: any
  // homeCategories: any[]
}

export const submissionStore = proxy<SubmissionStore>({
  // initialValue: null,
  isShowSubmissionModel: false,
  isShowDetailModel: false,
  selectedItem: null,
  list: [],
  homeList: [],
  total: 0,
  listLoading: false,
  inCreation: false
  // homeCategories: []
})

export let tempGetSubmissionListParams = { filter: 'ALL', page: 1, page_size: 20 }

export function setSelectedItem(item: TSubmissionItem) {
  submissionStore.selectedItem = item
}

export function showDetailModal(show: boolean) {
  submissionStore.isShowDetailModel = show
}

// export function showSubmissionModal(initialValue: any = null) {
//   submissionStore.isShowSubmissionModel = true
//   submissionStore.initialValue = initialValue
// }

// export function closeSubmissionModal() {
//   submissionStore.isShowSubmissionModel = false
//   submissionStore.initialValue = null
// }

export async function getSubmissions(params: { filter: string; page: number; page_size: number }) {
  try {
    submissionStore.listLoading = true
    tempGetSubmissionListParams = params
    const res = await submissionApi.getSubmissions(params)
    submissionStore.list = res.data ?? []
    submissionStore.total = res.total_count || 0
    submissionStore.listLoading = false

    //  get top 5 items from list to homeList
    submissionStore.homeList = submissionStore.list.slice(0, 5)
  } catch (err) {
    submissionStore.listLoading = false
    throw err
  }
}

interface CreateSubmissionParams {
  network: string
  address: string
  category: string
  entity: string
  evidence: {
    text: string
    link: string
    hash: string
    files: { filename: string; path: string }[]
  }
}

export async function createSubmission(params: CreateSubmissionParams) {
  try {
    submissionStore.inCreation = true
    const res = await submissionApi.createSubmission(params)
    submissionStore.inCreation = false

    getSubmissions(tempGetSubmissionListParams)
    return res
  } catch (err) {
    submissionStore.inCreation = false
    throw err
  }
}

// async function getHomeCategories() {
//   const res = await submissionApi.getSubmissionHomeCategories()
//   submissionStore.homeCategories = res.data
//   return res
// }

export function useSubmissionStore() {
  return useSnapshot(submissionStore)
}

export const submissionStoreActions = {
  getSubmissions,
  setSelectedItem,
  showDetailModal,
  // showSubmissionModal,
  // closeSubmissionModal,
  createSubmission
  // getHomeCategories
}
