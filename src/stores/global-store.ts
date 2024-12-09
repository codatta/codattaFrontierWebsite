import { proxy, useSnapshot } from 'valtio'

export interface TGlobal {

}


const globalStore = proxy<{
}>({
})


export function useGlobal() {
  return useSnapshot(globalStore)
}

