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

export function isValidEmail(email: string = ''): boolean {
  if (!email) return false
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return emailRegex.test(String(email).toLowerCase())
}

export function isValidGoogleEmail(email: string = ''): boolean {
  if (!isValidEmail(email)) return false
  const domain = email.split('@')[1]
  return domain === 'gmail.com' || domain === 'google.com'
}

export function isValidCryptoString(val: string, minLength: number = 20): boolean {
  if (!val) return false
  // Check length and allowed characters (alphanumeric, plus : for prefixes, - and _ for safety)
  return val.length >= minLength && /^[a-zA-Z0-9:\-_]+$/.test(val)
}
