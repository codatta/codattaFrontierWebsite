// import {
//   DynamicConnectButton,
//   useDynamicContext,
// } from '@dynamic-labs/sdk-react-core'
// import { Modal } from 'antd'
import { useState } from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import './Header.scss'
import logImg from '../assets/images/icons/logo-text.jpeg'

const Logo = styled.div`
  background: url(${logImg}) left center no-repeat;
  background-size: contain;
`
export default function Head() {
  // const { user, handleLogOut } = useDynamicContext()
  // const [open, setOpen] = useState(false)
  const [nav, setNav] = useState('/')

  // useEffect(() => {
  //   if (!user) return

  //   handleLogOut()
  //   setOpen(true)
  // }, [user])

  function jump2App() {
    const href = /test/.test(location.pathname)
      ? 'https://app.test.b18a.io/account/signin'
      : 'https://app.b18a.io/account/signin'

    console.log('jump2App', href)
    location.href = href
  }

  return (
    <>
      <header className="header flex justify-between items-center font-medium pt-14px color-white pr-48px ml-64px">
        <Logo className="w-200px h-30px text-xs"></Logo>
        <div className="border-1px border-solid border-#fff border-opacity-10 py-8px px-16px rounded-20px text-#fff text-opacity-60 flex justify-around bg-#fff bg-opacity-2">
          <NavLink
            className="h-full leading-24px no-underline nav cursor-pointer block mr-40px"
            to="/"
            onClick={() => setNav('/')}
          >
            Features
          </NavLink>
          <NavLink
            className="h-full leading-24px no-underline nav cursor-pointer block"
            to="/board"
            onClick={() => setNav('/board')}
          >
            Monitoring
          </NavLink>
        </div>
        {/* <DynamicConnectButton buttonClassName="ml-auto border-1px border-white bg-transparent text-white rounded-16px text-16px font-500 leading-24px px-12px py-6px cursor-pointer hover:bg-#fff hover:bg-opacity-16">
          Sign in
        </DynamicConnectButton> */}
        <button
          className="ml-auto border-1px border-white bg-transparent text-white rounded-16px text-16px font-500 leading-24px px-12px py-6px cursor-pointer hover:bg-#fff hover:bg-opacity-16"
          onClick={jump2App}
        >
          Sign in
        </button>
      </header>

      {/* <Modal
        open={open}
        centered
        onCancel={() => setOpen(false)}
        closable={false}
        footer={null}
      >
        <h2 className="text-20px font-700 m-b-20px">Thank You</h2>
        <span className="text-16px">
          Thank you for your interest in our product. Your email has been added
          to the waiting list. Once our product is released, we will promptly
          send an email for you.
        </span>
        <button
          className="mt-24px m-l-auto rounded-8px h-36px px-32px block border-none outline-none text-white font-700 text-16px bg-gradient-to-b from-#C63F6C to-#652ECC"
          onClick={() => setOpen(false)}
        >
          OK
        </button>
      </Modal> */}
    </>
  )
}
