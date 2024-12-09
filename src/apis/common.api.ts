import axios, { AxiosInstance } from 'axios'

const request = axios.create({
  baseURL: 'https://app.codatta.io/api',
  timeout: 60000
})

class CommonApi {
  constructor(private request: AxiosInstance) {}

  async uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    const res = await this.request.post<{
      file_path: string
      original_name: string
    }>('/file/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { content_type: file.type }
    })

    return res.data
  }
}

export default new CommonApi(request)
