import { cn } from '@udecode/cn'
import Logo3D from '@/assets/logo-3d.png'
import LogoBg from '@/assets/grid.svg'
import Button from '../button'

export default function Section({ className }: { className?: string }) {
  return (
    <div className={cn('', className)}>
      <div className="px-6">
        <h1 className="text-wrap font-extrabold text-[40px] leading-[48px] text-[#1D1D1D]">
          Decentralized Al Training Marketplace
        </h1>
        <p className="mt-2 text-[20px] leading-[30px] text-[#223140]">
          Connect, Collaborate, and Co-Train the Future of AGI
        </p>
      </div>
      <div className="aspect-1 relative pointer-events-none overflow-hidden">
        <div className="p-9">
          <img src={Logo3D} className="w-full h-auto " />
        </div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center ">
          <img
            src={LogoBg}
            className="scale-[1.9] origin-center min-w-full min-h-full"
          />
        </div>
      </div>
      {/* <div className="flex items-center justify-between gap-3 px-6">
        <Button hasArrow={true} className="flex-1 text-sm ">
          Join as Developer
        </Button>
        <Button isLight={true} hasArrow={true} className="flex-1 text-sm">
          Join as Data Creator
        </Button>
      </div> */}
    </div>
  )
}
