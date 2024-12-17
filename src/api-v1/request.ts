import axios from 'axios'
import {
  baseResponseInterceptor,
  requestInterceptor,
  md5Interceptor
} from './interceptor'

const request = axios.create({ baseURL: '/api' })

request.interceptors.request.use(md5Interceptor)
request.interceptors.request.use(requestInterceptor)
request.interceptors.response.use(baseResponseInterceptor)

export interface Response<T> {
  data: T
  success: true
  errorCode: 0
  errorMessage: string
}

export default request

export interface PaginationParam {
  page?: number
  page_size?: number
}

export interface PaginationResponse<T> extends Response<T> {
  data: T
  total_count: number
  total_page: number
  page: number
}
