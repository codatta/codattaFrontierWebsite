import { cn } from '@udecode/cn'

import Copy from './copy'
import logo from '@/assets/logo.png'
import DynamicSvg from '../dynamic-svg'

type TItem = {
  iconName: string
  label: string
}

const SOCIALS: TItem[] = [
  {
    iconName: 'logo-twitter',
    label: 'Twitter',
  },
  {
    iconName: 'logo-telegram',
    label: 'Telegram',
  },
  {
    iconName: 'logo-medium',
    label: 'Medium',
  },
  {
    iconName: 'logo-discord',
    label: 'Discord',
  },
  {
    iconName: 'logo-announcement',
    label: 'Announcement',
  },
]
const DOCS: TItem[] = [
  {
    iconName: 'logo-github',
    label: 'Brand Kit',
  },
  { iconName: 'logo-gitbook', label: 'Documentation' },
]
const LEGALS: TItem[] = [
  {
    iconName: 'privacy',
    label: 'Privacy Policy',
  },
  {
    iconName: 'items',
    label: 'Terms of Service',
  },
]

export default function Footer({ className }: { className?: string }) {
  return (
    <>
      <div className={cn('', className)}>
        <div>
          <img src={logo} className="h-9" />
          <p className="text-lg tracking-tight mt-4">
            The world's leading AI-powered collaboration protocol for blockchain
            metadata.
          </p>
        </div>
        <div className="mt-[64px]">
          <div>
            <h3 className="text-[#00000066] text-xl leading-8 tracking-wide font-normal">
              Social
            </h3>
            <ul className="grid grid-cols-2 gap-7 mt-4">
              {SOCIALS.map((item) => (
                <li key={item.label}>
                  <a className="flex items-center gap-2">
                    <DynamicSvg iconName={item.iconName} className="w-6 h-6" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-10">
            <h3 className="text-[#00000066] text-xl leading-8 tracking-wide font-normal">
              Docs
            </h3>
            <ul className="grid grid-cols-1 gap-7 mt-4">
              {DOCS.map((item) => (
                <li key={item.label}>
                  <a className="flex items-center gap-2">
                    <DynamicSvg iconName={item.iconName} className="w-6 h-6" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-10">
            <h3 className="text-[#00000066] text-xl leading-8 tracking-wide font-normal">
              Legal
            </h3>
            <ul className="grid grid-cols-1 gap-7 mt-4">
              {LEGALS.map((item) => (
                <li key={item.label}>
                  <a className="flex items-center gap-2">
                    <DynamicSvg iconName={item.iconName} className="w-6 h-6" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="h-[1px] bg-[#0000001F] my-10 mx-6"></div>
      <Copy className={cn('', className)} />
    </>
  )
}
