// import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import './Footer.scss'

export default function Footer() {
  const location = useLocation()

  return (
    <div className="mt-64px footer text-base">
      {/* <span className="title-1">* </span> */}
      {location.pathname !== '/board' && (
        <div>
          We utilize the Microscope protocol for storing and managing our data.
          The collected data will be contributed to the Microscope protocol.
        </div>
      )}
      <div className="flex justify-between mt-64px text-#FFFFFF73">
        <section>
          <div className="text-#fff font-semibold text-2xl">
            codatta Protocol
          </div>
          <div className="mt-16px ">
            The world's leading AI-powered collaboration protocol for blockchain
            metadata.
          </div>
          <div className="mt-43px text-#FFFFFF99">
            Have questions? Email us at hello@codatta.io
          </div>
        </section>
        <aside className="text-sm w-256px mt-13px">
          Social
          <div className="icon twitter-icon">
            <a href="https://x.com/codatta_io" className="no-underline">
              Twitter
            </a>
          </div>
          <div className="icon telegram-icon">
            <a href="https://t.me/codatta_io" className="no-underline">
              Telegram
            </a>
          </div>
          <div className="icon medium-icon">
            <a href="https://codatta.medium.com" className="no-underline">
              Medium
            </a>
          </div>
          <div className="icon discord-icon">
            <a href="https://discord.gg/YCESVmHEYv" className="no-underline">
              Discord
            </a>
          </div>
          <div className="icon annoucement-icon">
            <a href="https://t.me/codatta_ann" className="no-underline">
              Announcement
            </a>
          </div>
          {/* <div className="icon linkedin-icon">Linkedin</div>  */}
        </aside>
      </div>
    </div>
  )
}
