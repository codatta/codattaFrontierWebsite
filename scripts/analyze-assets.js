import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const assetsDir = path.join(__dirname, '../src/assets')
const srcDir = path.join(__dirname, '../src')

const imageExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.ico']

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList)
    } else {
      fileList.push(filePath)
    }
  })
  return fileList
}

function getFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath)
    return crypto.createHash('md5').update(content).digest('hex')
  } catch (e) {
    return null
  }
}

const allAssets = getAllFiles(assetsDir).filter((file) => imageExtensions.includes(path.extname(file).toLowerCase()))

const allSourceFiles = getAllFiles(srcDir).filter((file) =>
  ['.tsx', '.ts', '.jsx', '.js', '.css', '.scss'].includes(path.extname(file))
)

console.log(`Found ${allAssets.length} image assets`)
console.log(`Scanning ${allSourceFiles.length} source files...\n`)

const usedAssets = new Set()
const assetReferences = {}

allSourceFiles.forEach((sourceFile) => {
  const content = fs.readFileSync(sourceFile, 'utf-8')

  allAssets.forEach((assetPath) => {
    const relativePath = path.relative(assetsDir, assetPath)
    const fileName = path.basename(assetPath)

    const patterns = [
      `@/assets/${relativePath.replace(/\\/g, '/')}`,
      `assets/${relativePath.replace(/\\/g, '/')}`,
      fileName
    ]

    patterns.forEach((pattern) => {
      if (content.includes(pattern)) {
        usedAssets.add(assetPath)
        if (!assetReferences[assetPath]) {
          assetReferences[assetPath] = []
        }
        if (!assetReferences[assetPath].includes(sourceFile)) {
          assetReferences[assetPath].push(sourceFile)
        }
      }
    })
  })
})

const unusedAssets = allAssets.filter((asset) => !usedAssets.has(asset))

console.log('=== UNUSED ASSETS ===')
console.log(`Total: ${unusedAssets.length}\n`)
unusedAssets.forEach((asset) => {
  console.log(path.relative(assetsDir, asset))
})

console.log('\n=== DUPLICATE DETECTION ===')
const hashMap = {}
allAssets.forEach((asset) => {
  const hash = getFileHash(asset)
  if (hash) {
    if (!hashMap[hash]) {
      hashMap[hash] = []
    }
    hashMap[hash].push(asset)
  }
})

const duplicates = Object.values(hashMap).filter((files) => files.length > 1)
console.log(`Found ${duplicates.length} groups of duplicates:\n`)
duplicates.forEach((group, idx) => {
  console.log(`Group ${idx + 1}:`)
  group.forEach((file) => {
    const refs = assetReferences[file] || []
    console.log(`  - ${path.relative(assetsDir, file)} (${refs.length} references)`)
  })
  console.log('')
})

console.log('\n=== CURRENT DIRECTORY STRUCTURE ===')
const dirStructure = {}
allAssets.forEach((asset) => {
  const dir = path.dirname(path.relative(assetsDir, asset))
  if (!dirStructure[dir]) {
    dirStructure[dir] = []
  }
  dirStructure[dir].push(path.basename(asset))
})

Object.keys(dirStructure)
  .sort()
  .forEach((dir) => {
    console.log(`${dir}/`)
    dirStructure[dir].forEach((file) => {
      console.log(`  - ${file}`)
    })
  })

const report = {
  totalAssets: allAssets.length,
  usedAssets: usedAssets.size,
  unusedAssets: unusedAssets.map((a) => path.relative(assetsDir, a)),
  duplicates: duplicates.map((group) =>
    group.map((f) => ({
      path: path.relative(assetsDir, f),
      references: assetReferences[f] ? assetReferences[f].map((r) => path.relative(srcDir, r)) : []
    }))
  ),
  assetReferences: Object.fromEntries(
    Object.entries(assetReferences).map(([asset, refs]) => [
      path.relative(assetsDir, asset),
      refs.map((r) => path.relative(srcDir, r))
    ])
  )
}

fs.writeFileSync(path.join(__dirname, 'asset-analysis.json'), JSON.stringify(report, null, 2))

console.log('\n=== SUMMARY ===')
console.log(`Total assets: ${report.totalAssets}`)
console.log(`Used assets: ${report.usedAssets}`)
console.log(`Unused assets: ${report.unusedAssets.length}`)
console.log(`Duplicate groups: ${duplicates.length}`)
console.log(`\nDetailed report saved to: scripts/asset-analysis.json`)
