import { Upload, type UploadProps } from 'antd'

const UPLOAD_ACTION = '/api/file/upload?content_type=multipart/form-data'

export default function FileUpload(
  props: UploadProps & {
    value?: FileValue[]
    onChange?: (files: FileValue[]) => void
  }
) {
  const { children, onChange, value, ...restProps } = props
  const defaultProps: UploadProps = {
    action: UPLOAD_ACTION,
    onChange: ({ fileList }) => {
      onChange?.(
        fileList
          .filter(({ status }) => status === 'done')
          .map(({ response }) => ({
            name: response.original_name,
            path: response.file_path
          }))
      )
    },
    defaultFileList: value?.map(({ name, path }, index) => ({
      uid: index + '',
      name,
      url: path
    }))
  }
  const _props = Object.assign({}, defaultProps, restProps)
  return <Upload {..._props}>{children}</Upload>
}

export interface FileValue {
  name: string
  path: string
}
