import validationApi, { TValidationItem } from '@/api-v1/validation.api'
import { debounce } from 'lodash'
import { proxy } from 'valtio'

type ValidationFilterStore = {
  topData: {
    list: TValidationItem[]
    listLoading: boolean
  }
  page: number
  stage: number
}

export const validationFilterStore = proxy<ValidationFilterStore>({
  topData: {
    list: [],
    listLoading: false
  },
  page: 0,
  stage: 2
})

export const getValidations = debounce(async ({ page }) => {
  try {
    validationFilterStore.topData.listLoading = true
    const res = await validationApi.getValidationList({
      page,
      page_size: 30,
      status: 'NotStart',
      sort: 'DESC',
      type: 'Date',
      stage: validationFilterStore.stage
    })
    const list = res.data ?? []
    validationFilterStore.page = page
    validationFilterStore.topData.list = page === 1 ? list : [...validationFilterStore.topData.list, ...list]
    validationFilterStore.topData.listLoading = false
  } catch (err) {
    console.log(err)
    validationFilterStore.topData.listLoading = false
    throw err
  }
}, 500)

export const setStage = (value: number) => {
  validationFilterStore.stage = value
  validationFilterStore.page = 0
  validationFilterStore.topData.list = []
}
