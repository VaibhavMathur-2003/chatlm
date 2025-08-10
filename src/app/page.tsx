import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'

export default async function HomePage() {
  const user = await getCurrentUser()
  
  if (user) {
    redirect('/groups')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Multi-LLM Chat
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Chat with multiple AI assistants in group conversations
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Login
          </Link>
          
          <Link
            href="/auth/register"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Sign Up
          </Link>
        </div>

        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>✨ Create groups with multiple users and AI assistants</p>
          <p>🤖 Chat with various open-source LLMs via Groq</p>
          <p>💬 Use @all_llm or @specific_llm to get AI responses</p>
        </div>
      </div>
    </div>
  )
}