import userApi from '@/apis/user.api'
import { proxy, useSnapshot } from 'valtio'

const queryString = new URLSearchParams(window.location?.search)
const inviterCode = queryString.get('_ic')
const channelCode = queryString.get('_ch')

// for biz channel only
const goplus_address = queryString.get('goplus_address')
let related_info: object | undefined = undefined
if (goplus_address) {
  related_info = {
    goplus_address: goplus_address
  }
}

interface ChannelStore {
  channel: string
  inviterCode: string
  relatedInfo?: object
}

const channelStore = proxy<ChannelStore>({
  channel: channelCode || 'codatta-platform-website',
  inviterCode: inviterCode || '',
  relatedInfo: related_info
})

export function useChannelStore() {
  return useSnapshot(channelStore)
}

function setChannelCode(code: string) {
  channelStore.channel = code
}

function setInviterCode(code: string) {
  channelStore.inviterCode = code
}

function setRelatedInfo(info: object) {
  channelStore.relatedInfo = info
}

async function updateRelatedInfo(info: object) {
  await userApi.updateRelatedInfo(info)
}

export const channelStoreActions = {
  setChannelCode,
  setInviterCode,
  setRelatedInfo,
  updateRelatedInfo
}
