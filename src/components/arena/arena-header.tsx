import { cn } from '@udecode/cn'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import logo from '@/assets/chatbot/logo-notext-svg.svg'

export default function ArenaHeader() {
  const location = useLocation()
  const navigate = useNavigate()
  const [active, setActive] = useState(location.pathname)

  useEffect(() => {
    setActive(location.pathname)
  }, [location])

  const NavClonfig = [
    { key: '/arena', label: 'Battle' },
    { key: '/arena/leaderboard', label: 'Leaderboard' },
    { key: '/arena/model/list', label: 'Model List' }
  ]

  return (
    <div className="w-full border-b border-white/5 bg-[#1c1c26] py-5">
      <div className="mx-auto flex max-w-[1400px] items-center px-6">
        <img src={logo} className="mr-[80px] block h-8" alt="" />
        <nav className="flex gap-8">
          {NavClonfig.map((item) => {
            return (
              <div
                key={item.key}
                className={cn('cursor-pointer font-bold', active === item.key ? 'text-white' : 'text-white/70')}
                onClick={() => navigate(item.key)}
              >
                {item.label}
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
