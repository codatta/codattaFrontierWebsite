import { Loader2 } from 'lucide-react'
import Markdown from 'react-markdown'

export interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
  status?: 'loading' | 'done'
}

interface ChatHistoryProps {
  messages: ChatMessage[]
}

export default function ChatHistory(props: ChatHistoryProps) {
  return (
    <div className="flex flex-col items-start gap-6">
      {props.messages.map((message, index) => (
        <>
          {/* user message */}
          {message.role === 'user' && (
            <div className="self-end rounded-lg border border-primary/10 bg-primary/15 px-4 py-3" key={index}>
              {message.text}
            </div>
          )}

          {/* assistant message */}
          {message.role === 'assistant' && (
            <div className="rounded-lg border border-white/10 px-4 py-3" key={index}>
              {/* loading */}
              {message.status === 'loading' && !message.text && (
                <Loader2 className="animate-spin text-primary"></Loader2>
              )}
              {/* markdown message */}
              <Markdown
                children={message.text}
                components={{
                  code: ({ children }) => <code>{children}</code>
                }}
              />
            </div>
          )}
        </>
      ))}
    </div>
  )
}
