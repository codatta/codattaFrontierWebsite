import { createPortal } from 'react-dom'
import { useGlobalToast } from '@/hooks/use-global-toast'

export default function GlobalToast() {
  const { state } = useGlobalToast()

  if (!state.visible) return null

  return createPortal(
    <div
      className="fixed left-1/2 top-1/2 z-[9999] -translate-x-1/2 -translate-y-1/2"
      style={{
        animation: 'none'
      }}
    >
      <div
        className="relative flex h-[38px] items-center justify-center whitespace-nowrap rounded-lg px-6"
        style={{
          background: 'rgba(51, 51, 51, 0.8)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0px 10px 6px rgba(0, 0, 0, 0.02), 0px 17px 7px rgba(0, 0, 0, 0.01)',
          minWidth: '134px'
        }}
      >
        <span className="text-sm font-normal leading-5 text-white">{state.message}</span>
      </div>
    </div>,
    document.body
  )
}
