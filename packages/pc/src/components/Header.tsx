import { useState } from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { jump2App } from '@/utils/util'
import logImg from '../assets/images/icons/logo-white.png'
import './Header.scss'

const Logo = styled.div`
  background: url(${logImg}) left center no-repeat;
  background-size: contain;
`
export default function Head() {
  const [nav, setNav] = useState('/')

  return (
    <>
      <header className="relative font-medium color-white m-auto mt-12px flex items-center justify-between main">
        <div className="w-110px">
          <Logo className="w-200px h-24px text-xs"></Logo>
        </div>
        <div className="border-1px border-solid border-#FFFFFF1A rounded-20px text-#fff text-opacity-60 flex justify-center bg-#FFFFFF05">
          <NavLink
            className="leading-24px no-underline nav cursor-pointer block py-8px px-24px rounded-20px"
            to="/"
            onClick={() => setNav('/')}
          >
            Features
          </NavLink>
          <NavLink
            className="leading-24px no-underline nav cursor-pointer block py-8px px-24px rounded-20px"
            to="/board"
            onClick={() => setNav('/board')}
          >
            Monitoring
          </NavLink>
          {/* </div> */}
        </div>
        <button
          className="cursor-pointer rounded-16px h-32px px-24px block border-none outline-none text-#fff text-sm border-1px border-solid border-#FFFFFF99 font-500 bg-transparent text-base"
          onClick={jump2App}
        >
          Lanch App
        </button>
      </header>
    </>
  )
}
