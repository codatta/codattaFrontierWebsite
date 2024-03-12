import styled from 'styled-components'
import './Footer.scss'

const Divider = styled.div`
  width: 100%;
  height: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.45);
  margin-bottom: 32px;
  margin-top: 32px;
`

export default function Footer() {
  return (
    <div className="mt-24px pl-56px pr-43px pb-36px text-sm footer">
      <div className="flex">
        <div className="text-10px leading-12px mr-6px">1</div>
        <div>
          We utilize the Microscope protocol for storing and managing our data.
          The collected data will be contributed to the Microscope protocol.
        </div>
      </div>
      <section className="mt-48px">
        <div className="title-1">b18a Protocol</div>
        <div className="mt-16px">
          The world's leading AI-powered collaboration protocol for blockchain
          metadata.
        </div>
        <div className="mt-18px text-base">
          Have questions? Email us at hello@b18a.io
        </div>
      </section>
      <section className="mt-13px text-base">
        <div className="text-sm">Social</div>
        <div className="icon twitter-icon mt-16px">
          <a href="https://twitter.com/b18a_io">Twitter</a>
        </div>
        <div className="icon telegram-icon mt-12px">
          <a href="https://t.me/b18a_io">Telegram</a>
        </div>
        <div className="icon discord-icon">Discord</div>
        <div className="icon linkedin-icon">Linkedin</div>
      </section>
      <Divider />
      <div className="text-base">
        © 2024 b18a Labs Inc. All rights reserved.
      </div>
    </div>
  )
}
