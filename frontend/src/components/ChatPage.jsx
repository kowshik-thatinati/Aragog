import { useEffect, useMemo, useRef, useState } from 'react'
import { Send, User, AlertTriangle, BookOpen, Shield, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ChatPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [typingId, setTypingId] = useState(null)
  const [loadingStage, setLoadingStage] = useState('intake')
  const bottomRef = useRef(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (isLoading) {
      const stageInterval = setInterval(() => {
        setLoadingStage(prev => {
          if (prev === 'intake') return 'retrieval'
          if (prev === 'retrieval') return 'processing'
          return 'intake'
        })
      }, 1000)
      return () => clearInterval(stageInterval)
    }
  }, [isLoading])

  const animateAssistantMessage = (id, fullText) => {
    let index = 0
    setTypingId(id)

    const interval = setInterval(() => {
      index += 1
      setMessages((prev) =>
        prev.map((message) =>
          message.id === id
            ? {
                ...message,
                content: fullText.slice(0, index),
                done: index >= fullText.length,
              }
            : message,
        ),
      )

      if (index >= fullText.length) {
        clearInterval(interval)
        setTypingId(null)
      }
    }, 12)
  }

  const handleSend = async (event) => {
    event.preventDefault()
    const question = input.trim()
    if (!question || isLoading) return

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question,
      done: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setInput('')
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setLoadingStage('intake')

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: question }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch answer from backend')
      }

      const data = await response.json()
      const assistantId = crypto.randomUUID()
      const assistantText =
        typeof data.response === 'string'
          ? data.response
          : typeof data.response?.answer === 'string'
            ? data.response.answer
            : typeof data.answer === 'string'
              ? data.answer
              : 'No answer returned.'

      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          done: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ])

      animateAssistantMessage(assistantId, assistantText)
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'I could not reach the backend. Please make sure FastAPI is running on port 8000.',
          done: true,
          isError: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
      ])
    } finally {
      setIsLoading(false)
      setLoadingStage('intake')
    }
  }

  const getLoadingStageText = () => {
    switch (loadingStage) {
      case 'intake':
        return 'Receiving medical query...'
      case 'retrieval':
        return 'Scanning medical knowledge base...'
      case 'processing':
        return 'Structuring response...'
      default:
        return 'Processing...'
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Activity size={24} color="#9333ea" />
          <h1 style={{ fontSize: '30px', fontWeight: '600', color: '#111827', margin: 0 }}>
            ARAGOG
          </h1>
          <Activity size={24} color="#9333ea" />
        </div>
        <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500', margin: 0 }}>
          Clinical AI Diagnostic Assistant
        </p>
      </header>

      {/* Chat Container */}
      <main style={{
        width: '100%',
        maxWidth: '56rem',
        margin: '0 auto',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.95)',
        border: '1px solid #e5e7eb',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '600px',
        marginBottom: '24px'
      }}>
        {/* Messages Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {messages.length === 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}>
              <div style={{ textAlign: 'center', maxWidth: '320px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: '#f3e8ff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Activity size={32} color="#9333ea" />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>
                  Medical Knowledge Assistant
                </h3>
                <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px' }}>
                  Ask health-related questions and receive AI-assisted responses based on verified medical sources.
                </p>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  Example: "What is acne?" or "How to manage diabetes?"
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} style={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{ maxWidth: '512px' }}>
                {message.role === 'assistant' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: '#f3e8ff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Activity size={16} color="#9333ea" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>
                        Medical AI Assistant
                      </h4>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                )}
                
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  background: message.role === 'user' ? 'white' : message.isError ? '#fef2f2' : '#f9fafb',
                  borderColor: message.role === 'user' ? '#000000' : message.isError ? '#fecaca' : '#d1d5db',
                  color: message.role === 'user' ? '#111827' : message.isError ? '#991b1b' : '#1f2937'
                }}>
                  {message.content || ' '}
                  {typingId === message.id && (
                    <span style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '16px',
                      background: '#c084fc',
                      marginLeft: '4px',
                      animation: 'pulse 1.5s infinite'
                    }} />
                  )}
                </div>

                {message.role === 'assistant' && !message.isError && (
                  <div style={{
                    marginTop: '16px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '8px'
                  }}>
                    <div style={{
                      background: '#fef3c7',
                      border: '1px solid #fcd34d',
                      borderRadius: '8px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <AlertTriangle size={12} color="#b45309" />
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#92400e' }}>
                        Educational
                      </span>
                    </div>
                    <div style={{
                      background: '#dbeafe',
                      border: '1px solid #93c5fd',
                      borderRadius: '8px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Shield size={12} color="#1e40af" />
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#1e3a8a' }}>
                        Not Diagnosis
                      </span>
                    </div>
                    <div style={{
                      background: '#dcfce7',
                      border: '1px solid #86efac',
                      borderRadius: '8px',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <BookOpen size={12} color="#166534" />
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#15803d' }}>
                        Verified
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ maxWidth: '512px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: '#f3e8ff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Activity size={16} color="#9333ea" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>
                      Medical AI Assistant
                    </h4>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Processing...</p>
                  </div>
                </div>
                
                <div style={{
                  background: '#f9fafb',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '24px',
                  textAlign: 'center'
                }}>
                  <style>{`
                    @keyframes ambulanceMove {
                      0% { left: -56px; }
                      100% { left: calc(100% + 56px); }
                    }
                    @keyframes lightFlash {
                      0%, 100% { background-color: #dc2626; }
                      50% { background-color: #2563eb; }
                    }
                    .loader-stages {
                      display: grid;
                      grid-template-columns: repeat(3, minmax(0, 1fr));
                      gap: 8px;
                      margin-bottom: 12px;
                    }
                    .loader-stage {
                      font-size: 11px;
                      font-weight: 600;
                      padding: 6px 8px;
                      border-radius: 999px;
                      border: 1px solid #d1d5db;
                      background: #f3f4f6;
                      color: #4b5563;
                    }
                    .loader-stage-active {
                      background: #dbeafe;
                      color: #1d4ed8;
                      border-color: #93c5fd;
                    }
                    .heartbeat-road {
                      width: 100%;
                      height: 64px;
                      border: 2px solid #1f2937;
                      border-radius: 6px;
                      background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
                      position: relative;
                      overflow: hidden;
                      margin-bottom: 10px;
                    }
                    .heartbeat-road::before {
                      content: '';
                      position: absolute;
                      left: 0;
                      right: 0;
                      bottom: 6px;
                      height: 4px;
                      background: repeating-linear-gradient(
                        90deg,
                        #facc15 0 20px,
                        transparent 20px 32px
                      );
                      opacity: 0.85;
                    }
                    .heartbeat-svg {
                      position: absolute;
                      inset: 0;
                      width: 100%;
                      height: 100%;
                    }
                    .ambulance-track {
                      position: absolute;
                      top: 22px;
                      transform: translateY(-50%);
                      animation: ambulanceMove 5.2s linear infinite;
                      width: 45px;
                      height: 24px;
                      z-index: 3;
                    }
                    .amb-body {
                      width: 100%;
                      height: 100%;
                      background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
                      border-radius: 6px;
                      position: relative;
                      border: 1px solid #991b1b;
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      padding: 0 4px;
                      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                    }
                    .amb-front::before {
                      content: '';
                      position: absolute;
                      width: 3px;
                      height: 3px;
                      background: #fbbf24;
                      border-radius: 50%;
                      top: 3px;
                      left: 2px;
                    }
                    .amb-front::after {
                      content: '';
                      position: absolute;
                      width: 3px;
                      height: 3px;
                      background: #fbbf24;
                      border-radius: 50%;
                      bottom: 3px;
                      left: 2px;
                    }
                    .amb-cross {
                      width: 10px;
                      height: 10px;
                      background: white;
                      font-size: 8px;
                      font-weight: bold;
                      color: #ef4444;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      border-radius: 1px;
                    }
                    .amb-light {
                      width: 6px;
                      height: 6px;
                      border-radius: 50%;
                      animation: lightFlash 0.5s ease-in-out infinite;
                      box-shadow: 0 0 4px currentColor;
                    }
                    .amb-wheel {
                      position: absolute;
                      width: 4px;
                      height: 2px;
                      background: #1f2937;
                      left: 8px;
                      bottom: -4px;
                      border-radius: 1px;
                    }
                    .amb-wheel::after {
                      content: '';
                      position: absolute;
                      width: 4px;
                      height: 2px;
                      background: #1f2937;
                      right: -18px;
                      border-radius: 1px;
                    }
                  `}</style>

                  <div className="loader-stages">
                    <div className={`loader-stage ${loadingStage === 'intake' ? 'loader-stage-active' : ''}`}>
                      Loading documents
                    </div>
                    <div className={`loader-stage ${loadingStage === 'retrieval' ? 'loader-stage-active' : ''}`}>
                      Searching answers
                    </div>
                    <div className={`loader-stage ${loadingStage === 'processing' ? 'loader-stage-active' : ''}`}>
                      Filtering best match
                    </div>
                  </div>

                  <div className="heartbeat-road">
                    <svg className="heartbeat-svg" viewBox="0 0 100 64" preserveAspectRatio="none" aria-hidden="true">
                      <polyline
                        points="0,32 8,32 12,32 15,18 18,46 22,32 30,32 38,32 46,32 54,32 62,32 70,32 78,32 86,32 94,32 100,32"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                      />
                    </svg>

                    <div className="ambulance-track">
                      <div className="amb-body">
                        <div className="amb-front"></div>
                        <div className="amb-cross">+</div>
                        <div className="amb-light"></div>
                        <div className="amb-wheel"></div>
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151', display: 'block' }}>
                    {getLoadingStageText()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div style={{
          borderTop: '1px solid #d1d5db',
          padding: '16px',
          background: 'rgba(249,250,251,0.5)'
        }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend(e)
                  }
                }}
                rows={1}
                placeholder="Ask a medical question..."
                style={{
                  width: '100%',
                  resize: 'none',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  padding: '12px 16px',
                  fontSize: '14px',
                  color: '#111827',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  minHeight: '44px',
                  maxHeight: '128px',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!canSend}
              style={{
                padding: '12px 16px',
                background: canSend ? '#9333ea' : '#d1d5db',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                cursor: canSend ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '500',
                minWidth: '80px',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => canSend && (e.target.style.background = '#7e22ce')}
              onMouseLeave={(e) => canSend && (e.target.style.background = '#9333ea')}
            >
              <Send size={16} />
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default ChatPage
