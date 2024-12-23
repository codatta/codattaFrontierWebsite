import { useUserStore } from '@/stores/user.store'
// import {
//   notificationStoreActions,
//   useNotificationStore
// } from '@/stores/notification.store'
import { cn } from '@udecode/cn'
import { Badge, Flex, Tooltip } from 'antd'
import { motion } from 'framer-motion'
import { ArrowUpRight, LogOut } from 'lucide-react'
import ImageLogo from '@/assets/images/logo-white.png'
import IconHome from '@/assets/icons/app-nav/home.svg'
import IconQuest from '@/assets/icons/app-nav/quest.svg'
import IconEcosystem from '@/assets/icons/app-nav/ecosystem.svg'
import IconReferral from '@/assets/icons/app-nav/referral.svg'
import IconMail from '@/assets/icons/app-nav/email.svg'
import IconSetting from '@/assets/icons/app-nav/setting.svg'
import IconGitbook from '@/assets/icons/app-nav/gitbook.svg'

import { MouseEventHandler, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface MenuItem {
  icon: ReactNode
  label: string | ReactNode
  key: string
  className?: string
}

function AppNavItem(props: { item: MenuItem; selectedKey: string; onClick: (item: MenuItem) => void }) {
  const { item, selectedKey, onClick } = props
  const { icon, label, key, className } = props.item
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (selectedKey) {
      setActive(selectedKey.includes(key))
    }
  }, [selectedKey, key])

  function handleClick(item: MenuItem) {
    onClick(item)
  }

  return (
    <div className={cn('group relative', className)}>
      <div className="py-0.5 pl-4 pr-2 lg:pr-0" onClick={() => handleClick(item)}>
        <div
          className={cn(
            'flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-2xl bg-transparent px-4 py-3 transition-all',
            active ? 'font-600 bg-primary text-white' : ''
          )}
        >
          <div className="size-6 shrink-0 text-[24px]">{icon}</div>
          <span className="hidden flex-1 text-[14px] lg:block">{label}</span>
        </div>
      </div>
    </div>
  )
}

function AnimationDot(props: { show: boolean; customClass?: string }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: props.show ? 1 : 0 }}
      transition={{ duration: 0.3, type: 'spring', bounce: 0.6 }}
      className={[props.customClass ? props.customClass : 'bg-primary', 'h-2 w-2 rounded-full'].join(' ')}
    ></motion.div>
  )
}

function NotificationMenu() {
  // const { unread } = useNotificationStore()
  const unread = false
  return (
    <div className="flex items-center gap-3">
      Notification
      <AnimationDot show={unread}></AnimationDot>
    </div>
  )
}

const QuestLabel = () => {
  // const { unRewardedTask } = useNotificationStore()
  const unRewardedTask = 0
  return (
    <Flex justify="space-between" align="center">
      Quest
      <Badge
        count={unRewardedTask}
        showZero={false}
        style={{
          color: '#fff',
          height: '18px',
          fontSize: '12px',
          padding: '2px 8px',
          borderRadius: '12px'
        }}
        className="[&>.ant-badge-count]:drop-shadow-none"
        size="small"
      />
    </Flex>
  )
}

function UserNameLable() {
  const { username } = useUserStore()

  const handleLogout: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation()
    // handle logout here
  }

  return (
    <div className="flex items-center">
      <div className="truncate">{username}</div>
      <Tooltip title="Log out" className="ml-auto">
        <div className="py-2 pl-2" onClick={handleLogout}>
          <LogOut size={16} className="hidden lg:block"></LogOut>
        </div>
      </Tooltip>
    </div>
  )
}

function UserAvatar() {
  const { info } = useUserStore()
  return <img src={info?.user_data.avatar} className="size-6 rounded-full"></img>
}

const menuItems: MenuItem[] = [
  {
    icon: <IconHome color={'white'} size={24} />,
    label: 'Home',
    key: '/app'
  },
  {
    icon: <IconQuest color={'white'} size={24} />,
    key: '/app/quest',
    label: <QuestLabel />
  },
  {
    icon: <IconReferral color={'white'} size={24} />,
    key: '/app/referral',
    label: 'Referral'
  },
  {
    icon: <IconEcosystem color={'white'} size={24} />,
    key: '/app/ecosystem',
    label: 'Leaderboard'
  },
  {
    icon: <IconGitbook color="white" />,
    key: 'https://docs.codatta.io/codatta',
    label: (
      <div className="flex items-center justify-between">
        <span>Documentation</span>
        <ArrowUpRight strokeWidth={1.25} size={20} />
      </div>
    )
  },
  {
    icon: <IconMail color={'white'} size={24} />,
    key: '/app/notification',
    label: <NotificationMenu />,
    className: 'mt-auto'
  },
  {
    icon: <IconSetting color={'white'} size={24} />,
    key: '/app/settings/account',
    label: 'User Settings'
  },
  {
    icon: <UserAvatar />,
    key: '/user-section',
    label: <UserNameLable />
  }
]

export type AppNavProps = {
  className?: string
}

function AppNav(_props: AppNavProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedKey = useMemo(() => location.pathname, [location])

  function handleMenuClick(item: MenuItem) {
    if (/https?:/.test(item.key)) {
      window.open(item.key, '_blank')
    } else {
      navigate(item.key)
      // notificationStoreActions.getUnread()
    }
  }

  return (
    <div className="relative flex flex-1 flex-col">
      {menuItems.map((item) => {
        return <AppNavItem key={item.key} item={item} selectedKey={selectedKey} onClick={handleMenuClick} />
      })}
    </div>
  )
}

function LogoSection() {
  // const navigate = useNavigate()
  const timer = useRef<NodeJS.Timeout>()
  const { info } = useUserStore()
  function handleMouseEnter() {
    timer.current = setTimeout(() => {
      alert(`Welcome!, ${info?.user_data.user_id}`)
    }, 5000)
  }

  function handleMouseLeave() {
    clearTimeout(timer.current)
  }

  return (
    <div
      className="mb-8 hidden items-center pl-8 pt-2 lg:flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        <img src={ImageLogo} className="h-6" />
        <a className="mt-2 flex text-sm hover:text-primary" href="https://xny.ai/" target="_blank">
          <span className="mr-1">Powered by XnY</span>
          <ArrowUpRight strokeWidth={1.25} size={20} />
        </a>
      </div>
    </div>
  )
}

export default function AppSider() {
  return (
    <div className="flex size-full flex-col py-6">
      <LogoSection />
      <AppNav className="flex-1" />
    </div>
  )
}
