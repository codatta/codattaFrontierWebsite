import microImg from '@/assets/images/article-1/micro.svg'
import tracingIcon from '@/assets/images/icons/tracing-icon-1.svg'
import styled from 'styled-components'
import Signup from './Signup'
import BackgroundBeams from '../effects/BgBeam'
import Bg from './Bg'
import Title from './Title'

import './Index.scss'
import { DynamicConnectButton, useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { useEffect, useState } from 'react'
import { Modal } from 'antd'

function Head() {
  return (
    <header className="header flex justify-between items-center font-medium pt-14px color-white pr-64px">
      <div className="pl-48px w-68px text-xs logo">
        <div className="bold text-base">b18a</div>
        <div className="text-8px">
          {'{'}blockchain:metadata{'}'}
        </div>
      </div>
      <DynamicConnectButton buttonClassName='ml-auto border-1px border-white bg-transparent text-white rounded-8px text-16px font-500 leading-24px px-12px py-6px cursor-pointer'>
        Sign in
      </DynamicConnectButton>
    </header>
  )
}

const Circle = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
`

const Line1 = styled.div`
  background: linear-gradient(
    to bottom,
    rgba(139, 63, 198, 0.01),
    rgba(90, 36, 133, 1)
  );
`

const Line2 = styled.div`
  background: linear-gradient(
    to bottom,
    rgba(108, 41, 160, 1),
    rgba(0, 170, 81, 1)
  );
`
const GuideLine = () => {
  return (
    <div className="flex flex-col justify-between items-center guide-line">
      <Circle className="w-10px h-10px" />
      <Line1 className="w-4px h-300px" />
      <img src={tracingIcon} className="w-48px h-48px" />
      <Line2 className="w-4px h-274px" />
    </div>
  )
}

const Article = () => {
  const { user, handleLogOut } = useDynamicContext()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!user) return
    handleLogOut()
    setOpen(true)
  }, [user])

  return (
    <div className="relative overflow-hidden">
      <Head />
      <div className="relative flex mt-94px overflow-hidden">
        <GuideLine />
        <div className="main">
          <Title />
          {/* <div className="text-80px leading-88px color-#fff font-semibold">
            Let's annotate crypto
            <br /> addresses from here
          </div>
          <p className="text-2xl mt-16px">
            The world's leading AI-powered collaboration protocol for blockchain
            metadata.
          </p> */}
          <Signup />
          <a
            href="https://microscopeprotocol.xyz"
            target="_blank"
            className="mt-67px block"
          >
            <img src={microImg} className="h-124px" />
          </a>
          <div className="w-full absolute inset-0 top-0 left-0 pointer-events-none">
            <BackgroundBeams />
          </div>
        </div>
      </div>
      <Bg />
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
    </div>
  )
}

export default Article
