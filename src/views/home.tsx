import TransitionEffect from '@/components/common/transition-effect'
import Banner from '@/components/home/banner'
// import Explore from '@/components/home/explore'
import Frontiers from '@/components/home/frontiers'
import Aside from '@/components/home/aside'

export default function HomePage() {
  return (
    <TransitionEffect className="relative min-h-full text-sm">
      <div className="pr-[324px]">
        <Banner />
        <Frontiers />
        {/* <Explore /> */}
      </div>
      <Aside className="absolute right-0 top-0 h-full" />
    </TransitionEffect>
  )
}
