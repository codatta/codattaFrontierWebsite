import { jump2App } from '@/utils/util'
import logoImg from '@/assets/images/icons/logo-white.png'
import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { cn } from '../utils/cn'

export default function Head({ isHome }: { isHome?: boolean }) {
  const [nav, setNav] = useState('/')

  useEffect(() => {
    setNav(location.href.includes('board') ? '/board' : '/')
  }, [])

  return (
    <header className="m-auto p-4 flex items-center max-w-1240px box-border">
      {isHome && (
        <div>
          <img src={logoImg} className="block h-6" alt="" />
        </div>
      )}
      <div className="flex-1 flex justify-center">
        <div className="border-1px border-solid border-#fff border-opacity-10 py-8px px-16px rounded-20px text-#fff text-opacity-60 flex justify-around bg-#fff bg-opacity-2">
          <NavLink
            className={cn(
              'h-full leading-24px no-underline nav cursor-pointer block mr-40px text-white',
              nav === '/' && 'text-purple-300'
            )}
            to="/"
            onClick={() => setNav('/')}
          >
            Features
          </NavLink>
          <NavLink
            className={cn(
              'h-full leading-24px no-underline nav cursor-pointer block text-white',
              nav === '/board' && 'text-purple-300'
            )}
            to="/board"
            onClick={() => setNav('/board')}
          >
            Monitoring
          </NavLink>
        </div>
      </div>

      {isHome && (
        <button
          className="ml-auto  cursor-pointer rounded-16px h-32px px-24px block border-none outline-none text-white text-sm border-1px border-solid border-#FFFFFF99 font-500 bg-transparent text-base text-nowrap"
          onClick={jump2App}
        >
          Launch App
        </button>
      )}
    </header>
  )
}