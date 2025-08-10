'use client'

import { useState, KeyboardEvent } from 'react'

interface ChatInputProps {
  onSendMessage: (content: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [inputMessage, setInputMessage] = useState('')

  const handleSend = () => {
    if (inputMessage.trim() && !disabled) {
      onSendMessage(inputMessage.trim())
      setInputMessage('')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t bg-white p-4">
      <div className="flex space-x-2">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message... (Use @all_llm to mention all LLMs or @llm_name for specific ones)"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={2}
          disabled={disabled}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !inputMessage.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        <strong>Tips:</strong> Use @all_llm to get responses from all LLMs, or mention specific LLMs by name (e.g., @Assistant1)
      </div>
    </div>
  )
}