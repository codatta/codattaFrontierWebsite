import { useState } from 'react'
import { motion } from 'framer-motion'

interface RemoteServerPanelProps {
  url: string
}

const RemoteServerPanel: React.FC<RemoteServerPanelProps> = ({ url }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnectClick = () => {
    setIsConnecting(true)
    setProgress(0)

    const startTime = Date.now()
    const duration = 2000

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / duration) * 100, 100)
      setProgress(newProgress)

      if (elapsed >= duration) {
        clearInterval(timer)
        setIsConnecting(false)
        setIsConnected(true)
      }
    }, 50)
  }

  return (
    <motion.div
      className="aspect-[4/3] size-full rounded-xl bg-gray-800 shadow-lg transition-all hover:shadow-2xl"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="relative size-full overflow-hidden rounded-xl">
        {isConnected ? (
          <>
            {!iframeLoaded && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-800">
                <div className="size-12 animate-spin rounded-full border-4 border-purple-400 border-t-transparent"></div>
              </div>
            )}
            <motion.iframe
              key={url}
              src={url}
              className="size-full border-0"
              title="Embedded Content"
              frameBorder="0"
              scrolling="no"
              initial={{ opacity: 0 }}
              animate={{ opacity: iframeLoaded ? 1 : 0 }}
              transition={{ duration: 0.6 }}
              onLoad={() => setIframeLoaded(true)}
            />
          </>
        ) : (
          <div className="flex size-full flex-col items-center justify-center p-4">
            {!isConnecting ? (
              <>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="mx-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 px-5 py-2 text-sm font-semibold text-black transition-all hover:from-purple-500 hover:to-purple-700 md:px-6 md:py-3 md:text-base"
                  onClick={handleConnectClick}
                >
                  Connect
                </motion.button>
              </>
            ) : (
              <div className="flex w-full flex-col items-center">
                <span className="mb-4 text-sm text-white md:text-base">Connecting...</span>
                <div className="h-4 w-full overflow-hidden rounded-full bg-gray-700">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
                    style={{ width: `${progress}%`, transition: 'width 0.05s linear' }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default RemoteServerPanel
