import { cn } from '@udecode/cn'
import bigLogo from '@/assets/codatta_logo_big.png'

export default function Copy({ className }: { className?: string }) {
  return (
    <>
      <p className={cn('text-center', className)}>
        © 2024 Blockchain Metadata Labs Inc. All rights reserved.
      </p>
      <img src={bigLogo} className="w-full h-auto mt-[47px]" />
    </>
  )
}
