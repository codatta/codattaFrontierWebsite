import { cn } from '@udecode/cn'
import Logo from '@/assets/logo.png'
import SVGIcon from '@/components/dynamic-svg'

export default function Header({ className }: { className?: string }) {
  return (
    <header className={cn('flex items-center justify-between', className)}>
      <img src={Logo} className="h-8" />
      <Nav />
    </header>
  )
}

function Nav() {
  return <SVGIcon iconName="menu" className="w-6 h-6" />
}
