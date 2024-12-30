export function shortenAddress(address: string, len = 16) {
  if (!address) return ''
  if (address.length <= len) return address
  return `${address.slice(0, len / 2)}...${address.slice(-(len / 2))}`
}
