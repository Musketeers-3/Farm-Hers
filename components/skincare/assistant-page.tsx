"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickQuestions = [
  "Can I use retinol with vitamin C?",
  "What order should I apply my products?",
  "Is niacinamide safe for sensitive skin?",
  "How often should I exfoliate?",
]

const mockResponses: Record<string, string> = {
  "Can I use retinol with vitamin C?":
    "It's generally not recommended to use retinol and vitamin C together in the same routine as they work best at different pH levels. Use vitamin C in your morning routine and retinol at night for best results.",
  "What order should I apply my products?":
    "Apply products from thinnest to thickest consistency: cleanser - toner - serums - treatments - moisturizer - sunscreen (AM only). This allows each layer to absorb properly.",
  "Is niacinamide safe for sensitive skin?":
    "Yes! Niacinamide is generally well-tolerated by sensitive skin. Start with a lower concentration (2-5%) and gradually increase. It can actually help strengthen your skin barrier.",
  "How often should I exfoliate?":
    "For most skin types, 2-3 times per week is ideal. If you have sensitive skin, start with once weekly. Avoid over-exfoliating as it can damage your skin barrier.",
}

export function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your Skin Guardian, here to help with all your skincare questions. Ask me about ingredients, routines, product recommendations, or any skin concerns you have!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const response =
        mockResponses[content] ||
        "That's a great question! Based on your skin profile, I'd recommend consulting with a dermatologist for personalized advice on this topic. In the meantime, I can help you with ingredient compatibility, routine order, or general skincare tips."

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] max-w-3xl mx-auto">
      {/* Header */}
      <header className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose to-coral flex items-center justify-center shadow-lg">
          <Bot className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-brown-dark">Skin Guardian</h1>
          <p className="text-taupe text-sm">Your AI skincare assistant</p>
        </div>
      </header>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="mb-4">
          <p className="text-sm text-taupe mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-gold" />
            Try asking:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question) => (
              <button
                key={question}
                onClick={() => sendMessage(question)}
                className="px-4 py-2.5 rounded-xl glass-card text-sm text-taupe hover:text-rose-dark transition-all text-left"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "flex-row-reverse" : ""
            )}
          >
            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
                message.role === "user"
                  ? "bg-peach"
                  : "bg-gradient-to-br from-rose to-coral"
              )}
            >
              {message.role === "user" ? (
                <User className="w-4 h-4 text-brown-dark" />
              ) : (
                <Sparkles className="w-4 h-4 text-white" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
                message.role === "user"
                  ? "bg-gradient-to-br from-rose/30 to-peach/30 border border-rose/20"
                  : "glass-card"
              )}
            >
              <p className="text-sm text-brown-dark leading-relaxed">{message.content}</p>
              <span className="text-[10px] text-taupe/70 mt-2 block">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose to-coral flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="glass-card rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-rose animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-rose animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about skincare..."
              className="w-full px-4 py-3.5 rounded-2xl glass-warm text-brown-dark placeholder:text-taupe/50 focus:outline-none focus:ring-2 focus:ring-rose/50 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md",
              input.trim() && !isTyping
                ? "btn-primary"
                : "glass-warm text-taupe/40"
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
