export type ResultType = 'PENDING' | 'REJECT' | 'ADOPT'
export type FormData = {
  front_view_images: { url: string; hash: string }[]
  side_view_images: { url: string; hash: string }[]
  app_type: string
  scale_type: string
  scale_value: string
}
