import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Head.scss'

function Head({ className }: { className?: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [nav, setNav] = useState('/')

  function jump2App() {
    const href = /test/.test(location.pathname)
      ? 'https://app.test.codatta.io/account/signin'
      : 'https://app.codatta.io/account/signin'

    location.href = href
  }

  return (
    <div className="relative">
      <header
        className={`header flex justify-between items-center font-medium pt-12px color-white relative z-3 ${className}`}
      >
        <div className="w-200px h-30px text-xs logo"></div>
        <div className="flex items-center">
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
