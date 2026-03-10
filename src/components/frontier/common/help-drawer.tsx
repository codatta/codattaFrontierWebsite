import { ReactNode } from 'react'
import { cn } from '@udecode/cn'
import { X } from 'lucide-react'
import { useDrawerAnimation } from '@/hooks/use-drawer-animation'

export type ContentBlock =
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'list'; title?: string; items: string[] }

export type PresetCardType = 'about' | 'guidelines' | 'redline'

export interface CardConfig {
  preset?: PresetCardType
  title?: string
  titleColor?: string
  icon?: ReactNode
  content?: ContentBlock[]
}

interface HelpDrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  cards: CardConfig[]
  className?: string
}

export default function HelpDrawer({
  open,
  onClose,
  title = 'More About Frontier',
  cards,
  className
}: HelpDrawerProps) {
  const { isVisible, isAnimating } = useDrawerAnimation(open)

  if (!isVisible) return null

  const getPresetCard = (preset: PresetCardType, customConfig?: Partial<CardConfig>): CardConfig => {
    const presets: Record<PresetCardType, CardConfig> = {
      about: {
        title: 'About',
        icon: <AboutIcon className="absolute left-[-21px] top-[-21px]" />,
        content: []
      },
      guidelines: {
        title: 'Guidelines',
        icon: <GuidelinesIcon className="absolute left-[-21px] top-[-21px]" />,
        content: []
      },
      redline: {
        title: 'Expert Redline Behaviors',
        titleColor: '#D32F2F',
        icon: <RedlineIcon className="absolute left-[-21px] top-[-21px]" />,
        content: [
          {
            type: 'p',
            text: 'Please strictly adhere to the following rules. If any redline behavior is determined by the business, expert qualifications will be immediately revoked, and all unsettled data will not be paid for:'
          },
          {
            type: 'list',
            items: [
              'Maliciously circumventing or cracking task rules; submitting a large amount of invalid or low-quality data',
              'Engaging in obvious cheating behavior by directly submitting AI-generated content without performing any manual review, modification, or annotation',
              'Engaging in dishonest behaviors such as plagiarism or delegating tasks to others',
              'Engaging in uncivilized behaviors such as verbal abuse or personal attacks against others',
              'Disseminating question banks or task rules, or disclosing any related confidential information'
            ]
          },
          {
            type: 'p',
            text: 'Please also note that if any malicious activity is detected, all submitted data from the account will be invalidated, and the account will be blacklisted, preventing any new data submissions for 14 days.'
          }
        ]
      }
    }

    return {
      ...presets[preset],
      ...customConfig,
      content: customConfig?.content || presets[preset].content
    }
  }

  const renderContentBlock = (block: ContentBlock, blockIndex: number) => {
    switch (block.type) {
      case 'h3':
        return (
          <h4 key={blockIndex} className="mt-4 text-base font-semibold text-black">
            {block.text}
          </h4>
        )
      case 'p':
        return (
          <p key={blockIndex} className="text-sm leading-[18px] text-[#999999]">
            {block.text}
          </p>
        )
      case 'list':
        return (
          <div key={blockIndex}>
            {block.title && <h4 className="mt-4 text-base font-semibold text-black">{block.title}</h4>}
            <ul className="m-2 space-y-2">
              {block.items.map((item, idx) => (
                <li key={idx} className="flex items-start pl-1 text-[15px] leading-[18px] text-[#999999]">
                  <span className="mr-2 mt-[7px] size-1 shrink-0 rounded-full bg-[#999999]"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      default:
        return null
    }
  }

  const renderCard = (card: CardConfig, index: number) => {
    const finalCard = card.preset ? getPresetCard(card.preset, card) : card

    if (!finalCard.title || !finalCard.icon) {
      console.warn('Card missing required fields:', finalCard)
      return null
    }

    return (
      <div key={index} className="rounded-[26px] bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between">
          <h3 className="text-[20px] font-semibold" style={{ color: finalCard.titleColor || '#000000' }}>
            {finalCard.title}
          </h3>
          <div className="relative ml-3 size-[36px] shrink-0 overflow-hidden rounded-full">{finalCard.icon}</div>
        </div>
        {finalCard.content && finalCard.content.length > 0 && (
          <div className="mt-[10px] space-y-[10px]">
            {finalCard.content.map((block, blockIndex) => renderContentBlock(block, blockIndex))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[60] bg-black/30 transition-opacity duration-300 ease-out',
          isAnimating ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 top-[62px] z-[70] flex flex-col rounded-t-[32px] bg-[#F5F5F5] transition-transform duration-300 ease-out',
          isAnimating ? 'translate-y-0' : 'translate-y-full',
          className
        )}
      >
        {/* Fixed Header */}
        <div className="relative flex h-[72px] shrink-0 items-center justify-center border-b border-transparent px-5">
          <h2 className="text-[20px] font-bold text-black">{title}</h2>
          <button
            onClick={onClose}
            className="absolute right-5 top-1/2 flex size-[42px] -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_0_rgba(0,0,0,0.1)]"
          >
            <X size={24} className="text-black" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-5 pb-8">
          <div className="space-y-6">{cards.map((card, index) => renderCard(card, index))}</div>
        </div>
      </div>
    </>
  )
}

export function AboutIcon({ className }: { className?: string }) {
  return (
    <svg
      width="78"
      height="78"
      viewBox="0 0 78 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="39.2729" cy="38" r="18" fill="#F7F7F7" />
      <circle cx="39.2729" cy="38" r="18" fill="url(#paint0_radial_46097_90729)" />
      <path
        d="M44.508 31.9318L43.3963 32.7653C42.908 33.1317 42.2241 33.0827 41.7922 32.6516L40.1408 31.0001C39.6615 30.5208 38.8843 30.5208 38.4058 31.0001L36.7544 32.6516C36.3225 33.0835 35.6387 33.1317 35.1503 32.7653L34.0387 31.9318C33.4997 31.5277 32.73 31.9122 32.73 32.5862V43.4185C32.73 44.0925 33.4997 44.477 34.0387 44.0729L35.1503 43.2394C35.6387 42.8729 36.3225 42.922 36.7544 43.3531L38.4058 45.0046C38.8852 45.4839 39.6623 45.4839 40.1408 45.0046L41.7922 43.3531C42.2241 42.9212 42.908 42.8729 43.3963 43.2394L44.508 44.0729C45.047 44.477 45.8167 44.0925 45.8167 43.4185V32.5862C45.8167 31.9122 45.047 31.5269 44.508 31.9318ZM40.0909 40.2513H36.0011C35.6624 40.2513 35.3876 39.9765 35.3876 39.6379C35.3876 39.2992 35.6624 39.0244 36.0011 39.0244H40.0909C40.4295 39.0244 40.7044 39.2992 40.7044 39.6379C40.7044 39.9765 40.4295 40.2513 40.0909 40.2513ZM42.5448 36.9795H36.0011C35.6624 36.9795 35.3876 36.7046 35.3876 36.366C35.3876 36.0274 35.6624 35.7525 36.0011 35.7525H42.5448C42.8834 35.7525 43.1583 36.0274 43.1583 36.366C43.1583 36.7046 42.8834 36.9795 42.5448 36.9795Z"
        fill="black"
      />
      <defs>
        <radialGradient
          id="paint0_radial_46097_90729"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(21.2729 56) scale(44.2345 46.9963)"
        >
          <stop stopColor="#40E1EF" stopOpacity="0.2" />
          <stop offset="1" stopColor="#40E1EF" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}

export function GuidelinesIcon({ className }: { className?: string }) {
  return (
    <svg
      width="79"
      height="79"
      viewBox="0 0 79 79"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="39.2729" cy="39.2734" r="18" fill="#F7F7F7" />
      <circle cx="39.2729" cy="39.2734" r="18" fill="url(#paint0_radial_46097_90736)" />
      <path
        d="M39.2732 31.0898C34.7535 31.0898 31.0898 34.7535 31.0898 39.2732C31.0898 43.7928 34.7535 47.4565 39.2732 47.4565C43.7928 47.4565 47.4565 43.7928 47.4565 39.2732C47.4565 34.7535 43.7928 31.0898 39.2732 31.0898ZM39.8869 42.9557C39.8869 43.2945 39.612 43.5694 39.2732 43.5694C38.9344 43.5694 38.6594 43.2945 38.6594 42.9557V39.215C38.6594 38.8762 38.9344 38.6013 39.2732 38.6013C39.612 38.6013 39.8869 38.8762 39.8869 39.215V42.9557ZM39.2896 37.2273C38.8378 37.2273 38.467 36.8607 38.467 36.409C38.467 35.9573 38.8296 35.5907 39.2814 35.5907H39.2896C39.7421 35.5907 40.1079 35.9573 40.1079 36.409C40.1079 36.8607 39.7413 37.2273 39.2896 37.2273Z"
        fill="black"
      />
      <defs>
        <radialGradient
          id="paint0_radial_46097_90736"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(21.2729 57.2734) scale(44.2345 46.9963)"
        >
          <stop stopColor="#40E1EF" stopOpacity="0.2" />
          <stop offset="1" stopColor="#40E1EF" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}

export function RedlineIcon({ className }: { className?: string }) {
  return (
    <svg
      width="79"
      height="79"
      viewBox="0 0 79 79"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="39.2729" cy="39.2734" r="18" fill="#F7F7F7" />
      <circle cx="39.2729" cy="39.2734" r="18" fill="url(#paint0_radial_46097_90749)" />
      <path
        d="M47.1347 43.489L41.728 33.3775C40.6806 31.4184 37.8663 31.4184 36.818 33.3775L31.4114 43.489C30.4506 45.2861 31.7551 47.4562 33.7968 47.4562H44.7492C46.7902 47.4562 48.0954 45.2853 47.1347 43.489ZM38.6593 37.6362C38.6593 37.2974 38.9342 37.0225 39.273 37.0225C39.6118 37.0225 39.8868 37.2974 39.8868 37.6362V40.9095C39.8868 41.2483 39.6118 41.5233 39.273 41.5233C38.9342 41.5233 38.6593 41.2483 38.6593 40.9095V37.6362ZM39.2894 44.1829C38.8377 44.1829 38.4669 43.8163 38.4669 43.3645C38.4669 42.9128 38.8295 42.5462 39.2812 42.5462H39.2894C39.742 42.5462 40.1078 42.9128 40.1078 43.3645C40.1078 43.8163 39.7411 44.1829 39.2894 44.1829Z"
        fill="black"
      />
      <defs>
        <radialGradient
          id="paint0_radial_46097_90749"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(21.2729 57.2734) scale(44.2345 46.9963)"
        >
          <stop stopColor="#D92B2B" stopOpacity="0.2" />
          <stop offset="1" stopColor="#D92B2B" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}
