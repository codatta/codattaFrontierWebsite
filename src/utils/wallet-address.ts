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
