import Header from '@/components/header/index'
import Section1 from '@/components/section-1/index'
import Section2 from '@/components/section-2/index'
import Section3 from '@/components/section-3/index'
import Section4 from '@/components/section-4'

export default function HomePage() {
  return (
    <>
      <Header className="px-6 py-4" />
      <Section1 className="mt-7" />
      <Section2 className="mt-[56px]" />
      <Section3 className="px-6 mt-[120px]" />
      <div className="mt-[80px] rounded-3xl bg-black overflow-hidden py-[80px]">
        <Section4 className="px-6" />
      </div>
    </>
  )
}
