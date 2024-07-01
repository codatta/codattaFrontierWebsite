// import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import './Footer.scss'
import CopyRights from './CopyRights'

export default function Footer() {
  const location = useLocation()

  return (
    <div className="mt-64px footer text-base max-w-1240px m-auto box-border pl-5 pr-5 pt-2.5 pb-16">
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
            Have questions? Email us at{' '}
            <a
              href="mailto:hello@codatta.io"
              className="text-#FFFFFF99 no-underline hover:underline"
            >
              hello@codatta.io
            </a>
          </div>
        </section>
        <aside className="w-256px mt-13px font-semibold">
          <div className="text-sm ">Social</div>
          <div className="icon twitter-icon">
            <a href="https://x.com/codatta_io" target="_blank">
              Twitter
            </a>
          </div>
          <div className="icon telegram-icon">
            <a href="https://t.me/codatta_io" target="_blank">
              Telegram
            </a>
          </div>
          <div className="icon medium-icon">
            <a href="https://codatta.medium.com" target="_blank">
              Medium
            </a>
          </div>
          <div className="icon discord-icon">
            <a href="https://discord.gg/YCESVmHEYv" target="_blank">
              Discord
            </a>
          </div>
          <div className="icon annoucement-icon">
            <a href="https://t.me/codatta_ann" target="_blank">
              Announcement
            </a>
          </div>
          <div className="mt-16px text-sm ">Docs</div>
          <div className="icon brand-icon">
            <a href="https://docs.codatta.io/codatta" target="_blank">
              Documentation
            </a>
          </div>
          <div className="icon github-icon">
            <a href="https://github.com/codatta/brand-kit/" target="_blank">
              Brand Kit
            </a>
          </div>
        </aside>
      </div>
      <CopyRights />
    </div>
  )
}
