import React, { useState, useEffect } from 'react'
import { Switch } from 'antd'

type UIProps = {
  isOpen: boolean
  onClose: () => void
  onServersChange: (servers: IMCPServer[]) => void
}

export interface IMCPServer {
  key: string
  command: string
  description?: string
  args: string[]
  env?: Record<string, string>
  isActive: boolean
}

const McpToolsUI: React.FC<UIProps> = ({ isOpen, onServersChange }) => {
  const [servers, setServers] = useState<IMCPServer[]>([
    {
      key: 'SequentialThinking',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-sequential-thinking'],
      description: 'An MCP server tool for dynamic problem-solving with structured thinking.',
      isActive: true
    },
    {
      key: 'Web3andKOLResearch',
      command: 'npx',
      args: ['-y', 'kol_analyzer@1.0.16'],
      env: {
        TWITTER_API_KEY: '1a7f72c172ba41048e71a02b10359000',
        COINGECKO_API_KEY: 'CG-F6xRpFbWjzFNbJ4R7HTsZ3m9',
        TAVILY_API_KEY: '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'
      },
      description:
        'A Model Context Protocol server that analyzes cryptocurrency projects from tweets and public information. It extracts and processes data from KOL tweets, identifies crypto-related content, and generates comprehensive reports. The server utilizes specialized tools for Twitter data retrieval, smart search capabilities, and structured formatting of crypto analysis reports.',
      isActive: true
    },
    {
      key: 'mcp-notion-server',
      command: 'npx',
      args: ['-y', '@suekou/mcp-notion-server'],
      env: {
        NOTION_API_TOKEN: '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',
        NOTION_MARKDOWN_CONVERSION: 'true',
        NOTION_PAGE_ID: '1df53b7ccd66804e90fbf67033b8d226'
      },
      description:
        'An MCP Server for the Notion API, enabling LLM to interact with Notion workspaces. Additionally, it employs Markdown conversion to reduce context size when communicating with LLMs, optimizing token usage and making interactions more efficient',
      isActive: true
    }
  ])

  useEffect(() => {
    onServersChange(servers)
  }, [])

  const handleEnableToggleChange = (selectKey: string) => (checked: boolean) => {
    setServers((prev) => {
      const updatedServers = prev.map((server) =>
        server.key === selectKey ? { ...server, isActive: checked } : server
      )
      return updatedServers
    })
    onServersChange(servers)
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="flex size-full flex-col">
      <h2 className="mb-4 text-2xl font-bold text-white">MCP Servers</h2>
      <div className="grid grid-cols-1 gap-6 overflow-y-auto transition-all duration-300 sm:grid-cols-2 md:grid-cols-3">
        {servers.map((server) => (
          <div
            key={server.key}
            className="flex h-28 flex-col rounded-2xl bg-white/5 p-4 shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center space-x-2">
                <span
                  className={`size-3 rounded-full ${server.isActive ? 'bg-green-500' : 'bg-white/20 line-through'}`}
                />
                <span className="text-sm font-semibold text-white">{server.key}</span>
              </div>
              <Switch onChange={handleEnableToggleChange(server.key)} checked={server.isActive} size="small" />
            </div>
            <div className="mt-2 text-left">
              <p className="line-clamp-2 text-xs leading-relaxed text-white opacity-60">{server.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default McpToolsUI
