import React, { useState, useRef } from 'react'
import './GithubCard.scss'

const GitHubCard = ({ children }: { children: React.ReactNode }) => {
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })
  const contentRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: { clientX: any; clientY: any }) => {
    const { clientX, clientY } = e
    setHoverPosition({ x: clientX, y: clientY })
  }

  return (
    <div className="github-card" onMouseMove={handleMouseMove}>
      <div className="card-content" ref={contentRef}>
        {children}
      </div>
      <div
        className="hover-effect"
        style={{ top: hoverPosition.y, left: hoverPosition.x }}
      ></div>
    </div>
  )
}

export default GitHubCard
