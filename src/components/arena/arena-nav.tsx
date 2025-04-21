import { cn } from '@udecode/cn'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface MenuItem {
  icon?: ReactNode
  label: string | ReactNode
  key: string
  style?: object
}

const menuItems: MenuItem[] = [
  {
    // icon: <IconHome color={'white'} size={24} />,
    label: 'Battle',
    key: '/arena'
  },
  {
    // icon: <IconQuest color={'white'} size={24} />,
    label: 'Model List',
    key: '/arena/model/list'
  }
]

function NavItem(props: { item: MenuItem; selectedKeys: string[]; onClick: (item: MenuItem) => void }) {
  const { item, selectedKeys, onClick } = props
  const { label, key, style } = props.item
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (selectedKeys) setActive(selectedKeys.includes(key))
  }, [selectedKeys, key])

  function handleClick(item: MenuItem) {
    onClick(item)
  }

  return (
    <div style={style} className="group relative">
      <div className="" onClick={() => handleClick(item)}>
        <div
          className={cn(
            '-mr-[1px] flex cursor-pointer items-center gap-3 rounded-l-md border-primary/0 bg-transparent px-4 py-4 font-bold transition-all',
            active ? 'font-600 border-r-[3px] border-primary bg-primary/10 text-white' : ''
          )}
        >
          <span className="hidden flex-1 text-[14px] lg:block">{label}</span>
        </div>
      </div>
    </div>
  )
}

export default function ArenaNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const allItems = useMemo(() => menuItems.flatMap((item) => [item]), [])

  const selectedKeys = useMemo(
    () => [
      [...allItems.filter(({ key }) => location.pathname.startsWith(key as string))].sort(
        (a, b) => (b.key as string).length - (a.key as string).length
      )[0].key as string
    ],
    [location, allItems]
  )
  function handleMenuClick(item: MenuItem) {
    if (/https?:/.test(item.key)) {
      window.open(item.key, '_blank')
    } else {
      navigate(item.key)
    }
  }

  return (
    <div className="sticky top-0 flex h-full flex-1 flex-col border-r border-r-white/10 pt-8">
      {menuItems.map((item) => {
        return <NavItem key={item.key} item={item} selectedKeys={selectedKeys} onClick={handleMenuClick} />
      })}
    </div>
  )
}
