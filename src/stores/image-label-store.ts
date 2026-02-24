import { Frame } from '@/utils/media'
import { proxy, useSnapshot } from 'valtio'

interface ImageLabelStore {
  rect: {
    x: number // 0 ~1
    y: number // 0~1
    radius: number
    angle: number // 0~360
  }
  actionType: string
  focusPointVisible: boolean
  frame: Frame | null
}
const imageLabelStore = proxy<ImageLabelStore>({
  rect: {
    x: 0.5,
    y: 0.5,
    radius: 12,
    angle: 0
  },
  actionType: '',
  focusPointVisible: false,
  frame: null
})

export const updateRect = ({ x, y, angle, radius }: { x?: number; y?: number; angle?: number; radius?: number }) => {
  if (x !== undefined) imageLabelStore.rect.x = x
  if (y !== undefined) imageLabelStore.rect.y = y
  if (angle !== undefined) imageLabelStore.rect.angle = angle
  if (radius !== undefined) imageLabelStore.rect.radius = radius
}

export const toggleFocusPoint = (visible: boolean) => {
  imageLabelStore.focusPointVisible = visible
}

export function setFrameToLabel(frame: Frame) {
  imageLabelStore.frame = frame
}

const useImageLabelStore = () => {
  return useSnapshot(imageLabelStore)
}

export default useImageLabelStore
