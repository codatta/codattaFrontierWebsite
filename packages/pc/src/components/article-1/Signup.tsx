import { RightOutlined } from '@ant-design/icons'

// import AniBorder from '@/components/effects/AniBorder'

import './Signup.scss'
// import { DynamicConnectButton } from '@dynamic-labs/sdk-react-core'

export default function Signup() {
  function jump2App() {
    const href = /test/.test(location.pathname)
      ? 'https://app.test.codatta.io/account/signin'
      : 'https://app.codatta.io/account/signin'

    location.href = href
  }

  return (
    <div className="signup mt-88px h-58px flex gap-8px items-center">
      <div className="flex">
        {/* <DynamicConnectButton buttonClassName="cursor-pointer rounded-8px h-48px px-24px block border-none outline-none text-white font-700 text-16px bg-gradient-to-b from-#C63F6C to-#652ECC">
          Sign up for THE Great Mission
        </DynamicConnectButton> */}
        <button
          className="cursor-pointer rounded-8px h-48px px-24px block border-none outline-none text-white font-700 text-16px bg-gradient-to-b from-#C63F6C to-#652ECC"
          onClick={jump2App}
        >
          Sign up for THE Great Mission
        </button>
      </div>
      {/* <div className="w-1px h-48px bg-#fff opacity-10"></div> */}
      {/* <DynamicConnectButton buttonClassName="cursor-pointer flex items-center border-1px border-#B67FE0 bg-transparent rounded-8px text-white h-48px block p-x-24px text-16px font-700">
        Start with your wallet
        <RightOutlined size={3} className="ml-12px" />
      </DynamicConnectButton> */}
      {/* <button
        className="cursor-pointer flex items-center border-1px border-#B67FE0 bg-transparent rounded-8px text-white h-48px block p-x-24px text-16px font-700"
        onClick={jump2App}
      >
        Start with your wallet
        <RightOutlined size={3} className="ml-12px" />
      </button> */}
    </div>
  )
}
