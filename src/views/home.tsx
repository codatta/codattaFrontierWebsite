import TransitionEffect from '@/components/common/transition-effect'
import Banner from '@/components/home/banner'
import Explore from '@/components/home/explore'
import Frontiers from '@/components/home/frontiers'
import Checkin from '@/components/checkin/checkin-modal'

export default function HomePage() {
  return (
    <TransitionEffect className="relative pb-4 text-sm">
      <Banner />
      <Frontiers />
      <Explore />
      <Checkin />
    </TransitionEffect>
  )
}
