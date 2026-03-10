import configApi, { type TCategoryDict } from '@/api-v1/config.api'
import { proxy, useSnapshot } from 'valtio'
import { derive } from 'derive-valtio'

interface TConfigStore {
  networks: string[]
  categories: TCategoryDict[]
  entities: string[]
}

export const dicts = proxy<TConfigStore>({
  networks: [],
  categories: [],
  entities: []
})

export interface CategoryOption {
  value: string
  label: string
  children?: CategoryOption[]
  disableCheckbox?: boolean
  isLeaf?: boolean
  description?: string
}

const categoryParentMap = new Map<string, string>()
const categoryDesMap = new Map<string, string>()

export const options = derive({
  networks: (get) => getOptionFromStringDict(sortByFirstLetter(get(dicts).networks)),
  entities: (get) => getOptionFromStringDict(sortByFirstLetter(get(dicts).entities)),
  categories: (get): CategoryOption[] => {
    const data = get(dicts).categories
    categoryParentMap.clear()
    categoryDesMap.clear()
    return data.map(({ children, key: parentKey }) => ({
      value: parentKey,
      label: parentKey,
      disableCheckbox: true,
      children: [
        ...children.map(({ display_name, description, key: _childKey }) => {
          categoryParentMap.set(display_name, parentKey)
          categoryDesMap.set(display_name, description)

          return {
            value: display_name,
            label: display_name,
            isLeaf: true,
            description
          }
        })
      ].sort((a, b) => a.label.localeCompare(b.label))
    }))
  }
})

export function getCategoryValueByChild(category: string) {
  const item = categoryParentMap.get(category)
  if (!item) return null
  return [item, category]
}

export function getCategoryDesByName(category: string) {
  return categoryDesMap.get(category)
}

function getOptionFromStringDict(dict: string[]) {
  return dict?.map((dict) => ({ label: dict, value: dict }))
}

function sortByFirstLetter(arr: string[]) {
  return arr.sort((a, b) => a.localeCompare(b))
}

const loadingStatus = {
  loadingCategories: false,
  loadingEntities: false,
  loadingNetworks: false
}

function initDicts() {
  if (!dicts.categories.length && !loadingStatus.loadingCategories) {
    loadingStatus.loadingCategories = true
    configApi
      .getCategoryDict()
      .then((data) => {
        dicts.categories = data.data
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        loadingStatus.loadingCategories = false
      })
  }

  if (!dicts.entities.length && !loadingStatus.loadingEntities) {
    loadingStatus.loadingEntities = true
    configApi
      .getEntities()
      .then((data) => {
        dicts.entities = data.data
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        loadingStatus.loadingEntities = false
      })
  }

  if (!dicts.networks.length && !loadingStatus.loadingNetworks) {
    loadingStatus.loadingNetworks = true
    configApi
      .getNetworks()
      .then((data) => {
        dicts.networks = data.data
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        loadingStatus.loadingNetworks = false
      })
  }
}

export function useOptions() {
  initDicts()
  return useSnapshot(options)
}

export function useDicts() {
  initDicts()
  return useSnapshot(dicts)
}

export const configStoreActions = {
  getCategoryValueByChild,
  getCategoryDesByName
}
