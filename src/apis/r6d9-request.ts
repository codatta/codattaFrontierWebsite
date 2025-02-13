import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import cookies from 'js-cookie'

export interface TResponse<T> {
  code: number
  data: T
  message: string
}

const request = axios.create({
  baseURL: '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
})

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const token = cookies.get('token') || localStorage.getItem('token')
  config.headers.Token = `${token}`
  return config
}

function baseResponseInterceptor(res: AxiosResponse) {
  if (res.data.code !== 0) {
    const error = new AxiosError(res.data.message, res.data.code, res.config, res.request, res)
    return Promise.reject(error)
  }
  return res
}

function errorResponseInterceptor(err: AxiosError) {
  if (err.status === 401) {
    const redirect = window.location.href
    window.location.href = '/account/login?redirect=' + encodeURIComponent(redirect)
  }
  return Promise.reject(err)
}

request.interceptors.request.use(authRequestInterceptor)
request.interceptors.response.use(baseResponseInterceptor, errorResponseInterceptor)

export default request
