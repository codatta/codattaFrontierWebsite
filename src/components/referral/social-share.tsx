import Telegram from '@/assets/referral/tg-icon.svg'
import Twitter from '@/assets/referral/x-icon.svg'
import { cn } from '@udecode/cn'
import { useState } from 'react'

export interface ShareContent {
  text?: string
  link?: string
}

enum Social {
  Link = '',
  Telegram = 'telegram',
  Twitter = 'twitter'
}

const supportList = new Map<Social, { url: (content: ShareContent) => string; icon: (size?: number) => JSX.Element }>([
  [
    Social.Twitter,
    {
      url: ({ text, link }) => `https://twitter.com/intent/post?text=${text}&url=${encodeURIComponent(link!)}`,
      icon: () => <img src={Twitter} alt="" />
    }
  ],
  [
    Social.Telegram,
    {
      url: ({ text, link }) => `https://t.me/share/url?text=${text}&url=${encodeURIComponent(link!)}`,
      icon: () => <img src={Telegram} alt="" />
    }
  ]
])

interface SocialShareProps {
  className?: string
  content?: (name: Social) => ShareContent
  socials?: Social[]
  onShare?: (name: Social) => void
  itemWrapper?: (child: JSX.Element) => JSX.Element
  request?: (name: Social) => Promise<ShareContent>
}

export default function SocialShare(props: SocialShareProps) {
  const socials = props.socials ?? [...supportList.keys()]
  const itemWrapper = props.itemWrapper ?? ((child) => <>{child}</>)

  return (
    <ul className={cn('flex items-center gap-2 text-sm', props.className)}>
      {socials.map((socialName) => (
        <SocialItem
          key={socialName}
          socialName={socialName}
          itemWrapper={itemWrapper}
          onShare={props.onShare}
          request={props.request!}
          content={props.content}
        />
      ))}
    </ul>
  )
}
function SocialItem(props: {
  socialName: Social
  content?: (name: Social) => ShareContent
  socials?: Social[]
  onShare?: (name: Social) => void
  itemWrapper?: (child: JSX.Element) => JSX.Element
  request: (name: Social) => Promise<ShareContent>
}) {
  const socialName = props.socialName
  const social = supportList.get(socialName)

  const [url, setUrl] = useState('')

  function handleClick() {
    getUrl().then((url) => {
      window.open(
        url,
        'targetWindow',
        `toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=600px,height=600px`
      )
      props.onShare?.(socialName)
    })
  }

  async function getUrl() {
    if (url) return url
    if (props.content) {
      const url = social?.url(Object.assign({ text: '', link: '' }, props.content(socialName)))
      setUrl(url!)
      return url
    } else if (props.request) {
      const content = await props.request(socialName)
      const url = social?.url(Object.assign({ text: '', link: '' }, content))
      setUrl(url!)
      return url
    } else {
      throw new Error('Content is required')
    }
  }

  return (
    <li>
      {props.itemWrapper?.(
        <a
          title={`Share to ${socialName}`}
          className="block rounded-md bg-white/5 p-2"
          onClick={() => {
            handleClick()
          }}
        >
          <div className="flex size-4 items-center justify-center">{social?.icon()}</div>
        </a>
      )}
    </li>
  )
}
