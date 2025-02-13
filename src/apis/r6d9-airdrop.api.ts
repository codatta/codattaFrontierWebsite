import { AxiosInstance } from 'axios'
import request from './r6d9-request'
import cookies from 'js-cookie'

export interface TResponse<T> {
  code: number
  data: T
  message: string
}

interface TAirDropInfo {
  id: number
  register_flag: number
  sol_address: string
}

class R6D9AirdropApi {
  constructor(private request: AxiosInstance) {}

  async getAirdropInfo() {
    const uid = cookies.get('uid') || localStorage.getItem('uid')
    const res = await this.request.post<TResponse<TAirDropInfo>>('/ad/account/info', { user_id: uid })
    return res.data
  }

  async linkSolAddress(sol_address: string) {
    const uid = cookies.get('uid') || localStorage.getItem('uid')
    const res = await this.request.post<TResponse<TAirDropInfo>>('/ad/account/register', { sol_address, user_id: uid })
    return res.data
  }
}

export default new R6D9AirdropApi(request)
