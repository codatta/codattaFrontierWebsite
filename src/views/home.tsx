import Header from '@/components/header'
import Section1 from '@/components/section-1'
import Section2 from '@/components/section-2'
import Section3 from '@/components/section-3'
import Section4 from '@/components/section-4'
import Section5 from '@/components/section-5'
import Section6 from '@/components/section-6'
import Section7 from '@/components/section-7'
import Section8 from '@/components/section-8'

import Footer from '@/components/footer'

export default function HomePage() {
  return (
    <div className="snap-mandatory snap-y overflow-y-auto h-screen">
      <Header className="px-6 py-4 snap-start md:py-5 md:px-[120px]" />
      <Section1 className="mt-7" />
      <Section2 className="mt-0" />
      <Section3 className="px-6 pt-[60px] mt-[60px] snap-start" />
      <div className="mt-[80px] rounded-3xl bg-black pb-[80px]">
        <Section4 className="px-6 snap-start" />
        <Section5 className="px-6 pt-[60px] mt-[120px] snap-start" />
      </div>
      <Section6 className="px-6 pt-[60px] mt-[60px] snap-start" />
      <Section7 className="px-6 pt-[60px] mt-[60px] snap-start" />
      <Section8 className="px-6 pt-[60px] mt-[60px] snap-start" />
      <Footer className="px-6 pt-[60px] mt-[90px] snap-start" />
    </div>
  )
}
