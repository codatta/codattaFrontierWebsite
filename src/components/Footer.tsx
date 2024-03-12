import styled from 'styled-components'
import './Footer.scss'

const Divider = styled.div`
  width: 100%;
  height: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.45);
  margin-bottom: 32px;
`

export default function Footer() {
  return (
    <div className="mt-64px footer">
      {/* <span className="title-1">* </span> */}
      <div>
        We utilize the Microscope protocol for storing and managing our data.
        The collected data will be contributed to the Microscope protocol.
      </div>
      <div className="flex justify-between mt-64px">
        <section>
          <div className="title-1">b18a Protocol</div>
          <div>
            The world's leading AI-powered collaboration protocol for blockchain
            metadata.
          </div>
          <div className="mt-43px text-base">
            Have questions? Email us at hello@b18a.io
          </div>
        </section>
        <aside className="text-sm w-256px mt-13px">
          Social
          <div className="icon twitter-icon">
            <a href="https://twitter.com/b18a_io">Twitter</a>
          </div>
          <div className="icon telegram-icon">
            <a href="https://t.me/b18a_io">Telegram</a>
          </div>
          <div className="icon discord-icon">Discord</div>
          <div className="icon linkedin-icon">Linkedin</div>
        </aside>
      </div>
      <div className="mt-48px pt-32px text-base">
        <Divider />
        <div>© 2024 b18a Labs Inc. All rights reserved.</div>
      </div>
    </div>
  )
}
