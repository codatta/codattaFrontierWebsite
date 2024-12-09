import Header from '@/components/header'
import Section1 from '@/components/section-1'
import Section2 from '@/components/section-2'
import Section3 from '@/components/section-3'
import Section4 from '@/components/section-4'
import Section5 from '@/components/section-5'

import Footer from '@/components/footer'

export default function HomePage() {
  return (
    <>
      <Header className="px-6 py-4" />
      <Section1 className="mt-7" />
      <Section2 className="mt-[56px]" />
      <Section3 className="px-6 mt-[120px]" />
      <div className="mt-[80px] rounded-3xl bg-black overflow-hidden py-[80px]">
        <Section4 className="px-6" />
        <Section5 className="px-6 mt-[180px]" />
      </div>
      <Footer className="px-6 mt-[150px]" />
    </>
  )
}
