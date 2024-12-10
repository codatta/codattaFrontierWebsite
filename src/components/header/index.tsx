import { cn } from '@udecode/cn'
import Logo from '@/assets/logo.png'
import SVGIcon from '@/components/dynamic-svg'
import DynamicSvg from '@/components/dynamic-svg'
import Button from '@/components/button'
import { useEffect, useState } from 'react'

export default function Header({ className }: { className?: string }) {
  return (
    <header className={cn('flex items-center justify-between', className)}>
      <img src={Logo} className="h-8 relative z-20" />
      <Nav />
    </header>
  )
}

type TNav = {
  label: string
  url: string
}
const NAVS: TNav[] = [
  {
    label: 'Build',
    url: '',
  },
  {
    label: 'Explore',
    url: '',
  },
  {
    label: 'Community',
    url: '',
  },
  {
    label: 'About',
    url: '',
  },
]
const BUTTON = {
  label: 'Launch App',
  url: 'https://app.codatta.io/',
}
function Nav() {
  return (
    <>
      <MobileNav />
    </>
  )
}

function MobileNav({ className }: { className?: string }) {
  const [menuShow, setMenuShow] = useState<boolean>(false)

  useEffect(() => {
    if (menuShow) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [menuShow])

  const onClick = (e: React.MouseEvent<MouseEvent>, url?: string) => {
    e.preventDefault()

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    setMenuShow(false)
  }

  return (
    <div className={cn('', className)}>
      <SVGIcon
        iconName={menuShow ? 'close-btn' : 'menu-btn'}
        className="w-6 h-6 relative z-20"
        onClick={() => setMenuShow((pre) => !pre)}
      />
      <div
        className={cn(
          'fixed left-0 top-0 w-screen h-screen bg-white z-10 flex flex-col justify-end px-6 pb-[48px]',
          menuShow ? 'visible' : 'hidden'
        )}
      >
        <ul className="space-y-[48px]">
          {NAVS.map((nav) => (
            <li>
              <a
                className="flex items-center justify-between text-base font-normal"
                href={nav.url}
                target="_blank"
                data-url={nav.url}
                onClick={(e) =>
                  onClick(e as unknown as React.MouseEvent<MouseEvent>, nav.url)
                }
              >
                {nav.label}
                <DynamicSvg iconName="angle-right" className="w-4 h-4" />
              </a>
            </li>
          ))}
        </ul>
        <Button
          className="mt-[58px]"
          onClick={(e) =>
            onClick(e as unknown as React.MouseEvent<MouseEvent>, BUTTON.url)
          }
        >
          {BUTTON.label}
        </Button>
      </div>
    </div>
  )
}
