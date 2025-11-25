import React from 'react'

interface ProgressBarProps {
  progress: number
  isVisible: boolean
}

const FullscreenProgressBar: React.FC<ProgressBarProps> = ({ progress, isVisible }) => {
  if (!isVisible) return <></>

  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-black/80 transition-opacity duration-300">
      <div className="shadow-lg w-4/5 max-w-2xl overflow-hidden rounded-full bg-white/30">
        <div
          className="h-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-4 text-2xl font-semibold text-white">{Math.round(progress)}%</div>
    </div>
  )
}

export default FullscreenProgressBar
