import { useCallback, useEffect, useState, useRef } from 'react'
import { Button, message } from 'antd'
import { Copy } from 'lucide-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import aiModelRequest, { EvaluateValue } from '@/apis/ai-model.api'
import { SSEClient } from '@/apis/sse-client'
import Markdown from 'react-markdown'
import LoadingDots from '@/components/chat-bot/loading-dots'

interface HistoryItem {
  role: 'user' | 'assistant'
  text: string
  status?: 'loading' | 'done'
  task_id?: string
  isMarkdown?: boolean
}

function ChatHistory({ history, onCopyFn }: { history: Array<HistoryItem>; onCopyFn: () => void }) {
  return (
    <div className="flex h-full flex-col gap-[50px] overflow-y-scroll">
      {history.map((item, index) => (
        <div key={index} className={`relative flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`rounded-lg border px-4 py-2 text-sm transition-colors ${item.role === 'user' ? 'bg-primary text-white' : 'bg-white'}`}
          >
            {item.status === 'loading' ? (
              <LoadingDots />
            ) : (
              <div className={`prose prose-sm ${item.role === 'user' ? 'text-white' : 'text-black'}`}>
                <Markdown
                  children={item.text}
                  components={{
                    code: ({ children }) => <code>{children}</code>
                  }}
                />
              </div>
            )}
          </div>
          {item.status === 'done' && (
            <CopyToClipboard
              text={item.text}
              onCopy={() => {
                onCopyFn()
              }}
            >
              <div className={`absolute bottom-[-34px] ${item.role === 'user' ? 'right-0' : 'left-0'} cursor-pointer`}>
                <Copy />
              </div>
            </CopyToClipboard>
          )}
        </div>
      ))}
    </div>
  )
}

export default function ComparePage() {
  const [input, setInput] = useState('')
  const [sendLoading, setSendLoading] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const [hisotryA, setHistoryA] = useState<Array<HistoryItem>>([])
  const [hisotryB, setHistoryB] = useState<Array<HistoryItem>>([])
  const [task_id, setTaskId] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isComposing, setIsComposing] = useState(false)
  const sseclient = useRef<SSEClient | null>(null)
  const [disableChat, setDisableChat] = useState(false)
  const [showModelName, setShowModelName] = useState(false)
  const [modelInfo, setModelInfo] = useState<{
    model_a: string
    model_b: string
  } | null>(null)
  // const historyAWrapRef = useRef<HTMLDivElement>(null)
  // const historyBWrapRef = useRef<HTMLDivElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  // const scrollTimeoutRef = useRef<NodeJS.Timeout>()

  const feedbackArray = [
    {
      id: EvaluateValue.A,
      text: '👈 A is better'
    },
    {
      id: EvaluateValue.B,
      text: '👉 B is better'
    },
    {
      id: EvaluateValue.C,
      text: '🤝 Tie'
    },
    {
      id: EvaluateValue.D,
      text: '👎 Both are bad'
    }
  ]

  function createSSE(taskId: string) {
    sseclient.current = new SSEClient({
      url: `/api/ct/model/sse?task_id=${taskId}`,
      onMessage: (data: string) => {
        const _data = JSON.parse(data)
        if (_data.task_status === 'finish') {
          setShowFeedback(true)
          sseclient.current?.close()
          sseclient.current = null
          setIsStreaming(false)
          console.log(isStreaming)
          setHistoryA((prev) => {
            const newHistory = [...prev]
            const tail = newHistory[newHistory.length - 1]
            tail.status = 'done'
            return newHistory
          })
          setHistoryB((prev) => {
            const newHistory = [...prev]
            const tail = newHistory[newHistory.length - 1]
            tail.status = 'done'
            return newHistory
          })
          return
        }
        if (_data.model === 'model_a') {
          setHistoryA((prev) => {
            const newHistory = [...prev]
            const tail = newHistory[newHistory.length - 1]
            console.log(tail.text + _data.content)
            tail.text = tail.text + _data.content
            tail.status = 'done'
            return newHistory
          })
        } else {
          setHistoryB((prev) => {
            const newHistory = [...prev]
            const tail = newHistory[newHistory.length - 1]
            tail.text = tail.text + _data.content
            tail.status = 'done'
            return newHistory
          })
        }
      },
      onOpen: (event) => {
        console.log('SSE connection opened', event)
        setIsStreaming(true)
      },
      onError: (error) => {
        console.log(error)
        message.error('Error')
        sseclient.current?.close()
      }
    })
  }

  const sendQuestion = useCallback(async () => {
    if (!input) return
    if (sseclient.current) {
      sseclient.current.close()
      sseclient.current = null
    }
    setSendLoading(true)
    try {
      const requestData = task_id ? { content: input, task_id: task_id } : { content: input }
      const res = await aiModelRequest.sendPrompt(requestData)
      if (res.errorCode === 0) {
        setTaskId(res.data.task_id)
        setModelInfo({
          model_a: res.data.model_a,
          model_b: res.data.model_b
        })
        setHistoryA((prev) => {
          console.log(prev)
          return [
            ...prev,
            {
              role: 'user',
              text: input,
              status: 'done'
            },
            {
              role: 'assistant',
              text: '',
              status: 'loading'
            }
          ]
        })
        setHistoryB((prev) => [
          ...prev,
          {
            role: 'user',
            text: input,
            status: 'done'
          },
          {
            role: 'assistant',
            text: '',
            status: 'loading'
          }
        ])
        createSSE(res.data.task_id)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setSendLoading(false)
    }
  }, [input, task_id])

  function onCopyFn() {
    message.success('Copied to clipboard')
  }

  async function onPostFeedback(id: EvaluateValue) {
    const res = await aiModelRequest.submitFeedback({ evaluate: id, task_id: task_id })
    console.log(res)
    setShowFeedback(false)
    setDisableChat(true)
    setTaskId(null)
    setShowModelName(true)
  }

  const handleWindowKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (isComposing) return
        if (e.shiftKey || e.ctrlKey || e.metaKey) {
          console.log('default behavior')
        } else {
          e.preventDefault()
          sendQuestion()
        }
      }
    },
    [sendQuestion, isComposing]
  )

  // const scrollToBottom = useCallback(() => {
  //   if (historyAWrapRef.current && isStreaming) {
  //     historyAWrapRef.current.scrollTop = historyAWrapRef.current.scrollHeight
  //   }
  //   if (historyBWrapRef.current && isStreaming) {
  //     historyBWrapRef.current.scrollTop = historyBWrapRef.current.scrollHeight
  //   }
  // }, [isStreaming])

  // const debouncedScroll = useCallback(() => {
  //   if (scrollTimeoutRef.current) {
  //     clearTimeout(scrollTimeoutRef.current)
  //   }
  //   scrollTimeoutRef.current = setTimeout(scrollToBottom, 300)
  // }, [scrollToBottom])

  // useEffect(() => {
  //   if (isStreaming) {
  //     debouncedScroll()
  //   } else {
  //     if (scrollTimeoutRef.current) {
  //       clearTimeout(scrollTimeoutRef.current)
  //     }
  //   }
  // }, [isStreaming])

  useEffect(() => {
    if (inputFocused) {
      window.addEventListener('keydown', handleWindowKeyDown)
    } else {
      window.removeEventListener('keydown', handleWindowKeyDown)
    }
    return () => {
      window.removeEventListener('keydown', handleWindowKeyDown)
    }
  }, [inputFocused, handleWindowKeyDown])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const handleCompositionStart = () => setIsComposing(true)
    const handleCompositionEnd = () => setIsComposing(false)

    textarea.addEventListener('compositionstart', handleCompositionStart)
    textarea.addEventListener('compositionend', handleCompositionEnd)

    return () => {
      textarea.removeEventListener('compositionstart', handleCompositionStart)
      textarea.removeEventListener('compositionend', handleCompositionEnd)
    }
  }, [])

  return (
    <div className="size-full">
      <nav className="bg-transparent shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-[32px] font-bold leading-8 text-white">Free AI Chat to Compare</h1>
        </div>
      </nav>

      <div className="mt-6 items-start rounded-xl border border-[#FFFFFF1F] p-4">
        <div className="flex h-[700px] w-full gap-4">
          <div className="relative w-[calc(50%-8px)] flex-1 rounded-xl border border-[#FFFFFF1F] p-3">
            <div className="absolute left-0 top-0 z-10 rounded-br-xl rounded-tl-xl border border-l-0 border-t-0 border-white/10 bg-primary p-2">
              Model A
            </div>
            {hisotryA.length > 0 && <ChatHistory history={hisotryA} onCopyFn={onCopyFn} />}
            {showModelName && (
              <div className="absolute bottom-0 left-0 z-10 rounded-bl-xl rounded-tr-xl border border-b-0 border-l-0 border-white/10 bg-primary p-2 font-bold">
                Model A: {modelInfo?.model_a}
              </div>
            )}
          </div>
          <div className="relative w-[calc(50%-8px)] flex-1 rounded-xl border border-[#FFFFFF1F] p-3">
            <div className="absolute left-0 top-0 z-10 rounded-br-xl rounded-tl-xl border border-l-0 border-t-0 border-white/10 bg-primary p-2">
              Model B
            </div>
            {hisotryB.length > 0 && <ChatHistory history={hisotryB} onCopyFn={onCopyFn} />}
            {showModelName && (
              <div className="absolute bottom-0 left-0 z-10 rounded-bl-xl rounded-tr-xl border border-b-0 border-l-0 border-white/10 bg-primary p-2 font-bold">
                Model B: {modelInfo?.model_b}
              </div>
            )}
          </div>
        </div>
        {showFeedback && (
          <div className="mt-6 flex items-stretch gap-6">
            {feedbackArray.map((item) => (
              <Button
                key={item.id}
                size="large"
                className="flex-1 cursor-pointer rounded-lg border px-4 py-2 text-center text-sm transition-colors hover:bg-gray-50"
                onClick={() => onPostFeedback(item.id)}
              >
                {item.text}
              </Button>
            ))}
          </div>
        )}
      </div>
      <div className="mt-6 flex items-stretch gap-2 text-white">
        <textarea
          ref={textareaRef}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          disabled={disableChat}
          placeholder="Enter your question"
          className="placeholder:[#404049] flex-1 rounded-lg border border-white/10 bg-transparent px-4 py-2 text-white outline-none"
        />
        <Button
          size="large"
          disabled={disableChat}
          className="!h-auto w-[160px] items-center justify-center rounded-lg bg-primary px-6 text-white transition-colors"
          onClick={sendQuestion}
          loading={sendLoading}
        >
          Send
        </Button>
      </div>
    </div>
  )
}
