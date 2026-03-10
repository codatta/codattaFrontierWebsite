import request, { Response } from './request'

export interface TCategoryDict {
  children: {
    display_name: string
    description: string
    key: string
  }[]
  key: string
}

class ConfigApi {
  async getNetworks() {
    const res = await request.post<Response<string[]>>('/config/networks')
    return res.data
  }

  async getCategoryDict() {
    const res = await request.post<Response<TCategoryDict[]>>('/config/categories', { entity: null })
    return res.data
  }

  async getEntities() {
    return (await request.post<Response<string[]>>('/config/entries')).data
  }
}

const configApi = new ConfigApi()

export default configApi
