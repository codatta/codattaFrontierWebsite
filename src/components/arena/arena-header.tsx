import { cn } from '@udecode/cn'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '@/assets/chatbot/logo-notext-svg.svg'
import { useUserStore } from '@/stores/user.store'
import { useArenaStore } from '@/stores/arena.store'

function ModelListText() {
  const { modelList } = useArenaStore()
  const total = useMemo(() => modelList.length, [modelList])

  return <>Model List {total ? `(${total})` : ''}</>
}

export default function ArenaHeader() {
  const location = useLocation()
  const navigate = useNavigate()
  const [active, setActive] = useState(location.pathname)
  const { info } = useUserStore()

  useEffect(() => {
    setActive(location.pathname)
  }, [location])

  const NavClonfig = [
    { key: '/arena', label: 'Battle' },
    { key: '/arena/leaderboard', label: 'Leaderboard' },
    { key: '/arena/model/list', label: <ModelListText /> }
  ]

  return (
    <div className="w-full border-b border-white/5 bg-[#1c1c26] py-5">
      <div className="mx-auto flex max-w-[1400px] items-center px-6">
        <Link to="/" className="mr-[80px]">
          <img src={logo} className="block h-8" alt="" />
        </Link>
        <nav className="flex gap-8">
          {NavClonfig.map((item) => {
            return (
              <div
                key={item.key}
                className={cn('cursor-pointer', active === item.key ? 'text-white' : 'text-white/70')}
                onClick={() => navigate(item.key)}
              >
                {item.label}
              </div>
            )
          })}
        </nav>
        {info?.user_data?.avatar && (
          <div className="ml-auto flex cursor-pointer items-center" onClick={() => navigate('/app/settings/account')}>
            <img src={info?.user_data.avatar || ''} alt="" className="size-8 rounded-full" />
          </div>
        )}
      </div>
    </div>
  )
}
