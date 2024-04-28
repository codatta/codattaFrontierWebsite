import { Storage } from '@google-cloud/storage'
import { globby } from 'globby'
import path from 'path'
import { PluginOption, normalizePath } from 'vite'
import fs from 'fs'


type VitePluginGCPStorageOptions = {
  bucket: string
  keyFile: string
  exclude: string[]
  bucketDomain: string
  uploadPath: string
}

async function uploadFile(storage: Storage, file: any, outDir: string, options: VitePluginGCPStorageOptions) {
  const res = await storage.bucket(options.bucket).upload(file.path, {
    destination: file.path.replace(outDir, options.uploadPath),
    gzip: true,
    metadata: { cacheControl: 'public, max-age=31536000' },
  })
  const [fileObject] = res
  console.log(`${file.path.replace(outDir, '').padEnd(48)}${'=>'.padEnd(5)}${fileObject.name}`)
}

export default function vitePluginGCPStorage(options: VitePluginGCPStorageOptions): PluginOption {
  let buildConfig
  return {
    name: 'vite-plugin-gcp-storage',
    apply: 'build',
    configResolved(config) {
      const keyfile = path.resolve(__dirname, options.keyFile)
      if (fs.existsSync(keyfile)) {
        config.base = `${options.bucketDomain}/${options.uploadPath}`
        console.info(`发现google云key文件[${keyfile}], 修改编译base为: ${config.base}`)
      }
      buildConfig = config
    },
    async closeBundle() {
      if (!fs.existsSync(path.resolve(__dirname, options.keyFile))) {
        console.error('没有发现Google云Key文件!')
        return
      }
      const outDir = normalizePath(path.resolve(normalizePath(buildConfig.build.outDir)))
      const storage = new Storage({ keyFilename: options.keyFile })
      const files = await globby([`${outDir}/**/*`, ...options.exclude.map((item) => `!${item}`)], {
        objectMode: true,
        onlyFiles: true,
        deep: 10,
      })
      // 上传所有文件
      for (const file of files) {
        uploadFile(storage, file, outDir, options)
      }
    },
  }
}
