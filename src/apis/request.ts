import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import cookies from 'js-cookie'

const request = axios.create({
  baseURL: '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
})

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const token = cookies.get('token') || localStorage.getItem('token')
  const uid = cookies.get('uid') || localStorage.getItem('uid')
  config.headers.Authorization = `${token}`
  config.headers['uid'] = `${uid}`
  return config
}

function baseResponseInterceptor(res: AxiosResponse) {
  if (res.data.data?.code !== '0000') {
    return Promise.reject(res.data)
  }
  return res
}

function errorResponseInterceptor(err: AxiosError) {
  if (err.status === 401) {
    const redirect = window.location.href
    window.location.href =
      '/account/login?redirect=' + encodeURIComponent(redirect)
  }
  return Promise.reject(err)
}

request.interceptors.request.use(authRequestInterceptor)
request.interceptors.response.use(
  baseResponseInterceptor,
  errorResponseInterceptor
)

export default request
