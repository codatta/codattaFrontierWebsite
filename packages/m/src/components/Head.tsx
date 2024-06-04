import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { jump2App } from '@/utils/util'
import './Head.scss'

function Head({ className }: { className?: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [nav, setNav] = useState('/')

  return (
    <div className="relative">
      <header
        className={`header flex justify-between items-center font-medium pt-12px color-white relative z-3 ${className}`}
      >
        <div className="w-120px h-20px text-xs logo"></div>
        <div className="flex items-center">
          <button
            className="rounded-16px w-104px h-26px flex items-center justify-center mr-8px block border-none outline-none text-#fff text-sm border-1px border-solid border-#FFFFFF99 font-500 bg-transparent text-base"
            onClick={jump2App}
          >
            Launch App
          </button>
          <div
            className={`rounded-12px border-1px border-solid border-#fff border-opacity-10 w-32px h-26px box-border menu ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen((pre) => !pre)}
          ></div>
        </div>
      </header>
      {menuOpen && (
        <div className="absolute w-100vw h-100vh top-0 left-0 bg-#000 bg-opacity-90 box-border pt-78px px-12px font-sm leading-40px z-2">
          <NavLink
            className={` no-underline nav block text-#fff ${!/board/.test(nav) ? '' : 'text-opacity-70'}`}
            to="/m"
            onClick={() => setNav('/m')}
          >
            Features
          </NavLink>
          <NavLink
            className={`no-underline nav block text-#fff ${/board/.test(nav) ? '' : 'text-opacity-70'}`}
            to="/m/board"
            onClick={() => setNav('/m/board')}
          >
            Monitoring
          </NavLink>
        </div>
      )}
    </div>
  )
}

export default Head
