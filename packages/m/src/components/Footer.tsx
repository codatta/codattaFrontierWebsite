import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import './Footer.scss'

const Divider = styled.div`
  width: 100%;
  height: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.45);
  margin-bottom: 32px;
  margin-top: 32px;
`

export default function Footer() {
  const location = useLocation()

  return (
    <div className="mt-24px pb-36px text-sm footer">
      {!/board/.test(location.pathname) && (
        <div className="flex">
          <div className="text-10px leading-12px mr-6px">1</div>
          <div>
            We utilize the Microscope protocol for storing and managing our
            data. The collected data will be contributed to the Microscope
            protocol.
          </div>
        </div>
      )}
      <section className="mt-48px text-base text-#fff text-opacity-45">
        <div className="text-2xl text-#fff tracing-tight">b18a Protocol</div>
        <div className="mt-16px">
          The world's leading AI-powered collaboration protocol for blockchain
          metadata.
        </div>
        <div className="mt-18px text-base">
          Have questions? Email us at hello@b18a.io
        </div>
      </section>
      <section className="mt-24px text-base">
        <div className="text-sm text-#fff text-opacity-45">Social</div>
        <div className="flex justify-start items-center">
          <a href="https://twitter.com/b18a_io" className="no-underline">
            <div className="icon twitter-icon" />
          </a>
          <a href="https://t.me/b18a_io" className="no-underline">
            <div className="icon telegram-icon" />
          </a>
          <a href="https://medium.com/@b18a" className="no-underline">
            <div className="icon medium-icon"></div>
          </a>
          <a href="https://discord.gg/YCESVmHEYv" className="no-underline">
            <div className="icon discord-icon" />
          </a>
        </div>
      </section>
    </div>
  )
}
