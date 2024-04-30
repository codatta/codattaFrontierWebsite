import axios from 'axios'

type TRequestConfig = {
  useCache?: boolean
  needAbort?: boolean
  [key: string]: any
}

const request = axios.create()
const commonHeaders = request.defaults.headers.common

// Get method with caching support
const get = async (url: string, params = {}) => {
  const response = await request.get(url, {
    params,
  })

  return response.data
}

// Post method with caching support
const post = async (url: string, data = {}) => {
  const response = await request.post(url, data)

  return response.data
}

const setToken = (token: string, userId: string) => {
  commonHeaders['Token'] = token
  commonHeaders['UID'] = userId
}

const clearToken = () => {
  delete commonHeaders['Token']
  delete commonHeaders['UID']
}

export { clearToken, get, post, setToken }
