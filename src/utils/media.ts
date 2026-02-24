/**
 * Media processing utilities (GIF, images, etc.)
 */

import { parseGIF, decompressFrames } from 'gifuct-js'
import axios from 'axios'

export interface Frame {
  data: Uint8ClampedArray
  width: number
  height: number
}

export async function loadGifFrames(url: string, onProgress?: (progress: number) => void): Promise<Frame[]> {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    onDownloadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = progressEvent.loaded / progressEvent.total
        onProgress(percentCompleted)
      }
    }
  })
  const arrayBuffer = response.data
  const gif = parseGIF(arrayBuffer)
  const frames = decompressFrames(gif, true)
  return frames.map((frame) => ({
    data: frame.patch,
    width: frame.dims.width,
    height: frame.dims.height
  }))
}

export function getGifFrameUrl(
  frame: Frame,
  options?: {
    maxWidth: number
    maxHeight: number
    quality: number
  }
): string {
  if (!frame) {
    return ''
  }

  const scale = Math.min(1, (options?.maxWidth || 320) / frame.width, (options?.maxHeight || 240) / frame.height)
  const scaledWidth = Math.round(frame.width * scale)
  const scaledHeight = Math.round(frame.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = scaledWidth
  canvas.height = scaledHeight
  const ctx = canvas.getContext('2d')

  if (ctx) {
    const imageData = new ImageData(new Uint8ClampedArray(frame.data), frame.width, frame.height)

    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = frame.width
    tempCanvas.height = frame.height
    const tempCtx = tempCanvas.getContext('2d')

    if (tempCtx) {
      tempCtx.putImageData(imageData, 0, 0)
      ctx.drawImage(tempCanvas, 0, 0, scaledWidth, scaledHeight)
      return canvas.toDataURL('image/jpeg', options?.quality || 0.8)
    }
  }

  return ''
}
