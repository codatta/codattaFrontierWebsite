/**
 * String and number formatting utilities
 */

export function capitalizeFirstLetter(str: string = ''): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function splitTitle(str: string): string {
  return str.split(/(?=[A-Z])/).join(' ')
}

export function formatNumber(num: number = 0, toFixed?: number): string {
  const numStr: string = toFixed == undefined ? Number(num).toString() : Number(num).toFixed(toFixed)

  const parts = numStr.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export function truncateStr(
  address: string,
  options?: {
    len?: number
    pos?: 'start' | 'middle' | 'end'
    ellipsis?: string
  }
): string {
  const { len = 16, pos = 'middle', ellipsis = '...' } = options || {}
  if (!address) return ''
  if (address.length <= len) return address

  const ellipsisLen = ellipsis.length
  const sliceLen = len - ellipsisLen

  switch (pos) {
    case 'start':
      return `${ellipsis}${address.slice(-sliceLen)}`
    case 'end':
      return `${address.slice(0, sliceLen)}${ellipsis}`
    case 'middle':
    default:
  }

  const halfSliceLen = Math.floor(sliceLen / 2)
  return `${address.slice(0, halfSliceLen)}${ellipsis}${address.slice(-halfSliceLen)}`
}

export function timeToUTC(time: string): string {
  return new Date(time).toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
}

export function shortenAddress(address: string, len = 16) {
  if (!address) return ''
  if (address.length <= len) return address
  return `${address.slice(0, len / 2)}...${address.slice(-(len / 2))}`
}

export function maskAddress(address: string, size = 4) {
  if (!address) return ''
  if (!address.startsWith('0x')) return address
  const body = address.slice(2)
  if (body.length <= 8) return address
  return `0x${body.slice(0, size)}…${body.slice(-size)}`
}

export const getTokenName = (token: string) => {
  if (token === 'XnYCoin') return 'XNY'
  return token
}
