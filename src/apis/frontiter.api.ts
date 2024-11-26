import { AxiosInstance } from 'axios'
import request from './request'

class frontier {
  constructor(private request: AxiosInstance) {}

  async getFrontierList() {
    const res = await this.request.get<string>('/example')
    return res.data
  }
}

export default new frontier(request)
