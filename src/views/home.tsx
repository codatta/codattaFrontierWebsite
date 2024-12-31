import TransitionEffect from '@/components/common/transition-effect'
import Banner from '@/components/home/banner'
import Explore from '@/components/home/explore'
import Frontiers from '@/components/home/frontiers'
import Aside from '@/components/home/aside'

export default function HomePage() {
  return (
    <TransitionEffect className="relative flex gap-12 pb-4 text-sm">
      <div className="flex-1">
        <Banner />
        <Frontiers />
        <Explore />
      </div>
      <Aside />
    </TransitionEffect>
  )
}
