export function validateTxHash(hash: string): boolean {
  if (!hash || typeof hash !== 'string') {
    return false
  }
  const hexRegex = /^(?:0x)?[a-f0-9]{64}$/i
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{60,90}$/

  return hexRegex.test(hash) || base58Regex.test(hash)
}
export function validateCryptoAddress(address: string): boolean {
  if (!address || typeof address !== 'string') {
    return false
  }

  const regex = /^[a-zA-Z0-9]{25,}$/

  return regex.test(address)
}
