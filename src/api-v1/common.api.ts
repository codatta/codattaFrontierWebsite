import { AxiosProgressEvent } from 'axios'
import request from './request'

interface uploadResponse {
  file_path: string
  original_name: string
  success: boolean
  errorCode: number
  errorMessage: string
}

const postFormData = async (
  url: string,
  formData: FormData,
  onProgress?: (event: AxiosProgressEvent) => void
): Promise<uploadResponse> => {
  const res = await request.post<uploadResponse>(url, formData, {
    params: { content_type: 'multipart/form-data' },
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress
  })
  return res.data
}

const commonApi = {
  uploadFile: async (
    file: File,
    onProgress?: (event: AxiosProgressEvent) => void
  ): Promise<{ file_path: string; original_name: string }> => {
    const formData = new FormData()

    formData.append('file', file)
    const data = await postFormData('/file/upload', formData, onProgress)
    return data
  }
}

export default commonApi
