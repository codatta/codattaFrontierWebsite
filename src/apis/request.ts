import { authRedirect } from '@/utils/auth-redirect'
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import cookies from 'js-cookie'

const request = axios.create({
  baseURL: '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
})

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const token = cookies.get('auth') || localStorage.getItem('auth')
  config.headers['token'] = `${token}`
  return config
}

function baseResponseInterceptor(res: AxiosResponse) {
  if (res.data?.success !== true || res.data?.errorCode !== 0) {
    const error = new AxiosError(res.data?.errorMessage, res.data?.errorCode, res.config, res.request, res)
    return Promise.reject(error)
  } else {
    return res
  }
}

function errorResponseInterceptor(err: AxiosError) {
  if (err.status === 401) {
    localStorage.removeItem('uid')
    localStorage.removeItem('token')
    localStorage.removeItem('auth')

    const url = authRedirect()
    window.location.href = url
  }
  return Promise.reject(err)
}

request.interceptors.request.use(authRequestInterceptor)
request.interceptors.response.use(baseResponseInterceptor, errorResponseInterceptor)

export default request

export interface Response<T> {
  data: T
  success: true
  errorCode: 0
  errorMessage: string
}

export interface PaginationParam {
  page: number
  page_size: number
}

export interface PaginationResponse<T> extends Response<T> {
  data: T
  total_count: number
  total_page: number
  page: number
}

export interface TPagination {
  page_size: number
  page_num: number
}
