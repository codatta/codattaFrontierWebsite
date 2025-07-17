import frontierApi, { FrontierListItem, TaskDetail, SubmissionStatics, SubmissionRecord } from '@/apis/frontiter.api'
import { debounce } from 'lodash'
import { proxy, useSnapshot } from 'valtio'
import { message } from 'antd'

type FrontierStore = {
  frontierList: FrontierListItem[]
  pageData: {
    list: TaskDetail[]
    total: number
    listLoading: boolean
    page_size: number
    page: number
  }
  historyPageData: {
    list: TaskDetail[]
    total: number
    listLoading: boolean
    page_size: number
    page: number
  }
  userStatics: SubmissionStatics
  userRecords: {
    list: SubmissionRecord[]
    total: number
    listLoading: boolean
    page_size: number
    page: number
  }
}

export const frontiersStore = proxy<FrontierStore>({
  frontierList: [],
  pageData: {
    list: [],
    total: 0,
    listLoading: false,
    page_size: 5,
    page: 1
  },
  historyPageData: {
    list: [],
    total: 0,
    listLoading: false,
    page_size: 5,
    page: 1
  },
  userStatics: {
    total_submissions: 0,
    total_rewards: 0,
    on_chained: 0,
    avg_score: 0
  },
  userRecords: {
    list: [],
    total: 0,
    listLoading: false,
    page_size: 5,
    page: 1
  }
})

const getFrontiersTaskList = debounce(async (params: { page: number; page_size: number; frontier_id: string }) => {
  try {
    frontiersStore.pageData.listLoading = true
    const { page_size, page, frontier_id } = params
    const res = await frontierApi.getTaskList({
      frontier_id,
      page_size,
      page_num: page
    })
    frontiersStore.pageData.list = res.data ?? []
    frontiersStore.pageData.total = res.total_count
    frontiersStore.pageData.listLoading = false
  } catch (err) {
    message.error(err.message)
    frontiersStore.pageData.list = []
    frontiersStore.pageData.total = 0
    frontiersStore.pageData.listLoading = false
    throw err
  }
}, 500)

function changeFrontiersFilter(
  data: Partial<FrontierStore['pageData']> & {
    frontier_id: string
  }
) {
  const pageData = {
    ...frontiersStore.pageData,
    ...data,
    page: data.page || 1
  }

  frontiersStore.pageData = pageData
  getFrontiersTaskList({
    frontier_id: pageData.frontier_id,
    page_size: pageData.page_size,
    page: pageData.page
  })
}

const getFrontiersHistory = debounce(async (params: { page: number; frontier_id: string }) => {
  try {
    frontiersStore.historyPageData.listLoading = true
    const { page } = params
    const res = await frontierApi.getSubmissionList({
      frontier_id: params.frontier_id,
      page_size: frontiersStore.historyPageData.page_size,
      page_num: page
    })
    frontiersStore.historyPageData.list = res.data ?? []
    frontiersStore.historyPageData.total = res.total_count
    frontiersStore.historyPageData.listLoading = false
  } catch (err) {
    frontiersStore.historyPageData.list = []
    frontiersStore.historyPageData.total = 0
    frontiersStore.historyPageData.listLoading = false
    throw err
  }
}, 500)

function changeFrontiersHistoryFilter(page: number, frontier_id: string) {
  frontiersStore.historyPageData.page = page
  getFrontiersHistory({
    frontier_id,
    page
  })
}

async function getFrontierList() {
  const res = await frontierApi.getFrontiers()
  frontiersStore.frontierList = res.data || []
  return res.data
}

export function useFrontierStore() {
  return useSnapshot(frontiersStore)
}

export const getFrontierUserStatics = debounce(async () => {
  const res = await frontierApi.getSubmissionStatics()
  frontiersStore.userStatics = Object.assign(frontiersStore.userStatics, res.data)
  return res.data
})

export const getFrontierUserRecords = debounce(async (params: { page: number }) => {
  try {
    frontiersStore.userRecords.listLoading = true
    const { page } = params
    const res = await frontierApi.getSubmissionRecords({
      page_size: frontiersStore.userRecords.page_size,
      page_num: page
    })
    frontiersStore.userRecords.list = res.data ?? []
    frontiersStore.userRecords.total = res.total_count
    frontiersStore.userRecords.listLoading = false
  } catch (err) {
    message.error(err.message)
    frontiersStore.userRecords.list = []
    frontiersStore.userRecords.total = 0
    frontiersStore.userRecords.listLoading = false
    throw err
  }
}, 500)

export const frontierStoreActions = {
  getFrontierList,
  changeFrontiersFilter,
  changeFrontiersHistoryFilter,
  getFrontierUserStatics,
  getFrontierUserRecords
}
