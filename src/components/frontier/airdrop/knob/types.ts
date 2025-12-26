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
  originalImage: string | null
  annotatedImage: string | null
  rectCoordinates: Rect | null
  centerCoordinates: Point | null
  pointerCoordinates: Point | null
  scaleValue: string
}
