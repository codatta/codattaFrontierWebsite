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

export default request
