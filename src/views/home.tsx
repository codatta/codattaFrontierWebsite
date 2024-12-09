import Header from '@/components/header/index'
import Section1 from '@/components/section-1/index'
import Section2 from '@/components/section-2/index'

export default function HomePage() {
  return (
    <>
      <Header className="px-6 py-4" />
      <Section1 className="mt-7" />
      <Section2 className="mt-[56px]" />
    </>
  )
}
