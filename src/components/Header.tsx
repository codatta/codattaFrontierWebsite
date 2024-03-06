import styled from 'styled-components'
import { Button } from 'antd'

/**
 * 缺Logo图标
 */

const Logo = styled.div`
  height: 24px;
  line-height: 24px;
`
export default function Header() {
  return (
    <header className="header flex justify-between items-center font-medium mt-14px color-white">
      <Logo className="pl-32px ">Ominitags</Logo>
      <Button ghost size="middle" className="">
        Sign in
      </Button>
    </header>
  )
}
