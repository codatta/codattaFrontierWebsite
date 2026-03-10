import axios, { AxiosHeaders, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import CryptoJS from 'crypto-js'
import { authRedirect } from '@/utils/auth'

const md5Interceptor = (config: InternalAxiosRequestConfig<unknown>) => {
  const Timestamp = new Date().getTime()
  const salt = 'woshinibaba^***@113'
  // In development, we use relative baseURL '/api' for proxy, but the backend expects the signature
  // to be generated based on the full URL (or at least that's how it was configured before).
  // We prepend the host to match the previous behavior where baseURL was absolute in dev.
  const host = import.meta.env.MODE === 'production' ? '' : 'https://app-test.b18a.io'
  const requestUrl = `${host}${config.baseURL}${config.url}`
  const Signature = CryptoJS.MD5(requestUrl + Timestamp + salt).toString()
  if (!config.headers) config.headers = new AxiosHeaders()
  config.headers['Signature'] = Signature
  config.headers['Timestamp'] = Timestamp
  return config
}

const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  if (!config.headers) config.headers = new AxiosHeaders()
  config.headers['token'] = localStorage.getItem('token')
  config.headers['uid'] = localStorage.getItem('uid')
  return config
}

const baseResponseInterceptor = (res: AxiosResponse) => {
  if (res.data.success) {
    return res
  } else {
    if ([1003, 2011].includes(res.data.errorCode)) {
      localStorage.removeItem('uid')
      localStorage.removeItem('token')
      localStorage.removeItem('auth')

      const url = authRedirect()
      window.location.href = url
    }
    return Promise.reject(new Error(res.data?.errorMessage))
  }
}

const request = axios.create({
  baseURL: '/api'
})

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

export interface TPagination {
  current: number
  pageSize: number
  total?: number
}

export interface PaginationResponse<T> extends Response<T> {
  data: T
  total_count: number
  total_page: number
  page: number
}
