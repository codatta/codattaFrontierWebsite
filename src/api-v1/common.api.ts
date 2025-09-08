import { AxiosProgressEvent } from 'axios'
import request from './request'

interface SendCodeResponse {
  success: boolean
  message?: string
}

interface uploadResponse {
  file_path: string
  original_name: string
  success: boolean
  errorCode: number
  errorMessage: string
}

const postFormData = async (
  url: string,
  fileType: string,
  formData: FormData,
  onProgress?: (event: AxiosProgressEvent) => void
): Promise<uploadResponse> => {
  const res = await request.post<uploadResponse>(url, formData, {
    params: { content_type: fileType },
    headers: { 'Content-Type': fileType },
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
    const data = await postFormData('/file/upload', file.type, formData, onProgress)
    return data
  },
  sendVerificationCode: async (email: string): Promise<SendCodeResponse> => {
    const res = await request.post<SendCodeResponse>('/user/send_code', { email })
    return res.data
  }
}

export default commonApi
