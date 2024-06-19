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
    <div className="mt-24px pb-36px text-sm footer text-#FFFFFF73">
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
      <section className="mt-48px text-base">
        <div className="text-2xl text-#fff tracing-tight">codatta Protocol</div>
        <div className="mt-16px">
          The world's leading AI-powered collaboration protocol for blockchain
          metadata.
        </div>
        <div className="mt-18px text-base text-#FFFFFF99">
          Have questions? Email us at{' '}
          <a
            href="mailto:hello@codatta.io "
            className="no-underline hover:underline text-#FFFFFF99"
          >
            hello@codatta.io
          </a>
        </div>
      </section>
      <section className="mt-24px text-base">
        <div className="text-sm ">Social</div>
        <div className="flex justify-start items-center">
          <a href="https://x.com/codatta_io">
            <div className="icon twitter-icon" />
          </a>
          <a href="https://t.me/codatta_io">
            <div className="icon telegram-icon" />
          </a>
          <a href="https://codatta.medium.com">
            <div className="icon medium-icon"></div>
          </a>
          <a href="https://discord.gg/YCESVmHEYv">
            <div className="icon discord-icon" />
          </a>
          <a href="https://t.me/codatta_ann">
            <div className="icon annoucement-icon" />
          </a>
        </div>
        <div className="text-sm mt-16px">Docs</div>
        <div className="flex justify-start items-center">
          <a href="https://github.com/codatta/brand-kit">
            <div className="icon brand-icon" />
          </a>
        </div>
      </section>
    </div>
  )
}
