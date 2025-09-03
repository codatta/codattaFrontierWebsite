import { Button, message, Popover, QRCode } from 'antd'
import { cn } from '@udecode/cn'

import Logo from '@/assets/frontier/fashion-gensmo/logo.svg?react'
import logo from '@/assets/frontier/fashion-gensmo/logo.svg'
import CopyToClipboard from 'react-copy-to-clipboard'

export function DownloadTask({ className }: { className?: string }) {
  const link = 'https://apps.apple.com/us/app/gensmo-your-fashion-ai-agent/id6636520663?mt=8'

  const onCopied = () => {
    message.success({
      content: 'Download link copied to clipboard!'
    })
  }

  return (
    <div className={cn('flex items-stretch justify-between gap-6 text-sm leading-[22px]', className)}>
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#875DFF33] px-3 py-[2px] text-sm font-semibold text-[#875DFF]">Task1</span>
          <span className="text-base font-bold">Install Gensmo *</span>
        </div>
        <p className="mt-3">
          Click the download button and scan the generated QR code with your phone to download the app
        </p>
        <p className="mt-2">Only downloads via the official link will qualify for the reward.</p>
        <CopyToClipboard
          text={link}
          onCopy={() => {
            onCopied()
          }}
        >
          <Popover content={<QRCode value={link} bordered={false} icon={logo} />}>
            <Button type="primary" className="mt-3 h-[48px] w-[240px] rounded-full">
              Download
            </Button>
          </Popover>
        </CopyToClipboard>
      </div>
      <Logo className="aspect-1" />
    </div>
  )
}
