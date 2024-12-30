import validationApi, { TValidationItem } from '@/api-v1/validation.api'
import { debounce } from 'lodash'
import { proxy } from 'valtio'

export enum TaskType {
  SUBMISSION_PRIVATE = 'SUBMISSION_PRIVATE',
  SUBMISSION_HASH_ADDRESS = 'SUBMISSION_HASH_ADDRESS',
  SUBMISSION_IMAGE_ADDRESS = 'SUBMISSION_IMAGE_ADDRESS',
  SUBMISSION_IMAGE_ENTITY = 'SUBMISSION_IMAGE_ENTITY',
  SUBMISSION_ONLY_IMAGE = 'SUBMISSION_ONLY_IMAGE',
  SUBMISSION_ALL = ''
}

export type TValidationFilterStore = {
  paramsData: {
    status: string
    stage: 2 | 3
    network: string
    // category: string
    // entity: string
    address: string
    sort: 'DESC' | 'ASC' // ASC
    type: 'Date' | 'Point' // Point
    // decision: ''
    // data_type: ''
    task_type?: string
  }
  pageData: {
    list: TValidationItem[]
    total: number
    listLoading: boolean
    page_size: number
    page: number
  }
  topData: {
    list: TValidationItem[]
    listLoading: boolean
  }
  downData: {
    list: TValidationItem[]
    listLoading: boolean
  }
}

export const validationFilterStore = proxy<TValidationFilterStore>({
  paramsData: {
    status: 'InProgress',
    stage: 2,
    network: '',
    address: '',
    sort: 'ASC', // ASC
    task_type: TaskType.SUBMISSION_ALL,
    type: 'Date'
  },
  pageData: {
    list: [],
    total: 0,
    listLoading: false,
    page_size: 18,
    page: 1
  },
  topData: {
    list: [],
    listLoading: false
  },
  downData: {
    list: [],
    listLoading: false
  }
})

export let tempGetValidationListParams = {
  status: 'InProgress',
  page: 1,
  page_size: 20
}

export const getValidations = debounce(
  async (params: {
    status: string
    decision?: string
    page: number
    page_size: number
    stage?: number
    task_type?: string
  }) => {
    try {
      validationFilterStore.pageData.listLoading = true
      tempGetValidationListParams = params
      const { task_type, ...otherParams } = params
      const res = await validationApi.getValidationList({
        ...otherParams,
        ...(typeof task_type === 'string' ? { task_type } : {})
      })
      validationFilterStore.pageData.list = res.data ?? []
      validationFilterStore.pageData.total = res.total_count
      validationFilterStore.pageData.listLoading = false

      console.log('get filtered data', res.data)
    } catch (err) {
      validationFilterStore.pageData.list = []
      validationFilterStore.pageData.total = 0
      validationFilterStore.pageData.listLoading = false
      throw err
    }
  },
  500
)

export const getTopValidations = debounce(async () => {
  try {
    validationFilterStore.topData.listLoading = true
    const res = await validationApi.getValidationList({
      task_type: TaskType.SUBMISSION_HASH_ADDRESS,
      page: 1,
      page_size: 18,
      status: 'NotStart',
      sort: 'DESC',
      type: 'Date',
      stage: 2
    })
    validationFilterStore.topData.list = res.data ?? []
    validationFilterStore.topData.listLoading = false
  } catch (err) {
    validationFilterStore.topData.listLoading = false
    throw err
  }
}, 500)

export const getDownValidations = debounce(async () => {
  try {
    validationFilterStore.downData.listLoading = true
    const res = await validationApi.getValidationList({
      task_type: TaskType.SUBMISSION_ONLY_IMAGE,
      page: 1,
      page_size: 18,
      status: 'NotStart',
      sort: 'DESC',
      type: 'Date',
      stage: 2
    })
    validationFilterStore.downData.list = res.data ?? []
    validationFilterStore.downData.listLoading = false
  } catch (err) {
    validationFilterStore.downData.listLoading = false
    throw err
  }
}, 500)

export function setPage(value: number) {
  validationFilterStore.pageData.page = value
}

export function resetFilterStore() {
  validationFilterStore.pageData = {
    list: [],
    total: 0,
    listLoading: false,
    page_size: 18,
    page: 1
  }
  validationFilterStore.paramsData = {
    status: 'InProgress',
    stage: 2,
    network: '',
    address: '',
    sort: 'ASC', // ASC
    task_type: TaskType.SUBMISSION_ALL,
    type: 'Date'
  }
}

export function changeValidationFilter(data: {
  pageData?: Partial<TValidationFilterStore['pageData']>
  paramsData?: Partial<TValidationFilterStore['paramsData']>
}) {
  const pageData = {
    ...validationFilterStore.pageData,
    ...data.pageData,
    page: data.pageData?.page || 1
  }
  const paramsData = {
    ...validationFilterStore.paramsData,
    ...data.paramsData
  }

  validationFilterStore.pageData = pageData
  validationFilterStore.paramsData = paramsData
  getValidations({
    ...paramsData,
    page_size: pageData.page_size,
    page: pageData.page
  })
}
