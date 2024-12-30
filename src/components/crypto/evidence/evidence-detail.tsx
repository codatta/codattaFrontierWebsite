import { VALIDATION_TIPS } from '@/config/validation-tips'
import { Image, Tooltip } from 'antd'
import { Box, FileImage, Link, Type } from 'lucide-react'
import Copy from '@/components/common/copy'
import { TEvidence, TValidationDetail } from '@/api-v1/validation.api'

export default function EvidenceDetail(props: { evidence: TEvidence; explorer?: TValidationDetail['explorer_link'] }) {
  const {
    evidence: { link, hash, text, files: _files, translation },
    explorer
  } = props

  const files = _files?.filter((v) => v && v.path) ?? []

  return (
    <div className="flex flex-col gap-2 text-xs [&>*]:rounded [&>*]:bg-[#2B005506]">
      <ul className="flex flex-col divide-y px-4 py-1 empty:hidden [&.divide-y]:border-t-[#babaff2b] [&>*]:py-2">
        {hash && (
          <li>
            <div className="mb-1 flex items-center gap-1 font-semibold leading-normal">
              <Box size={11} /> TxHash
            </div>
            <div className="flex items-center gap-1">
              <a
                className="inline-block font-medium text-primary"
                href={explorer && explorer.base_link + (explorer.hash_match ?? '').replace(/%s/, hash)}
                target="_blank"
              >
                {hash}
              </a>
              <Copy content={hash} />
            </div>
          </li>
        )}
        {text?.trim() && (
          <li className="text-xs font-semibold">
            <div className="mb-1 flex items-center gap-1 leading-normal">
              <Type size={11} />
              Description
            </div>
            <div className="leading-4">
              {translation && translation.trim() !== text?.trim() && (
                <>
                  <div>AI Translator:</div>
                  <pre className="text-wrap break-all">{translation}</pre>
                  <div className="mt-4">Original:</div>
                </>
              )}
              <pre className="text-wrap break-all">{text}</pre>
            </div>
          </li>
        )}
      </ul>
      {link && (
        <div className="p-3">
          <div className="mb-1 flex items-center gap-1 font-semibold leading-normal">
            <Link size={11} />
            <Tooltip title={VALIDATION_TIPS.link} className="cursor-pointer">
              Link
            </Tooltip>
          </div>
          <Tooltip title={link}>
            <a href={link} className="block truncate text-sm font-medium text-primary" target="_blank">
              {link}
            </a>
          </Tooltip>
        </div>
      )}
      {!!files.length && (
        <div className="p-3">
          <div className="mb-1 flex items-center gap-1 font-semibold leading-normal">
            <FileImage size={11} />
            Image
          </div>
          <Image.PreviewGroup items={files.map(({ path }) => path)}>
            <div className="grid grid-cols-3 gap-2">
              {files.slice(0, 3).map(({ path }, i) => (
                <Image
                  src={path}
                  key={i}
                  className="aspect-[16/9] overflow-hidden rounded-2xl border border-gray-200 object-contain"
                ></Image>
              ))}
              {files.length > 3 && (
                <div className="flex-1 rounded bg-[#30004010] text-center leading-[72px]">+{files.length - 3}</div>
              )}
            </div>
          </Image.PreviewGroup>
        </div>
      )}
    </div>
  )
}
