import {
  DynamicConnectButton,
  useDynamicContext,
} from '@dynamic-labs/sdk-react-core'
import { Modal } from 'antd'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Head.scss'

function Head({ className }: { className?: string }) {
  const { user, handleLogOut } = useDynamicContext()
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [nav, setNav] = useState('/')

  useEffect(() => {
    if (!user) return
    handleLogOut()
    setOpen(true)
  }, [user])

  return (
    <div className="relative">
      <header
        className={`header flex justify-between items-center font-medium pt-12px color-white relative z-3 ${className}`}
      >
        <div className="w-200px h-30px text-xs logo"></div>
        <div className="flex items-center">
          <DynamicConnectButton buttonClassName="mr-8px signin-btn text-sm color-#fff rounded-6px">
            Sign in
          </DynamicConnectButton>
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
      <Modal
        width={'83%'}
        centered
        open={open}
        onCancel={() => setOpen(false)}
        closable={false}
        footer={null}
      >
        <h2 className="text-20px font-700 m-b-16px">Thank You</h2>
        <span>
          Thank you for your interest in our product. Your email has been added
          to the waiting list. Once our product is released, we will promptly
          send an email for you.
        </span>
        <button
          className="mt-24px m-l-auto rounded-8px h-36px px-32px block border-none outline-none text-white font-700 text-14px bg-gradient-to-b from-#C63F6C to-#652ECC"
          onClick={() => setOpen(false)}
        >
          OK
        </button>
      </Modal>
    </div>
  )
}

export default Head
