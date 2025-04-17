import { useCallback, useEffect, useState, useRef } from 'react'
import { message, notification, Spin } from 'antd'
import aiModelRequest, { EvaluateValue } from '@/apis/ai-model.api'
import { SSEClient } from '@/apis/sse-client'
import ChatHistory, { ChatMessage } from '@/components/chat-bot/history'
import HowItWorksImg from '@/assets/chatbot/chatbot-arena.png'
import { ArrowUp } from 'lucide-react'
import { AuthModal } from '@/components/account/auth-modal'
import PageHead from '@/components/common/page-head'

export default function ComparePage() {
  const [input, setInput] = useState('')
  const [sendLoading, setSendLoading] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const [historyA, setHistoryA] = useState<Array<ChatMessage>>([])
  const [historyB, setHistoryB] = useState<Array<ChatMessage>>([])
  const [task_id, setTaskId] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showChatBox, setShowChatBox] = useState(true)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isComposing, setIsComposing] = useState(false)
  const sseclient = useRef<SSEClient | null>(null)
  const [disableChat, setDisableChat] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false)

  const [modelInfo, setModelInfo] = useState<{
    model_a: string
    model_b: string
  } | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [notificationApi, contextHolder] = notification.useNotification()

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
          setShowFeedback(true)
          setDisableChat(false)
          setSendLoading(false)
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
        console.error('SSE connection error', error)
        setIsStreaming(false)
      }
    })
  }

  const sendQuestion = useCallback(
    async (input: string) => {
      console.log('sendQuestion', input, sendLoading)

      if (!input.trim() || sendLoading) return
      const token = localStorage.getItem('token')

      if (!token && historyA.length > 0) {
        setShowLoginModal(true)
        return
      }

      setSendLoading(true)
      setDisableChat(true)
      setShowFeedback(false)

      try {
        const userMessage: ChatMessage = {
          role: 'user',
          text: input,
          status: 'done'
        }

        const assistantMessageA: ChatMessage = {
          role: 'assistant',
          text: '',
          status: 'loading'
        }

        const assistantMessageB: ChatMessage = {
          role: 'assistant',
          text: '',
          status: 'loading'
        }

        setHistoryA((prev) => [...prev, userMessage, assistantMessageA])
        setHistoryB((prev) => [...prev, userMessage, assistantMessageB])

        const res = await aiModelRequest.sendPrompt({
          task_id: task_id ? task_id : null,
          content: input
        })

        if (res.data.task_id) {
          setTaskId(res.data.task_id)
          createSSE(res.data.task_id)
        } else {
          message.error('Failed to send message')
          setSendLoading(false)
          setDisableChat(false)
        }

        setInput('')
      } catch (error) {
        console.error('Error sending message:', error)
        message.error('Failed to send message')
        setSendLoading(false)
        setDisableChat(false)
      }
    },
    [sendLoading]
  )

  const onPostFeedback = async (evaluation: EvaluateValue, taskId: string | null) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setShowLoginModal(true)
      return
    }

    setFeedbackLoading(true)
    try {
      if (!taskId) throw new Error('Invalid task ID')

      const res = await aiModelRequest.submitFeedback({
        evaluate: evaluation,
        task_id: taskId
      })

      setModelInfo({
        model_a: res.data.model_a,
        model_b: res.data.model_b
      })

      notificationApi.success({
        message: 'Thanks for voting!',
        description: 'Your vote has been submitted successfully'
      })
      setShowFeedback(false)
      setShowChatBox(false)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      message.error('Failed to submit feedback')
    }
    setFeedbackLoading(false)
  }

  const handleWindowKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
        e.preventDefault()
        sendQuestion(input)
      }
    },
    [sendQuestion, isComposing, input]
  )

  const handleNewRound = () => {
    setHistoryA([])
    setHistoryB([])
    setTaskId(null)
    setShowFeedback(false)
    setModelInfo(null)
    setShowChatBox(true)
  }

  const handleRegenerate = () => {
    if (!task_id || historyA.length === 0 || historyB.length === 0) return

    const lastUserMessage = historyA.find((item) => item.role === 'user')
    console.log(lastUserMessage, 'lastUserMessage')
    if (lastUserMessage) {
      setHistoryA(historyA.slice(0, -2))
      setHistoryB(historyB.slice(0, -2))
      setShowFeedback(false)
      setTimeout(() => sendQuestion(lastUserMessage.text), 200)
    }
  }

  function onLogin() {
    setShowLoginModal(false)
  }

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
    const textarea = inputRef.current
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
    <div className="min-h-screen bg-[#1a1a1f] text-white">
      <PageHead />
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-2 text-center text-[32px] font-bold">⚔️ Codatta Chatbot</h1>
        <p className="text-center text-sm text-white/90">Compare AI ChatBots Anonymously, Logged on Chain</p>

        {/* How It Works Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-xl font-semibold">📜 How It Works</h2>
          <div className="rounded-2xl bg-gray-50 px-10 py-6">
            <img src={HowItWorksImg} alt="How It Works" />
          </div>
        </div>

        {/* Chat Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-xl font-semibold">💬 Chat now !</h2>

          <div className="overflow-hidden rounded-2xl bg-gray-50">
            {/* Model Tabs */}
            <div className="grid grid-cols-2 bg-white text-black">
              <div className="p-3 text-center">Model A</div>
              <div className="p-3 text-center">Model B</div>
            </div>

            {/* Chat Content */}
            <div className="grid grid-cols-2">
              {/* Model A Chat */}
              <div className="min-h-[300px] border-r border-dashed border-white/10 p-6">
                {historyA.length > 0 ? (
                  <ChatHistory messages={historyA} />
                ) : (
                  <div className="flex h-[300px] items-center justify-center text-center text-gray-400">
                    <p>Welcome to Codatta Chatbot Data! Here you can compare responses from two different AI models.</p>
                  </div>
                )}
              </div>

              {/* Model B Chat */}
              <div className="p-6">
                {historyB.length > 0 ? (
                  <ChatHistory messages={historyB} />
                ) : (
                  <div className="flex h-[300px] items-center justify-center text-center text-gray-400">
                    <p>Welcome to Codatta Chatbot Data! Here you can compare responses from two different AI models.</p>
                  </div>
                )}
              </div>
            </div>
            {modelInfo && (
              <div className="grid grid-cols-2 gap-4 bg-white px-6 py-3 text-black">
                <div className="text-center">{modelInfo?.model_a}</div>
                <div className="text-center">{modelInfo?.model_b}</div>
              </div>
            )}
          </div>

          {/* Feedback Section */}
          {showFeedback && (
            <Spin spinning={feedbackLoading}>
              <div className="mt-4 grid grid-cols-4 gap-4 rounded-2xl bg-gray-50 px-6 py-5">
                {feedbackArray.map((item) => (
                  <button
                    key={item.id}
                    className="flex items-center justify-center rounded-full border border-white/10 bg-transparent px-6 py-2 text-white shadow-none transition-all hover:bg-white hover:text-black"
                    onClick={() => onPostFeedback(item.id, task_id)}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </Spin>
          )}

          {/* Input Section */}
          {showChatBox && (
            <div className="mt-4 flex items-center gap-4 overflow-hidden rounded-xl bg-gray-50 p-4">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  autoFocus
                  value={input}
                  type="text"
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  disabled={disableChat || feedbackLoading}
                  placeholder="✋ Enter your prompt and press ⏎"
                  className="w-full rounded-lg bg-transparent px-4 py-2 focus:outline-none disabled:text-gray-400"
                />
              </div>
              <div>
                <button
                  className="rounded-full bg-primary p-2 text-white disabled:bg-white/20 disabled:text-white/20"
                  onClick={() => sendQuestion(input)}
                  disabled={disableChat}
                >
                  <ArrowUp />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 grid grid-cols-2 justify-center gap-4 rounded-2xl bg-gray-50 px-6 py-5">
            <button
              className="flex items-center justify-center rounded-full border border-white/10 bg-transparent px-6 py-2 text-white shadow-none transition-all hover:bg-white hover:text-black"
              onClick={handleNewRound}
            >
              🔄 New Round
            </button>
            <button
              className="flex items-center justify-center rounded-full border border-white/10 bg-transparent px-6 py-2 text-white shadow-none transition-all hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-white"
              onClick={handleRegenerate}
              disabled={!showChatBox}
            >
              🔁 Regenerate
            </button>
          </div>
        </div>
      </div>
      {contextHolder}
      <AuthModal open={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={onLogin} />
    </div>
  )
}
