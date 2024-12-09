import { cn } from '@udecode/cn'

import brand1 from '@/assets/brands/causal_brand.png'
import brand2 from '@/assets/brands/openAi_brand.png'
import brand3 from '@/assets/brands/causal_brand.png'
import brand4 from '@/assets/brands/plain_brand.png'
import brand5 from '@/assets/brands/passionfroot_brand.png'
import brand6 from '@/assets/brands/dopt_brand.png'

const BRANDS = [
  { icon: brand1, url: '' },
  { icon: brand2, url: '' },
  { icon: brand3, url: '' },
  { icon: brand4, url: '' },
  { icon: brand5, url: '' },
  { icon: brand6, url: '' },
]

export default function Section({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center  flex-nowrap gap-[56px] px-6 w-full overflow-hidden',
        className
      )}
    >
      {BRANDS.map((brand, index) => (
        <a href={brand.url} key={'brand_' + index} className="flex-shrink-0">
          <img
            src={brand.icon}
            className="h-[30px] w-auto object-contain"
            alt="Brand logo"
          />
        </a>
      ))}
    </div>
  )
}
