import { cn } from '@udecode/cn'
import logo3D from '@/assets/logo-3d.png'
import gridBg from '@/assets/grid.svg'
// import Button from '../button'

export default function Section({ className }: { className?: string }) {
  return (
    <div className={cn('md:flex md:h-[570px] ', className)}>
      <div className="px-6 md:px-0 md:w-1/2 md:flex md:flex-col md:justify-center">
        <h1 className="text-wrap font-extrabold text-[40px] leading-[48px] text-[#1D1D1D] md:text-[96px] md:leading-[110px]">
          Decentralized
          <br /> Al Training
          <br /> Marketplace
        </h1>
        <p className="mt-2 text-[20px] leading-[30px] text-[#223140] md:font-medium md:text-2xl md:leading-10 md:tracking-wide md:w-[450px]">
          Connect, Collaborate, and Co-Train the Future of AGI
        </p>
      </div>
      <div className="aspect-1 relative pointer-events-none overflow-hidden md:w-1/2">
        <div className="p-9 md:py-[0]">
          <img
            src={logo3D}
            className="w-full h-auto relative z-10 md:h-[570px] md:w-auto"
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center md:hidden">
          <img
            src={gridBg}
            className="scale-[1.9] origin-right min-w-full min-h-full md:scale-[3]"
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
