// import { DynamicConnectButton } from '@dynamic-labs/sdk-react-core'
import './Signup.scss'

export default function Signup() {
  function jump2App() {
    const href = /test/.test(location.pathname)
      ? 'https://app.test.codatta.io/account/signin'
      : 'https://app.codatta.io/account/signin'

    location.href = href
  }

  return (
    <div className="signup text-sm color-#fff">
      {/* <input
        placeholder="Email address"
        className="email-input rounded-lg bg-white w-299px h-38px"
      /> */}

      {/* <DynamicConnectButton buttonClassName='signup-btn rounded-lg color-#fff font-bold w-299px h-38px'>
        Sign up for THE Great Mission
      </DynamicConnectButton>

      <div className="w-299px h-1px bg-#fff opacity-10 mt-16px"></div>
      <DynamicConnectButton buttonClassName="wallet-btn rounded-lg color-#fff font-bold w-299px h-38px mt-16px">
        Start with your wallet
      </DynamicConnectButton> */}

      <button
        className="signup-btn rounded-lg color-#fff font-bold w-299px h-38px"
        onClick={jump2App}
      >
        Sign up for THE Great Mission
      </button>

      <div className="w-299px h-1px bg-#fff opacity-10 mt-16px"></div>
      <button
        className="wallet-btn rounded-lg color-#fff font-bold w-299px h-38px mt-16px"
        onClick={jump2App}
      >
        Start with your wallet
      </button>
    </div>
  )
}
