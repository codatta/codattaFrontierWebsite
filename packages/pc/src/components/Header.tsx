import { useState } from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import './Header.scss'
import logImg from '../assets/images/icons/logo-white.png'

const Logo = styled.div`
  background: url(${logImg}) left center no-repeat;
  background-size: contain;
`
export default function Head() {
  const [nav, setNav] = useState('/')

  return (
    <>
      <header className="header flex justify-between items-center font-medium pt-14px color-white pr-48px ml-64px">
        <Logo className="w-200px h-30px text-xs"></Logo>
        <div className="border-1px border-solid border-#fff border-opacity-10 py-8px px-16px rounded-20px text-#fff text-opacity-60 flex justify-around bg-#fff bg-opacity-2">
          <NavLink
            className="h-full leading-24px no-underline nav cursor-pointer block mr-40px"
            to="/"
            onClick={() => setNav('/')}
          >
            Features
          </NavLink>
          <NavLink
            className="h-full leading-24px no-underline nav cursor-pointer block"
            to="/board"
            onClick={() => setNav('/board')}
          >
            Monitoring
          </NavLink>
        </div>
        <div />
      </header>
    </>
  )
}
