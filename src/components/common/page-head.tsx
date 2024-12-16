import LogoWhiteSvgImage from '@/assets/common/logo-white.svg'
import { ArrowLeft } from 'lucide-react'

export default function PageHead() {
  return (
    <div className="flex h-[84px] items-center justify-between border-b border-white/10 px-6 py-4">
      <div
        className="flex cursor-pointer items-center gap-2 text-white"
        onClick={() => {
          window.history.back()
        }}
      >
        <ArrowLeft className="text-white"></ArrowLeft> Back
      </div>
      <object
        data={LogoWhiteSvgImage}
        type="image/svg+xml"
        className="h-8"
      ></object>
      <div></div>
    </div>
  )
}
