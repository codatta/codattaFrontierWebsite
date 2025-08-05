export function capitalizeFirstLetter(str: string = ''): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function splitTitle(str: string): string {
  return str.split(/(?=[A-Z])/).join(' ')
}

export function formatNumber(num: number = 0): string {
  let numStr: string = num.toString()

  numStr = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return numStr
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
