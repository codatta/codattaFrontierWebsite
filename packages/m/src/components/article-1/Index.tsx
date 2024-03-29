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
    <header className="header flex justify-between items-center font-medium pt-12px pl-24px color-white">
      <div className="pl-32px w-109px text-xs logo">
        <div className="bold text-base">b18a</div>
        <div className="text-8px leading-8px">
          <i>Blockchain:Metadata</i>
        </div>
      </div>
      <DynamicConnectButton buttonClassName="mr-25px signin-btn text-sm color-#fff rounded-6px">
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
    <div className="flex flex-col justify-between items-center guide-line ml-14px mr-7px">
      {/* <Circle className="w-10px h-10px" /> */}
      <Line1 className="w-4px h-343px" />
      <img src={tracingIcon} className="w-48px h-48px" />
      <Line2 className="w-4px h-172px" />
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
    <div className="relative">
      <Head />
      <Bg />
      <div className="w-full h-580px absolute inset-0 top-0 left-0 pointer-events-none">
        <BackgroundBeams />
      </div>
      <div className="flex mt-243px ">
        <GuideLine />
        <div className="main">
          <Title />
          <Signup />
          <a
            href="https://microscopeprotocol.xyz"
            target="_blank"
            className="mt-40px block"
          >
            <img src={microImg} className="h-94px" />
          </a>
        </div>
      </div>

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

export default Article
