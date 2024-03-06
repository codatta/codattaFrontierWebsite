import twitterIcon from '../assets/images/twitter-icon.svg'
import telegramIcon from '../assets/images/telegram-icon.svg'
import discordIcon from '../assets/images/discord-icon.svg'
import linkedinIcon from '../assets/images/linkedin-icon.svg'

import styled from 'styled-components'

const Icon = styled.div`
  margin-top: 12px;
  height: 24px;
  line-height: 24px;
  padding-left: 33px;
  background-position: left center;
  background-repeat: no-repeat;
  background-size: 24px auto;
`

const TwitterIcon = styled(Icon)`
  margin-top: 16px;
  background-image: url(${twitterIcon});
`
const TelegramIcon = styled(Icon)`
  background-image: url(${telegramIcon});
`
const DiscordIcon = styled(Icon)`
  background-image: url(${discordIcon});
`
const LinkedinIcon = styled(Icon)`
  background-image: url(${linkedinIcon});
`

const Divider = styled.div`
  width: 100%;
  height: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.45);
  margin-bottom: 32px;
`

export default function Footer() {
  return (
    <>
      <span className="title-1">* </span>
      <div>
        1. We utilize the Microscope protocol for storing and managing our data.
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
            Have questions? Email us at{' '}
            <a href="" target="blank" className="color-inherit">
              h
            </a>
          </div>
        </section>
        <aside className="text-sm w-256px mt-13px">
          <div>Social</div>
          <TwitterIcon>Twitter</TwitterIcon>
          <TelegramIcon>Telegram</TelegramIcon>
          <DiscordIcon>Discord</DiscordIcon>
          <LinkedinIcon>Linkedin</LinkedinIcon>
        </aside>
      </div>
      <div className="mt-48px pt-32px text-base">
        <Divider />
        <div>© 2024 Blockchain Metadata Labs Inc. All rights reserved.</div>
      </div>
    </>
  )
}
