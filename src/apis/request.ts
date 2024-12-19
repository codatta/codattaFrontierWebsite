import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import cookies from 'js-cookie'

const request = axios.create({
  baseURL: '/api/v2',
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
  if (res.data?.success !== true) {
    const error = new AxiosError(
      res.data?.errorMessage,
      res.data?.errorCode,
      res.config,
      res.request,
      res
    )
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

    const redirect = window.location.href
    window.location.href = `/account/signin?from=${encodeURIComponent(redirect)}`
  }
  return Promise.reject(err)
}

request.interceptors.request.use(authRequestInterceptor)
request.interceptors.response.use(
  baseResponseInterceptor,
  errorResponseInterceptor
)

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
