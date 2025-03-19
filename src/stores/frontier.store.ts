import frontierApi, { TaskDetail } from '@/apis/frontiter.api'
import { debounce } from 'lodash'
import { proxy } from 'valtio'
import { message } from 'antd'

type FrontiersStore = {
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
}

export const frontiersStore = proxy<FrontiersStore>({
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
  }
})

export const getFrontiersTaskList = debounce(
  async (params: { page: number; page_size: number; frontier_id: string }) => {
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
  },
  500
)

export function changeFrontiersFilter(
  data: Partial<FrontiersStore['pageData']> & {
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

export const getFrontiersHistory = debounce(async (params: { page: number; frontier_id: string }) => {
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

export function changeFrontiersHistoryFilter(page: number, frontier_id: string) {
  frontiersStore.historyPageData.page = page
  getFrontiersHistory({
    frontier_id,
    page
  })
}

export async function getFrontiers() {
  const data = await frontierApi.getFrontiers()
  return data
}
