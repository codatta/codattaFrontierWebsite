import {
  DynamicConnectButton,
  useDynamicContext,
} from '@dynamic-labs/sdk-react-core'
import { Modal } from 'antd'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import logImg from '../assets/images/icons/logo-text.jpeg'

const Logo = styled.div`
  background: url(${logImg}) left center no-repeat;
  background-size: contain;
`
export default function Head() {
  const { user, handleLogOut } = useDynamicContext()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!user) return

    handleLogOut()
    setOpen(true)
  }, [user])

  return (
    <>
      <header className="header flex justify-between items-center font-medium pt-14px color-white pr-64px">
        <Logo className="w-200px h-30px text-xs"></Logo>
        <div className="border-1px border-solid border-#fff border-opacity-10 w-224px h-48px rounded-24px text-#fff text-opacity-60">
          e
        </div>
        <DynamicConnectButton buttonClassName="ml-auto border-1px border-white bg-transparent text-white rounded-16px text-16px font-500 leading-24px px-12px py-6px cursor-pointer">
          Sign in
        </DynamicConnectButton>
      </header>

      <Modal
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
      </Modal>
    </>
  )
}
