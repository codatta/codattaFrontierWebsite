import { cn } from '@udecode/cn'

import partnerLogo1 from '@/assets/partners/alibaba-logo.png'
import partnerLogo2 from '@/assets/partners/aspecta-logo.png'
import partnerLogo3 from '@/assets/partners/carnegie-mellon-university-logo.png'
import partnerLogo4 from '@/assets/partners/circle-logo.png'
import partnerLogo5 from '@/assets/partners/coinbase-logo.png'
import partnerLogo6 from '@/assets/partners/goplus-logo.png'
import partnerLogo7 from '@/assets/partners/honkong-polytechnic-university-logo.png'
import partnerLogo8 from '@/assets/partners/mask-logo.png'
import partnerLogo9 from '@/assets/partners/messari-logo-dark.png'
import partnerLogo10 from '@/assets/partners/metis-logo.png'
import partnerLogo11 from '@/assets/partners/polygon-logo.png'
import partnerLogo12 from '@/assets/partners/rei-network-logo.png'
import partnerLogo13 from '@/assets/partners/yotta-logo.png'

const BRANDS = [
  { icon: partnerLogo5, url: '' },
  { icon: partnerLogo4, url: '' },
  { icon: partnerLogo9, url: '' },
  { icon: partnerLogo6, url: '' },
  { icon: partnerLogo11, url: '' },
  { icon: partnerLogo12, url: '' },
  { icon: partnerLogo10, url: '' },
  { icon: partnerLogo8, url: '' },
  { icon: partnerLogo13, url: '' },
  { icon: partnerLogo2, url: '' },
  { icon: partnerLogo3, url: '' },
  { icon: partnerLogo7, url: '' },
  { icon: partnerLogo1, url: '' },
]

export default function Section({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center flex-nowrap gap-[56px]  w-full overflow-hidden',
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
