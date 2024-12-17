import { cn } from '@udecode/cn'
import Banner from './banner'
import Frontiers from './frontiers'
import Explore from './explore'

type TProps = {
  className?: string
}
export default function Main({ className }: TProps) {
  return (
    <div className={cn('', className)}>
      <Banner />
      <Frontiers />
      <Explore />
    </div>
  )
}
