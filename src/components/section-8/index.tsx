import { cn } from '@udecode/cn'
import serviceBg from '@/assets/service-bg.png'
import Button from '../button'

export default function Section({ className }: { className?: string }) {
  return (
    <div className={cn(className)}>
      <div
        className="bg-center bg-contain aspect-[342/480] flex flex-col justify-between p-8"
        style={{ backgroundImage: `url(${serviceBg})` }}
      >
        <div className="text-white">
          <h2 className="font-extrabold text-[40px] leading-[60px]">
            Immediately Start Service
          </h2>
          <p className="mt-4 text-base tracking-wide">
            Start your free trial now and experience a new era of seamless,
            data-driven success.
          </p>
        </div>
        <div>
          <Button isLight={true} hasArrow={true}>
            Start Contribution
          </Button>
        </div>
      </div>
    </div>
  )
}
