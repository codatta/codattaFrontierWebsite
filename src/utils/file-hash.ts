export async function calculateFileHash(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')

    return hashHex
  } catch (error) {
    throw new Error(`Failed to calculate file hash: ${error.message}`)
  }
}

export async function calculateMultipleFileHashes(files: File[]): Promise<Array<{ file: File; hash: string }>> {
  const promises = files.map(async (file) => ({
    file,
    hash: await calculateFileHash(file)
  }))

  return Promise.all(promises)
}

export async function checkFileDuplicates(
  files: File[]
): Promise<Array<{ file: File; hash: string; isDuplicate: boolean }>> {
  const fileHashes = await calculateMultipleFileHashes(files)
  const hashMap = new Map<string, number>()

  fileHashes.forEach(({ hash }) => {
    hashMap.set(hash, (hashMap.get(hash) || 0) + 1)
  })

  return fileHashes.map(({ file, hash }) => ({
    file,
    hash,
    isDuplicate: hashMap.get(hash)! > 1
  }))
}

export async function verifyFileIntegrity(file: File, expectedHash: string): Promise<boolean> {
  try {
    const actualHash = await calculateFileHash(file)
    return actualHash.toLowerCase() === expectedHash.toLowerCase()
  } catch (error) {
    console.error('File integrity verification failed:', error)
    return false
  }
}
