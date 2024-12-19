import validationApi, {
  TSubmitValidationParams,
  TValidationItem
} from '@/api-v1/validation.api'
import { debounce } from 'lodash'
import { proxy } from 'valtio'
type ValidationStore = {
  list: TValidationItem[]
  homeList: TValidationItem[]

  total: number
  listLoading: boolean
  inCreation: boolean
  open: boolean
  selectedItem: TValidationItem | null
}

export const validationStore = proxy<ValidationStore>({
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
    task_type?: string
    sort?: string
    type?: string
  }) => {
    try {
      validationStore.listLoading = true
      tempGetValidationListParams = params
      const res = await validationApi.getValidationList(params)
      validationStore.list = res.data ?? []
      validationStore.total = res.total_count
      validationStore.listLoading = false

      if (!validationStore.homeList.length) {
        validationStore.homeList = res.data ?? []
      }
    } catch (err) {
      validationStore.listLoading = false
      throw err
    }
  },
  500
)

export async function createValidation(params: TSubmitValidationParams) {
  try {
    validationStore.inCreation = true
    await validationApi.validate(params)
    validationStore.inCreation = false
    await getValidations(tempGetValidationListParams)
  } catch (err) {
    validationStore.inCreation = false
    throw err
  }
}

export const setSelectedItem = (item: TValidationItem | null) => {
  validationStore.selectedItem = item
}

export function setOpen(open: boolean) {
  validationStore.open = open
}
