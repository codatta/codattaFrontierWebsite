import LogoWhiteSvgImage from '@/assets/common/logo-white.svg'
import { ArrowLeft } from 'lucide-react'

export default function PageHead(props: { onBack?: () => void }) {
  const { onBack } = props

  return (
    <div className="flex h-[84px] items-center justify-between border-b border-white/10 px-6 py-4">
      <div className="basis-[200px]">
        {onBack && (
          <div className="flex cursor-pointer items-center gap-2 text-white" onClick={onBack}>
            <ArrowLeft className="text-white"></ArrowLeft> Back
          </div>
        )}
      </div>
      <div className="basis-10">
        <object data={LogoWhiteSvgImage} type="image/svg+xml" className="h-8"></object>
      </div>
      <div className="basis-[200px]"></div>
    </div>
  )
}
