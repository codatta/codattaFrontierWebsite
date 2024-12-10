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
    <>
      <Header className="px-6 py-4" />
      <Section1 className="mt-7" />
      <Section2 className="mt-0" />
      <Section3 className="px-6 mt-[120px]" />
      <div className="mt-[80px] rounded-3xl bg-black overflow-hidden py-[80px]">
        <Section4 className="px-6" />
        <Section5 className="px-6 mt-[180px]" />
      </div>
      <Section6 className="px-6 mt-[120px]" />
      <Section7 className="px-6 mt-[120px]" />
      <Section8 className="px-6 mt-[120px]" />
      <Footer className="px-6 mt-[150px]" />
    </>
  )
}
