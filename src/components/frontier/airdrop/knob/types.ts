export interface Point {
  x: number
  y: number
}

export interface Rect {
  x1: number
  y1: number
  x2: number
  y2: number
  x3: number
  y3: number
  x4: number
  y4: number
  center?: Point
}

export interface KnobFormData {
  original_image: string | null
  original_image_hash: string | null
  annotated_image: string | null
  annotated_image_hash: string | null
  rect: Rect | null
  pointer_point: Point | null
  scale_value: string
}
