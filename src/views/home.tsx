import TransitionEffect from '@/components/common/transition-effect'
import Main from '@/components/home/main'

export default function HomePage() {
  return (
    <TransitionEffect className="relative">
      <Main className="pb-4 text-sm" />
    </TransitionEffect>
  )
}
