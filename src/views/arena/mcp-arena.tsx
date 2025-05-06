import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import McpToolsUI, { IMCPServer } from '@/components/arena/mcp-tools'
import RemoteServerPanel from '@/components/arena/vnc-server'
import { message } from 'antd'

export default function MCPArenaPage() {
  const [inputValue, setInputValue] = useState('')

  const [servers, setServers] = useState<IMCPServer[]>([])
  const [scrolled, setScrolled] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
  }

  const handleServersChange = (newServers: IMCPServer[]): void => {
    setServers(newServers)
  }

  async function sendTask(serverUrl: string, data: unknown) {
    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('postJson error:', error)
      return error
    }
  }

  const handleSendClick = async () => {
    const prompt = inputValue
    const combinedData = { prompt, servers }

    const serverUrls = ['http://47.237.83.209:80/api/executeTask', 'http://47.236.250.166:80/api/executeTask']

    try {
      for (const url of serverUrls) {
        const result = await sendTask(url, combinedData)
        console.log(`Result from ${url}:`, result)
      }
      messageApi.open({
        type: 'success',
        content: 'All tasks sent successfully!'
      })
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: `Task Execute Failed: ${error}`
      })
      console.log(`Task Execute Failed: ${error}`)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-black text-gray-200">
      {/* Main Content */}
      <motion.main
        className="flex w-full flex-col space-y-10 px-6 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Title */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl font-bold leading-snug text-white md:text-4xl">
            ⚔️ Computer Agent Arena: Compare & Test AI Agents on Crowdsourced Real-World Computer Use Tasks
          </h1>
        </motion.div>

        {/* Panels */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {[1, 2].map((_, idx) => (
            <motion.div
              key={idx}
              className="overflow-hidden rounded-2xl bg-gray-800/80 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <RemoteServerPanel
                url={idx === 1 ? 'http://47.237.83.209:5901/vnc.html' : 'http://47.236.250.166:5901/vnc.html'}
              />
            </motion.div>
          ))}
        </div>

        {/* McpToolsUI */}
        <motion.div
          className="w-full rounded-2xl bg-gray-800/80 p-6 shadow-xl backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <McpToolsUI isOpen={true} onClose={() => {}} onServersChange={handleServersChange} />
        </motion.div>

        {/* Input Section */}
        {contextHolder}
        <motion.div
          className="flex w-full flex-col items-center space-y-4 rounded-2xl bg-gray-800/80 p-6 shadow-xl backdrop-blur-md md:flex-row md:space-x-4 md:space-y-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Please Connect Virtual Machine First..."
            className="flex-1 rounded-lg border-2 border-gray-700 bg-gray-900/90 p-4 text-sm text-white shadow-inner transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-600 md:text-base"
            rows={4}
            style={{ resize: 'none' }}
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px #06b6d4' }}
            className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-cyan-400 hover:to-blue-400 md:text-base"
            onClick={handleSendClick}
          >
            ➤ Send
          </motion.button>
        </motion.div>
      </motion.main>
    </div>
  )
}
