import { useUserStore } from '@/stores/user.store'

import { cn } from '@udecode/cn'
import { Badge, Flex } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import ImageLogo from '@/assets/images/logo-white.png'
import IconHome from '@/assets/icons/app-nav/home.svg'
import IconQuest from '@/assets/icons/app-nav/quest.svg'
import IconEcosystem from '@/assets/icons/app-nav/ecosystem.svg'
import IconArena from '@/assets/icons/app-nav/arena.svg'
import IconReferral from '@/assets/icons/app-nav/referral.svg'
import IconMail from '@/assets/icons/app-nav/email.svg'
import IconSetting from '@/assets/icons/app-nav/setting.svg'
import IconGitbook from '@/assets/icons/app-nav/gitbook.svg'
import AirdropIcon from '@/assets/icons/app-nav/airdrop.svg'

import { ReactNode, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import AppUser from '@/components/app/app-user'
import { TRACK_CATEGORY, trackEvent } from '@/utils/track'
import { useAirdropActivityStore } from '@/stores/airdrop-activity.store'

export interface MenuItem {
  icon: ReactNode
  label: string | ReactNode
  key: string
  style?: object
  id?: string
  isDynamic?: boolean // Flag to identify dynamically inserted menu items
  insertAfter?: string // Specify which menu item to insert after
  priority?: number // Priority, smaller numbers appear first
}

// Animation variants configuration
const menuItemVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    y: -20,
    transition: { duration: 0.2, ease: 'easeInOut' }
  },
  visible: {
    opacity: 1,
    height: 'auto',
    y: 0,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    height: 0,
    y: -20,
    transition: { duration: 0.2, ease: 'easeInOut' }
  }
}

function AppNavItem(props: {
  item: MenuItem
  selectedKeys: string[]
  onClick: (item: MenuItem) => void
  isDynamic?: boolean
}) {
  const { item, selectedKeys, onClick, isDynamic = false } = props
  const { icon, label, key, style } = props.item
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (selectedKeys) setActive(selectedKeys.includes(key))
  }, [selectedKeys, key])

  function handleClick(item: MenuItem) {
    onClick(item)
  }

  const itemContent = (
    <div
      style={style}
      className={cn('group relative', ['/arena', '/app/leaderboard'].includes(key) ? 'hidden md:block' : '')}
    >
      <div className="py-0.5 pl-3 pr-2 lg:pr-0" onClick={() => handleClick(item)}>
        <div
          className={cn(
            'flex cursor-pointer items-center justify-center gap-3 rounded-2xl bg-transparent px-4 py-3 transition-all',
            active ? 'font-600 bg-primary text-white' : ''
          )}
        >
          <div className="size-6 text-[24px]">{icon}</div>
          <span className="hidden flex-1 text-[14px] lg:block">{label}</span>
        </div>
      </div>
    </div>
  )

  // If it's a dynamic menu item, wrap with animation
  if (isDynamic) {
    return (
      <motion.div variants={menuItemVariants} initial="hidden" animate="visible" exit="exit" layout>
        {itemContent}
      </motion.div>
    )
  }

  return itemContent
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
        className="[&>.ant-badge-count]:shadow-none"
        size="small"
      />
    </Flex>
  )
}

// Base menu items configuration
const baseMenuItems: MenuItem[] = [
  {
    icon: <IconHome color={'white'} size={24} />,
    label: 'Home',
    key: '/app',
    priority: 1
  },
  {
    icon: <IconQuest color={'white'} size={24} />,
    key: '/app/quest',
    label: <QuestLabel />,
    priority: 2
  },
  {
    icon: <IconArena color={'white'} size={24} />,
    key: '/arena',
    label: 'Arena',
    priority: 3
  },
  {
    icon: <IconReferral color={'white'} size={24} />,
    key: '/app/referral',
    label: 'Referral',
    priority: 4
  },
  {
    icon: <IconEcosystem color={'white'} size={24} />,
    key: '/app/leaderboard',
    label: 'Leaderboard',
    priority: 5
  },
  {
    icon: <IconGitbook color="white" />,
    key: 'https://docs.xny.ai/xny/codatta',
    label: (
      <div className="flex items-center justify-between">
        <span>Documentation</span>
        <ArrowUpRight strokeWidth={1.25} size={20} />
      </div>
    ),
    priority: 6
  },
  {
    icon: <IconMail color={'white'} size={24} />,
    key: '/app/notification',
    label: <NotificationMenu />,
    style: {
      marginTop: 'auto'
    },
    priority: 7
  },
  {
    icon: <IconSetting color={'white'} size={24} />,
    key: '/app/settings',
    label: 'User Info',
    priority: 8
  }
]

// Dynamic menu items management hook
function useDynamicMenuItems(dynamicMenuItems?: MenuItem[]) {
  const [dynamicItems, setDynamicItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Handle API response and add dynamic menu items
  const addDynamicMenuItems = useCallback((items: MenuItem[]) => {
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      setDynamicItems((prev) => {
        const newItems = items.filter((item) => !prev.some((existing) => existing.id === item.id))
        return [...prev, ...newItems]
      })
      setIsLoading(false)
    }, 0)
  }, [])

  // Remove dynamic menu items
  const removeDynamicMenuItems = useCallback((itemIds: string[]) => {
    setDynamicItems((prev) => prev.filter((item) => !itemIds.includes(item.id || '')))
  }, [])

  // Listen for API response changes
  useEffect(() => {
    if (dynamicMenuItems) {
      addDynamicMenuItems(dynamicMenuItems)
    }
  }, [dynamicMenuItems, addDynamicMenuItems])

  return {
    dynamicItems,
    isLoading,
    addDynamicMenuItems,
    removeDynamicMenuItems
  }
}

export type AppNavProps = {
  className?: string
  dynamicMenuItems?: MenuItem[] // API response data for dynamic menu items
}

// Merge base menu items and dynamic menu items
function useMergedMenuItems(dynamicItems: MenuItem[]) {
  return useMemo(() => {
    const allItems = [...baseMenuItems, ...dynamicItems]

    // Sort by priority
    return allItems.sort((a, b) => (a.priority || 999) - (b.priority || 999))
  }, [dynamicItems])
}

function AppNav(props: AppNavProps) {
  const { dynamicMenuItems } = props
  const navigate = useNavigate()
  const location = useLocation()

  // Use dynamic menu items hook
  const { dynamicItems, isLoading } = useDynamicMenuItems(dynamicMenuItems)

  // Merge menu items
  const allMenuItems = useMergedMenuItems(dynamicItems)

  const selectedKeys = useMemo(
    () =>
      [
        [...allMenuItems.filter(({ key }) => location.pathname.startsWith(key as string))].sort(
          (a, b) => (b.key as string).length - (a.key as string).length
        )[0]?.key as string
      ].filter(Boolean),
    [location, allMenuItems]
  )

  function handleMenuClick(item: MenuItem) {
    if (/https?:/.test(item.key)) {
      trackEvent(TRACK_CATEGORY.LINK_CLICK, { method: 'click', contentType: item.key })
      window.open(item.key, '_blank')
    } else {
      trackEvent(TRACK_CATEGORY.NAV_CLICK, { method: 'click', contentType: item.key })
      navigate(item.key)
    }
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <AnimatePresence mode="popLayout">
        {allMenuItems.map((item) => {
          const isDynamic = item.isDynamic || false
          return (
            <AppNavItem
              key={item.id || item.key}
              item={item}
              selectedKeys={selectedKeys}
              onClick={handleMenuClick}
              isDynamic={isDynamic}
            />
          )
        })}
      </AnimatePresence>

      {/* Loading indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center py-2"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="size-4 rounded-full border-2 border-primary border-t-transparent"
          />
        </motion.div>
      )}
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
        <img src={ImageLogo} className="w-[128px]" />
        <a className="mt-2 flex text-sm hover:text-primary" href="https://xny.ai/" target="_blank">
          <span className="mr-1">Powered by XnY</span>
          <ArrowUpRight strokeWidth={1.25} size={20} />
        </a>
      </div>
    </div>
  )
}

export default function AppSider() {
  const { hasAirdropActivity } = useAirdropActivityStore()
  const [extraAppMenuItems, setExtraAppMenuItems] = useState<MenuItem[]>([])

  useEffect(() => {
    if (hasAirdropActivity) {
      setExtraAppMenuItems([
        {
          icon: <AirdropIcon color="white" />,
          label: 'Airdrop',
          isDynamic: true,
          key: '/app/airdrop',
          priority: 2.5
        }
      ])
    }
  }, [hasAirdropActivity])

  return (
    <div className="flex size-full flex-col py-6">
      <LogoSection />
      <AppNav className="flex-1" dynamicMenuItems={extraAppMenuItems} />
      <AppUser />
    </div>
  )
}
