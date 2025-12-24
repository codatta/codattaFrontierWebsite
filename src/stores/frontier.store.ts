import frontierApi, {
  FrontierListItem,
  TaskDetail,
  // SubmissionStatics,
  SubmissionRecord,
  FrontierActivityInfoItem,
  ActiveStatus,
  TaskType
} from '@/apis/frontiter.api'
import { debounce } from 'lodash'
import { proxy, useSnapshot } from 'valtio'
import { message } from 'antd'

type FrontierStore = {
  frontierList: FrontierListItem[]
  frontierActivities: FrontierActivityInfoItem[]
  pageData: {
    list: TaskDetail[]
    total: number
    listLoading: boolean
    page_size: number
    page: number
    task_types: TaskType[]
  }
  historyPageData: {
    list: TaskDetail[]
    total: number
    listLoading: boolean
    page_size: number
    page: number
  }
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
  frontierActivities: [],
  pageData: {
    list: [],
    total: 0,
    listLoading: false,
    page_size: 8,
    page: 1,
    task_types: ['submission', 'validation']
  },
  historyPageData: {
    list: [],
    total: 0,
    listLoading: false,
    page_size: 8,
    page: 1
  },
  userRecords: {
    list: [],
    total: 0,
    listLoading: false,
    page_size: 8,
    page: 1
  }
})

const getFrontiersTaskList = debounce(
  async (params: { page: number; page_size: number; frontier_id: string; task_types?: string }) => {
    try {
      frontiersStore.pageData.listLoading = true
      const { page_size, page, frontier_id, task_types = 'submission,validation' } = params
      const res = await frontierApi.getTaskList({
        frontier_id,
        page_size,
        page_num: page,
        task_types
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
  },
  500
)

function changeFrontiersFilter(
  data: Partial<FrontierStore['pageData']> & {
    frontier_id: string
    task_types?: string[]
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
    page: pageData.page,
    task_types: pageData.task_types?.join(',')
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

async function getFrontierList(channel: string) {
  const res = await frontierApi.getFrontiers(channel)
  frontiersStore.frontierList = res.data || []
  return res.data
}

async function getFrontierActivities(data: { frontier_id: string; status?: ActiveStatus }) {
  const res = await frontierApi.getFrontierActivityInfo({
    frontier_id: data.frontier_id,
    status: data.status
  })
  frontiersStore.frontierActivities = res.data || []
  return res.data
}

export function useFrontierStore() {
  return useSnapshot(frontiersStore)
}

// export const getFrontierUserStatics = debounce(async () => {
//   const res = await frontierApi.getSubmissionStatics()
//   frontiersStore.userStatics = Object.assign(frontiersStore.userStatics, res.data)
//   return res.data
// })

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
    message.error(err.message ?? 'Failed to get submission records')
    frontiersStore.userRecords.list = []
    frontiersStore.userRecords.total = 0
    frontiersStore.userRecords.listLoading = false
    throw err
  }
}, 500)

export const frontierStoreActions = {
  getFrontierList,
  getFrontierActivities,
  changeFrontiersFilter,
  changeFrontiersHistoryFilter,
  // getFrontierUserStatics,
  getFrontierUserRecords
}
