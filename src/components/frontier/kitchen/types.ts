export type ResultType = 'PENDING' | 'REJECT' | 'ADOPT'
export type FormData = {
  front_images: { url: string; hash: string }[]
  multi_angle_images: { url: string; hash: string }[]
  app_type: string
  text_on_knob: string
}
