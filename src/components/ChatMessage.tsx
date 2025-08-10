'use client'

import { Message } from '@/types'

interface ChatMessageProps {
  message: Message
  currentUserId: string
}

export default function ChatMessage({ message, currentUserId }: ChatMessageProps) {
  const isCurrentUser = message.senderId === currentUserId
  const isLLM = message.type === 'LLM'

  return (
    <div className={`mb-4 ${isCurrentUser && !isLLM ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isLLM
            ? 'bg-purple-100 border-l-4 border-purple-500 text-gray-800'
            : isCurrentUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        <div className="text-xs mb-1 opacity-75">
          {isLLM ? (
            <span className="font-semibold text-purple-700">🤖 {message.llm?.name}</span>
          ) : (
            <span className="font-semibold">
              {isCurrentUser ? 'You' : message.sender?.username}
            </span>
          )}
          <span className="ml-2">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  )
}