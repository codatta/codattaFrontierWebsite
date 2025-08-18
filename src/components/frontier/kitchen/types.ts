export type ResultType = 'PENDING' | 'REJECT' | 'ADOPT'
export type FormData = {
  front_view_images: { url: string; hash: string }[]
  side_view_images: { url: string; hash: string }[]
  app_type: string
  text_on_knob: string
}
