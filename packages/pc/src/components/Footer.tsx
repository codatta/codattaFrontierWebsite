// import styled from 'styled-components'
import './Footer.scss'

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
            <a href="https://twitter.com/b18a_io" className="no-underline">
              Twitter
            </a>
          </div>
          <div className="icon telegram-icon">
            <a href="https://t.me/b18a_io" className="no-underline">
              Telegram
            </a>
          </div>
          <div className="icon medium-icon">
            <a href="https://medium.com/@b18a" className="no-underline">
              Medium
            </a>
          </div>
          <div className="icon discord-icon">
            <a href="https://discord.gg/YCESVmHEYv" className="no-underline">
              Discord
            </a>
          </div>
          {/* <div className="icon linkedin-icon">Linkedin</div>  */}
        </aside>
      </div>
    </div>
  )
}
