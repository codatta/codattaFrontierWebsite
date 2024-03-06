import { Button } from 'antd'
import Search from 'antd/es/input/Search'
import { RightOutlined } from '@ant-design/icons'

import './Signup.scss'

export default function Signup() {
  return (
    <div className="signup mt-88px h-48px flex">
      <Search
        placeholder="Email address"
        allowClear
        enterButton="Sign up for Ominitags"
        size="large"
        className="w-485px h-full mr-24px"
        // addonBg="rgba(255, 0, 0, 0.7)"
        // onSearch={onSearch}
      />
      <div className="w-1px h-full bg-#fff opacity-10 mr-24px"></div>
      <Button size="large" ghost>
        Start with your wallet
        <span className="ml-12px">
          <RightOutlined size={3} />
        </span>
      </Button>
    </div>
  )
}
