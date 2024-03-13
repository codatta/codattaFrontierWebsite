import { Button } from 'antd'
import Search from 'antd/es/input/Search'
import { RightOutlined } from '@ant-design/icons'

// import AniBorder from '@/components/effects/AniBorder'

import './Signup.scss'

export default function Signup() {
  return (
    <div className="signup mt-88px h-58px flex gap-8px items-center">



      {/* <Search
        placeholder="Email address"
        allowClear
        enterButton="Sign up for Ominitags"
        size="large"
        className="w-485px h-full mr-24px"
      // addonBg="rgba(255, 0, 0, 0.7)"
      // onSearch={onSearch}
      /> */}
      <div className='flex'>
        <input className='rounded-l-8px w-380px outline-none bg-white border-none px-20px block text-16px' placeholder='Email address' type="text" />
        <button className='rounded-r-8px h-48px px-24px block border-none outline-none text-white font-700 text-16px' style={{ background: 'linear-gradient(180deg, #C63F6C 0%, #652ECC 100%)' }}>Sign up for THE Great Mission</button>
      </div>
      <div className="w-1px h-48px bg-#fff opacity-10"></div>
      <button className='flex items-center border-1px border-#B67FE0 bg-transparent rounded-8px text-white h-48px block p-x-24px text-16px font-700'>
        Start with your wallet
        <RightOutlined size={3} className='ml-12px' />
      </button>
      {/* <AniBorder>Start with your wallet</AniBorder> */}
    </div>
  )
}
