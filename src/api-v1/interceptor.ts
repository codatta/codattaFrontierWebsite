import {
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import CryptoJS from 'crypto-js'

export const md5Interceptor = (config: InternalAxiosRequestConfig<unknown>) => {
  const Timestamp = new Date().getTime()
  const salt = 'woshinibaba^***@113'
  const requestUrl = `${config.baseURL}${config.url}`
  const Signature = CryptoJS.MD5(requestUrl + Timestamp + salt).toString()
  if (!config.headers) config.headers = new AxiosHeaders()
  config.headers['Signature'] = Signature
  config.headers['Timestamp'] = Timestamp
  return config
}

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  if (!config.headers) config.headers = new AxiosHeaders()
  config.headers['token'] = localStorage.getItem('token')
  config.headers['uid'] = localStorage.getItem('uid')
  return config
}

export const baseResponseInterceptor = (res: AxiosResponse) => {
  if (res.data.success) {
    return res
  } else {
    if (res.data.errorCode === 1003) {
      localStorage.removeItem('uid')
      localStorage.removeItem('token')
      localStorage.removeItem('auth')

      const redirect = window.location.href
      window.location.href = `/account/signin?from=${encodeURIComponent(redirect)}`
    }
    return Promise.reject(new Error(res.data?.errorMessage))
  }
}
