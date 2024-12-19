import {
  TSubmitValidationParams,
  TValidationItem
} from '@/api-v1/validation.api'
import validationApi from '@/api-v1/validation.api'
import { debounce } from 'lodash'
import { proxy } from 'valtio'
type ValidationDetailStore = {
  list: TValidationItem[]
  homeList: TValidationItem[]

  total: number
  listLoading: boolean
  inCreation: boolean
  open: boolean
  selectedItem: TValidationItem | null
}

export const validationDetailStore = proxy<ValidationDetailStore>({
  list: [],
  homeList: [],
  total: 0,
  listLoading: false,
  inCreation: false,
  selectedItem: null,
  open: false
})

export let tempGetValidationListParams = {
  status: 'NotStart',
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
  }) => {
    try {
      validationDetailStore.listLoading = true
      tempGetValidationListParams = params
      const res = await validationApi.getValidationList(params)
      validationDetailStore.list = res.data ?? []
      validationDetailStore.total = res.total_count
      validationDetailStore.listLoading = false

      if (!validationDetailStore.homeList.length) {
        validationDetailStore.homeList = res.data ?? []
      }
    } catch (err) {
      validationDetailStore.listLoading = false
      throw err
    }
  },
  500
)

export async function createValidation(params: TSubmitValidationParams) {
  try {
    validationDetailStore.inCreation = true
    await validationApi.validate(params)
    validationDetailStore.inCreation = false
    // await getValidations(tempGetValidationListParams)
  } catch (err) {
    validationDetailStore.inCreation = false
    throw err
  }
}

export const setSelectedItem = (item: TValidationItem | null) => {
  validationDetailStore.selectedItem = item
}

export function setOpen(open: boolean) {
  validationDetailStore.open = open
}
