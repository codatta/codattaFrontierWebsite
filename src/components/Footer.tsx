import './Footer.scss'

export default function Footer() {
  return (
    <div className="mt-100px text-2xl">
      <span className="font-semibold">* </span>
      <p className="opacity-45">
        1. We utilize the Microscope protocol for storing and managing our data.
        The collected data will be contributed to the Microscope protocol.
      </p>
      <div className="flex justify-between mt-64px">
        <section>
          <div className="font-semibold">b18a Protocol</div>
          <p className="opacity-45 mt-16px text-base">
            The world's leading AI-powered collaboration protocol for blockchain
            metadata.
          </p>
          <p className="mt-43px opacity-60  text-base">
            Have questions? Email us at{' '}
            <a href="" target="blank" className="color-inherit">
              h
            </a>
          </p>
        </section>
        <aside className="social-group text-sm w-256px">
          <div>Social</div>
          <div className="icon twitter-icon mt-16px">Twitter</div>
          <div className="icon telegram-icon mt-12px">Telegram</div>
          <div className="icon discord-icon mt-12px">Discord</div>
          <div className="icon linkedin-icon mt-12px">Linkedin</div>
        </aside>
      </div>
      <p className="opacity-45 mt-48px pt-32px text-base">
        <div className="divider"></div>
        <p>© 2024 Blockchain Metadata Labs Inc. All rights reserved.</p>
      </p>
    </div>
  )
}
