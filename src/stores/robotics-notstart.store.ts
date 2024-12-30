import FrontierApi, { TaskDetail } from '@/apis/frontiter.api'
import { debounce } from 'lodash'
import { proxy } from 'valtio'
type RoboticsStore = {
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

export const roboticsStore = proxy<RoboticsStore>({
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

export const getRobotics = debounce(async (params: { page: number; page_size: number }) => {
  try {
    roboticsStore.pageData.listLoading = true
    const { page_size, page } = params
    const res = await FrontierApi.getTaskList({
      frontier_id: 'ROBSTIC001',
      page_size,
      page_num: page
    })
    roboticsStore.pageData.list = res.data ?? []
    roboticsStore.pageData.total = res.total_count
    roboticsStore.pageData.listLoading = false
  } catch (err) {
    roboticsStore.pageData.list = []
    roboticsStore.pageData.total = 0
    roboticsStore.pageData.listLoading = false
    throw err
  }
}, 500)

export function changeRoboticsFilter(data: Partial<RoboticsStore['pageData']>) {
  const pageData = {
    ...roboticsStore.pageData,
    ...data,
    page: data.page || 1
  }

  roboticsStore.pageData = pageData
  getRobotics({
    page_size: pageData.page_size,
    page: pageData.page
  })
}

export const getRoboticsHistory = debounce(async (params: { page: number }) => {
  try {
    roboticsStore.historyPageData.listLoading = true
    const { page } = params
    const res = await FrontierApi.getSubmissionList({
      page_size: roboticsStore.historyPageData.page_size,
      page_num: page
    })
    roboticsStore.historyPageData.list = res.data ?? []
    roboticsStore.historyPageData.total = res.total_count
    roboticsStore.historyPageData.listLoading = false
  } catch (err) {
    roboticsStore.historyPageData.list = []
    roboticsStore.historyPageData.total = 0
    roboticsStore.historyPageData.listLoading = false
    throw err
  }
}, 500)

export function changeRoboticsHistoryFilter(page: number) {
  roboticsStore.historyPageData.page = page

  getRoboticsHistory({
    page
  })
}
