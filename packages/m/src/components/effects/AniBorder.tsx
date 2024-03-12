import React from 'react'
import './AniBorder.scss'

interface AniBorderProps {
  children: React.ReactNode
}

const AniBorder: React.FC<AniBorderProps> = ({ children }) => {
  return (
    <div className="wrapper">
      <div className="btn-border-animate">
        <a href="#">
          <p>{children}</p>
          <div className="hoverBtn"></div>
          <div className="hoverBtn-bottom"></div>
        </a>
      </div>
    </div>
  )
}

export default AniBorder
